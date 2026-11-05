// Santosh's portfolio assistant — a fully client-side answer engine.
// Answers come only from the portfolio data below, so nothing is invented.
import {
  personalInfo, experience, projects, skills, education, certifications, leadershipAndInvolvement,
} from '../data/portfolioData.jsx';

export const ME = 'Santosh';
const EMAIL = personalInfo.email;

// Facts that are not in the section data. Edit these if anything changes.
export const facts = {
  location: 'Dallas, Texas (DFW)',
  relocation: 'Open to relocation, and comfortable with on-site, hybrid, or remote roles.',
  availability: 'Can start on short notice (about two weeks).',
  workAuth:
    `Authorized to work in the United States. For specifics on visa status and any future sponsorship, please email ${EMAIL} — he'll answer directly.`,
  compensation:
    `Flexible and aligned with the role's scope and the company's range. He's happy to discuss specifics directly at ${EMAIL}.`,
  yearsLabel: '3+ years',
  yearsNumber: 3.5,
};

// ---------- text helpers ----------
const STOP = new Set('a an the and or of to in on for with at by from is are was were be been being he his him she her they their you your i me my we our it its this that these those what which who whom how does do did can could would should will has have had about any some there tell show give list please much many more most kind type also just as into than then so if not no yes ok'.split(' '));
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9+#./\s-]/g, ' ').replace(/\s+/g, ' ').trim();
const tokens = (s) => norm(s).split(' ').map((t) => t.replace(/^[./-]+|[./-]+$/g, '')).filter((t) => t.length > 1 && !STOP.has(t));
const bullets = (arr) => arr.map((x) => `- ${x}`).join('\n');

