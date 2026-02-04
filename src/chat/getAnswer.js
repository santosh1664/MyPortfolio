import { resumeProfile } from "./resumeData";

function localAnswer(question) {
  const q = question.toLowerCase();

  if (q.includes("tell me about yourself") || q.includes("introduce")) {
    return resumeProfile.summary;
  }

  if (q.includes("who are you") || q.includes("about you")) {
    return resumeProfile.summary;
  }

  if (q.includes("experience")) {
    return resumeProfile.experience;
  }

  if (q.includes("angular")) {
    return resumeProfile.angular;
  }

  if (q.includes("current") || q.includes("work")) {
    return resumeProfile.currentJob;
  }

  if (q.includes("project")) {
    return resumeProfile.project;
  }

  if (q.includes("skills") || q.includes("technology")) {
    return resumeProfile.skills;
  }

  if (q.includes("certification")) {
    return resumeProfile.certifications;
  }

  if (q.includes("relocation")) {
    return "Yes, I am open to relocation for the right opportunity.";
  }

  if (q.includes("salary") || q.includes("compensation")) {
    return resumeProfile.salary.default;
  }

  if (q.includes("visa") || q.includes("opt")) {
    return resumeProfile.visa.status;
  }

  if (q.includes("stem")) {
    return resumeProfile.visa.stem;
  }

  if (q.includes("sponsorship") || q.includes("h1b")) {
    return resumeProfile.visa.sponsorship;
  }

  return resumeProfile.summary;
}

export async function getAnswer(question) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await fetch(`${API_BASE_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) throw new Error("Backend failed");

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.warn("Using local fallback:", error);
    return localAnswer(question);
  }
}
