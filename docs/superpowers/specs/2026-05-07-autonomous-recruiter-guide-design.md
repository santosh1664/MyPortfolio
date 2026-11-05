# Autonomous Recruiter Guide Design

Date: 2026-05-07
Repo: `/Users/roy/MyPortfolio`
Status: Proposed and approved in chat, pending final spec review

## Objective

Convert the current resume chat widget into a lightweight autonomous recruiter guide for the portfolio website. The experience should feel like a digital representation of Santosh speaking in first person, not a generic assistant describing him in third person.

The system should:

- greet visitors proactively, but only after a subtle delay
- optimize for recruiter engagement without feeling spammy
- guide visitors through experience, projects, and technical background
- answer direct questions using the existing FastAPI + RAG setup
- ask one focused follow-up question at a time
- recommend the most relevant next portfolio section to review
- preserve conversational continuity with lightweight session memory

The system should not:

- show suggestion chips
- behave like ChatGPT
- introduce heavy infrastructure
- force-open the full chat window

## Current Architecture Summary

### Frontend

The frontend is a Vite React application using JSX. The recruiter chat experience lives primarily in `src/components/ResumeChatWidget.jsx` with styling in `src/components/ResumeChatWidget.css`.

Current widget behavior:

- starts closed behind a floating toggle button
- displays a generic initial bot message
- relies on category buttons and suggested question chips
- sends freeform messages to `POST /api/chat`
- stores a client-side `session_id` in `localStorage`

### Backend

The backend is a small FastAPI app in `backend/app/main.py` and `backend/app/rag.py`.

Current backend behavior:

- exposes `POST /api/chat`
- stores recent history in an in-memory dictionary keyed by `session_id`
- loads markdown knowledge files from `backend/knowledge`
- sends a single-shot LLM request over resume context
- returns only a plain `reply`

Limitations relevant to this project:

- no structured conversation controller
- no first-person enforcement strong enough for recruiter simulation
- no recommendation model for next section
- no opener state or guided flow state
- current frontend UI makes the experience feel like a guided FAQ instead of a recruiter conversation

## Design Goals

### Primary UX Goal

The visitor should feel like they are speaking directly with Santosh in a concise recruiter-friendly format. The experience should sound technical, direct, and natural.

### Behavioral Goals

- first-person voice only
- concise, confident, technical tone
- one strong question at a time
- answer direct questions first
- keep the conversation moving naturally
- avoid abrupt topic switches
- recommend relevant portfolio sections when useful

### Non-Goals

- no full interview orchestration platform
- no SSE
- no database persistence
- no Redis or background workers
- no auth or multi-tenant complexity

## Chosen Approach

Use a lightweight backend-led conversation controller with a thin frontend.

The frontend will handle presentation, teaser timing, and session-aware UI state. The backend will handle conversation policy and return a structured response that includes:

- the main reply
- an optional next focused question
- an optional recommended portfolio section
- small conversation state metadata for continuity

This keeps conversational behavior centralized and easier to tune without turning the React component into a policy engine.

## UX Behavior Flow

### 1. Landing Behavior

When a visitor lands on the portfolio:

- do not open the full chat panel immediately
- if viewport indicates desktop or tablet, start a delayed teaser timer
- randomize or choose a delay in the 6 to 10 second range
- cancel the teaser if the user has already interacted with the chat
- show the teaser only once per browser session

The teaser should be compact and subtle. It should look like a recruiter-style preview, not a popup ad.

Example teaser copy:

`Hi — my recent work has focused on AI-driven full-stack systems. I can walk you through the parts most relevant to your hiring needs.`

### 2. First Interaction

When the user clicks the teaser:

- open the chat panel
- render the opener inside the panel
- immediately continue with one focused routing question

Example:

`Hi — my recent work has focused on AI-driven full-stack systems, especially conversational AI and full-stack product engineering. Are you mainly interested in frontend architecture, backend systems, or AI-focused work?`

This should feel like a recruiter-led conversation instead of a passive support widget.

### 3. Conversation Behavior

For each turn:

- if the visitor asks a direct question, answer it directly first
- after answering, optionally ask one relevant follow-up question
- optionally recommend one portfolio section to view next
- avoid asking unrelated compound questions
- do not repeat topics that were already covered unless the visitor reopens them

### 4. Section Guidance

The assistant should be able to recommend sections such as:

- Experience
- Projects
- Skills
- Certifications
- Resume PDF

Recommendations should be short and contextual, for example:

`If you want the strongest backend examples, the Projects section is the best next stop.`

## Conversation Model

### Voice and Tone Policy

The assistant represents Santosh directly and must speak only in first person.

It must not say:

- `Santosh has experience...`
- `He worked on...`
- `The candidate...`
- `This portfolio owner...`

It should say:

- `I built...`
- `My recent work...`
- `I focused on...`
- `One challenge I solved...`

Tone requirements:

- concise
- technical
- direct
- slightly conversational
- not robotic
- not marketing-heavy

### Topic Model

The controller should reason in terms of lightweight topics:

- introduction
- current role
- experience
- projects
- backend
- frontend
- AI systems
- cloud/devops
- education/certifications
- work authorization
- compensation

These topics are not exposed directly in the UI, but they are tracked in session state.

### Follow-up Depth

The controller should track how deep it has gone on a topic and limit repeated probing. A topic can have a shallow follow-up depth cap, for example:

- depth 0: initial topic question
- depth 1: first follow-up
- depth 2: final focused probe or transition

After the cap is reached, the backend should naturally transition or recommend the next relevant area.

## Backend Changes

### API Contract

Keep `POST /api/chat` as the single entry point.

Extend the response model from:

```json
{ "reply": "..." }
```

to:

```json
{
  "reply": "...",
  "next_question": "...",
  "recommended_section": {
    "id": "projects",
    "label": "Projects"
  },
  "conversation_state": {
    "current_topic": "backend",
    "covered_topics": ["introduction", "projects"],
    "follow_up_depth": 1,
    "has_started": true
  }
}
```

All new fields should be optional so the frontend can degrade cleanly.

### Session State

Replace the current memory-only list with a small in-memory session object that includes:

- `history`
- `has_started`
- `current_topic`
- `covered_topics`
- `follow_up_depth`
- `last_recommended_section`
- `teaser_acknowledged` or equivalent client-managed flag if needed only on frontend

This remains in-memory and session-scoped. No persistence is required.

### Conversation Controller

Introduce a lightweight controller module responsible for:

- determining whether this is the opener turn, a direct answer turn, a follow-up turn, or a transition turn
- selecting the active topic
- enforcing follow-up depth limits
- deciding whether to attach a next question
- deciding whether to recommend a section

This should be implemented as a small reusable helper, not embedded entirely inside the route handler.

### Prompting

Update the system prompt to enforce:

- first-person only
- recruiter-facing tone
- concise technical language
- resume-grounded answers only
- no hallucinated claims
- answer direct questions first

The prompt should also allow lightweight guidance behavior such as:

- asking one focused follow-up question
- recommending which area to explore next

### Retrieval

Preserve the current markdown knowledge loading model. Do not introduce embeddings, vector stores, or external retrieval infrastructure in this phase.

Minimal improvements allowed:

- simple topic-to-file weighting
- heuristics for prioritizing certain knowledge files based on the current question

This is optional and should only be added if it stays small and improves answer quality materially.

## Frontend Changes

### Widget Structure

Refactor `ResumeChatWidget.jsx` so it has three UI states:

1. closed with only floating button
2. closed with teaser visible
3. full panel open

### Teaser Behavior

The teaser should:

- appear only on desktop/tablet
- trigger once per session
- wait 6 to 10 seconds
- disappear if the user manually opens chat or dismisses it
- animate subtly

The teaser should not block page interaction.

### Panel Behavior

When the panel opens for the first time in a session:

- request or render the autonomous opener flow
- show the opener and first routing question
- allow freeform reply input immediately

### Message Rendering

The panel should continue to show a simple message stack, but remove:

- category lists
- suggestion chips
- “main menu” behavior

If the backend includes a recommended section, render it as a lightweight inline cue rather than a chip menu.

Example:

`Best next section: Projects`

This can later become clickable, but clickability is not required in the first implementation.

## Exact Impacted Files

### Existing files to modify

- `src/components/ResumeChatWidget.jsx`
- `src/components/ResumeChatWidget.css`
- `backend/app/main.py`
- `backend/app/rag.py`

### Likely new files

- `backend/app/conversation.py`
- optionally `backend/app/models.py` for typed session and response models if keeping `main.py` smaller

## Minimal File-by-File Modification Plan

### `src/components/ResumeChatWidget.jsx`

- remove suggestion category data and chip rendering
- add teaser timing and visibility state
- add desktop/tablet gating
- add one-time session suppression
- add first-open autonomous conversation bootstrap
- render `next_question` and `recommended_section` gracefully
- preserve current input/send flow and local session id behavior

### `src/components/ResumeChatWidget.css`

- add teaser styles and animation
- remove or de-emphasize suggestion grid styling
- keep panel stable to avoid layout flicker
- preserve current visual language where possible

### `backend/app/main.py`

- expand request/response models
- replace simple history store with a structured session store
- keep timeout fallback behavior
- preserve route path and backward compatibility

### `backend/app/rag.py`

- strengthen prompt policy for first-person recruiter voice
- support structured output composition
- continue using existing resume knowledge files

### `backend/app/conversation.py`

- add conversation controller logic
- add topic tracking helpers
- add section recommendation mapping
- add follow-up depth management

## Risks

### Product Risks

- too much autonomy could feel scripted
- too little autonomy could feel like a normal chatbot
- first-person voice could degrade if prompt instructions are not strict enough

### Technical Risks

- in-memory session state is lost on server restart
- prompt-only topic routing may be inconsistent across edge cases
- adding too much controller logic into existing files could make them harder to maintain

### UX Risks

- teaser timing may still feel intrusive if copy or animation is too aggressive
- overly long opener copy will hurt credibility
- too many follow-up questions can frustrate recruiters who want fast answers

## Testing Plan

### Backend Unit Tests

Add tests for:

- opener turn generation
- first-person enforcement in controller output expectations
- topic transition behavior
- follow-up depth cap behavior
- recommended section mapping
- direct question answering behavior
- fallback behavior on timeout or model failure

### Backend Integration Tests

Test `POST /api/chat` for:

- initial conversation start
- multi-turn continuity
- optional response fields present or omitted safely
- backward-compatible `reply` field always present

### Frontend Tests

Add or update tests for:

- teaser appears only after delay
- teaser appears only once per session
- teaser suppressed on small/mobile viewport
- teaser suppressed after interaction
- full panel opens without auto-popup behavior
- suggestion chips are removed
- autonomous opener renders correctly

### Manual Verification

Verify in browser:

- no teaser on mobile-sized viewport
- teaser appears once on desktop after idle delay
- chat panel remains visually stable
- direct recruiter questions receive first-person answers
- follow-up questions remain concise and on-topic
- section recommendations feel helpful rather than promotional

## Migration and Compatibility Notes

- existing `POST /api/chat` consumers remain compatible because `reply` stays present
- current client-side `session_id` logic can remain
- no infrastructure migration is required
- no changes to deployment shape are required

## Implementation Boundary

This phase delivers a lightweight autonomous recruiter guide, not a full interview platform. The implementation should remain small, modular, and easy to tune.