// ---------- skill dictionary (canonical name -> aliases) ----------
// Skills Santosh has are derived from portfolio data; the extra entries let the
// job-fit check recognise common requirements he does NOT list (reported honestly as gaps).
const ALIASES = {
  'Java': ['java', 'java 17', 'java 8', 'j2ee', 'core java'],
  'Python': ['python'],
  'TypeScript': ['typescript', ' ts '],
  'JavaScript': ['javascript', ' js ', 'es6', 'ecmascript'],
  'SQL': ['sql', 'pl/sql', 't-sql'],
  'Go': ['golang', ' go '],
  'C++': ['c++', 'cpp'],
  'Spring Boot': ['spring boot', 'springboot', 'spring framework', 'spring'],
  'Spring Security': ['spring security'],
  'Hibernate / JPA': ['hibernate', 'jpa', 'spring data'],
  'FastAPI': ['fastapi'],
  'Node.js': ['node.js', 'nodejs', 'node ', 'express'],
  'React': ['react', 'react.js', 'reactjs'],
  'Next.js': ['next.js', 'nextjs'],
  'Angular': ['angular'],
  'Redux': ['redux'],
  'Kafka': ['kafka'],
  'Microservices': ['microservice', 'microservices'],
  'REST APIs': ['rest', 'restful', 'api design', 'apis'],
  'JWT / OAuth': ['jwt', 'oauth'],
  'PostgreSQL': ['postgres', 'postgresql'],
  'MySQL': ['mysql'],
  'DynamoDB': ['dynamodb', 'dynamo'],
  'Redis': ['redis'],
  'MongoDB': ['mongodb', 'mongo', 'nosql'],
  'ChromaDB / vector DBs': ['chromadb', 'chroma', 'vector database', 'vector db', 'vector store', 'embeddings'],
  'AWS': ['aws', 'amazon web services', 'ec2', 's3', 'ecs', 'fargate', 'lambda', 'cloudwatch', 'rds', 'sqs'],
  'Docker': ['docker', 'container'],
  'Kubernetes': ['kubernetes', 'k8s', 'eks'],
  'Jenkins': ['jenkins'],
  'GitLab CI': ['gitlab'],
  'GitHub Actions': ['github actions'],
  'CI/CD': ['ci/cd', 'cicd', 'continuous integration', 'continuous delivery'],
  'Terraform': ['terraform', 'infrastructure as code', 'iac'],
  'Maven': ['maven'],
  'Playwright': ['playwright'],
  'JUnit / Mockito': ['junit', 'mockito'],
  'pytest': ['pytest'],
  'Git': ['git ', 'git,', 'version control'],
  'Linux': ['linux', 'unix'],
  'Generative AI': ['generative ai', 'genai', 'gen ai'],
  'LLMs': ['llm', 'large language model', 'gpt', 'openai', 'gemini', 'claude'],
  'AI agents': ['agent', 'agentic', 'multi-agent', 'google adk', 'adk'],
  'RAG': ['rag', 'retrieval augmented', 'retrieval-augmented'],
  'LangChain': ['langchain'],
  'LangGraph': ['langgraph'],
  'MCP': ['mcp', 'model context protocol'],
  'Prompt engineering': ['prompt engineering', 'prompting', 'prompt design'],
  'PyTorch': ['pytorch'],
  'TensorFlow': ['tensorflow'],
  'Machine learning': ['machine learning', ' ml ', 'deep learning', 'neural network', 'fine-tun', 'fine tun'],
  'NLP / OCR': ['nlp', 'natural language', 'ocr', 'spacy', 'tesseract'],
  'Speech (Whisper/TTS)': ['whisper', 'speech', 'tts', 'text-to-speech', 'voice'],
  'Data pipelines / ETL': ['etl', 'data pipeline', 'ingestion', 'pandas', 'numpy'],
  'Agile / Scrum': ['agile', 'scrum'],
  'System design': ['system design', 'architecture', 'distributed system', 'scalab'],
  // common requirements not on his resume (used to report gaps honestly)
  'Azure': ['azure'],
  'GCP': ['gcp', 'google cloud'],
  'C#/.NET': ['c#', '.net', 'dotnet'],
  'Rust': ['rust'],
  'Ruby / Rails': ['ruby', 'rails'],
  'PHP': ['php'],
  'Scala': ['scala'],
  'Kotlin': ['kotlin'],
  'Swift / iOS': ['swift', 'ios'],
  'Vue': ['vue'],
  'GraphQL': ['graphql'],
  'Spark': ['spark', 'pyspark', 'databricks'],
  'Airflow': ['airflow'],
  'Snowflake': ['snowflake'],
  'Elasticsearch': ['elasticsearch', 'opensearch'],
  'RabbitMQ': ['rabbitmq'],
  'Salesforce': ['salesforce'],
};

const HAS = new Set([
  'Java', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'Go', 'C++', 'Spring Boot', 'Spring Security', 'Hibernate / JPA', 'FastAPI',
  'Node.js', 'React', 'Angular', 'Redux', 'Kafka', 'Microservices', 'REST APIs', 'JWT / OAuth', 'PostgreSQL', 'MySQL', 'DynamoDB',
  'Redis', 'MongoDB', 'ChromaDB / vector DBs', 'AWS', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'CI/CD',
  'Terraform', 'Maven', 'JUnit / Mockito', 'pytest', 'Git', 'Linux', 'Generative AI', 'LLMs', 'AI agents', 'RAG', 'LangChain',
  'LangGraph', 'MCP', 'Prompt engineering', 'PyTorch', 'TensorFlow', 'Machine learning', 'NLP / OCR', 'Speech (Whisper/TTS)',
  'Data pipelines / ETL', 'Agile / Scrum', 'System design',
  'Next.js', 'Azure', 'GCP', 'C#/.NET', 'GraphQL', 'Spark', 'RabbitMQ', 'Playwright',
]);

const findSkills = (text) => {
  const t = ` ${norm(text)} `;
  return Object.entries(ALIASES).filter(([, al]) => al.some((a) => t.includes(a))).map(([k]) => k);
};

