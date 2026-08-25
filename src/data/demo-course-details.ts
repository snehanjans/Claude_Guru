/**
 * Program copy for the catalogue courses: the overview line and the highlights
 * shown on a course's referral page.
 *
 * Same source and capture as demo-referable-courses.ts — read out of each
 * program's page on mygreatlearning.com — but kept separate so that file stays
 * a one-line-per-course mirror of the sitemap.
 *
 * What was read, per field:
 *
 * - `overview` — the subtext under the program page's header. The templates
 *   name it differently (`pp-banner__seo-content`, `banner__subtitle`,
 *   `banner__heading--subtext`, `pp-banner__subtitle`), and the two oldest
 *   pages have no class at all, so it falls back to the heading that follows
 *   the h1 and then to the JSON-LD `description`.
 *
 * - `highlights` — the page's own program-highlights section, whichever markup
 *   it uses: the template cards (`highlight__item-*`), the icon list
 *   (`highlight-title`), the accordion (`highlight-content__*`), the benefit
 *   cards (`benefit__*`), SRM's "why choose" columns, or the legacy cards under
 *   `#benefits`. Some pages publish a title per highlight and no description,
 *   hence the optional `detail`. Capped at six, in page order.
 *
 * - `brochureUrl` — /brochures/<slug>, present for 25 of the 34 programs and
 *   verified 200. The rest publish their brochure only behind a lead-capture
 *   form on the program page, so those fall back to the program page itself.
 *
 * Captured 2026-08-25. Re-pull rather than hand-editing: this is site copy, and
 * an edit here quietly stops matching what a learner reads.
 */

export interface CourseHighlight {
  title: string;
  /** Supporting line, where the page publishes one. */
  detail?: string;
}

export interface CourseDetail {
  /** Subtext from the program page header — the page's own one-liner. */
  overview: string;
  /** Program highlights, in page order. */
  highlights: CourseHighlight[];
  /** Brochure page, where one exists. */
  brochureUrl?: string;
}

