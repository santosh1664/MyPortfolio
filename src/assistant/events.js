// Open the assistant from anywhere, optionally with a question or in job-fit mode.
export const askSantosh = (q = '', mode = 'chat') =>
  window.dispatchEvent(new CustomEvent('ask-santosh', { detail: { q, mode } }));