// ---------- evidence corpus (every bullet, tagged with where it came from) ----------
const corpus = [];
experience.forEach((j) => j.points.forEach((p) => corpus.push({ text: p, src: `${j.role} · ${j.company}` })));
projects.forEach((p) => {
  corpus.push({ text: p.description, src: `Project · ${p.title.split('—')[0].trim()}` });
  (p.highlights || []).forEach((h) => corpus.push({ text: h, src: `Project · ${p.title.split('—')[0].trim()}` }));
});
leadershipAndInvolvement.forEach((l) => l.points.forEach((p) => corpus.push({ text: p, src: l.role })));
const docTokens = corpus.map((d) => new Set(tokens(d.text)));
const df = {};
docTokens.forEach((s) => s.forEach((t) => { df[t] = (df[t] || 0) + 1; }));
const idf = (t) => Math.log(1 + corpus.length / (df[t] || 0.5));

const search = (q, k = 3, extraTerms = []) => {
  const qt = [...new Set([...tokens(q), ...extraTerms.flatMap(tokens)])];
  if (!qt.length) return [];
  return corpus
    .map((d, i) => ({ d, s: qt.reduce((a, t) => a + (docTokens[i].has(t) || [...docTokens[i]].some((w) => w.startsWith(t) && t.length > 3) ? idf(t) : 0), 0) }))
    .filter((x) => x.s > 1.2)
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .map((x) => x.d);
};
const evidence = (items) => items.map((e) => `- ${e.text} _(${e.src})_`).join('\n');

// ---------- canned knowledge ----------
const cur = experience[0];
const rejekt = projects[0];
const beyond = projects[1];
const skillLine = (arr, n = 99) => arr.slice(0, n).map((s) => s.name).join(', ');

const intro = () =>
  `**${personalInfo.name} G ("${ME}")** is a Software Engineer in ${facts.location} with ${facts.yearsLabel} of experience in **Java, Python, and React**.\n\n` +
  bullets([
    `**Now:** ${cur.role} at ${cur.company} (${cur.duration}), building AI agent workflows with Google ADK for Java and full-stack financial workflows used by 500+ internal users.`,
    `**Built:** rejekt.ai, a live Generative AI interview platform (RAG, LangGraph, OpenAI/Gemini, real-time Whisper voice).`,
    `**Research:** co-authored *Beyond Sight* at ACM W4A '24 (Judges' Award).`,
    `**Credentials:** MS in Computer Science, University of North Texas (GPA 3.82) · AWS Certified Developer – Associate.`,
  ]);

const projAnswer = (key) => {
  const p = projects.find((x) => x.title.includes(key));
  return {
    text: `**${p.title}** · ${p.date}\n\n${p.description}\n\n${bullets(p.highlights || [])}\n\n**Stack:** ${p.tech.join(', ')}${p.githubLink ? `\n\nCode: [GitHub](${p.githubLink})` : ''}`,
    follow: ['What AI work has he done?', 'Tell me more about rejekt.ai'],
  };
};

