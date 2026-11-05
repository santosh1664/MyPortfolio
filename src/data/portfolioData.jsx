// Icon imports removed from data file
// Icons are now rendered directly in components to avoid JSX in data

export const personalInfo = {
  name: "Durgasantosh",
  title: "Software Engineer",
  email: "gaddamsantosh03@gmail.com",
  linkedin: "https://www.linkedin.com/in/durgasantosh-g/",
  github: "https://github.com/santosh1664",
  resumeLink: "/Durgasantosh_G_Software_Engineer.pdf", // Make sure your resume is in public/
  bio: "Software Engineer with 3+ years of experience building responsive and high-performance web applications using React.js and Spring Boot. Focused on reusable UI components, asynchronous data flows, secure RESTful APIs, microservices-based architectures, AWS-based CI/CD, and AI-powered conversational systems.",
  shortBio: "I build high-performance full-stack and AI-driven web systems." // For Hero section
};

export const education = [
  {
    institution: "University of North Texas(UNT), Denton, Texas",
    degree: "Master of Science in Computer Science",
    score: "CGPA: 3.82/4",
  },
  {
    institution: " Vellore Institute of Technology(VIT), Chennai",
    degree: "Bachelor of Technology in Computer Science",
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
    company: "Citi Group",
    location: "New Jersey, USA",
    duration: "May 2025 – Present",
    tech: [
      "React.js",
      "Java 17",
      "Spring Boot",
      "Spring Security",
      "Apache Kafka",
      "AWS",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "JWT",
      "DynamoDB",
      "GitLab CI"
    ],
    points: [
      "Developed and enhanced user-facing web applications using React.js, building reusable and responsive UI components for enterprise financial platforms.",
      "Improved frontend performance by about 25% through optimized API consumption, memoization, efficient state management, and fewer unnecessary re-renders.",
      "Implemented client-side validation, dynamic form handling, and conditional rendering logic to improve usability and reduce backend validation errors.",
      "Integrated React components with Java 17 and Spring Boot microservices to keep frontend-backend communication consistent and reliable.",
      "Developed and maintained RESTful APIs with validation, exception handling, and secure access control using Spring Security and JWT-based authentication.",
      "Worked with Kafka and DynamoDB to support reliable backend processing and low-latency UI-driven workflows.",
      "Participated in API contract discussions and maintained backward compatibility to reduce frontend regressions during releases.",
      "Diagnosed and resolved production issues across frontend and backend layers, improving stability and reducing recurring defects.",
      "Contributed to CI/CD pipelines and containerized deployments using Docker, Kubernetes, Jenkins, and GitLab CI."
    ],
  },
  {
    role: "Software Developer",
    company: "Zensar Technologies",
    location: "India",
    duration: "Jun 2021 – Jul 2023",
    tech: [
      "React",
      "Angular 15",
      "Java",
      "Spring Boot",
      "Microservices",
      "Apache Kafka",
      "AWS",
      "Docker",
      "Jenkins"
    ],
    points: [
      "Worked on end-to-end feature development across Angular 15, React.js, and Spring Boot within a microservices-based financial application.",
      "Built reusable UI components, client-side form validations, and dynamic data handling, improving development speed by about 30%.",
      "Integrated frontend modules with REST APIs and handled async loading and error states to keep user interactions smooth.",
      "Developed RESTful APIs using Java and Spring Boot with input validation, exception handling, and secure service integration.",
      "Assisted with Kafka-based workflows for asynchronous transaction-related backend processing.",
      "Contributed to PCI DSS-compliant financial modules, reducing transaction processing errors by around 20% through stronger validation and error handling.",
      "Participated in AWS deployments and CI/CD automation using Jenkins and Docker in Agile release cycles."
    ],
  },
];

