// Icon imports removed from data file
// Icons are now rendered directly in components to avoid JSX in data

export const personalInfo = {
  name: "Durgasantosh",
  title: "Software Engineer",
  email: "gaddamsantosh03@gmail.com",
  linkedin: "https://www.linkedin.com/in/durgasantosh-g/",
  github: "https://github.com/santosh1664",
  resumeLink: (import.meta.env.VITE_RESUME_URL || "/Durgasantosh_G_Software_Engineer.pdf"), // Make sure your resume is in public/
  bio: "Software Engineer with 3+ years in Java and Python, currently building AI agent workflows with Google ADK for Java on Citigroup's financial platforms (8 microservices, 500+ internal users). I also built and run rejekt.ai, a live Generative AI interview platform using RAG, LangGraph, OpenAI/Gemini, and real-time Whisper voice.",
  shortBio: "Full-stack and AI systems, from Spring Boot microservices to LLM agents.",
};

export const heroStats = [
  { k: "3+", v: "Years shipping production software in Java, Python & React" },
  { k: "500+", v: "Internal users on Citigroup workflows I build" },
  { k: "50K+", v: "Requests a day across 15 secure REST endpoints, 99.9% uptime" },
  { k: "2.02M", v: "Job listings processed by rejekt.ai's 19-source pipeline" },
];

export const education = [
  {
    institution: "University of North Texas (UNT), Denton, Texas",
    degree: "Master of Science in Computer Science",
    duration: "Aug 2023 – May 2025",
    score: "GPA: 3.82/4",
  },
  {
    institution: "Vellore Institute of Technology (VIT), Chennai",
    degree: "Bachelor of Technology in Computer Science",
    duration: "Aug 2018 – May 2022",
  },
];

export const certifications = [
  {
    title: "AWS Certified Developer - Associate",
    issuer: "Amazon Web Services",
    issued: "January 19, 2026",
    expires: "January 19, 2029",
    validationId: "70b6a9b194264fe6bae7094c4bb4de34",
    verifyUrl: "https://aws.amazon.com/verification",
    image: "",
  },
  {
    title: "Applied Data Science",
    issuer: "IBM",
    issued: "",
    expires: "",
    validationId: "",
    verifyUrl: "",
    image: "",
  },
];