const answers = {
  greet: () => ({
    text: `Hi! I'm ${ME}'s assistant. Ask me anything about his experience, projects, skills, or availability — or paste a job description and I'll check how well he fits.`,
    follow: ['Give me a 30-second intro', 'What is he working on now?', 'Check fit for a job'],
  }),
  intro: () => ({ text: intro(), follow: ['What AI work has he done?', 'Why should we hire him?', 'Is he available?'] }),
  current: () => ({
    text: `**${cur.role} at ${cur.company}** · ${cur.location} · ${cur.duration}\n\n${bullets(cur.points.slice(0, 5))}\n\n**Stack:** ${cur.tech.join(', ')}`,
    follow: ['Tell me about the AI agent work', 'What did he do at Zensar?', 'Biggest impact numbers?'],
  }),
  years: () => ({
    text: `**${facts.yearsLabel}** of professional software engineering:\n\n${bullets(experience.map((j) => `**${j.role}**, ${j.company} — ${j.duration}`))}\n\nPlus a Master's in CS (2023–2025) and ongoing product work on rejekt.ai since Jan 2026.`,
    follow: ['What is he working on now?', 'Tell me about Zensar'],
  }),
  zensar: () => {
    const z = experience.filter((j) => j.company.includes('Zensar'));
    return {
      text: z.map((j) => `**${j.role}** · ${j.duration}\n${bullets(j.points.slice(0, 4))}`).join('\n\n'),
      follow: ['What is he working on now?', 'Backend experience?'],
    };
  },
  ai: () => ({
    text:
      `AI is where ${ME} is heading, and he has shipped it in production and in his own product:\n\n` +
      bullets([
        `**At ${cur.company}:** ${cur.points[0]}`,
        `**rejekt.ai:** ${rejekt.description}`,
        ...rejekt.highlights.slice(0, 2),
        `**Computer-use agents:** an LLM discovers legacy-app workflows once, records typed capability artifacts, and production replays them deterministically with a human handoff on risky steps (Playwright + CDP; TypeScript and Python/Claude).`,
        `**Agent skills:** a Claude Code plugin of 11 trading agent skills (scan → entry → exit → 10,000-replay time machine → risk → broker), paper by default with human approval before live orders.`,
        `**Research:** Beyond Sight — fine-tuned ResNet (92% chart-classification accuracy) + OCR/NLP pipeline (85% precision), published at ACM W4A '24.`,
      ]) +
      `\n\n**AI stack:** ${skillLine(skills.aiAndDataEngineering, 14)}`,
    follow: ['Tell me more about rejekt.ai', 'Has he used RAG?', 'Check fit for a job'],
  }),
  rejekt: () => ({
    text: `**${rejekt.title}** · ${rejekt.date}\n\n${rejekt.description}\n\n${bullets(rejekt.highlights)}\n\n**Stack:** ${rejekt.tech.join(', ')}\n\nLive: [rejekt.ai](${rejekt.liveLink}) · Code: [GitHub](${rejekt.githubLink})`,
    follow: ['What is Beyond Sight?', 'What AI work has he done?'],
  }),
  beyond: () => ({
    text: `**${beyond.title}** · ${beyond.date}\n\n${beyond.description}\n\n${bullets(beyond.highlights)}\n\n[Award certificate](${beyond.award}) · [Tool demo](${beyond.liveLink2})`,
    follow: ['Tell me more about rejekt.ai', 'Education?'],
  }),
  projects: () => ({
    text: `Highlights from ${ME}'s projects:\n\n${bullets(projects.slice(0, 6).map((p) => `**${p.title.split('—')[0].trim()}** — ${p.description.split('. ')[0]}.`))}`,
    follow: ['Tell me more about rejekt.ai', 'What is Beyond Sight?'],
  }),
  skills: () => ({
    text:
      `**Languages:** ${skillLine(skills.languages)}\n\n**AI / ML:** ${skillLine(skills.aiAndDataEngineering, 12)}\n\n` +
      `**Backend & frontend:** ${skillLine(skills.frameworksAndLibraries)}\n\n**Data:** ${skillLine(skills.databases)}\n\n**Cloud & DevOps:** ${skillLine(skills.toolsAndPlatforms)}`,
    follow: ['Does he know Kubernetes?', 'Frontend experience?', 'Check fit for a job'],
  }),
  frontend: () => ({
    text: `Frontend: **React.js, TypeScript, Angular, Redux**.\n\n${evidence(search('react angular frontend components page-load memoizing ui', 4))}`,
    follow: ['Backend experience?', 'Skills overview'],
  }),
  backend: () => ({
    text: `Backend is ${ME}'s core: **Java 17 + Spring Boot microservices, Python + FastAPI, Kafka, REST/JWT security**.\n\n${evidence(search('spring boot rest endpoints kafka microservices api fastapi', 4))}`,
    follow: ['Cloud / DevOps experience?', 'Frontend experience?'],
  }),
  cloud: () => ({
    text: `**AWS Certified Developer – Associate.** Hands-on with ${skillLine(skills.toolsAndPlatforms, 8)}.\n\n${evidence(search('aws docker kubernetes jenkins gitlab deployment fargate release', 4))}`,
    follow: ['Biggest impact numbers?', 'Skills overview'],
  }),
  testing: () => ({
    text: `Testing: **JUnit, Mockito, pytest**, plus regression-test discipline after incidents.\n\n${evidence(search('junit mockito pytest regression tests', 3))}`,
    follow: ['Backend experience?'],
  }),
  impact: () => ({
    text:
      `Measurable results:\n\n` +
      bullets([
        '**30% fewer** manual processing steps — AI agents automating 12 financial processes (Citigroup)',
        '**50K+ requests/day at 99.9%** availability across 15 secure REST endpoints',
        '**3.2s → 2.4s** page-load time',
        '**2 days → 6 hours** code-to-production via CI/CD automation',
        '**20+ production incidents** resolved, each backed by regression tests',
        '**2.02M+ job listings** processed by rejekt.ai pipelines (19 sources)',
        '**92% accuracy** chart classification · **85% precision** OCR extraction (ACM W4A \'24)',
        '**~20% fewer** processing errors and **~30% less** repetitive dev effort (Zensar)',
      ]),
    follow: ['Why should we hire him?', 'What is he working on now?'],
  }),
  why: () => ({
    text:
      `Why ${ME} is a strong hire:\n\n` +
      bullets([
        '**Production AI, not just demos** — agent workflows at a global bank with deterministic, auditable guardrails.',
        '**Full-stack depth** — React/Angular through Spring Boot, Kafka and AWS, owning features end to end.',
        '**Builder mindset** — designed, shipped and runs rejekt.ai on his own: RAG, voice, data pipelines, cloud infra.',
        '**Reliability focus** — 99.9% availability, incident root-causing, regression tests, faster releases.',
        '**Strong foundations** — MS CS (3.82 GPA), AWS certified, published accessibility research.',
      ]),
    follow: ['Biggest impact numbers?', 'Is he available?', 'Check fit for a job'],
  }),
  education: () => ({
    text: `${bullets(education.map((e) => `**${e.degree}** — ${e.institution.trim()} (${e.duration})${e.score ? ` · ${e.score}` : ''}`))}\n\n**Certification:** ${certifications.map((c) => c.title).join(', ')}`,
    follow: ['Research / publications?', 'Skills overview'],
  }),
  certs: () => ({
    text: certifications.map((c) => `**${c.title}** — ${c.issuer}\nIssued ${c.issued} · valid until ${c.expires} · Validation ID \`${c.validationId}\` ([verify](${c.verifyUrl}))`).join('\n\n'),
    follow: ['Cloud / DevOps experience?'],
  }),
  research: () => answers.beyond(),
  computeruse: () => projAnswer('Computer-Use'),
  trader: () => projAnswer('Angel One'),
  leadership: () => ({
    text: bullets(leadershipAndInvolvement.map((l) => `**${l.role}** — ${l.points[0]}`)) +
      `\n\nAt work he contributes to architecture reviews and API-contract decisions for 6 team-owned services and coordinates fixes across dev and QA.`,
    follow: ['Why should we hire him?'],
  }),
  availability: () => ({
    text: `${facts.availability} Based in ${facts.location}. ${facts.relocation}`,
    follow: ['How do I contact him?', 'Work authorization?'],
  }),
  location: () => answers.availability(),
  visa: () => ({ text: facts.workAuth, follow: ['Is he available?', 'How do I contact him?'] }),
  salary: () => ({ text: facts.compensation, follow: ['Is he available?', 'How do I contact him?'] }),
  contact: () => ({
    text: `- **Email:** ${EMAIL}\n- **LinkedIn:** [durgasantosh-g](${personalInfo.linkedin})\n- **GitHub:** [santosh1664](${personalInfo.github})\n- **Résumé:** [download PDF](${personalInfo.resumeLink})`,
    follow: ['Is he available?', 'Give me a 30-second intro'],
  }),
  weakness: () => ({
    text: `Honest answer from his record: ${ME}'s professional work so far is mostly in financial services, and his deepest cloud experience is on AWS (where he's certified) rather than Azure or GCP. He closes gaps fast — rejekt.ai was built end to end on his own, from RAG pipelines to ECS Fargate infrastructure.`,
    follow: ['Why should we hire him?'],
  }),
  thanks: () => ({ text: `Happy to help! You can reach ${ME} at ${EMAIL}.`, follow: ['Give me a 30-second intro', 'Check fit for a job'] }),
};

