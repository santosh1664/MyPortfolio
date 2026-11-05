import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import ResumeChatWidget from './ResumeChatWidget';

describe('ResumeChatWidget', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            reply: 'Hi — my recent work has focused on AI-driven full-stack systems.',
            next_question:
              'Are you mainly interested in frontend architecture, backend systems, or AI-focused work?',
            recommended_section: { id: 'projects', label: 'Projects' },
            conversation_state: {
              has_started: true,
              current_topic: 'introduction',
              covered_topics: [],
              follow_up_depth: 0,
            },
          }),
      })
    );
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('shows teaser after delay on desktop', () => {
    vi.useFakeTimers();
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<ResumeChatWidget />);
    act(() => vi.advanceTimersByTime(7000));

    expect(screen.getByText(/my recent work has focused/i)).toBeInTheDocument();
  });

  test('does not show teaser on mobile viewport', () => {
    vi.useFakeTimers();
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<ResumeChatWidget />);
    act(() => vi.advanceTimersByTime(7000));

    expect(screen.queryByText(/my recent work has focused/i)).not.toBeInTheDocument();
  });

  test('opens panel from teaser and shows local greeting before any api request', () => {
    vi.useFakeTimers();
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<ResumeChatWidget />);
    act(() => vi.advanceTimersByTime(7000));

    fireEvent.click(screen.getByText(/my recent work has focused/i));

    expect(
      screen.getByText(
        /this is durgasantosh\. feel free to ask me about my experience, projects, or role fit\./i
      )
    ).toBeInTheDocument();
    expect(window.fetch).not.toHaveBeenCalled();
    expect(screen.queryByText(/best next section:/i)).not.toBeInTheDocument();
  });

  test('shows teaser only once per session', () => {
    vi.useFakeTimers();
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    window.sessionStorage.setItem('chat_teaser_seen', 'true');

    render(<ResumeChatWidget />);
    act(() => vi.advanceTimersByTime(7000));

    expect(screen.queryByText(/my recent work has focused/i)).not.toBeInTheDocument();
  });

  test('shows service unavailable message when message send fails', async () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    window.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({}),
      })
    );

    render(<ResumeChatWidget />);

    fireEvent.click(screen.getByLabelText(/open chat/i));
    fireEvent.change(
      screen.getByPlaceholderText(/ask about projects, backend systems, or ai work/i),
      { target: { value: 'Tell me about your backend experience' } }
    );
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(
      await screen.findByText(/chat service is unavailable right now/i)
    ).toBeInTheDocument();
  });
});
