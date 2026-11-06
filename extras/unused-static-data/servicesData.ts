export interface ServiceItem {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  tagline: string;
  heroDescription: string;
  highlights: string[];
  features: { title: string; desc: string }[];
  deliverables: string[];
  metrics: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
}

export const SERVICES_LIST: ServiceItem[] = [
  {
    slug: "digital-marketing-services-company-bangalore",
    category: "Digital Marketing Agency",
    title: "Digital Marketing Services Bangalore",
    subtitle: "A results-driven digital marketing company in Bangalore",
    tagline: "DIGITAL MARKETING AGENCY",
    heroDescription: "We help brands grow online with data-backed strategies across SEO, paid ads, social media, and content marketing — designed to generate qualified leads and measurable ROI.",
    highlights: [
      "Search Engine Optimization (SEO)",
      "Google Ads & performance marketing",
      "Social media marketing & management",
      "Content marketing & copywriting",
      "Conversion rate optimization",
      "Transparent reporting & analytics"
    ],
    features: [
      {
        title: "Holistic Omnichannel Marketing",
        desc: "Integrated growth funnels unifying organic search, high-intent Google PPC, social media awareness, and automated lead nurturing."
      },
      {
        title: "Data-Driven ROI Focus",
        desc: "Every marketing rupee spent is tracked with Google Analytics 4, Tag Manager, and custom attribution models for maximum return on spend."
      },
      {
        title: "Qualified Lead Generation",
        desc: "Laser-focused targeting ensuring high conversion rates and lower cost per customer acquisition across B2B and B2C verticals."
      }
    ],
    deliverables: [
      "Custom Digital Marketing Strategy & Roadmap",
      "Monthly KPI & Revenue Attribution Dashboards",
      "Dedicated Campaign Account Manager",
      "A/B Split-Testing for Ad Creatives & Copies",
      "Bi-Weekly Strategy Review Calls"
    ],
    metrics: [
      { value: "3.8x", label: "Average Lead Volume Increase" },
      { value: "48%", label: "Reduction in Cost Per Acquisition" },
      { value: "250+", label: "Active Brands Scaled" },
      { value: "98%", label: "Client Retention Rate" }
    ],
    faqs: [
      {
        q: "What makes MicronInfoTech different from other digital marketing agencies in Bangalore?",
        a: "Unlike typical marketing agencies that outsource or rely on vanity metrics like impressions, MicronInfoTech focuses purely on revenue, qualified pipeline, and transparent ROAS. Our team includes senior practitioners who also train corporate enterprises."
      },
      {
        q: "How soon can we expect results from digital marketing campaigns?",
        a: "Paid advertising (Google Ads & Meta) delivers qualified inbound leads within 24 to 48 hours of campaign launch. Organic SEO and content marketing compound steadily, with significant organic traffic increases typically achieved within 60 to 90 days."
      }
    ]
  },
  {
    slug: "google-ads-ppc-company-india",
    category: "Paid Advertising",
    title: "Google Ads & PPC Management India",
    subtitle: "Performance-focused Google Ads & PPC company in India",
    tagline: "PAID ADVERTISING",
    heroDescription: "Maximise your ad spend with expertly managed Google Ads campaigns. We optimise for lower cost-per-acquisition and higher return on ad spend across search, display, shopping, and video.",
    highlights: [
      "Google Search & Display campaigns",
      "Shopping & YouTube advertising",
      "Keyword & audience targeting",
      "Landing page & conversion optimization",
      "A/B testing & bid management",
      "Transparent ROAS & spend reporting"
    ],
    features: [
      {
        title: "High-Intent Keyword Capture",
        desc: "Target users at the exact moment they are looking to buy with exact and phrase match clustering and rigorous negative keyword pruning."
      },
      {
        title: "Smart Bidding & Automation",
        desc: "Leverage Google's target CPA and target ROAS smart bidding algorithms backed by first-party offline conversion data."
      },
      {
        title: "High-Converting Landing Pages",
        desc: "Continuous CRO audits, fast mobile load speeds, and friction-free lead capture forms that boost Google Quality Scores."
      }
    ],
    deliverables: [
      "Complete Google Ads Account Audit & Restructure",
      "Negative Keyword Mining & Budget Optimization",
      "Ad Copywriting with Responsive Search Ads",
      "Conversion Tracking Setup & Server-Side GTM",
      "Live Google Looker Studio Dashboard"
    ],
    metrics: [
      { value: "4.5x+", label: "Average Client ROAS" },
      { value: "-35%", label: "Cost Per Conversion Cut" },
      { value: "₹12 Cr+", label: "Annual Ad Spend Managed" },
      { value: "100%", label: "Certified Google Partner Team" }
    ],
    faqs: [
      {
        q: "How do you prevent wasted ad spend?",
        a: "We maintain exhaustive negative keyword lists, restrict geo-targeting strictly to qualified high-intent territories, and monitor search term queries daily to eliminate irrelevant clicks."
      },
      {
        q: "Do I have complete ownership of my Google Ads account?",
        a: "Yes, 100%. You retain full administrative ownership and billing control of your Google Ads account at all times. We operate with transparent partner access."
      }
    ]
  },
  {
    slug: "oracle/obi-consultants-services-bangalore-india",
    category: "Enterprise BI Solutions",
    title: "Oracle OBI Consultants & BI Services",
    subtitle: "Enterprise Oracle Business Intelligence and Data Warehousing in Bangalore",
    tagline: "ORACLE ENTERPRISE CONSULTING",
    heroDescription: "Empower your executive leadership with robust enterprise analytics. Our certified Oracle OBI consultants deliver data warehouse modeling, ETL integration, and Oracle Analytics Cloud modernization.",
    highlights: [
      "OBIEE Repository (RPD) 3-layer modeling",
      "Oracle Analytics Cloud (OAC) migration",
      "ETL pipeline architecture with ODI & Informatica",
      "Bespoke executive dashboards & BI Publisher",
      "High-volume query tuning & cache management",
      "Enterprise security, roles & row-level access"
    ],
    features: [
      {
        title: "Physical, Business & Presentation Modeling",
        desc: "Flawless RPD design ensuring single source of truth across complex ERP, CRM, and transactional legacy databases."
      },
      {
        title: "Cloud Analytics Modernization",
        desc: "Smooth, zero-downtime migrations from on-premise OBIEE 11g/12c to Oracle Analytics Cloud and Autonomous Data Warehouse."
      },
      {
        title: "Performance Optimization",
        desc: "Eliminate slow-running management reports through aggregate tables, database partition awareness, and cache persistence."
      }
    ],
    deliverables: [
      "Architectural Review & Schema Optimization Document",
      "Bespoke Interactive C-Suite Dashboards",
      "Automated Scheduled Pixel-Perfect Reports",
      "End-to-End User Training & Governance Playbook"
    ],
    metrics: [
      { value: "10x", label: "Faster Query Execution Speeds" },
      { value: "15+ Yrs", label: "Specialized Oracle Consulting" },
      { value: "100%", label: "Data Integrity & Security" },
      { value: "50+", label: "Enterprise Implementations" }
    ],
    faqs: [
      {
        q: "Can you assist with migration from OBIEE to Oracle Analytics Cloud (OAC)?",
        a: "Yes, our certified consultants specialize in migrating legacy OBIEE 11g/12c instances to OAC with automated BAR file utilities, security mapping, and verification testing."
      }
    ]
  },
  {
    slug: "seo-company/seo-consultants-bangalore-india",
    category: "Organic Search Optimization",
    title: "SEO Consultants Bangalore India",
    subtitle: "Award-winning SEO consultancy driving top #1 Google organic rankings",
    tagline: "ORGANIC GROWTH CONSULTING",
    heroDescription: "Dominating search rankings requires technical excellence and authority. Our senior SEO consultants engineer sustainable organic traffic engines that capture qualified commercial search intent.",
    highlights: [
      "Deep Technical SEO & Core Web Vitals audit",
      "Keyword research & topical authority mapping",
      "On-page optimization & content architecture",
      "White-hat high-DA authority backlink acquisition",
      "Local SEO & Google Business Profile dominance",
      "E-commerce schema markup & product optimization"
    ],
    features: [
      {
        title: "Topical Authority Framework",
        desc: "Cluster-based content architectures establishing unmatched domain authority in your specific industry niche."
      },
      {
        title: "Core Web Vitals Engineering",
        desc: "Sub-second LCP, zero CLS, and swift INP scores that Google’s search algorithms reward with prime search rankings."
      },
      {
        title: "Penalty Protection & Recovery",
        desc: "Safe white-hat methodologies compliant with Google Core, Helpful Content, and Spam updates."
      }
    ],
    deliverables: [
      "Comprehensive 120-Point Technical Audit",
      "Quarterly Keyword & Competitor Gap Strategy",
      "High-Impact Monthly Content Briefs",
      "Contextual Editorial Authority Links",
      "Keyword Ranking & Traffic Attribution Report"
    ],
    metrics: [
      { value: "+320%", label: "Average 12-Month Traffic Growth" },
      { value: "12,000+", label: "First Page Keywords Ranked" },
      { value: "85%", label: "Commercial Intent Keywords" },
      { value: "14+", label: "Years SEO Industry Leadership" }
    ],
    faqs: [
      {
        q: "Do you guarantee #1 ranking on Google?",
        a: "No ethical SEO consultancy guarantees specific #1 rankings because Google's algorithm evaluates hundreds of dynamic signals. However, we have a 95%+ track record of bringing primary target keywords to the top 3 spots within 4 to 6 months."
      }
    ]
  },
  {
    slug: "seo-company",
    category: "Search Engine Optimization",
    title: "Best SEO Company in India",
    subtitle: "Scalable organic search solutions for startups, SMBs, and global brands",
    tagline: "SEO SERVICES INDIA",
    heroDescription: "Elevate your brand presence across India and worldwide markets with our enterprise SEO services designed to outrank competitors and drive sustainable inbound business inquiries.",
    highlights: [
      "Custom Enterprise SEO strategy",
      "National & International SEO campaigns",
      "Technical indexation & crawl budget optimization",
      "Content creation by subject matter writers",
      "Competitive intelligence & gap analysis",
      "Dedicated SEO Project Manager"
    ],
    features: [
      {
        title: "Scalable Organic Footprint",
        desc: "Rank for thousands of high-converting long-tail and head terms across all Indian metro cities and international markets."
      },
      {
        title: "Link Building with Real Websites",
        desc: "Zero PBNs or spam farms. Only high-trust, editorial placements on established industry publications."
      },
      {
        title: "Conversion-Focused Search Traffic",
        desc: "Focusing on users who are ready to buy, request quotes, or sign up rather than empty vanity traffic."
      }
    ],
    deliverables: [
      "Holistic SEO Campaign Architecture",
      "Monthly Crawl Health & Error Resolution",
      "Competitor Backlink Intersect Reports",
      "Bi-Weekly Progress & Milestone Reviews"
    ],
    metrics: [
      { value: "500+", label: "Happy Clients across India" },
      { value: "4.9/5", label: "Client Satisfaction Rating" },
      { value: "100%", label: "White-Hat Techniques" },
      { value: "4x", label: "Average ROI on SEO Investment" }
    ],
    faqs: [
      {
        q: "How does contract duration work?",
        a: "We offer flexible 6-month and 12-month performance engagements with transparent monthly milestone deliverables."
      }
    ]
  },
  {
    slug: "web-development-services-in-india",
    category: "Web Engineering",
    title: "Web Development Services in India",
    subtitle: "Custom web development services in India",
    tagline: "WEB ENGINEERING",
    heroDescription: "We design and build fast, secure, and scalable websites and web applications — from marketing sites and e-commerce stores to complex custom enterprise software platforms.",
    highlights: [
      "Custom websites & web applications",
      "E-commerce & CMS development",
      "Responsive, mobile-first design",
      "Performance & SEO-friendly builds",
      "API integration & backend development",
      "Maintenance & ongoing support"
    ],
    features: [
      {
        title: "Modern Tech Stack",
        desc: "Engineered with React, Next.js, Node.js, Python, PostgreSQL, and serverless cloud architectures for blazing performance."
      },
      {
        title: "Enterprise Grade Security",
        desc: "Built-in protection against OWASP top 10 vulnerabilities, SSL encryption, role-based authentication, and automated backup."
      },
      {
        title: "Lightning-Fast Load Times",
        desc: "Optimized asset delivery, CDN edge caching, and server-side rendering ensuring pages load under 1.5 seconds."
      }
    ],
    deliverables: [
      "Custom UI/UX Wireframes & Prototypes",
      "Fully Responsive & Tested Codebase",
      "Clean RESTful / GraphQL API Endpoints",
      "Source Code Ownership & Git Repository Transfer",
      "30-Day Post-Launch Warranty & Handover"
    ],
    metrics: [
      { value: "< 1.5s", label: "Average Page Load Speed" },
      { value: "99.9%", label: "Platform Uptime SLA" },
      { value: "100%", label: "Mobile Responsive & Tested" },
      { value: "350+", label: "Web Applications Delivered" }
    ],
    faqs: [
      {
        q: "Do you build custom web applications from scratch?",
        a: "Yes! We specialize in tailored single-page and progressive web applications engineered to your exact business requirements, database schemas, and workflows."
      }
    ]
  },
  {
    slug: "website-designing",
    category: "UI / UX Design",
    title: "Website Designing Services Bangalore",
    subtitle: "Creative, high-converting website design that captures and captivates",
    tagline: "CREATIVE WEB DESIGN",
    heroDescription: "First impressions matter. We craft intuitive, visually breathtaking, and conversion-optimized website experiences that reflect your brand excellence and turn visitors into loyal customers.",
    highlights: [
      "Modern UI/UX Design in Figma & Adobe XD",
      "Brand Identity & Styleguide Systems",
      "Mobile-First Responsive Layouts",
      "Interactive Micro-Animations & Interactivity",
      "High-Converting Landing Page Design",
      "Accessibility (WCAG 2.1) Compliance"
    ],
    features: [
      {
        title: "Human-Centric UX Design",
        desc: "User research, wireframing, and usability testing designed to reduce user friction and elevate conversions."
      },
      {
        title: "Pixel-Perfect Visual Polish",
        desc: "Bespoke typography, color palettes, and custom illustrations tailored to elevate your corporate branding."
      },
      {
        title: "Seamless Conversion Journeys",
        desc: "Strategic call-to-action placements, clear visual hierarchy, and persuasive layout flows that boost lead capture."
      }
    ],
    deliverables: [
      "Clickable Interactive Figma Prototypes",
      "Complete Design System & Component Library",
      "Production-Ready Asset Export (SVGs, Icons)",
      "Developer Handoff Specifications"
    ],
    metrics: [
      { value: "+65%", label: "Conversion Rate Improvement" },
      { value: "500+", label: "Websites Designed" },
      { value: "100%", label: "Custom Bespoke Designs" },
      { value: "5/5", label: "Client Design Satisfaction" }
    ],
    faqs: [
      {
        q: "Do you provide revisions during the design process?",
        a: "Yes! We collaborate closely with you through interactive Figma feedback cycles, offering unlimited revisions during the wireframe and mock-up stages until you are 100% satisfied."
      }
    ]
  }
];