// ---------- intent routing ----------
const ROUTES = [
  ['greet', [/^(hi|hey|hello|yo|hola|good (morning|afternoon|evening))\b/]],
  ['thanks', [/^(thanks|thank you|thx|great|cool|awesome)\b/]],
  ['salary', ['salary', 'compensation', 'pay ', 'expected pay', 'ctc', 'rate', 'hourly', 'package']],
  ['visa', ['visa', 'sponsor', 'h1b', 'h-1b', 'opt', 'citizen', 'green card', 'work authorization', 'authorized', 'authorization', 'eligible to work']],
  ['availability', ['available', 'availability', 'notice', 'start date', 'when can', 'join', 'start']],
  ['location', ['where is he', 'located', 'location', 'relocat', 'remote', 'onsite', 'on-site', 'hybrid', 'based']],
  ['why', ['why should', 'why hire', 'why him', 'strength', 'stand out', 'unique', 'good fit', 'best at', 'value']],
  ['weakness', ['weakness', 'gap', 'improve', 'lacking', 'not good']],
  ['contact', ['contact', 'email', 'reach', 'linkedin', 'resume', 'cv', 'phone', 'get in touch']],
  ['impact', ['impact', 'achievement', 'accomplish', 'metric', 'result', 'numbers', 'proud']],
  ['rejekt', ['rejekt', 'interview platform', 'interview prep']],
  ['computeruse', ['computer use', 'computer-use', 'legacy app', 'playwright', 'browser automation', 'rpa', 'replay']],
  ['trader', ['trading', 'trader', 'angel one', 'stock', 'claude skill', 'agent skill', 'plugin']],
  ['beyond', ['beyond sight', 'audible', 'visually impaired', 'accessibility']],
  ['research', ['research', 'paper', 'publication', 'publish', 'w4a', 'acm']],
  ['certs', ['certif', 'aws certified', 'credential']],
  ['education', ['education', 'degree', 'master', 'bachelor', 'university', 'college', 'gpa', 'unt', 'vit', 'study', 'studied']],
  ['zensar', ['zensar', 'previous job', 'previous company', 'before citi', 'past experience', 'india']],
  ['current', ['current', 'currently', 'right now', 'working on', ' now ', 'doing now', 'latest role', 'recent role', 'citi', 'present role', 'present job', 'working now', 'day to day', 'day-to-day']],
  ['years', ['how many years', 'years of experience', 'how long', 'how experienced', 'seniority', 'level']],
  ['ai', [' ai', 'ai ', 'llm', 'genai', 'generative', 'agent', 'rag', 'machine learning', ' ml', 'langchain', 'langgraph', 'openai', 'gemini', 'nlp']],
  ['leadership', ['lead', 'team', 'mentor', 'collaborat', 'soft skill', 'communication', 'handball']],
  ['frontend', ['frontend', 'front-end', 'front end', 'ui ', 'react', 'angular']],
  ['backend', ['backend', 'back-end', 'back end', 'server', 'java', 'spring', 'api']],
  ['cloud', ['cloud', 'aws', 'devops', 'deploy', 'docker', 'kubernetes', 'ci/cd', 'infra']],
  ['testing', ['test', 'quality', 'junit', 'pytest']],
  ['projects', ['project', 'built', 'portfolio', 'side project', 'github']],
  ['skills', ['skill', 'stack', 'tech', 'technolog', 'tools', 'languages', 'know']],
  ['intro', ['who is he', 'who is santosh', 'who is durga', 'about him', 'about you', 'tell me about', 'introduce', 'summary', 'summar', 'overview', 'background', 'profile', 'elevator', 'intro']],
];