export const courseDetails: Record<string, CourseDetail> = {
  "nus-accelerated-management-program": {
    overview:
      "The Accelerated Management Program from National University of Singapore Business School is a 9-month live-online fast-track management program for professionals who want to excel in a dynamic business environment.",
    highlights: [
      { title: "High-touch integrated curriculum", detail: "Be immersed in a 9-month learning journey that includes interactive sessions with faculty and practitioners" },
      { title: "Flexible learning", detail: "Learn at your own pace with guided online sessions and peer interactions" },
      { title: "World-renowned faculty", detail: "Gain insights from internationally renowned global industry experts and some of the best faculty in Asia Pacific" },
      { title: "Real-world applications", detail: "Benefit from a teaching approach that includes real-world case studies, video lectures, virtual fireside chats, and research-driven insights" },
      { title: "Practitioner insights", detail: "Engage in dialogue with business and industry thought-leaders from around the world" },
      { title: "Peer learning", detail: "Grow your network and enhance your learning experience through experiences shared with a diverse peer group of accomplished professionals" },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/nus-accelerated-management-program",
  },
  "mit-data-science-and-machine-learning-program": {
    overview:
      "Learn Agentic AI, LLM orchestration, and RAG to build intelligent systems capable of driving AI-powered decisions and solving real-world business challenges. Delivered by globally renowned MIT faculty, this AI and Data Science program is designed to accelerate your career growth.",
    highlights: [
      { title: "Learn from MIT faculty", detail: "Learn from MIT faculty with expertise across AI, Data Science, Machine Learning, and Agentic AI through recorded lectures." },
      { title: "Attend Mentorship Sessions by Industry Experts", detail: "Learn from experienced industry practitioners who help connect concepts, tools, and frameworks to real-world business applications." },
      { title: "Build End-to-End AI Expertise", detail: "Progress from Data Science and Machine Learning to GenAI, RAG, AI Agents, and Multi-Agent Systems through a structured, application-focused curriculum." },
      { title: "Personalized Learning Support", detail: "Receive guidance from a dedicated program support team at Great Learning that will guide you throughout your learning journey and help you stay on track toward program completion." },
      { title: "Build Real-World AI Expertise", detail: "Strengthen practical skills through 4 hands-on projects and 10+ case studies that reflect real business challenges." },
      { title: "Earn a Recognized MIT IDSS Credential", detail: "Earn a Certificate of Completion and 8.0 CEUs from MIT IDSS that validate your AI and Data Science expertise." },
    ],
  },
  "ai-for-leaders-course": {
    overview:
      "Designed for senior leaders to lead initiatives using GenAI & Agentic AI solutions. Build strategic judgment & hands-on expertise with no-code tools. Earn dual certificates from the McCombs School of Business at The University of Texas at Austin & Great Lakes Executive Learning.",
    highlights: [
      { title: "Learn from Texas McCombs Faculty", detail: "Learn through a structured curriculum designed by leading Texas McCombs faculty and recorded video lectures that build a strong foundation in AI for business leadership." },
      { title: "Attend Weekly Live Mentorship Sessions with Industry Experts", detail: "Join weekly live mentorship sessions with experienced industry practitioners to explore real-world AI applications, implementation challenges, and business use cases." },
      { title: "No-Code Learning Approach", detail: "Build practical AI capability using no-code AI and analytics tools without requiring a programming background." },
      { title: "Apply AI to Real Business Challenges", detail: "Build practical experience through 4 projects and a capstone that helps you connect AI capabilities to business outcomes and strategic priorities." },
      { title: "Get Personalized Learning Support", detail: "Receive guidance from a dedicated Program Manager, academic support, discussion forums, peer groups, and the Great Learning community." },
      { title: "Earn Dual Certificates and 5.5 CEUs", detail: "Earn dual Certificates of Completion from Texas McCombs and Great Lakes Executive Learning, and 5.5 CEUs from Great Lakes Executive Learning upon successful completion." },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/ai-for-leaders-course",
  },
  "iit-bombay-certificate-in-agentic-ai": {
    overview:
      "Designed for tech practitioners and data professionals who want to build autonomous AI agents that reason, act, and collaborate using RAG, MCP, LangGraph, and CrewAI. Build deep, hands-on technical expertise and earn a Certificate of Completion from IIT Bombay.",
    highlights: [
      { title: "Weekly Live Sessions from IIT Bombay CSE Faculty", detail: "Learn through live, online, interactive sessions designed and delivered by faculty from the Department of Computer Science and Engineering at IIT Bombay." },
      { title: "Real-World Curriculum", detail: "Engage with an industry-relevant curriculum featuring real-world use cases focused on building autonomous agents." },
      { title: "Work with Industry-Relevant Agentic AI Tools", detail: "Gain hands-on exposure to tools and frameworks such as RAG, MCP, LangGraph, CrewAI, vector databases, and multi-agent orchestration." },
      { title: "IIT Bombay campus immersion", detail: "Participate in a one-day optional immersion at the IIT Bombay campus to interact with faculty and experience the campus environment." },
      { title: "Get Personalized Learner Support", detail: "Receive assistance from a dedicated Programme Manager throughout the learning journey." },
      { title: "Earn a Certificate from IIT Bombay", detail: "Earn a Certificate of Completion from IIT Bombay upon successful completion of the course." },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/iit-bombay-certificate-in-agentic-ai",
  },
  "certificate-in-ai-engineering-and-mlops": {
    overview:
      "The Certificate in AI Engineering and MLOps is a five-month online, hands-on certificate for professionals transitioning into AI engineering roles. Learn to build, scale and manage systems powering modern AI workflows, bridging data science and systems engineering.",
    highlights: [
      { title: "IIT Bombay faculty-led", detail: "Learn from IIT Bombay faculty through a mix of live, online, interactive sessions who will connect cutting-edge research with practical frameworks and cases." },
      { title: "Weekly live sessions", detail: "Weekly live sessions for learning, hands-on skills and query resolution" },
      { title: "Hands-on, Industry-focused Curriculum", detail: "Learn through real-world projects using industry-standard tools and technologies." },
      { title: "NVIDIA-enabled learning modules", detail: "NVIDIA-enabled curriculum prepares learners to pursue an industry-recognised NVIDIA certification" },
      { title: "Campus immersion at IIT Bombay", detail: "Meet the faculty and experience the IIT Bombay campus during the campus immersion" },
      { title: "Dedicated learner support", detail: "Personalised assistance from a dedicated Programme Manager" },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/certificate-in-ai-engineering-and-mlops",
  },
  "iit-bombay-certificate-generative-ai": {
    overview:
      "Designed for technology, and data professionals, this course builds skills to design, adapt, and deploy reliable GenAI applications using LLMs, RAG, agents, LLMOps, and governance. Build hands-on expertise, strategic judgment and earn a Certificate of Completion from IIT Bombay.",
    highlights: [
      { title: "Weekly Live Sessions from IIT Bombay Faculty", detail: "Learn through live, online, interactive sessions designed and delivered by faculty from IIT Bombay." },
      { title: "Learn to Deploy and Manage GenAI Applications", detail: "Understand how to deploy, monitor, secure, and manage GenAI applications using LLMOps, privacy, governance, and operational controls." },
      { title: "IIT Bombay Campus Immersion", detail: "Participate in a one-day optional immersion at the IIT Bombay campus to interact with faculty and experience the campus environment." },
      { title: "Learn Through Guided Labs and Projects", detail: "Apply concepts through guided labs and hands-on projects focused on building, evaluating, and operating agentic systems." },
      { title: "Get Personalized Learner Support", detail: "Receive assistance from a dedicated Programme Manager throughout the learning journey." },
      { title: "Earn a Certificate from IIT Bombay", detail: "Earn a Certificate of Completion from IIT Bombay upon successful completion of the certificate course." },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/iit-bombay-certificate-generative-ai",
  },
  "iit-bombay-certificate-leadership-with-ai": {
    overview:
      "Designed for business leaders and technology managers, this course builds strategic judgement and technical expertise to evaluate, implement and scale AI initiatives using AI, Generative AI, and Agentic AI. Earn a Certificate of Completion from IIT Bombay.",
    highlights: [
      { title: "Learn weekly from IIT Bombay Faculty", detail: "Learn through live interactive online sessions delivered by IIT Bombay faculty, connecting AI concepts with business frameworks, practical cases, and leadership applications." },
      { title: "Hands-on low-code AI leadership curriculum", detail: "Build AI leadership capabilities through case-based learning, low-code tools, and applied projects across AI strategy, governance, GenAI, and Agentic AI." },
      { title: "Real-world business case studies", detail: "Analyze AI adoption, transformation, innovation, governance, ROI, and scalability through applied business cases and sector-relevant examples." },
      { title: "IIT Bombay campus immersion", detail: "Participate in a one-day optional immersion at the IIT Bombay campus to interact with faculty and experience the campus environment." },
      { title: "Earn a certificate from IIT Bombay", detail: "Earn a Certificate of Completion from IIT Bombay upon successful completion of the course." },
      { title: "Industry-Specific Curated Projects", detail: "Analyse real-world business case studies to assess AI initiatives from the perspective of organizational strategy, governance, ROI, and scalability across sectors." },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/iit-bombay-certificate-leadership-with-ai",
  },
  "iit-bombay-supply-chain-analytics-with-ai-ml-applications": {
    overview:
      "A 6-month hands-on curriculum designed to equip professionals with supply chain analytics using AI and ML applications.",
    highlights: [
      { title: "Designed and delivered by IIT Bombay faculty" },
      { title: "Weekly live sessions for learning and query resolution" },
      { title: "Industry-relevant curriculum with case-based teaching methodology" },
      { title: "Online curriculum designed for working professionals" },
      { title: "AI topics and techniques woven throughout the curriculum" },
      { title: "Peer-to-peer learning and networking opportunities" },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/iit-bombay-supply-chain-analytics-with-ai-ml-applications",
  },
  "chief-financial-officer-programme": {
    overview:
      "A 9-month online CFO Programme by SPJIMR, a Triple Crown-accredited institute, featuring live sessions by SPJIMR faculty and two campus immersions. Includes dedicated Forensic Accounting and AI for Finance modules for building boardroom readiness.",
    highlights: [
      { title: "Designed and delivered by SPJIMR faculty", detail: "Industry-relevant curriculum designed and delivered through SPJIMR faculty-led live lectures, industry masterclasses, and live mentor sessions." },
      { title: "Two on-campus immersions at SPJIMR, Mumbai", detail: "Participate in two campus immersions at SPJIMR, Mumbai, for deeper learning, direct faculty engagement, and peer networking" },
      { title: "Executive sessions with CFOs and senior leaders", detail: "Gain boardroom perspectives through executive sessions led by SPJIMR faculty, CFOs, and senior finance leaders focused on real leadership decisions." },
      { title: "SPJIMR Executive Alumni Status & Triple Crown Recognition", detail: "Learn from SPJIMR, a Triple Crown-accredited business school, and earn a Certificate of Completion with Executive Alumni Status upon successful completion of the programme." },
      { title: "No-code AI and fintech modules", detail: "Build digital capability with AI and data analytics for finance, including evaluating fintech investments, dashboards, forecasting, and governance—no technical background required." },
      { title: "Dedicated Forensic Accounting module", detail: "Master forensic techniques to detect fraud, analyse financial statements, and protect organisational credibility while strengthening strategic CFO decision-making." },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/chief-financial-officer-programme",
  },
  "data-analytics-online-powerbi-bootcamp": {
    overview:
      "Elevate your professional journey with the Data Analytics and Power BI Bootcamp. Master critical business intelligence skills, prepare for PL-300 certification, and demonstrate industry readiness with certificates from Microsoft and Great Learning.",
    highlights: [
      { title: "12-Week Online Program" },
      { title: "4 Hands-on Projects" },
      { title: "Dedicated Program Manager" },
      { title: "Certificate of Completion from Great Learning and Microsoft" },
      { title: "PL-300 - Microsoft Power BI Data Analyst Certification Training Program" },
    ],
  },
  "dba-aiml-online": {
    overview:
      "The DBA program by Walsh College, blends rigorous academic teaching with real world applications and equips you to master AI intelligent systems and data driven decision making in the evolving business landscape.",
    highlights: [
      { title: "Top ranked DBA by Forbes", detail: "Ranked among top 10 online DBA degrees of 2024 by Forbes for academic quality and industry relevance." },
      { title: "Hands-on projects followed by thesis", detail: "Work on numerous real world projects followed by capstone projects and a final dissertation with dedicated guidance from top faculty and industry experts." },
      { title: "WES recognized and HLC accredited", detail: "Enhances your professional credibility and academic opportunities." },
      { title: "Alumni status from Walsh College", detail: "Earn alumni status from Walsh College upon program completion." },
      { title: "Expert mentorship and support", detail: "Engage with AI experts for project guidance, get 1:1 support, weekly sessions, and dedicated program manager assistance." },
      { title: "Earn 60 Semester credit hours in this program", detail: "Complete a rigorous, research-driven DBA in AI & ML with 60 Semester Credit Hours (SCH), qualifying you for senior leadership roles and advanced professional growth." },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/dba-aiml-online",
  },
  "mba-dba-gm-walsh": {
    overview:
      "Walsh College, in collaboration with Great Lakes Executive Learning, offers a dual degree program with a DBA and a STEM MBA, accredited by the HLC and recognized by WES.",
    highlights: [
      { title: "Top ranked DBA by Forbes", detail: "Ranked #1 in Forbes’ list of the best online DBA degrees of 2024" },
      { title: "Hands-on projects followed by thesis", detail: "Work on numerous real world projects followed by capstone projects and a final dissertation with dedicated guidance from top faculty and industry experts." },
      { title: "WES recognized and HLC accredited", detail: "Ensures global acceptance and enhances career and academic opportunities." },
      { title: "Alumni status from Walsh College", detail: "Earn alumni status from Walsh College upon program completion." },
      { title: "Expert mentorship and support", detail: "Learn from top faculty and leading industry practitioners" },
      { title: "Powerful Global Network", detail: "Network with professionals from leading firms like Amazon, Microsoft, and JPMorgan, and unlock career opportunities beyond the classrooms." },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/mba-dba-gm-walsh",
  },
  "iit-bombay-pg-diploma-ai-data-science": {
    overview:
      "Master AI & Data Science from IIT Bombay",
    highlights: [
      { title: "Designed and delivered by IIT Bombay faculty" },
      { title: "Online synchronous 6-course curriculum designed for working professionals" },
      { title: "Meet the faculty and experience the IIT Bombay campus during campus visits" },
      { title: "Hands-on learning through industry-relevant tools" },
      { title: "Access to IIT Bombay’s Lateral Hiring Group" },
      { title: "No GATE Score required" },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/iit-bombay-pg-diploma-ai-data-science",
  },
  "iit-bombay-e-postgraduate-diploma-computer-science-engineering": {
    overview:
      "Designed for software engineers, IT professionals, data scientists and fresh graduates, this e-Postgraduate Diploma in Computer Science and Artificial Intelligence combines rigorous academics, AI specialization & flexible learning with campus immersion and eAlumni status.",
    highlights: [
      { title: "World-Class IIT Bombay CSE Faculty", detail: "Learn from distinguished CSE faculty, including ACM/IEEE Fellows and award winners, through weekly live sessions for direct academic interactions and query resolution" },
      { title: "Prestigious eAlumni Status", detail: "Elevate your career by gaining official IIT Bombay eAlumni status upon graduation, connecting you to an illustrious global network of engineers and researchers." },
      { title: "In-Person Campus Immersion", detail: "Visit the campus to meet the computer science faculty face-to-face, network with your professional peer group, and experience IIT Bombay's vibrant academic culture." },
      { title: "GATE Score Not Mandatory", detail: "Benefit from highly accessible postgraduate education. A traditional GATE score is not required for registration, making it ideal for working professionals" },
      { title: "Concept-Based, 36-Credit Curriculum", detail: "Earn 36 credits across six rigorous courses. The comprehensive curriculum mirrors on-campus standards and focuses on programming, systems, and machine learning" },
      { title: "Highly Flexible Hybrid Learning", detail: "Balance work and studies with a flexible online hybrid delivery model combining synchronous and asynchronous sessions designed for geographically dispersed learners." },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/iit-bombay-e-postgraduate-diploma-computer-science-engineering",
  },
  "iit-bombay-e-postgraduate-diploma-e-mobility": {
    overview:
      "Gain expertise in EV technology, battery systems, and power electronics from IIT Bombay faculty. Earn a credit-bearing ePGD and eAlumni status from IIT Bombay, designed for working professionals to transition into the electric vehicle industry.",
    highlights: [
      { title: "ePGD delivered by IIT Bombay", detail: "Designed and delivered by IIT Bombay faculty" },
      { title: "36 IIT Bombay credits", detail: "Earn a credit-bearing diploma from IIT Bombay, with credits savable in the Academic Bank of Credits (ABC)." },
      { title: "Campus Immersion", detail: "Interact with faculty and experience the IIT Bombay campus during visits and an in-person graduation." },
      { title: "eAlumni Status", detail: "Upon successful completion, candidates are awarded IIT Bombay eAlumni status and join a prestigious network." },
      { title: "Lateral Hiring", detail: "Gain exclusive access to IIT Bombay's Lateral Hiring Group to explore relevant career opportunities." },
      { title: "No GATE Score", detail: "A GATE score is not required for registration, ensuring accessibility for working professionals." },
    ],
  },
  "advanced-management-programme-in-ai-leadership": {
    overview:
      "A 7-month blended AI leadership program for mid-to-senior professionals to lead AI-driven transformations. With live sessions, executive masterclasses, projects, case studies, and campus immersions, gain hands-on experience in GenAI, Agentic AI, and data-driven decision-making.",
    highlights: [
      { title: "Designed by SPJIMR Faculty", detail: "Designed and Delivered by SPJIMR Faculty with an AI-Led Strategic Business Focus" },
      { title: "Campus Immersion", detail: "On-Campus Immersion at SPJIMR, Mumbai, for In-Person Learning and Networking" },
      { title: "Live Sessions and Executive Masterclasses", detail: "Engage in SPJIMR faculty-led live sessions and Executive Industry Masterclasses" },
      { title: "SPJIMR Executive Alumni Status", detail: "Upon successful completion, gain the prestigious Executive Alumni Status from SPJIMR" },
      { title: "Hands-on Projects & Case Studies", detail: "Build a robust AI project portfolio through real-world projects and structured case-based learning" },
      { title: "Guided AI Tool Demos for Hands-on Prototyping", detail: "Work with leading tools such as Google AI Studio, NotebookLM, LangChain, and Hugging Face" },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/advanced-management-programme-in-ai-leadership",
  },
  "executive-certificate-programme-in-ai-and-gen-ai-for-managers": {
    overview:
      "This Executive Certificate Programme from SPJIMR is a 5-month online certificate for executives aspiring to lead AI-driven business transformation. Learn GenAI, LLMs, RAG, Agentic AI, and AI strategy in a no-code environment through live sessions, projects and case studies.",
    highlights: [
      { title: "Designed by SPJIMR Faculty", detail: "Learn through a strategically driven curriculum built by SPJIMR faculty with a strong business focus" },
      { title: "Live Masterclasses & Industry Mentored Sessions", detail: "Engage in live interactive masterclasses by SPJIMR faculty and weekly mentored sessions led by industry practitioners" },
      { title: "Executive Alumni Status from SPJIMR", detail: "Upon successful completion, gain the prestigious Executive Alumni Status from SPJIMR" },
      { title: "Hands-on Projects & Case Studies", detail: "Build a robust AI project portfolio through real-world projects and structured case-based learning" },
      { title: "Dedicated Learner Support & Networking", detail: "Benefit from peer learning, networking opportunities, and personalised support from a dedicated Programme Manager" },
      { title: "Exposure to Latest Tools & Technologies", detail: "Work with leading tools such as Google AI Studio, NotebookLM, LangChain, and Hugging Face" },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/executive-certificate-programme-in-ai-and-gen-ai-for-managers",
  },
  "pg-program-management-executive": {
    overview:
      "Transform your career with the Executive PG Program in Management. Specialize in Business Analytics, Operations, or Marketing with an Executive MBA equivalent curriculum, including Harvard case studies and capstone projects",
    highlights: [
      { title: "Certificate from a premier institute", detail: "Earn a Certificate from one of India's Top 10 business schools - Great Lakes Executive Learning." },
      { title: "Curriculum based on the best executive MBA programs", detail: "Intensive Executive MBA equivalent curriculum with emphasis on management foundations, hands-on projects, and a capstone project." },
      { title: "Guidance from the best management faculty of India", detail: "Interact with 20+ professors from leading universities and 5,800+ industry experts." },
      { title: "Designed for working professionals", detail: "Candidates can learn at their own pace and attend classes as per their convenience." },
    ],
  },
  "mtech-artificial-intelligence-srm": {
    overview:
      "Industry oriented Masters degree program for working professionals",
    highlights: [
      { title: "Comprehensive Curriculum", detail: "Learn Artificial Intelligence, Data Visualisation, Machine Learning, Deep Learning, Big Data, and more" },
      { title: "Immersive Classroom Learning Experience", detail: "Offered in a Weekend learning format for working professionals" },
      { title: "Dedicated Career Support", detail: "Resume Building, Interview Preparation, Job Boards, and Career Guidance" },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/mtech-artificial-intelligence-srm",
  },
  "ms-data-science-deakin-programme": {
    overview:
      "Earn a Master’s from Deakin University and PG Certificates from the McCombs School of Business at The University of Texas at Austin and Great Lakes Executive Learning, specializing in AI, Machine Learning, or Data Science.",
    highlights: [
      { title: "Masters degree & PG certificates", detail: "Earn an online masters degree from Deakin University and PG certificates from world's leading institutions" },
      { title: "Practical, hands-on learning from world-class faculty", detail: "Live virtual classes, Industry sessions and competency courses delivered by experts and faculty at Deakin" },
      { title: "Industry-ready curriculum", detail: "Curriculum designed in a modular structure with foundational and advanced competency track" },
      { title: "Dedicated career support", detail: "Get expert guidance to prepare for job roles with mock interviews, resume building, and e-portfolio review" },
      { title: "11 hands-on projects & 22+ tools", detail: "The program includes 11 hands-on projects, 1 capstone project, 60+ case studies, and 22+ tools to strengthen practical and conceptual knowledge." },
      { title: "On-campus graduation ceremony in Australia", detail: "Opportunity to attend a graduation ceremony (optional) at the Deakin University campus in Melbourne." },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/ms-data-science-deakin-programme",
  },
  "walsh-ms-aiml-online": {
    overview:
      "The MS in Artificial Intelligence and Machine Learning program offered by Walsh College provides a comprehensive curriculum covering advanced applications of Artificial Intelligence and Machine Learning. This fully online program emphasizes practical experience to equip students with the necessary skills in the field.",
    highlights: [
      { title: "Designed for Working Professionals" },
      { title: "Pursue MS in AIML for under INR 6 Lakhs" },
      { title: "12 Hands-on Projects and 30+ Case Studies" },
      { title: "1 Capstone Project at the end of each Year" },
      { title: "Get Alumni Status from Walsh College" },
      { title: "No GRE/GMAT or TOEFL Requirement" },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/walsh-ms-aiml-online",
  },
  "ms-data-science-programme": {
    overview:
      "A world-class master's degree in data science from Northwestern University School of Professional Studies",
    highlights: [
      { title: "Physical Residency", detail: "Two-day in-person residencies, twice in the programme held either in Gurugram, Bengaluru, or Chennai." },
      { title: "Networking", detail: "An opportunity to build connections and interact with fellow students and professors in an environment reminiscent of a traditional campus." },
      { title: "Academics", detail: "Collaborate with your team members to present your projects in real time in front of your peers and the professors." },
      { title: "Career Support", detail: "Highly interactive career mentoring sessions and fireside chats with industry speakers during the event." },
    ],
  },
  "amrita-online-bba": {
    overview:
      "Elevate your career with an Online BBA from Amrita Online (Amrita Vishwa Vidyapeetham). Graduate from a top-ranked Indian university (NIRF #8, NAAC A++) with a globally recognized Bachelor of Business Administration degree.",
    highlights: [
      { title: "Top Ranked University", detail: "#8 University in India (NIRF 2025), #1 in India by TIMES HIGHER EDUCATION (THE Impact Rankings 2025), and NAAC A++ Accredited." },
      { title: "Industry Certifications", detail: "Gain a competitive edge with specialized training paths from global leaders like Google, Amazon, Salesforce, and Oracle across various functional domains." },
      { title: "Career Placement", detail: "Accelerate your professional growth with dedicated placement assistance, expert industry mentorship, and access to a powerful alumni network spanning 50+ countries." },
      { title: "Global Exposure & Study Abroad", detail: "Go global via Student Exchange, Study Abroad, and 3+1+x integrated Masters programs with global partners like UC Davis, UC San Diego, Oakland University, and UCD Dublin." },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/amrita-online-bba",
  },
  "amrita-online-bca": {
    overview:
      "Kickstart your tech journey with the Online BCA from Amrita Vishwa Vidyapeetham, a NAAC A++ accredited university. This 3-year degree offers flexible learning, global industry certifications, and specialized tracks in AI & Data Science.",
    highlights: [
      { title: "Top Ranked University", detail: "#8 University in India (NIRF 2025), #1 in India by TIMES HIGHER EDUCATION (THE Impact Rankings 2025), and NAAC A++ Accredited." },
      { title: "Industry Certifications", detail: "Build your professional credentials with specialized training for certifications from global tech leaders like the Python Institute, Google Cloud, and CISCO (CCNA)." },
      { title: "Career Placement", detail: "Accelerate your professional growth with dedicated placement assistance, expert industry mentorship, and access to a powerful alumni network spanning 50+ countries." },
      { title: "Global Exposure & Study Abroad", detail: "Go global via Student Exchange, Study Abroad, and 3+1+x integrated Masters programs with global partners like UC Davis, UC San Diego, UCD Dublin, and University of Twente." },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/amrita-online-bca",
  },
  "amrita-online-mba": {
    overview:
      "Transform your career with the Online MBA from Amrita Vishwa Vidyapeetham , a top-ranked NAAC A++ accredited university. This 2-year online master's program offers flexible learning, an industry-mentored curriculum tailored to help learners step into influential leadership roles.",
    highlights: [
      { title: "Top Ranked University in India", detail: "#8 University in India (NIRF 2025), #1 in India by TIMES HIGHER EDUCATION (THE Impact Rankings 2025), and NAAC A++ Accredited." },
      { title: "Unmatched Industry Integration", detail: "Partnered with Grant Thornton & GFTI. Four of ten specializations are offered with industry partners, connecting your academic learning to real-world business." },
      { title: "Career Placement", detail: "Accelerate your professional growth with dedicated placement assistance, expert industry mentorship, and access to a powerful alumni network spanning 50+ countries." },
      { title: "Global Exposure & Study Abroad", detail: "Go global via Student Exchange and Study Abroad programs with global partners like Oakland University, Univ. of New Mexico, Institut Mines-Télécom, and Universitat de Barcelona." },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/amrita-online-mba",
  },
  "amrita-online-mca": {
    overview:
      "Accelerate your IT career with the Online MCA from Amrita Vishwa Vidyapeetham, a NAAC A++ accredited university. This 2-year master's program offers an Industry 4.0-aligned curriculum, global certifications, and tracks in Cybersecurity and AI & ML.",
    highlights: [
      { title: "Top Ranked University in India", detail: "#8 University in India (NIRF 2025), #1 in India by TIMES HIGHER EDUCATION (THE Impact Rankings 2025), and NAAC A++ Accredited." },
      { title: "Industry Certifications", detail: "Gain a competitive edge with specialized training paths from global leaders like CISCO, Google Cloud, and Python Institute across critical tech domains." },
      { title: "Career Placement", detail: "Accelerate your professional growth with dedicated placement assistance, expert industry mentorship, and access to a powerful alumni network spanning 50+ countries." },
      { title: "Global Exposure & Study Abroad", detail: "Go global via Student Exchange and Study Abroad programs with global partners like University of Twente, Universität Paderborn, Univ. of New Mexico, and Oakland University." },
    ],
    brochureUrl: "https://www.mygreatlearning.com/brochures/amrita-online-mca",
  },
  "pg-program-artificial-intelligence-course": {
    overview:
      "Transition to AI roles or deepen your technical expertise. Build hands-on skills in ML, GenAI & Agentic AI. Earn dual certificates from the McCombs School of Business at UT Austin & Great Lakes Executive Learning.",
    highlights: [
      { title: "Learn from Texas McCombs Faculty", detail: "Learn core concepts through recorded video lectures and deepen your perspective through monthly faculty-led masterclasses that connect theory to business application." },
      { title: "Attend Weekly Live Mentorship Sessions with Industry Experts", detail: "Learn from AI practitioners in weekend live online mentorship sessions where you discuss case studies, see practical demos, clarify doubts, and understand how AI is applied." },
      { title: "Build Hands-on Expertise to Solve Business Problems", detail: "Apply your learning through 4 hands-on projects and 30+ real-world case studies using industry datasets, 30+ cutting-edge tools, and personalized coding support." },
      { title: "Build End-to-End AI & ML Expertise", detail: "Learn the full spectrum of AI & ML concepts, including Python, Machine Learning, Deep Learning, NLP, GenAI, Agentic AI, and more, through a hands-on, structured learning approach." },
      { title: "Learn Without Disrupting Your Work Schedule", detail: "Access 200+ hours of learning content online, including lectures, assignments, and live webinars, anytime, anywhere." },
      { title: "Get Personalized Program Support", detail: "Get 1:1 support from a dedicated Program Manager to stay on track and complete the program with ease." },
    ],
  },
  "pg-program-cloud-computing-course": {
    overview:
      "Join the online PG Program in Cloud Computing and DevOps by Great Lakes Executive Learning. Explore Applied GenAI on Cloud across AWS, Azure, and GCP, featuring 80+ hands-on exercises and career support.",
    highlights: [
      { title: "120+ cloud services covered", detail: "Learn in-depth cloud technology with in-demand DevOps tools, offered by AWS, Azure and Google Cloud" },
      { title: "80+ Hands-on Projects and Exercises", detail: "Build industry relevant projects and get access to additional hands-on exercises and self paced reading material" },
      { title: "Live mentorship sessions", detail: "A certified professional from the industry mentors you through the entire program." },
      { title: "Master DevOps skills and tools", detail: "Master technologies such as AWS RDS, Cloudwatch, AWS Lambda, Docker, Azure DevOps, Kubernetes, Terraform, Ansible,Jenkins and many more..." },
      { title: "Top certification exam prep", detail: "Get access to comprehensive certification prep materials, from over 100 exercises & 1,100+ mock questions." },
      { title: "Dedicated career support", detail: "Get career support with resume and profile review, career mentorship and access to Great Learning job board." },
    ],
  },
  "pg-program-data-science-business-analytics-course": {
    overview:
      "Master cutting-edge Data Science technologies like Python, Tableau, Machine Learning, AI, Generative AI, and more in this Data Science with GenAI certificate program. Earn dual certificates from McCombs School of Business at UT Austin and Great Lakes Executive Learning",
    highlights: [
      { title: "Learn from a world-leading university", detail: "Earn a prestigious certificate from Texas McCombs, taught by its esteemed faculty." },
      { title: "Industry-ready curriculum", detail: "Master topics like Predictive Modelling, Machine Learning, GenAI & Data Visualisation" },
      { title: "Learn at your convenience", detail: "Gain access to 500+ hours of content online, including lectures, assignments, and live webinars which you can access anytime, anywhere" },
      { title: "11+ hands-on projects & 22+ tools", detail: "The program includes 10 hands-on projects, 1 capstone project, 60+ case studies, and 22+ tools to strengthen practical and conceptual knowledge." },
      { title: "Expert mentorship and support", detail: "Get expert AI guidance to complete and showcase projects, plus 1:1 support, weekly concept sessions, and dedicated program-manager assistance for all queries." },
      { title: "Legacy of success", detail: "With over 11 years of excellence and 300+ graduating batches, our program boasts a proven track record of delivering exceptional results." },
    ],
  },
  "gl-pg-program-cloud-computing-course": {
    overview:
      "Advance your Career Growth with Cloud Computing",
    highlights: [
      { title: "90+ cloud services covered in curriculum", detail: "Learn in-depth cloud technology with in-demand tools and software, offered by AWS, Azure and Google Cloud." },
      { title: "Live mentorship sessions", detail: "A certified professional from the industry mentors you through the entire program." },
    ],
  },
};

/** Page copy for a course, if we captured any. */
export const courseDetailFor = (slug: string): CourseDetail | undefined => courseDetails[slug];