export const experience = [
  {
    role: "Software Engineer",
    company: "Citigroup",
    location: "New Jersey · Remote",
    duration: "Jun 2025 – Present",
    tech: ["Google ADK for Java", "Java 17", "Python", "Spring Boot", "Spring Security", "React.js", "TypeScript", "Kafka", "DynamoDB", "JWT", "JUnit", "Mockito", "Docker", "Kubernetes", "Jenkins", "GitLab CI"],
    points: [
      "Built AI agent workflows with Google ADK for Java that automate 12 multi-step financial processes; agents call enterprise APIs only through deterministic business-rule checks, keeping every decision predictable and auditable. Cut manual processing steps by 30%.",
      "Maintain 15 secure REST endpoints (Spring Security, JWT, centralized validation and exception handling) that serve agent-integrated workflows at 50K+ requests a day and 99.9% availability.",
      "Build and maintain end-to-end financial workflows in React.js, Java 17, and Spring Boot used by 500+ internal users across 8 production microservices.",
      "Work on Kafka and DynamoDB event pipelines that feed agent and UI services, validating payloads and tracing failed or delayed transactions back to their source.",
      "Cut page-load time from 3.2s to 2.4s by removing redundant API calls, memoizing expensive React components, and simplifying state management.",
      "Investigated and resolved 20+ production incidents using application logs, API traces, event payloads, and Python log-analysis scripts, then added JUnit/Mockito regression tests so the same defects did not return.",
      "Shortened code-to-production time from 2 days to 6 hours by automating build and release steps across Docker, Kubernetes, Jenkins, and GitLab CI.",
      "Contributed to architecture reviews and API-contract decisions for 6 team-owned services, and created reusable React integration patterns that keep frontend and backend data consistent.",
    ],
  },
  {
    role: "Software Developer",
    company: "Zensar Technologies",
    location: "Hyderabad, India",
    duration: "Jun 2022 – Jul 2023",
    tech: ["Java", "Spring Boot", "Hibernate/JPA", "Angular", "React.js", "TypeScript", "RESTful APIs", "Kafka", "JUnit", "Mockito", "Maven", "Jenkins", "Docker", "AWS"],
    points: [
      "Developed and maintained full-stack features using Angular, React.js, Java, and Spring Boot for a microservices-based financial-services platform.",
      "Designed and enhanced RESTful APIs with request validation, exception handling, Spring Data JPA/Hibernate database interactions, and downstream service integration, keeping API contracts stable across releases.",
      "Created reusable frontend components, shared validation utilities, and common data-handling workflows, reducing repetitive development effort by approximately 30%.",
      "Integrated frontend modules with backend services, handling asynchronous requests, loading states, validation failures, and API errors to keep user experiences reliable during degraded service conditions.",
      "Strengthened transaction-processing workflows through improved validation and exception handling, reducing processing errors by approximately 20% within supported financial modules.",
      "Updated Kafka producers and consumers, validated message payloads, and analyzed failed events to resolve transaction-processing issues in asynchronous workflows.",
      "Applied secure coding practices to PCI DSS–aligned modules, keeping sensitive payment information out of application logs, exception messages, and API responses.",
      "Investigated cross-stack defects using application logs, API responses, and JUnit/Mockito regression tests, coordinating fixes with developers and QA engineers before release.",
      "Supported builds and deployments using Maven, Jenkins, Docker, and AWS, monitoring releases for configuration and runtime issues within Agile delivery cycles.",
    ],
  },
  {
    role: "Junior Software Developer",
    company: "Zensar Technologies",
    location: "Hyderabad, India",
    duration: "Jun 2021 – May 2022",
    tech: ["Angular", "React.js", "Java", "REST APIs", "Git", "Jira"],
    points: [
      "Contributed to frontend development for a financial-services application using Angular and React.js, building reusable UI components, forms, and client-side validation.",
      "Integrated frontend modules with existing REST APIs, handling asynchronous requests, loading states, validation failures, and user-facing error messages.",
      "Reproduced reported issues by reviewing application logs and network responses, identified root causes, and implemented fixes with senior developer support.",
      "Created and maintained unit tests, addressed defects found in regression testing, and took part in peer code reviews to improve reliability.",
      "Managed stories and defects in Git and Jira while participating in sprint planning, daily stand-ups, and other Agile ceremonies.",
    ],
  },
];

