import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaComments } from 'react-icons/fa';
import { getApiBaseUrl } from '../chat/apiBaseUrl';
import './ResumeChatWidget.css';

const FALLBACK_REPLY =
  'I don’t have that information available right now, but I’m happy to help with my experience, projects, skills, or role fit.';
const SERVICE_UNAVAILABLE_REPLY =
  'Chat service is unavailable right now. Please try again later.';
const LOCAL_GREETING =
  'Hey - thanks for checking out my portfolio.\n\nThis is Durgasantosh. Feel free to ask me about my experience, projects, or role fit.';
const TEASER_SESSION_KEY = 'chat_teaser_seen';
const PANEL_STARTED_KEY = 'chat_started';
const OPENER_DELAY_MS = 7000;
const TEASER_COPY =
  'Hi — my recent work has focused on AI-driven full-stack systems. I can walk you through the parts most relevant to your hiring needs.';

function shouldEnableTeaser() {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    window.matchMedia('(min-width: 768px)').matches &&
    window.sessionStorage.getItem(TEASER_SESSION_KEY) !== 'true'
  );
}

function createAssistantMessages(data) {
  const reply = data?.reply || FALLBACK_REPLY;
  const messages = [{ role: 'bot', text: reply }];
  const nextQuestion = data?.next_question?.trim();

  if (nextQuestion && reply.trim() !== nextQuestion) {
    messages.push({ role: 'bot', text: nextQuestion, meta: 'next-question' });
  }

  return messages;
}

function createGreetingMessage() {
  return [{ role: 'bot', text: LOCAL_GREETING, meta: 'local-greeting' }];
}

function ResumeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const apiBaseUrl = getApiBaseUrl();

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

  const markTeaserSeen = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(TEASER_SESSION_KEY, 'true');
    }
    setShowTeaser(false);
  };

  const handleResponseMessages = (data) => {
    const assistantMessages = createAssistantMessages(data);
    setMessages((prev) =>
      prev.flatMap((message) => (message.pending ? assistantMessages : [message]))
    );
  };

  const openPanel = () => {
    markTeaserSeen();
    setIsOpen(true);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(PANEL_STARTED_KEY, 'true');
    }
    setMessages((prev) => {
      if (prev.length > 0) {
        return prev;
      }
      return createGreetingMessage();
    });
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  const handleToggleClick = () => {
    if (isOpen) {
      closePanel();
      return;
    }

    openPanel();
  };

  const handleAsk = async (question) => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) {
      return;
    }

    markTeaserSeen();
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
      if (!response.ok) {
        throw new Error(`Chat request failed with status ${response.status}`);
      }
      const data = await response.json();
      handleResponseMessages(data);
    } catch (error) {
      console.error(error);
      setMessages((prev) =>
        prev.map((message) =>
          message.pending ? { role: 'bot', text: SERVICE_UNAVAILABLE_REPLY } : message
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }

    handleAsk(trimmed);
    setInputValue('');
  };

  useEffect(() => {
    if (!shouldEnableTeaser()) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShowTeaser(true);
      window.sessionStorage.setItem(TEASER_SESSION_KEY, 'true');
    }, OPENER_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  return (
    <div className="resume-chat-widget">
      {showTeaser && !isOpen ? (
        <button
          className="resume-chat-widget__teaser"
          type="button"
          onClick={openPanel}
        >
          {TEASER_COPY}
        </button>
      ) : null}
      <button
        className="resume-chat-widget__toggle"
        type="button"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        onClick={handleToggleClick}
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
              onClick={closePanel}
            >
              ×
            </button>
          </div>
          <div className="resume-chat-widget__body">
            <div className="resume-chat-widget__messages">
              {messages.map((message, index) => (
                <div
                  className={`resume-chat-widget__message resume-chat-widget__message--${message.role}`}
                  key={`${message.role}-${index}-${message.meta || 'message'}`}
                >
                  {message.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="resume-chat-widget__input-row">
              <input
                className="resume-chat-widget__input"
                type="text"
                placeholder="Ask about projects, backend systems, or AI work..."
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