// Questions that are not about Santosh get redirected instead of answered.
const ABOUT_HIM = /\b(he|his|him|he's|santosh|durga|durgasantosh|candidate|you|your|you're)\b/;
const OFF_TOPIC = [
  /\bweather\b/, /\bjoke\b/, /\bpoem\b/, /\bstory\b/, /\brecipe\b/, /\bnews\b/, /\bpresident\b/, /\bprime minister\b/,
  /\bcapital of\b/, /\btranslate\b/, /\bcalculate\b/, /\bsolve\b/, /^\s*what is \d/, /\d+\s*[-+*/x]\s*\d+/, /\bstock price\b/, /\bbitcoin|crypto\b/,
  /\bmovie|song|lyrics|game score|football|cricket|nba|nfl\b/, /\bwhat time\b/, /\bwhat day\b/,
  /\b(write|generate|create|make|give)\b.*\b(code|program|script|function|essay|email|letter|poem|story|query|sql)\b/,
  /\bhow (do|to|can) (i|you|we)\b(?!.*\b(contact|reach|hire|email)\b)/, /\bexplain (what|how)\b/, /\bwhat is (a|an|the)\b/, /\bdefine\b/, /\bdifference between\b/,
  /\b(chatgpt|openai's ceo|elon|weather)\b/,
];
export const redirect = () => ({
  text: `I'm only here to talk about **${ME}** — so I can't help with that one.\n\nAsk me about ${ME} instead: his experience, AI projects, skills, availability, or paste a job description to see how well he fits.`,
  follow: ['Give me a 30-second intro', 'What AI work has he done?', 'Check fit for a job'],
});

const SKILL_Q = /\b(does|do|has|have|can|is|know|knows|familiar|experience|experienced|worked|used|use|proficient)\b/;

const skillCheck = (q, found) => {
  const yes = found.filter((s) => HAS.has(s));
  const no = found.filter((s) => !HAS.has(s));
  let text = '';
  if (yes.length) {
    const ev = search(q, 3, yes.flatMap((s) => ALIASES[s].slice(0, 2)));
    text += `**Yes — ${yes.join(', ')}.**${ev.length ? `\n\nWhere he's used it:\n${evidence(ev)}` : ' It is part of his listed skill set.'}`;
  }
  if (no.length) {
    text += `${text ? '\n\n' : ''}**${no.join(', ')}:** not listed on his résumé, so I won't claim it. His closest experience is ${HAS.has('AWS') ? 'AWS (certified) and the Java/Python/React stack' : 'his core stack'}; you can ask him directly at ${EMAIL}.`;
  }
  return { text, follow: ['Skills overview', 'Check fit for a job'] };
};

// ---------- job-fit check ----------
export const looksLikeJD = (s) => (s.length > 180 && /(responsibilit|requirement|qualification|experience with|you will|we are looking|must have|nice to have|years of)/i.test(s)) || (s.length > 150 && findSkills(s).length >= 6);

export const fitCheck = (jd) => {
  const found = findSkills(jd);
  const matched = found.filter((s) => HAS.has(s));
  const missing = found.filter((s) => !HAS.has(s));
  const yrs = [...jd.matchAll(/(\d{1,2})\s*\+?\s*(?:-|to|–)?\s*(?:\d{1,2}\s*)?years?/gi)].map((m) => +m[1]).filter((n) => n > 0 && n < 20);
  const reqYears = yrs.length ? Math.min(...yrs) : null;
  let score = found.length ? Math.round((matched.length / found.length) * 100) : 0;
  if (reqYears && reqYears > facts.yearsNumber + 1) score = Math.max(0, score - 15);
  const ev = search(jd, 4, matched.flatMap((s) => ALIASES[s].slice(0, 1)));
  const verdict = !found.length ? 'I could not find specific technologies in that text.'
    : score >= 80 ? 'Strong match' : score >= 60 ? 'Good match' : score >= 40 ? 'Partial match' : 'Stretch role';
  const text = !found.length
    ? `${verdict} Try pasting the full job description, including the requirements section.`
    : `**${verdict} — ${score}%** of the technologies named in this posting are on ${ME}'s résumé.\n\n` +
      `**Matches (${matched.length}):** ${matched.join(', ') || '—'}\n\n` +
      `**Not on his résumé (${missing.length}):** ${missing.join(', ') || 'none — every listed technology is covered'}\n\n` +
      (reqYears ? `**Experience:** posting asks for ${reqYears}+ years; ${ME} has ${facts.yearsLabel}.\n\n` : '') +
      (ev.length ? `**Most relevant evidence:**\n${evidence(ev)}` : '');
  return { text, score: found.length ? score : null, follow: ['Why should we hire him?', 'Is he available?', 'How do I contact him?'] };
};

// ---------- main entry ----------
export const answer = (raw) => {
  const input = raw.trim();
  if (!input) return answers.greet();
  if (looksLikeJD(input)) return fitCheck(input);
  const q = ` ${norm(input)} `;
  if (!ABOUT_HIM.test(q) && OFF_TOPIC.some((re) => re.test(q))) return redirect();

  const found = findSkills(input);
  const routed = ROUTES.find(([, pats]) => pats.some((p) => (p instanceof RegExp ? p.test(q.trim()) : q.includes(p))));
  // "Does he know Kubernetes?" style questions → evidence-backed yes/no
  if (found.length && SKILL_Q.test(q) && (!routed || ['skills', 'backend', 'frontend', 'cloud', 'ai', 'testing'].includes(routed[0]))) {
    return skillCheck(input, found);
  }
  if (routed) return answers[routed[0]]();
  if (found.length) return skillCheck(input, found);

  const ev = search(input, 3);
  if (ev.length && ABOUT_HIM.test(q)) {
    return { text: `Here's what I found in ${ME}'s record:\n\n${evidence(ev)}`, follow: ['Give me a 30-second intro', 'Skills overview'] };
  }
  if (!ABOUT_HIM.test(q)) return redirect();
  return {
    text: `I don't have that detail in ${ME}'s portfolio, and I'd rather not guess. Ask me about ${ME}'s experience, projects, skills, or availability — or email him directly at ${EMAIL}.`,
    follow: ['Give me a 30-second intro', 'What AI work has he done?', 'How do I contact him?'],
  };
};

export const STARTERS = [
  'Give me a 30-second intro',
  'What is he working on now?',
  'What AI work has he done?',
  'Biggest impact numbers?',
  'Does he know Kubernetes?',
  'Is he available?',
];

export const recruiterSummary = () =>
  `${personalInfo.name} G — Software Engineer (${facts.location})\n` +
  `${facts.yearsLabel} · Java 17/Spring Boot, Python/FastAPI, React, Kafka, AWS (Certified Developer)\n` +
  `Now: ${cur.role}, ${cur.company} (${cur.duration}) — AI agent workflows (Google ADK), 500+ users, 50K+ req/day at 99.9%\n` +
  `Built: rejekt.ai — live GenAI interview platform (RAG, LangGraph, OpenAI/Gemini, Whisper)\n` +
  `MS CS, University of North Texas (3.82) · ACM W4A '24 co-author\n` +
  `${facts.availability} ${facts.relocation}\n` +
  `Contact: ${EMAIL} · ${personalInfo.linkedin}`;

export { HAS as SKILLS_HAVE, findSkills };