export const projects = [
  {
    title: "rejekt.ai — Generative AI Interview Preparation Platform",
    tech: ["Python", "FastAPI", "LangChain", "LangGraph", "OpenAI", "Google Gemini", "MCP", "SentenceTransformers", "ChromaDB", "Whisper", "TTS", "PostgreSQL", "Redis", "AWS ECS Fargate", "Docker", "GitHub Actions", "pytest"],
    description:
      "A live Generative AI platform with 6 interview modes that generates personalized technical, behavioral, and company-specific mock interviews. A LangGraph adaptive engine keeps multi-turn context, asks targeted follow-ups, and scores answers on 5 dimensions: technical accuracy, STAR structure, communication, filler words, and missing concepts.",
    highlights: [
      "End-to-end RAG with SentenceTransformers embeddings and ChromaDB, grounding questions and feedback in the candidate's resume and the job description.",
      "Real-time voice interviews with Whisper speech-to-text and text-to-speech; OpenAI and Gemini integrated through LLM workflows and Model Context Protocol (MCP) tools.",
      "FastAPI services for auth, orchestration, AI evaluation, reporting, billing and credits on PostgreSQL + Redis, shipped on AWS ECS Fargate, RDS, S3, ALB and CloudWatch with Docker, GitHub Actions and pytest.",
      "Ingestion pipelines across 19 job sources: 2.02M+ listings processed, ~115,600 qualified records kept after validation, normalization, classification and deduplication.",
    ],
    date: "Jan 2026 – Present",
    githubLink: "https://github.com/santosh1664/rejekt-ai",
    liveLink: "https://www.rejekt.ai",
    category: "Generative AI · Featured",
    iconName: "FaRobot",
  },
  {
    title: "Beyond Sight — Audible Graphs for the Visually Impaired (ACM W4A '24)",
    tech: ["Python", "PyTorch", "TensorFlow", "ResNet", "Tesseract OCR", "spaCy", "Pandas", "NumPy", "TTS"],
    description:
      "Co-developed a machine learning accessibility system that turns bar, line, and pie charts (Excel data and chart images) into audio narratives and structured text. Co-authored the paper published in the proceedings of the 21st International Web for All Conference (ACM W4A '24), which won the Accessibility Challenge Judges' Award.",
    highlights: [
      "Fine-tuned and benchmarked an ImageNet-pretrained ResNet in PyTorch and TensorFlow: 92% accuracy in chart classification and data extraction.",
      "3-stage text pipeline (text-region detection, OCR, text-role classification) with Pandas, NumPy, spaCy and Tesseract, extracting titles, axes, legends and values at 85% precision.",
      "Outputs in 3 accessible formats (raw data tables, multi-level summaries, spoken descriptions) with screen-reader-compatible text-to-speech.",
    ],
    date: "Sep 2023 – Apr 2024",
    award: "https://wajdialjedaani.com/certificates/AccessbilityChallenge.pdf",
    liveLink2: "https://wajdialjedaani.com/tools/tool.html?id=tool1",
    category: "AI / Accessibility Research",
    iconName: "FaUniversalAccess",
  },
  {
    title: "Agentic AI Resume Chatbot with RAG",
    tech: ["React", "FastAPI", "RAG Pipeline", "Embeddings", "Intent Routing", "Prompt Templates"],
    description:
      "The chatbot on this site: an interactive resume assistant that uses intent routing, embeddings, and retrieval-augmented generation over structured resume data to answer recruiter questions instantly, with a guided category menu and quick-question chips for fast screening.",
    date: "Jan 2025 – Present",
    githubLink: "https://github.com/santosh1664/MyPortfolio",
    liveLink: null,
    category: "AI / Ongoing",
    iconName: "FaComments",
  },
  {
    title: "Accessible Weather & Shelter Finder",
    tech: ["React", "Node.js", "MongoDB", "Text-to-Speech", "Geolocation", "Accessibility"],
    description: "An accessible web app for blind and visually impaired users with real-time weather, severe-weather alerts, and the nearest shelter locations, built with keyboard navigation, shortcut keys, a high-contrast UI, and integrated text-to-speech.",
    date: "Oct 2024 – Present",
    githubLink: null,
    liveLink: null,
    category: "Accessibility / Current",
    iconName: "FaUniversalAccess",
  },
  {
    title: "Dynamic Pricing Prediction for Cabs",
    tech: ["Python", "Reinforcement Learning", "Supervised Learning"],
    description: "Developed ML models to predict dynamic cab pricing using supervised and reinforcement learning approaches. Processed trip datasets and trained models to estimate fares based on origin, destination and cab type.",
    date: "Feb 2021 – Jun 2022",
    githubLink: "https://github.com/santosh1664/Dynamic-Cab-Price-Prediction" ,
    award: "https://drive.google.com/uc?export=view&id=1OHsSVE4FcozQ3jrBE26h2ubjFdbYlMIs",
    category: "Machine Learning / Academic",
    iconName: "FaDatabase",
  },
  {
  title: "AI-Based Talking Camera App",
  tech: ["Flutter", "Dart", "TensorFlow Lite", "Computer Vision", "Text-to-Speech (TTS)", "Object Detection"],
  description: "An AI-powered talking camera mobile application that helps blind and visually impaired users perceive their surroundings independently. The app captures real-time images, identifies objects using on-device ML models, and narrates the scene through natural text-to-speech, enabling hands-free, accessible environment understanding.",
  date: "Jan 2024 – Apr 2024",
  githubLink: null,
  liveLink: null,
  category: "Accessibility / Mobile AI",
  iconName: "FaCamera",
},

  {
    title: "Driver Drowsiness Detection Using CNN & HAAR",
    tech: ["Python", "TensorFlow", "OpenCV", "HAAR Cascades", "CNN"],
    description: "Developed convolutional neural networks to classify eye states (open/closed) using grayscale images from public datasets. Evaluated different CNN depths; results showed deep CNNs effectively learn facial features for eye detection. Hybrid feature sets did not improve accuracy, indicating CNNs can learn key features from raw pixels.",
    date: "Feb 2021 – June 2021",
    githubLink: "https://github.com/santosh1664/Drowsiness-Dection",
    liveLink: null,
    category: "Computer Vision / Academic",
    iconName: "FaCode",
  },
  {
  title: "2D Chess Game Using Python",
  tech: ["Python", "Pygame", "Object-Oriented Programming"],
  description: "Built a fully interactive 2D chess game with move validation, piece-specific logic, turn-based gameplay, and real-time board rendering. Implemented core chess rules including legal moves, captures, check, and checkmate detection using modular OOP design.",
  date: "May 2023 – July 2023",
  githubLink: "https://github.com/santosh1664/Chess_Game/tree/main/Chess",
  liveLink: null,
  category: "Game Development / Personal",
  iconName: "FaChess",
},

  {
    title: "Basic Shell Interpreter",
    tech: ["C", "Unix System Calls", "fork", "pipes"],
    description: "Implemented a basic shell interpreter in C that parses and executes commands entered by the user. Used Unix system calls, implemented process management with fork(), and connected commands using pipes.",
    date: "Feb 2021 – June 2021",
    githubLink: null,
    liveLink: null,
    category: "Systems / Academic",
    iconName: "FaCode",
  },
  {
    title: "House Price Prediction",
    tech: ["Python", "Pandas", "scikit-learn", "Regression"],
    description: "Built a regression-based ML pipeline to forecast housing prices. Collected and preprocessed a dataset (~10k entries) from Kaggle, performed feature engineering and model evaluation to support purchase decision-making.",
    date: "Feb 2021 – June 2021",
    githubLink: null,
    liveLink: null,
    category: "Machine Learning / Academic",
    iconName: "FaDatabase",
  },
  // {
  //   title: "Pac-Man Game (Java)",
  //   tech: ["Java", "Swing", "OOP"],
  //   description: "Implemented a playable Pac-Man clone using Java Swing. Applied inheritance and exception handling; added game effects and a responsive GUI.",
  //   date: "Feb 2021 – June 2021",
  //   githubLink: null,
  //   liveLink: null,
  //   category: "Game Development / Academic",
  //   iconName: "FaCode",
  // },
  // {
  //   title: "Online Mobile Store",
  //   tech: ["HTML", "CSS", "Bootstrap", "PHP"],
  //   description: "Developed an online mobile store connecting customers with product listings. Implemented frontend with HTML/CSS and Bootstrap, backend with PHP for product and order management.",
  //   date: "Feb 2021 – June 2021",
  //   githubLink: null,
  //   liveLink: null,
  //   category: "Web Development / Academic",
  //   iconName: "FaCode",
  // },




];

