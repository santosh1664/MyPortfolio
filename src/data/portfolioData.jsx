// Icon imports removed from data file
// Icons are now rendered directly in components to avoid JSX in data

export const personalInfo = {
  name: "Durgasantosh",
  title: "Software Engineer",
  email: "gaddamsantosh03@gmail.com",
  linkedin: "https://www.linkedin.com/in/durgasantosh-g/",
  github: "https://github.com/santosh1664",
  resumeLink: "/Durgasantosh_G_Software_Engineer.pdf", // Make sure your resume is in public/
  bio: "Software Engineer with 3+ years of experience across full-stack development, building scalable applications using Java, Spring Boot, React, and AWS. Experienced in microservices, CI/CD pipelines, and delivering enterprise-grade systems in Agile environments.",
  shortBio: "I build things for the web." // For Hero section
};

export const education = [
  {
    institution: "University of North Texas(UNT), Denton, Texas",
    degree: "Master of Science in Computer Science",
    duration: "Aug 2023 – May 2025",
    score: "CGPA: 3.82/4",
  },
  {
    institution: " Vellore Institute of Technology(VIT), Chennai",
    degree: "Bachelor of Technology in Computer Science",
    duration: "Aug 2019 – May 2023",
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
];

export const experience = [
  {
    role: "Software Engineer",
    company: "Citi Group",
    location: "Dallas, Texas, USA",
    duration: "May 2025 – Present",
    tech: [
      "React.js",
      "Java 17",
      "Spring Boot",
      "Spring Cloud",
      "Apache Kafka",
      "AWS",
      "Docker",
      "Kubernetes",
      "Jenkins"
    ],
    points: [
      "Build and maintain full-stack features for enterprise platforms.",
      "Deliver scalable services and resilient integrations across teams.",
      "Support testing, deployment, and production reliability workflows."
    ],
  },
  {
    role: "Software Developer",
    company: "Zensar Technologies",
    location: "India",
    duration: "Jun 2021 – Jul 2023",
    tech: [
      "React",
      "Angular",
      "Java",
      "Spring Boot",
      "Microservices",
      "Apache Kafka",
      "AWS"
    ],
    points: [
      "Contributed to end-to-end full-stack development initiatives.",
      "Built frontend experiences and backend services with Java and Spring Boot.",
      "Supported microservices and event-driven workflows with Kafka."
    ],
  },
];

export const projects = [
  {
    title: "Agentic AI Resume Chatbot with RAG (In Progress)",
    tech: [
      "React",
      "Rule-Based NLP",
      "RAG Pipeline",
      "Embeddings",
      "Intent Routing",
      "Prompt Templates"
    ],
    description:
      "Building an interactive resume chatbot that uses AI-style patterns like intent routing, embeddings, and retrieval-augmented generation (RAG) over structured resume data to answer recruiter questions instantly. Features a guided category menu, quick question chips, and a recruiter-focused UX with eye-catching micro-interactions for fast screening.",
    date: "Jan 2025 – Present",
    githubLink: null,
    liveLink: null,
    category: "Ongoing Project",
    iconName: "FaComments",
  },
  {title: "Accessible Weather & Shelter Finder",
    tech: ["React", "Node.js", "MongoDB", "Text-to-Speech", "Geolocation", "Accessibility"],
    description:"Currently building an accessible, life-saving web application for blind and visually impaired users. Provides real-time weather updates, severe weather alerts, and nearest shelter locations with full accessibility support including keyboard navigation, high-contrast UI, shortcut keys, and integrated text-to-speech.",
    date: "Oct 2024 – Present",
    githubLink: null,
    liveLink: null,
    category: "Accessibility / Current Project",
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
    { name: "Go", iconName: "SiGo" },
    { name: "HTML5", iconName: "FaHtml5" },
    { name: "CSS3", iconName: "FaCss3Alt" },
    { name: "MySQL", iconName: "SiMysql" },
    { name: "PostgreSQL", iconName: "SiPostgresql" },
    { name: "MongoDB", iconName: "SiMongodb" },
    { name: "DynamoDB", iconName: "SiAmazondynamodb" }
  ],

  frameworksAndLibraries: [
    { name: "Spring Boot", iconName: "SiSpringboot" },
    { name: "React.js", iconName: "FaReact" },
    { name: "Next.js", iconName: "SiNextdotjs" },
    { name: "Node.js", iconName: "FaNodeJs" },
    { name: "Express.js", iconName: "SiExpress" },
    { name: "Flask", iconName: "SiFlask" },
    { name: "Django", iconName: "SiDjango" },
    { name: "REST APIs", iconName: "FaCloud" },
    { name: "Microservices", iconName: "FaProjectDiagram" },
  ],

  aiAndDataEngineering: [
    { name: "TensorFlow", iconName: "SiTensorflow" },
    { name: "PyTorch", iconName: "SiPytorch" },
    { name: "Scikit-Learn", iconName: "SiScikitlearn" },
    { name: "Pandas", iconName: "SiPandas" },
    { name: "NumPy", iconName: "SiNumpy" },
    { name: "OCR", iconName: "FaEye" },
    { name: "NLP", iconName: "FaLanguage" },
    { name: "Kafka", iconName: "SiApachekafka" },
    { name: "Spark", iconName: "SiApachespark" },
    { name: "ETL Pipelines", iconName: "FaCogs" },
    { name: "Data Streaming", iconName: "FaStream" }
  ],

  toolsAndPlatforms: [
    { name: "AWS", iconName: "FaAws" },
    { name: "GCP", iconName: "SiGooglecloud" },
    { name: "Azure", iconName: "FaWindows" },
    { name: "Kubernetes", iconName: "SiKubernetes" },
    { name: "Docker", iconName: "FaDocker" },
    { name: "Git", iconName: "FaGitAlt" },
    { name: "GitHub Actions", iconName: "SiGithubactions" },
    { name: "Jenkins", iconName: "SiJenkins" },
    { name: "Terraform", iconName: "SiTerraform" },
    { name: "Linux", iconName: "FaLinux" },
    { name: "Bash", iconName: "SiGnubash" },
    { name: "Jira", iconName: "SiJira" },
    { name: "Postman", iconName: "SiPostman" },
    { name: "VS Code", iconName: "SiVscodium" },
    { name: "IntelliJ IDEA", iconName: "SiIntellijidea" }
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
