import React, { useEffect, useRef, useState } from 'react';
import { FaComments } from 'react-icons/fa';
import './ResumeChatWidget.css';

const questionCategories = [
  {
    id: 'about',
    title: 'About You',
    questions: [
      'Tell me about yourself',
      'What is your professional background?',
      'How many years of experience do you have?',
      'What is your current role?',
    ],
  },
  {
    id: 'work',
    title: 'Work Experience',
    questions: [
      'Where do you currently work?',
      'What do you do at Citi Group?',
      'What technologies do you use in your current job?',
      'What did you do at Zensar Technologies?',
    ],
  },
  {
    id: 'projects',
    title: 'Projects & Impact',
    questions: [
      'Tell me about your recent projects',
      'What is the Beyond Sight project?',
      'What impact did your projects have?',
      'Have you worked on AI or machine learning projects?',
    ],
  },
  {
    id: 'skills',
    title: 'Skills & Tech Stack',
    questions: [
      'What are your core technical skills?',
      'Do you have experience with microservices?',
      'What frontend technologies do you use?',
      'What backend technologies do you specialize in?',
      'Do you have AWS or cloud experience?',
    ],
  },
  {
    id: 'education',
    title: 'Education & Certifications',
    questions: [
      'What is your highest qualification?',
      'Where did you complete your master’s degree?',
      'Do you have any certifications?',
      'Are you AWS certified?',
    ],
  },
  {
    id: 'Status & Relocation',
    title: 'Status & Relocation',
    questions: [
      'Are you open to relocation?',
      'What is your visa status?',
      'Are you eligible for STEM OPT?',
      'Will you need H1B sponsorship?',
    ],
  },
  {
    id: 'comp',
    title: 'Compensation',
    questions: ['What is your desired compensation range?',
    ],
  },
];

function ResumeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm Roy. Ask me anything about Durgasantosh." },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

  const sessionIdRef = useRef(
    typeof window !== 'undefined'
      ? window.localStorage.getItem('chat_session_id') || `session-${Date.now()}`
      : 'session-default'
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('chat_session_id', sessionIdRef.current);
    }
  }, []);

  const handleAsk = async (question) => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: trimmed },
      { role: 'bot', text: 'Thinking...', pending: true },
    ]);

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          session_id: sessionIdRef.current,
        }),
      });
      const data = await response.json();
      const reply = data?.reply || 'That information is not available in my resume. Please feel free to ask something else.';

      setMessages((prev) =>
        prev.map((message) =>
          message.pending ? { ...message, text: reply, pending: false } : message
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((message) =>
          message.pending
            ? {
                ...message,
                text: 'That information is not available in my resume. Please feel free to ask something else.',
                pending: false,
              }
            : message
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    handleAsk(trimmed);
    setInputValue('');
  };

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  return (
    <div className="resume-chat-widget">
      <button
        className="resume-chat-widget__toggle"
        type="button"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <FaComments aria-hidden="true" />
      </button>
      {isOpen ? (
        <div className="resume-chat-widget__panel" role="dialog" aria-label="Resume chat">
          <div className="resume-chat-widget__header">
            <span className="resume-chat-widget__title">Roy</span>
            <button
              className="resume-chat-widget__close"
              type="button"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="resume-chat-widget__body">
            <div className="resume-chat-widget__messages">
              {messages.map((message, index) => (
                <div
                  className={`resume-chat-widget__message resume-chat-widget__message--${message.role}`}
                  key={`${message.role}-${index}`}
                >
                  {message.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="resume-chat-widget__suggestions">
              <div className="resume-chat-widget__suggestions-header">
                <span>Suggested Questions</span>
                {activeCategoryId ? (
                  <button
                    className="resume-chat-widget__menu-button"
                    type="button"
                    onClick={() => setActiveCategoryId(null)}
                  >
                    Main menu
                  </button>
                ) : null}
              </div>
              {activeCategoryId ? (
                <div className="resume-chat-widget__question-list">
                  {questionCategories
                    .find((category) => category.id === activeCategoryId)
                    ?.questions.map((question) => (
                      <button
                        className="resume-chat-widget__chip"
                        type="button"
                        key={question}
                        onClick={() => handleAsk(question)}
                      >
                        {question}
                      </button>
                    ))}
                </div>
              ) : (
                <>
                  <div className="resume-chat-widget__category-list">
                    {questionCategories.map((category) => (
                      <button
                        className="resume-chat-widget__category"
                        type="button"
                        key={category.id}
                        onClick={() => setActiveCategoryId(category.id)}
                      >
                        {category.title}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="resume-chat-widget__input-row">
              <input
                className="resume-chat-widget__input"
                type="text"
                placeholder="Ask about skills, projects, education..."
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleSend();
                  }
                }}
                disabled={isLoading}
              />
              <button
                className="resume-chat-widget__send"
                type="button"
                onClick={handleSend}
                disabled={isLoading}
              >
                {isLoading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ResumeChatWidget;