export const skills = {
  languages: [
    { name: "Java 17" }, { name: "Python" }, { name: "TypeScript" }, { name: "JavaScript" }, { name: "SQL" },
    { name: "Go" }, { name: "C++" }, { name: "C# / .NET" }, { name: "HTML5 / CSS3" },
  ],
  aiAndDataEngineering: [
    { name: "Generative AI" }, { name: "LLMs" }, { name: "AI Agents" }, { name: "RAG" }, { name: "LangChain" }, { name: "LangGraph" },
    { name: "Google ADK" }, { name: "Model Context Protocol (MCP)" }, { name: "OpenAI API" }, { name: "Google Gemini" },
    { name: "Prompt & Context Engineering" }, { name: "LLM Evaluation" }, { name: "Vector Embeddings" }, { name: "SentenceTransformers" },
    { name: "Model Fine-tuning" }, { name: "PyTorch" }, { name: "TensorFlow" }, { name: "spaCy" }, { name: "Tesseract OCR" },
    { name: "Whisper" }, { name: "Pandas" }, { name: "NumPy" }, { name: "Apache Spark / PySpark" }, { name: "ETL / Data Pipelines" },
  ],
  frameworksAndLibraries: [
    { name: "Spring Boot" }, { name: "Spring Security" }, { name: "Spring MVC" }, { name: "Spring Data JPA / Hibernate" }, { name: "FastAPI" },
    { name: "Node.js / Express" }, { name: "React.js" }, { name: "Next.js" }, { name: "Angular" }, { name: "Redux" }, { name: "GraphQL" }, { name: "Kafka" }, { name: "RabbitMQ" },
    { name: "Microservices" }, { name: "RESTful APIs" }, { name: "JWT" },
  ],
  databases: [
    { name: "PostgreSQL" }, { name: "MySQL" }, { name: "DynamoDB" }, { name: "Redis" }, { name: "ChromaDB" }, { name: "MongoDB" },
  ],
  toolsAndPlatforms: [
    { name: "AWS (ECS Fargate, EC2, S3, RDS, SQS, CloudWatch)" }, { name: "Azure" }, { name: "GCP" }, { name: "Docker" }, { name: "Kubernetes" }, { name: "Jenkins" },
    { name: "GitLab CI" }, { name: "GitHub Actions" }, { name: "Maven" }, { name: "Terraform" }, { name: "JUnit" }, { name: "Mockito" },
    { name: "pytest" }, { name: "Postman" }, { name: "Git" }, { name: "Jira" }, { name: "Linux" },
  ],
  coreCompetencies: [
    { name: "System Design" }, { name: "API Contract Design" }, { name: "Data Structures & Algorithms" }, { name: "Root-cause Analysis" },
    { name: "Technical Documentation" }, { name: "Agile / Scrum" }, { name: "Cross-functional Collaboration" },
  ],
};

