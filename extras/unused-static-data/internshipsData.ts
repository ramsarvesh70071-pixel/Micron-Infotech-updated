export interface InternshipProgram {
  slug: string;
  degree: string;
  title: string;
  subtitle: string;
  tagline: string;
  heroDescription: string;
  targetAudience: string;
  duration: string;
  mode: string;
  stipendNote: string;
  coreHighlights: string[];
  curriculumTracks: {
    track: string;
    skills: string[];
    projects: string;
  }[];
  prerequisites: string;
  careerOutcomes: string[];
}

export const INTERNSHIPS_DATA: InternshipProgram[] = [
  {
    slug: "internship-for-bcom-students-bangalore",
    degree: "B.Com",
    title: "Internship for B.Com Students in Bangalore",
    subtitle: "Hands-on internships for B.Com students in Bangalore",
    tagline: "INTERNSHIP PROGRAM",
    heroDescription: "Kickstart your career with a practical, project-based internship designed for B.Com students. Learn in-demand skills, work on real corporate finance, analytics, and marketing assignments, and get certified with dedicated placement support.",
    targetAudience: "Final year B.Com students, fresh B.Com graduates, and commerce enthusiasts looking for high-paying corporate careers.",
    duration: "2 to 3 Months (Flexible Timing)",
    mode: "Classroom in Bangalore & Online Batches",
    stipendNote: "Project-based performance stipends & full-time job offers upon successful completion.",
    coreHighlights: [
      "Real-time, project-based learning",
      "Mentorship from industry experts",
      "Internship completion certificate",
      "Resume building & mock interviews",
      "100% placement assistance",
      "Flexible online & classroom batches"
    ],
    curriculumTracks: [
      {
        track: "Financial Analytics & Advanced Excel / Power BI",
        skills: ["Financial Modeling", "Pivot & VLOOKUP/XLOOKUP", "Power BI Dashboards", "Balance Sheet Variance Analysis"],
        projects: "Live financial statement modeling and quarterly revenue forecast dashboards for retail brands."
      },
      {
        track: "SAP FICO & Corporate Accounting",
        skills: ["General Ledger (GL)", "Accounts Payable & Receivable (AP/AR)", "Asset Accounting", "Tax Invoicing & GST Filing"],
        projects: "End-to-end invoice auditing and corporate month-end closing simulation in SAP S/4HANA."
      },
      {
        track: "Digital Marketing & Commerce Growth",
        skills: ["Google Search Ads", "Social Media ROI", "E-commerce Funnel Analytics", "Email Automation"],
        projects: "Running live paid ads and lead-generation campaigns for D2C consumer brands."
      }
    ],
    prerequisites: "Basic understanding of commerce, accounting principles, and eagerness to acquire modern software skills.",
    careerOutcomes: ["Financial Analyst", "SAP FICO Associate", "Business Analyst Trainee", "Digital Growth Specialist", "Accounts Executive"]
  },
  {
    slug: "internship-for-bsc-students-bangalore",
    degree: "B.Sc",
    title: "Internship for B.Sc Students in Bangalore",
    subtitle: "Practical, career-building internships for B.Sc graduates & undergraduates",
    tagline: "INTERNSHIP PROGRAM",
    heroDescription: "Transition from pure science theory to high-growth tech industry domains. Gain hands-on exposure to Python programming, data science, software testing, and analytics with industry mentorship.",
    targetAudience: "B.Sc (Comp Science, IT, Mathematics, Physics, Statistics, Electronics) students and recent graduates.",
    duration: "2 to 3 Months",
    mode: "Classroom & Live Instructor-Led Online",
    stipendNote: "Merit-based stipends & direct interview pipelines with 2000+ hiring partners.",
    coreHighlights: [
      "Real-time, project-based learning",
      "Mentorship from industry experts",
      "Internship completion certificate",
      "Resume building & mock interviews",
      "100% placement assistance",
      "Flexible online & classroom batches"
    ],
    curriculumTracks: [
      {
        track: "Python Programming & Data Analysis",
        skills: ["Python Fundamentals", "NumPy & Pandas", "Data Visualization", "SQL Database Queries"],
        projects: "Exploratory data analysis of 1M+ customer transaction records with visual dashboards."
      },
      {
        track: "Software Testing & QA Automation",
        skills: ["Manual Testing Methodologies", "Selenium WebDriver", "Test Case Design", "Bug Tracking with Jira"],
        projects: "Automating test regression suites for an enterprise banking portal."
      },
      {
        track: "Web Development Fundamentals",
        skills: ["HTML5 / CSS3", "JavaScript ES6+", "React Basics", "Git Version Control"],
        projects: "Building responsive single-page web applications with live API integration."
      }
    ],
    prerequisites: "Basic computer familiarity and problem-solving mindset. No prior coding experience required.",
    careerOutcomes: ["Junior Python Developer", "QA Automation Engineer", "Junior Data Analyst", "Web Developer Trainee"]
  },
  {
    slug: "internship-for-civil-engineering-students-bangalore",
    degree: "Civil Engineering",
    title: "Civil Engineering Internship in Bangalore",
    subtitle: "Industry-standard CAD, BIM, and structural drafting internships",
    tagline: "INTERNSHIP PROGRAM",
    heroDescription: "Bridging the gap between civil engineering academics and real construction infrastructure projects. Master AutoCAD, Revit Architecture, and structural detailing under practicing site engineers and BIM consultants.",
    targetAudience: "B.E / B.Tech / Diploma in Civil Engineering students and fresh passouts.",
    duration: "2 Months Intensive",
    mode: "Classroom in Bangalore (Workstation Labs) & Hybrid",
    stipendNote: "Certification accredited by engineering partners + placement assistance across EPC contractors.",
    coreHighlights: [
      "Real-time, project-based learning",
      "Mentorship from industry experts",
      "Internship completion certificate",
      "Resume building & mock interviews",
      "100% placement assistance",
      "Flexible online & classroom batches"
    ],
    curriculumTracks: [
      {
        track: "AutoCAD 2D & 3D Civil Drafting",
        skills: ["Building Plans & Elevations", "Sectional Details & Detailing", "Site Layouts & Contour Modeling", "Municipal Submission Drawings"],
        projects: "G+4 Residential and commercial complex floor drafting and electrical/plumbing layout schematics."
      },
      {
        track: "BIM & Revit Architecture",
        skills: ["3D Parametric Modeling", "Clash Detection & Scheduling", "Quantity Takeoff & Estimation", "Rendering & Walkthroughs"],
        projects: "Full BIM model of an institutional building with material scheduling and 3D walkthroughs."
      }
    ],
    prerequisites: "Pursuing or completed Civil Engineering diploma or degree.",
    careerOutcomes: ["Civil CAD Drafter", "BIM Modeler", "Structural Detailing Trainee", "Site Planning Engineer"]
  },
  {
    slug: "internship-for-mba-students-bangalore",
    degree: "MBA",
    title: "Internship for MBA Students in Bangalore",
    subtitle: "High-impact internships in Marketing, HR, Finance & Business Analytics",
    tagline: "INTERNSHIP PROGRAM",
    heroDescription: "Accelerate your MBA credentials with real-world corporate project delivery. Gain hands-on exposure to digital growth funnels, HR analytics, financial forecasting, and CRM software.",
    targetAudience: "MBA / PGDM students specializing in Marketing, HR, Finance, Operations, or Business Analytics.",
    duration: "6 to 12 Weeks (Summer / Winter)",
    mode: "Bangalore Classroom & Flexible Online",
    stipendNote: "Formal summer internship project (SIP) documentation, mentor evaluations & placement drives.",
    coreHighlights: [
      "Real-time, project-based learning",
      "Mentorship from industry experts",
      "Internship completion certificate",
      "Resume building & mock interviews",
      "100% placement assistance",
      "Flexible online & classroom batches"
    ],
    curriculumTracks: [
      {
        track: "Growth Marketing & Brand Strategy",
        skills: ["Performance Marketing (Meta & Google)", "Conversion Rate Optimization (CRO)", "Customer Lifetime Value (LTV)", "Email Automation Funnels"],
        projects: "Formulating multi-channel go-to-market marketing campaign and attribution models."
      },
      {
        track: "HR Analytics & Talent Management",
        skills: ["Attrition Forecasting", "Payroll & Statutory Compliance", "Compensation Benchmarking", "Talent Sourcing via LinkedIn Recruiter"],
        projects: "Designing automated HR KPI dashboard tracking recruitment funnels and retention rates."
      },
      {
        track: "Business Analytics & Power BI",
        skills: ["Executive Reporting", "SQL Data Extraction", "Predictive Trend Analysis", "Dashboard Storytelling"],
        projects: "Enterprise sales velocity and territory performance dashboard for retail leadership."
      }
    ],
    prerequisites: "Enrolled in or graduated from MBA/PGDM program.",
    careerOutcomes: ["Management Trainee", "Business Development Associate", "HR Business Partner Trainee", "Marketing Strategist"]
  },
  {
    slug: "internship-for-mca-students-bangalore",
    degree: "MCA",
    title: "Internship for MCA Students in Bangalore",
    subtitle: "Software engineering internships with fullstack and cloud project portfolios",
    tagline: "INTERNSHIP PROGRAM",
    heroDescription: "Kickstart your software engineering career with production-grade fullstack and cloud development internships. Build and deploy real web applications, APIs, and cloud microservices alongside senior developers.",
    targetAudience: "MCA final year students, MCA freshers, and computer application postgraduates.",
    duration: "3 to 6 Months (Academic Project Approval Included)",
    mode: "Classroom Labs & Live Online",
    stipendNote: "Includes complete project source code, synopsis, guide endorsement & interview referrals.",
    coreHighlights: [
      "Real-time, project-based learning",
      "Mentorship from industry experts",
      "Internship completion certificate",
      "Resume building & mock interviews",
      "100% placement assistance",
      "Flexible online & classroom batches"
    ],
    curriculumTracks: [
      {
        track: "Full Stack Web Development (React & Node.js)",
        skills: ["React.js & Next.js", "Node.js & Express REST APIs", "MongoDB / PostgreSQL", "JWT Auth & Cloud Hosting"],
        projects: "Full-featured SaaS platform with subscription billing, admin dashboards, and OAuth."
      },
      {
        track: "Cloud & DevOps Engineering",
        skills: ["AWS Core Services", "Docker Containerization", "Kubernetes Orchestration", "CI/CD Pipelines"],
        projects: "Automated continuous delivery pipeline deploying containerized microservices to AWS EKS."
      },
      {
        track: "AI & Machine Learning Engineering",
        skills: ["Python Data Science", "Scikit-Learn & PyTorch", "FastAPI Model Serving", "LLM Fine-tuning & LangChain"],
        projects: "Intelligent document retrieval and automated customer query resolution AI agent."
      }
    ],
    prerequisites: "Computer science or programming basics in C++, Java, or Python.",
    careerOutcomes: ["Full Stack Developer", "Cloud Support Engineer", "Backend Software Engineer", "DevOps Trainee"]
  },
  {
    slug: "internship-for-mechanical-engineering-students-bangalore",
    degree: "Mechanical Engineering",
    title: "Mechanical Engineering Internship in Bangalore",
    subtitle: "Hands-on CAD/CAM, CATIA, SolidWorks & Automotive Design internships",
    tagline: "INTERNSHIP PROGRAM",
    heroDescription: "Gain practical design engineering experience. Work on 3D parametric part modeling, assembly kinematics, sheet metal, and automotive wiring harness design with industry design engineers.",
    targetAudience: "B.E / B.Tech / Diploma in Mechanical, Automobile, or Production Engineering.",
    duration: "2 Months",
    mode: "Classroom CAD Labs & Hybrid",
    stipendNote: "Industry-standard project portfolio suitable for OEM and Tier-1 automotive interviews.",
    coreHighlights: [
      "Real-time, project-based learning",
      "Mentorship from industry experts",
      "Internship completion certificate",
      "Resume building & mock interviews",
      "100% placement assistance",
      "Flexible online & classroom batches"
    ],
    curriculumTracks: [
      {
        track: "CATIA V5 Automotive BIW Design",
        skills: ["Part Design Workbench", "Generative Shape Design (Surfacing)", "Assembly Design", "Drafting & GD&T Standards"],
        projects: "Automotive door panel inner sheet metal modeling and locator pin placement."
      },
      {
        track: "SolidWorks & Product Design",
        skills: ["Parametric 3D Solid Modeling", "Weldments & Sheet Metal", "Motion Analysis & Simulation", "Manufacturing Blueprints"],
        projects: "Gearbox casing assembly design with stress analysis and exploded view documentation."
      },
      {
        track: "Automotive Electrical Wiring Harness",
        skills: ["Schematic Interpretation", "Bundle Routing in 3D Space", "Connector Selection", "Clip and Bracket Mounting"],
        projects: "EV chassis harness routing design adhering to safety clearance standards."
      }
    ],
    prerequisites: "Mechanical, production, or automotive engineering background.",
    careerOutcomes: ["Design Engineer Trainee", "CAD Modeler", "BIW Design Engineer", "Harness Routing Specialist"]
  },
  {
    slug: "internship-for-msc-students-bangalore",
    degree: "M.Sc",
    title: "Internship for M.Sc Students in Bangalore",
    subtitle: "Hands-on internships for M.Sc students in Bangalore",
    tagline: "INTERNSHIP PROGRAM",
    heroDescription: "Kickstart your career with a practical, project-based internship designed for M.Sc students. Work on cutting-edge data science, artificial intelligence, bioinformatics, and computing algorithms with elite mentors.",
    targetAudience: "M.Sc students and graduates in Computer Science, IT, Data Analytics, Mathematics, Statistics, or Physics.",
    duration: "2 to 4 Months",
    mode: "Classroom in Bangalore & Virtual Lab Online",
    stipendNote: "Capstone research project documentation, academic credit support & high-tier placement drives.",
    coreHighlights: [
      "Real-time, project-based learning",
      "Mentorship from industry experts",
      "Internship completion certificate",
      "Resume building & mock interviews",
      "100% placement assistance",
      "Flexible online & classroom batches"
    ],
    curriculumTracks: [
      {
        track: "Advanced Data Science & Machine Learning",
        skills: ["Advanced Statistical Inference", "Gradient Boosting (XGBoost/LightGBM)", "Deep Learning Architectures", "Feature Engineering"],
        projects: "Predictive customer churn algorithm with hyperparameter tuning and model explainability using SHAP."
      },
      {
        track: "Generative AI & LLM Systems",
        skills: ["Retrieval-Augmented Generation (RAG)", "Vector Databases (Pinecone/Milvus)", "LangChain & LlamaIndex", "Hugging Face Transformers"],
        projects: "Building an enterprise legal document query assistant powered by local open-source LLMs."
      },
      {
        track: "Big Data & Cloud Analytics",
        skills: ["Apache Spark & PySpark", "Databricks Lakehouse", "AWS S3 & Athena", "Distributed Processing"],
        projects: "Real-time log stream processing pipeline handling 10,000 events/second."
      }
    ],
    prerequisites: "M.Sc degree candidate or graduate with analytical or programming interest.",
    careerOutcomes: ["Data Scientist", "Machine Learning Engineer", "Statistical Analyst", "AI Research Associate"]
  }
];