export const projects = [
  {
    title: "Agentic AI Resume Chatbot with RAG",
    tech: [
      "React",
      "FastAPI",
      "ChromaDB",
      "SentenceTransformers",
      "RAG Pipeline",
      "GPT-4o-mini",
      "Session Memory"
    ],
    description:
      "Built a production-ready agentic AI chatbot for my portfolio using Retrieval-Augmented Generation (RAG) with a React frontend and FastAPI backend. It uses ChromaDB vector search, SentenceTransformers embeddings, session-based memory, and grounded responses with deterministic fallback behavior.",
    date: "Jan 2025 – May 2025",
    githubLink: null,
    liveLink: "https://santoshroy.info",
    category: "Completed Project",
    iconName: "FaComments",
  },
  {title: "Accessible Weather & Shelter Finder",
    tech: ["React", "Node.js", "MongoDB", "Text-to-Speech", "Geolocation", "Accessibility"],
    description:"Built an accessible, life-saving web application for blind and visually impaired users. Provides real-time weather updates, severe weather alerts, and nearest shelter locations with full accessibility support including keyboard navigation, high-contrast UI, shortcut keys, and integrated text-to-speech.",
    date: "Oct 2024 – May 2025",
    githubLink: null,
    liveLink: "https://accessible-weather-shelter-1.onrender.com/",
    category: "Accessibility / Completed Project",
    iconName: "FaUniversalAccess",
  },
  { title: "Beyond Sight – Audible Graphs for the Visually Impaired",
    tech: ["Python", "TensorFlow", "PyTorch", "OCR", "NLP", "TTS"],
    description:"AI accessibility system converting graphs and images into speech for visually-impaired users using CNNs, OCR & TTS. Presented at ACM W4A 2024.",
    date: "Aug 2023 – Oct 2024",
    // githubLink: "https://github.com/santosh1664",
    award: "https://wajdialjedaani.com/certificates/AccessbilityChallenge.pdf",
    liveLink2: "https://wajdialjedaani.com/tools/tool.html?id=tool1",
    category: "AI / Accessibility",
    iconName: "FaUniversalAccess"
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
    { name: "Java", iconName: "FaJava" },
    { name: "Python", iconName: "FaPython" },
    { name: "JavaScript", iconName: "SiJavascript" },
    { name: "TypeScript", iconName: "SiTypescript" },
    { name: "C++", iconName: "SiCplusplus" },
    { name: "C#", iconName: "SiCsharp" },
    { name: "SQL", iconName: "FaDatabase" },
    { name: "HTML5", iconName: "FaHtml5" },
    { name: "CSS3", iconName: "FaCss3Alt" },
    { name: "XML", iconName: "FaCode" },
    { name: "JSON", iconName: "FaCode" }
  ],

  frameworksAndLibraries: [
    { name: "Spring Boot", iconName: "SiSpringboot" },
    { name: "React.js", iconName: "FaReact" },
    { name: "Angular", iconName: "FaAngular" },
    { name: "Bootstrap 5", iconName: "FaBootstrap" },
    { name: "React Hooks", iconName: "FaReact" },
    { name: "Redux", iconName: "FaProjectDiagram" },
    { name: "GraphQL", iconName: "FaProjectDiagram" },
    { name: "jQuery", iconName: "SiJquery" },
    { name: "AJAX", iconName: "FaExchangeAlt" },
    { name: "Spring MVC", iconName: "FaCloud" },
    { name: "Spring REST", iconName: "FaCloud" },
    { name: "Spring Security", iconName: "FaLock" },
    { name: "Spring Batch", iconName: "FaCogs" },
    { name: "Spring ORM", iconName: "FaDatabase" },
    { name: "REST APIs", iconName: "FaCloud" },
    { name: "Microservices", iconName: "FaProjectDiagram" },
  ],

  aiAndDataEngineering: [
    { name: "TensorFlow", iconName: "SiTensorflow" },
    { name: "PyTorch", iconName: "SiPytorch" },
    { name: "Scikit-Learn", iconName: "SiScikitlearn" },
    { name: "AI Agents", iconName: "FaRobot" },
    { name: "RAG", iconName: "FaBrain" },
    { name: "LLM Orchestration", iconName: "FaCogs" },
    { name: "SentenceTransformers", iconName: "FaProjectDiagram" },
    { name: "Pandas", iconName: "SiPandas" },
    { name: "NumPy", iconName: "SiNumpy" },
    { name: "OCR", iconName: "FaEye" },
    { name: "NLP", iconName: "FaLanguage" },
    { name: "Kafka", iconName: "SiApachekafka" },
    { name: "ETL Pipelines", iconName: "FaCogs" },
    { name: "Data Streaming", iconName: "FaStream" },
    { name: "Scikit-Learn", iconName: "SiScikitlearn" }
  ],

  toolsAndPlatforms: [
    { name: "AWS", iconName: "FaAws" },
    { name: "Kubernetes", iconName: "SiKubernetes" },
    { name: "Docker", iconName: "FaDocker" },
    { name: "Git", iconName: "FaGitAlt" },
    { name: "Jenkins", iconName: "SiJenkins" },
    { name: "Linux", iconName: "FaLinux" },
    { name: "Postman", iconName: "SiPostman" },
    { name: "VS Code", iconName: "SiVscodium" },
    { name: "IntelliJ IDEA", iconName: "SiIntellijidea" },
    { name: "Eclipse", iconName: "FaCode" },
    { name: "Maven", iconName: "FaCogs" },
    { name: "Oracle", iconName: "FaDatabase" },
    { name: "PostgreSQL", iconName: "SiPostgresql" },
    { name: "MySQL", iconName: "SiMysql" },
    { name: "SQL Server", iconName: "FaDatabase" },
    { name: "DB2", iconName: "FaDatabase" },
    { name: "MongoDB", iconName: "SiMongodb" },
    { name: "DynamoDB", iconName: "SiAmazondynamodb" },
    { name: "RabbitMQ", iconName: "FaExchangeAlt" },
    { name: "ChromaDB", iconName: "FaDatabase" }
  ],

  coreCompetencies: [
    { name: "Problem Solving", iconName: "FaLightbulb" },
    { name: "Data Structures & Algorithms", iconName: "FaProjectDiagram" },
    { name: "System Design", iconName: "FaSitemap" },
    { name: "API Design", iconName: "FaPlug" },
    { name: "Team Leadership", iconName: "FaUsers" },
    { name: "Agile Methodologies", iconName: "FaRunning" },
    { name: "Communication", iconName: "FaComments" },
    { name: "Presentations", iconName: "FaChalkboardTeacher" }
  ]
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