export const leadershipAndInvolvement = [
    {
    role: "Accessibility Challenge – Judges' Award Winner",
    organization: "Project: Beyond Sight – Audible Graphs for the Visually Impaired | Event: ACM W4A Accessibility Hackathon / Challenge",
    duration: "",
    points: [
      "Awarded the Judges' Award for developing an AI-powered system that converts charts and visual graphs into meaningful audio explanations for blind and visually impaired users.",
      "Built a pipeline combining OCR, NLP, and deep learning to interpret chart elements and generate speech-based insights.",
      "Recognized for innovation, accessibility impact, and contributions to inclusive technology.",
    ],
  },
  {
    role: "Vice Captain – University Handball Team",
    organization: "University of North Texas",
    duration: "",
    points: [
      "Led the university handball team in intercollegiate tournaments as Vice Captain.",
      "Organized practice sessions, guided team strategy, and motivated teammates during competitive events.",
      "Improved team coordination, discipline, and overall performance through consistent leadership.",
      "Demonstrated leadership, teamwork, and perseverance through sport.",
    ],
  },

];

export const socialLinks = {
  linkedin: { url: personalInfo.linkedin, iconName: "FaLinkedin" },
  github: { url: personalInfo.github, iconName: "FaGithub" },
  email: { url: `mailto:${personalInfo.email}`, iconName: "FaEnvelope" },
};
