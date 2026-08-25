/**
 * Learner-facing FAQ for the catalogue courses, read from each program's page on
 * mygreatlearning.com — the same questions a learner sees, so a guru answering
 * one isn't guessing.
 *
 * Read from the FAQ accordions' schema.org microdata, falling back to the page's
 * FAQPage JSON-LD where a page has no accordion markup. Group titles are the
 * page's own tabs or accordion headings; pages that publish one flat list get a
 * single "Program details" group. Trimmed to at most four groups of five and
 * answers to ~700 characters: this is a reference panel inside the guru
 * dashboard, not a mirror of the page.
 *
 * Nine programs render their FAQ client-side, so there is nothing to read out of
 * the page: those courses have no entry here and the tab links out instead of
 * inventing answers.
 *
 * Distinct from the guru referral FAQ on the Recommend page, and from the AINP
 * programs' FAQ in ProgramDetailPage.
 *
 * Captured 2026-08-25. Re-pull rather than hand-editing — these are the
 * program's own answers, and an edit here quietly stops matching them.
 */

export interface CourseFaqGroup {
  title: string;
  items: { q: string; a: string }[];
}

export const courseFaq: Record<string, CourseFaqGroup[]> = {
  "nus-accelerated-management-program": [
    {
      title: "Program details",
      items: [
        {
          q: "What is a fast-track management program, and is it designed for experienced professionals or early-career candidates?",
          a:
            "A fast-track management program is designed to help professionals rapidly build a solid foundation in core business areas, such as Strategy, Leadership, and Finance, while simultaneously gaining critical skills in emerging digital domains. For example, the NUS Accelerated Management Program is a 9-month fast-track program aimed at helping professionals develop future-ready capabilities to excel in a dynamic and disruptive business environment. These programs are designed for experienced professionals, rather than early-career candidates or fresh graduates.",
        },
        {
          q: "What is the duration and format of the program?",
          a:
            "The program lasts for 9 months and is delivered in an online and live-online format.",
        },
        {
          q: "How can an accelerated management program help senior professionals prepare for strategic leadership roles?",
          a:
            "An accelerated management program helps senior professionals transition into strategic leadership roles by rapidly equipping them with the necessary tools, global perspectives, and transformational capabilities, all without requiring them to step away from their current roles. Ultimately, this comprehensive upskilling builds the confidence and future-ready capabilities necessary for emerging leaders and functional managers to successfully navigate business disruption and step into top executive roles.",
        },
        {
          q: "What certificate will I receive after completing this management program?",
          a:
            "Upon successful completion of the NUS Accelerated Management Program, you will receive a verified certificate from NUS Business School.",
        },
        {
          q: "Do employers and business leaders value accelerated management programs for career growth and leadership advancement?",
          a:
            "Yes, companies and business leaders increasingly value accelerated management programs for career growth and leadership advancement. These fast-track programs are highly regarded because they focus on delivering a strong return on investment for both the professional and their organization.",
        },
      ],
    },
  ],
  "mit-data-science-and-machine-learning-program": [
    {
      title: "Program details",
      items: [
        {
          q: "What is the AI and Data Science: Leveraging Responsible AI, Data and Statistics for Practical Impact program?",
          a:
            "The AI and Data Science: Leveraging Responsible AI, Data and Statistics for Practical Impact program is a 16-week online program offered by the MIT Institute for Data, Systems, and Society (IDSS). The curriculum is designed by MIT faculty and covers Data Science, machine learning, Generative AI, Agentic AI, and responsible AI deployment. Delivered in collaboration with Great Learning, the program combines recorded MIT faculty lectures with live mentorship sessions and four hands-on projects.",
        },
        {
          q: "What does the MIT IDSS AI and Data Science course offer?",
          a:
            "The 16-week online AI and Data Science: Leveraging Responsible AI, Data and Statistics for Practical Impact is offered by the MIT Institute for Data, Systems, and Society (IDSS). It offers: ● A Certificate of Completion from MIT IDSS ● 22+ hours of recorded video lectures from MIT faculty ● 14+ live mentored learning sessions ● 11 graded quizzes, 10+ case studies, and 4 hands-on projects ● Coverage of advanced topics, including Generative AI, Responsible AI, Deep Learning, and more ● A comprehensive curriculum covering both foundational and advanced concepts, including the practical application of data analytics in Artificial Intelligence",
        },
        {
          q: "How is this program different from other data science courses?",
          a:
            "MIT IDSS’ AI and Data Science program is different from other data science courses because of its academic rigor and industry relevance. Here are the reasons why this program stands out: ● Learn from MIT Faculty: Access recorded lectures from MIT faculty and instructors who bring academic depth and industry relevance to every session. ● Benefit From Mentorship by Industry Experts: Receive direct mentorship from professionals working in the world’s leading organizations as they share real-world applications of Data Science and AI concepts. ● Real-World Expertise: Work on 4 hands-on projects and explore 10+ real-world case studies to strengthen your skills and demonstrate your AI and Data Scie",
        },
        {
          q: "What are the learning outcomes of the MIT IDSS AI and Data Science course?",
          a:
            "With AI and Data Science: Leveraging Responsible AI, Data and Statistics for Practical Impact, learners will: ● Explain how AI evolved from prediction models to language models and autonomous agents, and identify where each is useful versus overhyped. ● Write effective prompts, identify hallucinations, and apply structured checks to improve the reliability of AI-generated outputs. ● Use AI coding assistants to write and debug Python faster while spotting common errors to maintain code quality. ● Choose the right machine learning approach for a given business question, apply it, and assess whether the results are trustworthy. ● Connect language models to external data using retrieval-augmente",
        },
        {
          q: "What is the duration of this MIT IDSS AI and Data Science Program?",
          a:
            "The duration of the MIT IDSS AI and Data Science Program is 16 weeks. It includes recorded lectures from award-winning MIT faculty, 10+ case studies, and 4 hands-on projects. Self-paced modules on topics such as deep learning, computer vision, and Claude-based AI workflows are available in addition to the core schedule.",
        },
      ],
    },
  ],
  "ai-for-leaders-course": [
    {
      title: "Program details",
      items: [
        {
          q: "What is the AI for Business Leaders Course?",
          a:
            "The Post Graduate Program in Artificial Intelligence for business managers and leaders is designed for both technical and non-technical professionals. It equips business managers and leaders with the capabilities and limitations of AI, enabling them to make strategic AI-driven decisions. This 5-month online AI course blends conceptual learning and real-world case studies, ensuring an immersive AI learning experience. Participants gain hands-on expertise to: • Adapt to changing market conditions: Leverage AI for data-driven insights. • Outsmart competitors: Develop AI strategies to gain a competitive edge. • Build superior products: Utilize AI for product innovation and enhanced customer valu",
        },
        {
          q: "What is the structure of this AI for Leaders program?",
          a:
            "The AI for Business Leaders program follows a structured 5-month learning journey, combining recorded lectures, live mentor sessions, and hands-on projects. • Recorded Content: Covers core AI concepts for flexible, self-paced learning. • 13 Live Classes: Led by program faculty and industry experts, including 4 dedicated GenAI sessions. • 7 Industry Sessions: Learn AI's impact across various business sectors. • Hands-on Projects (4) & Capstone Project (1): Apply AI concepts to real-world challenges.",
        },
        {
          q: "What advantages does Texas McCombs provide to this online AI course?",
          a:
            "The AI for Leaders course is in collaboration with McCombs School of Business at The University of Texas at Austin, offering: · Prestigious Affiliation: UT Austin ranks #7 among public universities (US News & World Report) and #4 in MS - Business Analytics (QS World University Rankings, 2023). · World-Class Faculty: The program leverages the expertise of a renowned faculty from Texas McCombs with a proven portfolio of success and cutting-edge research. · Certificate: Earn a course certificate from UT Austin & Great Lakes Executive Learning, enhancing your professional credibility. · By choosing this program, you gain access to a top-ranked university's knowledge, resources, and reputation. T",
        },
        {
          q: "What benefits does this Artificial Intelligence for Leaders program offer?",
          a:
            "This PGP-AI for Leaders program offers several key advantages: • Practical Learning: Industry-specific case studies show real AI applications. • Flexibility: The online format allows learning at your convenience. • Accessibility: No prior coding experience required—ideal for business professionals from any background. • Holistic Approach: Balances AI’s business impact with technical understanding.",
        },
        {
          q: "Who is this program designed for?",
          a:
            "This program is tailored for current and aspiring business leaders aiming to leverage AI strategically. Ideal participants include: · Business Leaders: Managers, Directors, CXOs, and Team Leads who want to drive AI-driven business growth. · AI Initiative Champions: Professionals looking to lead AI projects from strategy to execution. · Internal Change Agents: Those aiming to implement AI for internal process optimization and customer engagement. · Technical Team Liaisons: Leaders managing AI teams and bridging business and technical communications. · Strategic Thinkers: Professionals making AI-related decisions, from technology selection to investment analysis. This program is specifically c",
        },
      ],
    },
  ],
  "iit-bombay-certificate-in-agentic-ai": [
    {
      title: "Certificate Details",
      items: [
        {
          q: "What is the Certificate in Agentic AI?",
          a:
            "This is a five-month online certificate offered by the Department of Computer Science and Engineering at IIT Bombay. Designed for professionals in Technology, Software Development, Data Science, Artificial Intelligence, and Machine Learning, this Agentic AI online course enables learners to build autonomous AI agents that can reason, plan, and act across real-world tasks. The focus is on hands-on implementation using real tools and deployable systems.",
        },
        {
          q: "What makes this certificate different from other Agentic AI programs?",
          a:
            "This certificate, in comparison to other Agentic AI programs, stands out for the following reasons: Designed and delivered by IIT Bombay faculty Developed and taught by the reputed faculty at the Department of CSE at IIT Bombay. Strong technical depth Learners start with core AI foundations and move into agent workflows, architectures, and memory frameworks, planning, reasoning, multi-agent coordination, and reinforcement learning. Hands-on implementation The certificate includes guided labs and practical projects focused on building real agentic systems. Focus on deployment and governance Learners understand human-in-the-loop design, monitoring, guardrails, and responsible deployment practi",
        },
        {
          q: "Is the Certificate in Agentic AI delivered fully online?",
          a:
            "Yes, the certificate is delivered fully online through: · Live interactive sessions by IIT Bombay faculty · Guided lab sessions · Practical projects · Peer discussions and networking This format allows working professionals to participate without taking a career break.",
        },
        {
          q: "What is the duration of the Certificate in Agentic AI?",
          a:
            "The duration is five months.",
        },
        {
          q: "What will I learn in this certificate program in Agentic AI?",
          a:
            "By the end of this certificate, you will be able to: · Design and implement intelligent agents that plan, reason, act, and collaborate across multi-step tasks. · Apply Tool-Augmented Generation (TAG) and Model Context Protocol (MCP) to enable agents to access, leverage, and retain relevant knowledge within workflows. · Develop multi-agent systems for coordinated decision-making and complex problem-solving. · Deploy and operate agentic applications in real-world environments with appropriate safeguards. · Apply Agentic AI techniques to real-world business use cases. These outcomes ensure working professionals are equipped with industry-leading, production-ready Agentic AI skills.",
        },
      ],
    },
    {
      title: "Faculty, Curriculum and Projects",
      items: [
        {
          q: "Who will be teaching this Certificate?",
          a:
            "The certificate is delivered by faculty from the Department of Computer Science and Engineering at IIT Bombay. It is led by Dr. Arpit Agarwal, Assistant Professor at IIT Bombay. His work focuses on Human-AI interaction and responsible AI systems.",
        },
        {
          q: "Is the Agentic AI program self-paced or instructor-led?",
          a:
            "This is an instructor-led certificate delivered through scheduled live sessions, guided labs, and structured project work, with support from IIT Bombay faculty.",
        },
        {
          q: "What topics are covered in this Certificate in Agentic AI?",
          a:
            "The curriculum of this certificate is divided into four modules: Module 1: Foundations of Agentic Systems Python refresher, AI and LLM fundamentals, transformer architecture, sampling methods, and prompt engineering. Module 2: Agentic AI Fundamentals Agent workflows, tool usage, routing patterns, memory systems (RAG), vector databases, MCP, and orchestration with LangGraph and CrewAI. Module 3: Advanced Agentic Systems Planning and reasoning techniques (CoT, ReAct), reflection mechanisms, reinforcement learning basics, DSPy, and multi-agent coordination. Module 4: AI Agents in the Real World Human-in-the-loop design, alignment, prompt security, guardrails, monitoring, evaluation, and deploym",
        },
        {
          q: "What kind of projects will I work on?",
          a:
            "You will build practical systems, and here are some of the sample projects for reference: 1. The \"Analyst\" Agent Build a single agent that can search the web and summarise financial news. Concepts Covered: Tool usage (Search API), Prompt Engineering, and Structured Output. 2. Customer Support Agent A RAG-based customer support chatbot to address the frequently asked questions (FAQs) and escalate to a human operator if a customer needs specialized assistance. Concepts covered: Natural Language Processing (NLP), LLM Integration, Agentic Frameworks (LangChain), Retrieval Augmented Generation (RAG), Human-in-the-loop (for escalated cases). 3. The \"Event Planner\" Crew A team of agents collaborate",
        },
        {
          q: "Will I build real-world AI agents during the certificate?",
          a:
            "Yes. You will build practical agentic systems, including autonomous agents, multi-agent workflows, and deployable applications using industry-relevant tools and frameworks. Eligibility, Registration & Fees",
        },
      ],
    },
    {
      title: "Eligibility, Registration & Fees",
      items: [
        {
          q: "What is the eligibility for the Certificate in Agentic AI?",
          a:
            "Learners should have a Bachelor’s or Master’s degree in Engineering from a recognised university with a minimum aggregate of 50 % (or equivalent CGPA) and at least 2 years of relevant work experience. Prior exposure to programming is required.",
        },
        {
          q: "Can working professionals pursue this Agentic AI course online?",
          a:
            "Yes. The Certificate in Agentic AI is delivered fully online through live, interactive sessions conducted by IIT Bombay faculty. The schedule is structured to accommodate working professionals, with an expected commitment of approximately 4 to 6 hours per week.",
        },
        {
          q: "Do I need coding experience for this Agentic AI certificate?",
          a:
            "Yes. Prior exposure to programming is required. Learners are expected to be comfortable with basic programming concepts to build and work with AI agents.",
        },
        {
          q: "Is this Agentic AI certificate suitable for software engineers?",
          a:
            "Yes. This certificate is well-suited for software engineers who want to design, build, and deploy autonomous AI agents and integrate agentic systems into real-world applications.",
        },
        {
          q: "What is the total fee for this Certificate?",
          a:
            "The total fee is ₹1,80,000 + 18% GST. For flexible payment options, you may contact the Registration Team.",
        },
      ],
    },
    {
      title: "Career-Related Queries",
      items: [
        {
          q: "Do I need to leave my job to pursue this Certificate?",
          a:
            "No. The certificate is designed for working professionals and delivered online.",
        },
        {
          q: "How can this online Agentic AI course help my career?",
          a:
            "This certificate prepares you to: · Design and deploy autonomous AI agents · Build scalable multi-agent systems · Implement governance and monitoring in AI deployments · Move from experimentation to production-ready agentic applications It strengthens your ability to work on advanced AI systems in technical roles.",
        },
        {
          q: "Who is this Certificate in Agentic AI meant for?",
          a:
            "This certificate is suited for: · Data and AI professionals · Software Development and Technology Professionals · Technology Consultants and · Technical Leaders Others",
        },
      ],
    },
  ],
  "certificate-in-ai-engineering-and-mlops": [
    {
      title: "Program details",
      items: [
        {
          q: "What is the Certificate in AI Engineering and MLOps?",
          a:
            "This is a five-month online certificate offered by IIT Bombay. Designed for professionals transitioning from data or software roles into specialized AI Engineering positions, this certificate establishes the technical foundation for building and managing the large computational systems required for modern AI workflows.",
        },
        {
          q: "Is the Certificate in AI Engineering and MLOps delivered fully online?",
          a:
            "The curriculum is delivered primarily online through weekly live interactive sessions, guided labs, and projects. However, the program also features a campus immersion at IIT Bombay.",
        },
        {
          q: "What is the duration of the certificate?",
          a:
            "The duration is five months.",
        },
        {
          q: "What will I learn in this certificate?",
          a:
            "By the end of this certificate, you will be able to: · Design parallel algorithms and implement scalable machine learning models using shared and distributed memory paradigms. · Deploy distributed training using high-performance compute clusters and job schedulers. · Orchestrate containerized workflows using modern platforms. · Engineer scalable data pipelines capable of handling massive datasets. · Implement production MLOps by designing automated CI/CD pipelines, experiment-tracking systems, and monitoring frameworks.",
        },
        {
          q: "Is this certificate more focused on AI or MLOps?",
          a:
            "It covers both, but with a strong emphasis on AI Engineering at scale: · AI → LLMs, scaling and operating them, parallelism · MLOps → CI/CD, monitoring, deployment The goal is to help you build AI systems, not just train models.",
        },
      ],
    },
  ],
  "iit-bombay-certificate-generative-ai": [
    {
      title: "Program details",
      items: [
        {
          q: "What is unique about Certificate in Generative AI by IIT Bombay?",
          a:
            "The Certificate in Generative AI by IIT Bombay stands out from other Generative AI courses in several ways: Expert-led learning: Designed and delivered by IIT Bombay faculty, ensuring a rigorous and high-quality curriculum. Practical industry focus: Includes hands-on projects using advanced Generative AI tools to build real-world applications. Enterprise-ready approach: Emphasizes adapting Large Language Models (LLMs) to enterprise data through Retrieval-Augmented Generation (RAG) and creating agentic applications. Interactive learning experience: Participants benefit from weekly live sessions, peer learning, networking opportunities, and dedicated Program Manager support. Recognized certifi",
        },
        {
          q: "What is the format and structure of this Certificate in Generative AI?",
          a:
            "The Certificate in Generative AI is a 5-month, online, hands-on certificate. · The curriculum takes a practical, LLM-first approach across 6 modules. · Learners will start with the essentials of how AI works, then learn the basics of Large Language Models (LLMs) · Followed by how to write effective prompts and how to judge the quality of results. · Learners will also adapt models according to their own data using simple retrieval and light tuning. · Explore how to build helpful “copilot” tools and multi-step workflows, and finally learn how to launch, secure, and maintain what they have built. · This learning is reinforced through hands-on projects and practice.",
        },
        {
          q: "Who is this for?",
          a:
            "Software and Technology Professionals who want to add Generative AI features to products, stay current with evolving tools, and unlock new career opportunities at the intersection of software and AI. · Data Scientists and Data Analysts looking to move beyond prediction into text, image, and code generation to automate reporting and extract more value from existing data. · Technology Consultants and Technical Managers seeking to evaluate Generative AI options, lead cross-functional builds, manage risks, and present clear ROI cases to clients and stakeholders. · Product Managers and Product Owners aiming to embed Generative AI into product features and workflows to boost user value and acceler",
        },
        {
          q: "What are the learning outcomes of the Certificate in Generative AI?",
          a:
            "The learning outcomes of the Certificate in Generative AI from IIT Bombay are: · To design reliable workflows using Large Language Models (LLMs). · Adapt foundation models to enterprise data with Retrieval-Augmented Generation (RAG). · Build agentic applications that plan tasks, call tools and APIs, manage memory, and coordinate multi-step workflows for business use-cases. · Deploy and operate Generative AI systems using LLMOps practices. · Implement governance and security by embedding privacy controls.",
        },
        {
          q: "Who teaches the Certificate in Generative AI?",
          a:
            "Certificate in Generative AI is designed and delivered by the experienced faculty of IIT Bombay.",
        },
      ],
    },
  ],
  "iit-bombay-supply-chain-analytics-with-ai-ml-applications": [
    {
      title: "Course Details",
      items: [
        {
          q: "What is unique about this supply chain analytics course?",
          a:
            "This blend of academic rigour, AI integration, practical focus, and interactive delivery makes the course uniquely effective for supply chain professionals aiming to advance their expertise and impact in the field.",
        },
        {
          q: "How will the course be delivered?",
          a:
            "The course is delivered entirely online through a mix of live, interactive sessions and video recordings",
        },
        {
          q: "Who will be in my peer group?",
          a:
            "Your peers will be other professionals, including: · Professionals responsible for inventory and supply chain management · Data and business intelligence professionals working in logistics, procurement, inventory, or operations · Supply chain consultants and strategy professionals · Emerging leaders in manufacturing, retail, e-commerce, or related domains who are participating in the course.",
        },
        {
          q: "Will I receive a certificate after completing this course?",
          a:
            "Upon successful completion, learners will get the Certificate of Completion for Supply Chain Analytics with AI and ML Applications from IIT Bombay.",
        },
        {
          q: "What topics are covered in this supply chain analytics course?",
          a:
            "The supply chain analytics course covers topics including: · Data-driven supply chain analytics · Supply chain network design and optimization · Demand forecasting and planning · Data-driven inventory models · Transportation and risk analysis It focuses on optimization, simulation, statistical modeling, AI/ML techniques and their applications for scenario planning and decision making in logistics, procurement, inventory, and supply chain management.",
        },
      ],
    },
    {
      title: "Faculty, Curriculum and Projects",
      items: [
        {
          q: "What is the course structure?",
          a:
            "The course consists of a cohesive five-module curriculum covering: · Data-driven supply chain analytics · Supply chain network design and optimization · Demand forecasting and planning · Data-driven inventory models · Transportation and risk analysis It blends theoretical learning with hands-on case studies and scenario-based discussions",
        },
        {
          q: "Who will deliver the lectures?",
          a:
            "Lectures are designed and delivered by leading faculty from the Indian Institute of Technology, Bombay. The course is currently led by Prof. Priyank Sinha, Assistant Professor in the Industrial Engineering and Operations Research Department. His teaching and research interests broadly cover network optimization techniques applied to supply chains, transportation, and logistics problems.",
        },
        {
          q: "How many modules do I need to complete under this course?",
          a:
            "For this Supply Chain Analytics Certificate Online course, you need to successfully complete all the five modules.",
        },
        {
          q: "Who has designed the curriculum?",
          a:
            "The curriculum is designed and delivered by leading faculty from the Indian Institute of Technology, Bombay.",
        },
        {
          q: "Who will conduct the sessions?",
          a:
            "The sessions are conducted by IIT Bombay faculty.",
        },
      ],
    },
    {
      title: "Eligibility, Registration & Fees",
      items: [
        {
          q: "What is the eligibility for this Supply Chain Analytics Online Course?",
          a:
            "The eligibility criteria for the Certificate in Supply Chain Analytics with AI and ML Applications at IIT Bombay are: Bachelor’s degree (any discipline) from a recognised university with a minimum aggregate of 50% (or equivalent CGPA) or 5+ years relevant experience. Advantageous but not mandatory: · Basic familiarity with elementary statistics and spreadsheet tools (e.g., MS Excel) and exposure to programming languages such as Python or R. · Professional experience in supply chain, operations, logistics, procurement, inventory management, analytics, or related functional areas.",
        },
        {
          q: "What is the selection process to pursue this course?",
          a:
            "Step 1: Application Interested candidates can apply by filling out a simple online application form. Step 2: Interview Process Go through a mandatory screening call with the registration office. Step 3: Offer of Registration Selected candidates will receive an offer letter. They must pay the registration fee to confirm their seat and complete the registration.",
        },
        {
          q: "Is there any financial assistance provided to candidates?",
          a:
            "Yes, financial assistance options are available to candidates through Great Learning. We have partnerships with financial service providers such as Propelld, eduvanz, and Liquiloans, which offer education loans and financial aid. *Conditions apply, and candidates are advised to reach out to the admissions office at 080 4680 1927 for more details regarding financial assistance.",
        },
        {
          q: "What is the total fee for completing the Supply Chain Analytics Online course?",
          a:
            "The total course fee is ₹1,50,000 + GST, with special inaugural offers available for the first cohort.",
        },
      ],
    },
    {
      title: "Career-Related Queries",
      items: [
        {
          q: "Do I need to quit my job to pursue this supply chain analytics online course?",
          a:
            "All live sessions are conducted on weekends. You can advance your skills without disrupting your current professional commitments.",
        },
        {
          q: "How will the course help me progress in my career?",
          a:
            "The course is designed to position learners to drive AI-enabled, data-driven transformation initiatives across logistics, procurement, inventory, and supply chain planning, making them suitable for advanced roles in supply chain, operations, analytics, and consulting.",
        },
        {
          q: "What skills and competencies will I gain from this supply chain analytics course?",
          a:
            "From the Certificate in Supply Chain Analytics with AI and ML Applications course at IIT Bombay, learners will gain skills and competencies to: · Generate accurate, insight-rich demand plans · Determine optimal inventory and replenishment policies under uncertainty · Configure resilient supply chain networks and supplier portfolios · Optimize transportation and mitigate multi-factor risks using analytics · Make data-driven, end-to-end supply chain decisions These skills enable learners to leverage data and AI to drive transformation initiatives across logistics, procurement, inventory, and supply chain planning.",
        },
      ],
    },
  ],
  "dba-aiml-online": [
    {
      title: "Program details",
      items: [
        {
          q: "What is the DBA in Artificial Intelligence (AI/ML) program about?",
          a:
            "The Doctor of Business Administration (DBA) in Artificial Intelligence and Machine Learning is a doctoral-level program designed to help professionals understand, apply, and lead AI and ML initiatives in business contexts. The program combines rigorous academic foundations with real-world applications, enabling learners to use AI and ML for data-driven decision-making and organizational leadership",
        },
        {
          q: "Are the Master's Degree and Doctorate WES-approved?",
          a:
            "Yes. Walsh College is recognized by the World Education Services (WES). Students can showcase their educational accomplishments with a verified WES report that is accepted and respected by licensing boards, academic institutions, and employers throughout the US and Canada.",
        },
        {
          q: "What is the duration and mode of the DBA in the Artificial Intelligence and Machine Learning program?",
          a:
            "The program is 3 years long and offered 100% online.",
        },
        {
          q: "How is the Walsh DBA better than other doctorate degrees in Business Administration?",
          a:
            "#1 Ranking for Best Online DBA Programs by Forbes; Awarded Top-Tier Global DBA Ranking by CEO Magazine ; WES recognized; Accredited by The Higher Learning Commission (HLC), a regional accreditation agency recognized by the U.S. Department of Education.",
        },
        {
          q: "Why should you choose this DBA course in AIML?",
          a:
            "The program is ranked among the Top 10 Best Online DBA Degrees, is 100% online, and integrates advanced AI and ML with business strategy and applied research. It is designed for professionals seeking doctoral-level expertise with real-world relevance",
        },
      ],
    },
  ],
  "mba-dba-gm-walsh": [
    {
      title: "Program Details",
      items: [
        {
          q: "What is the duration of the DBA in General Management program?",
          a:
            "The program is designed to be completed in 3 years with a 100% online learning format, offering flexibility for working professionals.",
        },
        {
          q: "Do I need GRE, GMAT, or TOEFL scores to apply?",
          a:
            "No, the application process is simple and does not require GRE, GMAT, or TOEFL scores.",
        },
        {
          q: "What will I earn upon completing the program?",
          a:
            "Graduates receive a DBA and MBA dual degrees from Walsh College and Great Lakes. Get an alumni status from Walsh College.",
        },
        {
          q: "What are the key highlights of this program?",
          a:
            "Ranked #1 in Forbes' Best Online DBA Degrees (2024) · Top-tier Global DBA by CEO Magazine · Hands-on projects and case studies · Live sessions with top faculty and industry experts",
        },
        {
          q: "What are the eligibility criteria for the program?",
          a:
            "Applicants must have: · A bachelor’s degree (3 or 4 years) with a minimum of 60% marks from a UGC-recognized institution · English as the medium of instruction · No GRE/GMAT or English proficiency test requirements",
        },
      ],
    },
  ],
  "iit-bombay-pg-diploma-ai-data-science": [
    {
      title: "ePGD Details",
      items: [
        {
          q: "What is the e-Postgraduate Diploma in Artificial Intelligence and Data Science from IIT Bombay?",
          a:
            "The e-Postgraduate Diploma (ePGD) in Artificial Intelligence and Data Science from IIT Bombay provides professionals with advanced expertise in AI and Data Science through a comprehensive six-course curriculum. Designed and delivered by IIT Bombay faculty, the ePGD covers topics such as Machine Learning, Deep Learning, Generative AI, and Natural Language Processing (NLP). This synchronous online diploma includes hands-on assessments and in-person end-term examinations at the IIT Bombay campus. Candidates are required to complete 36 credits to earn the ePGD certificate.",
        },
        {
          q: "What is the format of the ePGD from IIT Bombay?",
          a:
            "The ePGD is delivered in a synchronous online mode with live sessions conducted by IIT Bombay faculty. Candidates are required to visit the IIT Bombay campus for in-person end-term examinations and the convocation ceremony.",
        },
        {
          q: "How many credits will I earn during the online PG Diploma in Artificial Intelligence and Data Science?",
          a:
            "Candidates must complete 36 IIT Bombay credits through a mix of core and elective courses. Credits earned will be stored in the candidate’s Academic Bank of Credits (ABC) account and can be utilized as per ABC guidelines.",
        },
        {
          q: "What will I receive after completing the ePGD in Artificial Intelligence and Data Science?",
          a:
            "Upon successful completion of all course requirements, candidates will be awarded an e-Postgraduate Diploma (ePGD) in Artificial Intelligence and Data Science from IIT Bombay. The diploma will be conferred during an in-person convocation ceremony at IIT Bombay. Graduates will also receive IIT Bombay eAlumni status and the associated benefits.",
        },
        {
          q: "What is the time commitment for this ePGD?",
          a:
            "You should expect to spend around 12–14 hours per week on live sessions, self-study, and assignments. The ePGD schedule is designed to accommodate working professionals, with sessions conducted on weekdays after working hours and on weekends.",
        },
      ],
    },
    {
      title: "Faculty, Curriculum and Projects",
      items: [
        {
          q: "Who are the faculty teaching the ePGD in Artificial Intelligence and Data Science?",
          a:
            "The ePGD is taught by IIT Bombay’s faculty, renowned experts in AI, Data Science, and Machine Learning. Some of the faculty members include: Faculty Member Designation & Department Qualification Research Interests Biplab Banerjee Associate Professor, Centre of Studies in Resources Engineering (CSRE) Ph.D. Computer Vision, Image Processing, Satellite Image Analysis, Deep Learning, Advanced Machine Learning Sudeep Bapat Assistant Professor, SJM School of Management Ph.D., University of Connecticut Sequential Analysis, Change Point Detection, Time Series, Statistical Inference, Linear Models, Survival Analysis Vinay Kulkarni Adjunct Professor, Centre for Machine Intelligence and Data Science (C",
        },
        {
          q: "How will the ePG Diploma in Artificial Intelligence and Data Science prepare me to tackle real-world problems?",
          a:
            "The curriculum integrates practical learning through case studies, projects, and a capstone project that allows candidates to apply Artificial Intelligence and Data Science concepts to real-world challenges. Through these components, candidates develop problem-solving, analytical, and implementation skills essential for addressing industry-relevant use cases.",
        },
        {
          q: "What is the structure of the ePGD Artificial Intelligence and Data Science curriculum?",
          a:
            "The e-Postgraduate Diploma comprises six IIT Bombay courses totaling 36 credits. The curriculum includes a balanced mix of core and elective courses, ensuring a strong foundation in Artificial Intelligence and Data Science. The courses offered are: · Programming for Machine Learning and Data Science · Statistical Foundations of Machine Learning · Machine Learning · Deep Learning and Generative AI · AI-ML in Practice (includes a Capstone Project) · One elective course in specialized areas such as Natural Language Processing, Internet of Things (IoT), or Computer Vision. (Note: Curriculum changes, if any, will be under the purview of IIT Bombay.)",
        },
        {
          q: "What languages and tools will I work with?",
          a:
            "Candidates will work with tools and programming languages widely used in Artificial Intelligence and Data Science, such as Python, SQL, TensorFlow/Keras, PyTorch, Docker, Kubernetes, and more. Additional open-source tools may be introduced at the discretion of the faculty to support course objectives.",
        },
        {
          q: "Can the curriculum change during the ePGD?",
          a:
            "Yes, the curriculum is periodically reviewed and updated by IIT Bombay faculty to ensure it aligns with industry trends and technological developments. Any updates will be communicated to registered learners.",
        },
      ],
    },
    {
      title: "Eligibility, Registration & Fees",
      items: [
        {
          q: "Who can apply for the ePGD in Artificial Intelligence and Data Science?",
          a:
            "Candidates must hold either a recognized four-year undergraduate degree or a recognized three-year undergraduate degree with at least one year of relevant work experience. A background in Mathematics and Statistics at the undergraduate level is required. Postgraduate and doctoral degree holders are also eligible to apply.",
        },
        {
          q: "Is work experience mandatory for applying to the ePGD?",
          a:
            "Work experience in relevant domains is recommended but not mandatory. Fresh graduates meeting the eligibility criteria can also apply.",
        },
        {
          q: "Is a GATE score required for registration?",
          a:
            "No, a GATE score is not required for registration. The e-Postgraduate Diploma is open to all eligible candidates who meet the academic requirements.",
        },
        {
          q: "What is the application and registration process?",
          a:
            "The registration process comprises three steps: 1. Application: Candidates must submit an online application form. 2. Online Test and Screening: Candidates will take an online test to assess foundational knowledge, followed by a screening call with the Registration Office. 3. Offer of Registration: Selected candidates will receive an offer letter and must pay the registration fee within seven days to confirm their seat.",
        },
        {
          q: "Can Overseas Citizens of India (OCI) apply for the ePGD?",
          a:
            "Yes, Overseas Citizens of India (OCI) who have completed their higher education in India may apply for the ePGD, provided they can fulfill all ePGD requirements and attend the in-person examinations on the IIT Bombay campus.",
        },
      ],
    },
    {
      title: "Career-Related Queries",
      items: [
        {
          q: "Will IIT Bombay provide career or placement support?",
          a:
            "Successful ePGD graduates will gain access to IIT Bombay’s Lateral Hiring Group, managed by the IIT Bombay Placement Cell. Job postings and lateral opportunities are shared within this group. Candidates are responsible for their own job applications. Campus placement opportunities are not provided for ePGD participants.",
        },
        {
          q: "How will this ePGD help advance my career?",
          a:
            "The e-Postgraduate Diploma equips candidates with advanced expertise in Artificial Intelligence and Data Science, enabling them to: · Design and deploy AI/ML-based solutions for real-world business problems. · Develop a strong foundation in data-driven decision-making. · Apply cutting-edge techniques such as Deep Learning, Generative AI, and NLP. · Enhance career prospects in AI, Machine Learning, and Data Science roles across industries.",
        },
        {
          q: "Do candidates need to leave their jobs to pursue this ePGD?",
          a:
            "No. The ePGD is designed for working professionals. Live sessions are scheduled on weekday evenings and weekends, allowing candidates to balance academic and professional commitments.",
        },
        {
          q: "Will I become an IIT Bombay alumnus after completing the ePGD?",
          a:
            "Yes. Upon successful completion of all ePGD requirements, candidates will receive IIT Bombay eAlumni status. They may apply for IIT Bombay eAlumni Association (IITBAA) Life Membership to access eAlumni privileges, including the IIT Bombay eAlumni email ID, campus access using the eAlumni card, networking groups, and participation in eAlumni events.",
        },
        {
          q: "Does the ePGD support peer-to-peer learning and networking?",
          a:
            "Yes. The ePGD encourages collaborative learning through group discussions, peer projects, and a capstone project. Candidates also interact with faculty and peers during on-campus examinations and the convocation ceremony.",
        },
      ],
    },
  ],
  "iit-bombay-e-postgraduate-diploma-e-mobility": [
    {
      title: "Program details",
      items: [
        {
          q: "What is the e-Postgraduate Diploma in E-Mobility from IIT Bombay?",
          a:
            "The ePGD in E-Mobility is an 18-month online diploma offered by IIT Bombay through the C1973 EV Power Train Lab. The ePGD includes six courses covering electric vehicles, batteries, power electronics, electric drives, grid integration, design, and manufacturing. On completion, you will earn 36 IIT Bombay credits, including mandatory in-person end-term exams at the IIT Bombay campus. On completion of this ePGD in E-Mobility, you will receive IIT Bombay eAlumni status.",
        },
        {
          q: "Is the ePGD in E-Mobility delivered fully online?",
          a:
            "Yes. All live classes are conducted online by IIT Bombay faculty. All end-term exams are conducted in person at IIT Bombay, or any other designated location, and attendance is mandatory for passing each course. In addition, students will be invited to campus for the graduation ceremony at the end of their diploma.",
        },
        {
          q: "How many credits will I earn during the ePGD in E-Mobility?",
          a:
            "Students are required to complete 36 IIT Bombay credits across six courses: · Two core courses · Four electives These credits can be saved in the Academic Bank of Credits (ABC) and may be used for future higher education as per UGC guidelines.",
        },
        {
          q: "How can the credits earned in the ePGD be used?",
          a:
            "The ePGD requires completion of 36 IIT Bombay credits, which are stored in your Academic Bank of Credits (ABC) account. After earning the credits, you have two options: Apply for the ePGD diploma from IIT Bombay: · All 36 credits are utilized. · You will be formally awarded the e-Postgraduate Diploma and granted IIT Bombay eAlumni status. · Once used for the diploma, the credits cannot be reused for other courses. Retain credits for higher education: · If you do not apply for the diploma, your credits remain in your ABC account. · These can be used for pursuing higher degrees as per the policies of the admitting institution. · In this case, you will not be recognized as an IIT Bombay alumnus",
        },
        {
          q: "What is the weekly time commitment for the ePGD in E-Mobility?",
          a:
            "You should plan for about 6–8 hours a week for live online sessions, along with 4–6 hours for self-study, projects, and assignments. The weekly commitment is around 12–14 hours. It includes: · Live online sessions (6-8 hours) · Additional time for self-study, projects, and assignments (4–6 hours). Multiple courses may run simultaneously. You may need to adjust your schedule accordingly to manage overlapping coursework.",
        },
      ],
    },
  ],
  "advanced-management-programme-in-ai-leadership": [
    {
      title: "Program details",
      items: [
        {
          q: "I'm a senior manager who wants to use AI to make better decisions. Is this Program designed to teach this without requiring a tech background?",
          a:
            "Yes, the Executive Program in AI for Business Leaders offered by the S. P. Jain Institute of Management & Research (SPJIMR) is explicitly designed for your profile. It is a 7-month blended Program tailored specifically for mid-to-senior professionals, functional heads, and business unit leaders who want to leverage AI as a strategic enabler. The Program is primarily no-code and does not require any prior coding experience. It is specifically built for leaders who want to govern AI initiatives without having to become technical specialists.",
        },
        {
          q: "What will I actually be able to do differently at work after completing an AI leadership Program?",
          a:
            "After completing the Program, you will be able to confidently lead AI initiatives, identify high-impact business use cases, and make informed AI-driven decisions. You will gain the skills to manage AI projects and technical teams, design workflow automation using Agentic AI, use tools like ChatGPT and Power BI for business problem-solving, implement responsible AI practices, and drive organisation-wide AI adoption and workforce transformation. Depending on your specialisation, you will also learn to apply AI solutions in domains such as: · Finance: Improve fraud detection, credit risk assessment, lending decisions, and customer personalisation using AI. · Marketing: Build AI-powered customer",
        },
        {
          q: "Will completing an executive AI Program from a top B-school help me access senior leadership roles or board-level networks?",
          a:
            "Yes, completing the Executive Program in AI for Business Leaders from SPJIMR can significantly enhance your access to senior leadership roles and elite professional networks. Here is how the Program specifically supports your networking and career progression goals: · Access to Global Leadership Roles · Elite 18,000+ Alumni Network · Board-Level and Senior Connections · Peer-to-Peer Cross-Industry Learning and Networking Opportunities",
        },
        {
          q: "Is SPJIMR a ranked business school?",
          a:
            "Yes, SPJIMR is consistently ranked among the top 10 B-schools in India. Key 2025/2026 rankings include: #1 in India and #74 in the World (Financial Times Global MBA Ranking 2026). #20 in India (MHRD's NIRF Management Category 2025). #3 in India (All-India Private B-School Business Today MDRA India’s Best B-Schools Ranking 2025)",
        },
        {
          q: "Will I receive a certificate after completing this AI leadership Program?",
          a:
            "Yes, upon successful completion, you will receive a Certificate of Completion from the S.P. Jain Institute of Management & Research, Mumbai. This AI leadership certificate Program validates your ability to lead AI initiatives, drive strategy, and implement AI solutions in real business environments.",
        },
      ],
    },
  ],
  "executive-certificate-programme-in-ai-and-gen-ai-for-managers": [
    {
      title: "Program details",
      items: [
        {
          q: "What is the duration and format of the SPJIMR AI for Managers programme?",
          a:
            "The programme is a 5-month Artificial Intelligence online course designed for working professionals and business leaders. It blends pre-recorded faculty sessions, weekly live mentored learning, and monthly masterclasses, making it ideal for those looking for an AI course for managers with flexibility.",
        },
        {
          q: "What certificate will I receive after completing the Executive Certificate Programme in Artificial Intelligence and Generative AI for Managers?",
          a:
            "Learners who successfully complete the programme will earn a Certificate of Completion from S.P. Jain Institute of Management & Research (SPJIMR), a Triple Crown-accredited business school.",
        },
        {
          q: "Who are the faculty members leading the programme?",
          a:
            "The programme is directed by distinguished SPJIMR faculty: • Prof. Abhishek Kumar Jha: Programme Director and Assistant Professor in Information Management and Analytics. • Prof. Debmallya Chatterjee: Co-Programme Director and Professor in Operations and Supply Chain Management. • Prof. Ashish Desai: Associate Professor with extensive experience in technology-driven financial services.",
        },
        {
          q: "What are the core modules covered in the curriculum of this AI and Generative AI course for Managers?",
          a:
            "This programme has an industry-focused curriculum divided into four modules: • Module 1: Foundations of AI and GenAI for Managers. • Module 2: AI Strategy, ROI, and Core Building Blocks of AI Systems. • Module 3: Advanced GenAI Systems and Agentic Workflows. • Module 4: Functional Applications, India Context, and Responsible Scaling.",
        },
        {
          q: "What kind of hands-on projects will I work on?",
          a:
            "Learners build an AI project portfolio through various assignments, including: • Local RAG Chatbot: Developing a system over domain-specific documents like HR manuals or product catalogues. • Production-Simulated AI System: Adding monitoring, evaluation, and maintenance layers to an AI deployment. • Enterprise Responsible AI Framework: A capstone project focused on governance, risk classification, and implementation roadmaps.",
        },
      ],
    },
  ],
  "pg-program-management-executive": [
    {
      title: "Program Details",
      items: [
        {
          q: "Can I complete this Management program while working a full-time job, and how much time does it require?",
          a:
            "Yes, this Executive PG Program in Management follows an online learning model consisting of live virtual classes, recorded lectures, and guided capstone projects, ensuring cutting-edge online learning for busy professionals. The duration of this program is 12 Months.",
        },
        {
          q: "Which specialization should I choose if I want to build expertise in business analytics, operations, or marketing?",
          a:
            "If you want to build expertise in those specific areas, the PGPMEx program is uniquely structured to meet your needs, as it integrates analytics with core business functions. You do not need to choose between business/data analytics and the other fields. Instead, the program offers two integrated specializations that combine Data Science & Analytics with either marketing or operations. Based on your interests, you can choose between these two options: · Data Science & Analytics and Marketing: Choose this if you want to apply analytical models and data-driven insights to marketing strategies, consumer behavior, and campaign performance. · Data Science & Analytics and Operations: Choose this i",
        },
        {
          q: "How valuable is an Executive PG Program certificate for career advancement and leadership opportunities?",
          a:
            "An Executive PG Program certificate, such as the PGPMEx, is highly valuable for professionals looking to accelerate their career growth and transition into leadership roles. The program combines business fundamentals, analytics-driven decision-making, and practical projects to develop skills that employers value in today's workplace. Its value is further strengthened through dedicated career support, including resume guidance, interview preparation, career mentoring, access to opportunities from 3,000+ organizations, and an e-portfolio that showcases applied skills. This makes it a strong 1-year executive MBA equivalent for working professionals in India, designed to deliver industry-relevan",
        },
        {
          q: "How is an Executive PG Program in Management different from an online Executive MBA?",
          a:
            "For working professionals searching for an Executive MBA program or an Executive program in Business Management, PGPMEx presents a practical, online alternative focused on applied management skills. It offers live virtual classes, recorded lectures, and hands-on projects, allowing learners to upskill without pausing their careers.",
        },
      ],
    },
    {
      title: "Faculty, Curriculum and Projects",
      items: [
        {
          q: "Will this program help me develop leadership, business analytics, and strategic decision-making skills?",
          a:
            "Yes, PGPMEx is designed to help working professionals develop leadership, business analytics, and strategic decision-making skills. The program prepares learners for managerial and leadership roles through a combination of management concepts, analytics-driven learning, and real-world business applications. With specializations that integrate business analytics with marketing or operations, learners gain practical experience in using data to solve business challenges and make informed decisions. Hands-on projects and a capstone project further strengthen the ability to apply analytical insights, develop strategic thinking, and create business value in leadership roles.",
        },
        {
          q: "Are there hands-on projects included in the program?",
          a:
            "Yes, the program includes hands-on projects and a capstone project to enhance practical learning.",
        },
        {
          q: "Who teaches the PGPMEx program?",
          a:
            "The courses are taught by faculty members and industry experts, ensuring cutting-edge online learning with real-world relevance.",
        },
      ],
    },
    {
      title: "Eligibility, Admissions, and Fees",
      items: [
        {
          q: "What are the eligibility criteria for this Executive program in Business Management?",
          a:
            "Applicants must hold a bachelor’s degree or equivalent in any discipline with a minimum of 50% marks (45% for SC/ST/OBC candidates) from a recognized university or institution.",
        },
        {
          q: "What is the admission process for PGPMEx?",
          a:
            "Step 1: Application Form Register by filling up the online application form and provide some basic details. Step 2: Screening Go through a screening call with the Admissions Director’s office. Step 3: Join the Program If selected, you will receive a letter for the upcoming cohort. Secure your seat by paying the admission fee.",
        },
        {
          q: "Is this Executive PG Program suitable for working professionals?",
          a:
            "Yes, the Executive PG Program in Management (PGPMEx) is designed for professionals who want to advance into managerial and leadership roles. It is ideal for: Early-career professionals (1–3 years of experience) Those who want to accelerate their career growth with cutting-edge management skills from one of India’s leading B-schools. Mid- to senior-level professionals (4 or more years of experience) Those who wish to accelerate their careers and transition from technical to managerial roles.",
        },
        {
          q: "What is the fee for PGPMEx?",
          a:
            "For a detailed fee breakup or clarifications, reach out to your Program Advisor.",
        },
      ],
    },
    {
      title: "Career-Related Queries",
      items: [
        {
          q: "How can an online Executive MBA equivalent program boost my career?",
          a:
            "An online Executive MBA equivalent program can boost your career by helping you develop the management, leadership, and analytical skills needed to take on greater responsibilities and advance into leadership roles. It is particularly valuable for working professionals looking to accelerate career growth, transition into management, or strengthen their business decision-making capabilities.",
        },
        {
          q: "What are the Job Options After this online Executive MBA equivalent program?",
          a:
            "After completing this online Executive MBA equivalent program, professionals can pursue a wide range of managerial, leadership, and analytics-driven roles across industries. The program is particularly valuable for those looking to transition from technical or functional positions into management roles or accelerate their progression into leadership positions. Depending on your experience level and specialization, potential career paths may include Team Manager, Project Manager, Operations Manager, Business Analyst, Marketing Manager, Product Manager, Strategy Manager, and other leadership-focused roles. The combination of business management knowledge, analytics expertise, and practical pro",
        },
        {
          q: "What practical management and business skills will I develop that employers value today?",
          a:
            "An Executive PG Program in Management can help you move into managerial and leadership roles by developing the business, analytical, and strategic skills needed to lead teams and drive organizational growth. PGPMEx by Great Lakes Executive Learning is designed for working professionals who want to accelerate their careers, transition from technical to managerial positions, or prepare for greater leadership responsibilities. Through an industry-focused curriculum, hands-on projects, and a capstone project, learners gain practical experience in solving business challenges and making data-driven decisions. The program also provides career mentoring, resume and interview support, and access to o",
        },
        {
          q: "Is the Executive Manangement Program suitable for those looking for an online Executive MBA alternative?",
          a:
            "Yes. The PGPMEx is designed in a flexible online format with live sessions and industry-expert guidance, making it a suitable choice for those seeking an online Executive MBA for working professionals.",
        },
        {
          q: "How can an Executive PG Program in Management help me move into a managerial or leadership role?",
          a:
            "This program is offered by one of India’s leading B-schools. It includes a future-ready curriculum, hands-on projects, and dedicated career support, including an exclusive job board and career mentoring, making it a standout among executive Post-graduate programmes in management.",
        },
      ],
    },
  ],
  "mtech-artificial-intelligence-srm": [
    {
      title: "Program Details",
      items: [
        {
          q: "What is the program structure for M.Tech in Artificial Intelligence ?",
          a:
            "The program is delivered over 4 semesters, including project work. The degree will be awarded at the end of 2 years.",
        },
        {
          q: "What degree will I receive?",
          a:
            "Successful participants will be awarded with an M.Tech Degree in Artificial Intelligence from SRM Institute of Science and Technology. SRMIST is Ranked in the Top 50 Universities in India by *MHRD - NIRF, and has been accredited with the Highest 'A++' Grade by *NAAC. SRMIST is globally rated as ‘Four Star’ University by renowned ranking agency QS and given ‘Diamond’ Rating by QS-IGAUGE in Indian context.",
        },
        {
          q: "How will I be evaluated during the course?",
          a:
            "M.Tech in Artificial Intelligence is a holistic and rigorous program and follows a continuous evaluation scheme. Candidates are evaluated in the courses they undergo through examinations, case studies, quizzes, assignments, and project reports.",
        },
        {
          q: "Where will the classes be held?",
          a:
            "The classes will be held at the SRM Institute of Science and Technology Main Campus in Kattankulathur, Chennai, and online learning platform.",
        },
        {
          q: "Will there be placements at the completion of the course?",
          a:
            "All program participants get access to dedicated career support, that helps you unlock your career potential by highlighting your skills and connecting you to the right opportunities for your next job through the following activities: Access to curated jobs Access a list of jobs relevant to your experience and domain. Leverage our dedicated career support, who’ll recommend the right jobs for you. Interview preparation workshops Familiarise yourself with commonly asked questions that’ll help you crack any technical interview. Use your ePortfolio to showcase your skills and improve your chances of getting hired. Personalised career mentorship Get an expert career mentor personalised to your ex",
        },
      ],
    },
    {
      title: "Fee Related Queries",
      items: [
        {
          q: "What is the course fee? Is there any financial aid provided?",
          a:
            "Please refer to the fee details here . Admissions office will help you in applying for loans once you receive an offer of admission.",
        },
        {
          q: "What is the refund policy for the program?",
          a:
            "Refund policy governed by applicable AICTE refund guidelines",
        },
      ],
    },
    {
      title: "Admission Queries",
      items: [
        {
          q: "What is the eligibility criterion for M.Tech in Artificial Intelligence?",
          a:
            "A basic degree or equivalent in the following with a minimum aggregate of 50% - B.E/B.Tech. (or) M.Sc. (or) MCA.",
        },
        {
          q: "What is the admission process?",
          a:
            "All interested candidates are required to apply for the course through the online application form. The admissions committee will review and shortlist candidates. Shortlisted candidates are required to clear an admissions test followed by a program selection interview. Selected candidates will receive an admission offer letter.",
        },
      ],
    },
  ],
  "ms-data-science-deakin-programme": [
    {
      title: "Program Details",
      items: [
        {
          q: "What is unique about the Deakin University Master of Data Science (Global) program?",
          a:
            "The Master of Data Science (Global) from Deakin University is a 12+12-month online data science degree. This program is split into two parts: foundational and advanced stages. This structure ensures learners gain both practical and in-depth mastery of data science concepts and tools. Key features that set the program apart include: · Expert-Led Learning: Live online lectures delivered by Deakin’s esteemed faculty, complemented by sessions from experienced industry professionals. · Hands-on Experience: Weekly mentorship and real-world projects that reinforce practical skills and application. · Career Advancement Support: Provides robust career enhancement support, including workshops, persona",
        },
        {
          q: "What is the structure of this program?",
          a:
            "Learners have the option of choosing two programs: one is the PG Program in Artificial Intelligence and Machine Learning , and the other is the Postgraduate Program in Data Science (first 12 months) Upon completing either program, you will continue your learning journey with Deakin University’s 12-month online Masters in Data Science (Global) Program.",
        },
        {
          q: "What is the duration of the Master of Data Science Program?",
          a:
            "The duration of the program is 24 months (12 months PG certificate + 12 months Deakin Master’s degree) .",
        },
        {
          q: "Will I receive a data science master’s degree or a certificate after completing the program?",
          a:
            "Yes, you will get a dual advantage from the world’s leading universities and institutes after successfully completing this program. The details are provided below: · Post Graduate Program in Data Science and Business Analytics and Master of Data Science Students who enrol in the Post Graduate Program in Data Science and Business Analytics alongside the Master of Data Science program will receive Post Graduate Certificates in Data Science and Business Analytics, awarded by the University of Texas at Austin and Great Lakes Executive Learning. They will also earn a Master of Data Science degree from Deakin University, Australia. OR · Post Graduate Program in Artificial Intelligence and Machine ",
        },
        {
          q: "How does this program stay updated with the rapidly evolving Data Science, Artificial Intelligence, and Machine Learning fields?",
          a:
            "The Master of Data Science Degree (Global) program gets you ready to handle the changing world of AIML and Data Science. It stays updated because of the following: · Curriculum co-created with Industry Experts: The curriculum is updated often with input from industry leaders, academic experts, and program alumni. This keeps the content current in Data Science and AIML, so you learn the latest topics. · Hands-On Project-Based Learning: The program emphasizes experiential learning. You will work on hands-on projects and case studies. This lets you use modern techniques and tools to solve real-world problems. It helps make sure your skills are up-to-date and relevant. · Continuous Learning Modu",
        },
      ],
    },
    {
      title: "Faculty, Curriculum and Projects",
      items: [
        {
          q: "Who would be the faculty to teach Deakin’s Master of Data Science?",
          a:
            "The renowned and highly experienced faculty members of the McCombs School of Business at The University of Texas at Austin and Great Lakes (for PGP-AIML/DSBA) and Deakin University (for the second year) will teach you this program. They will guide you through your lucrative career path in Data Science, Business Analytics, and Artificial Intelligence.",
        },
        {
          q: "What topics are covered in the data science course syllabus of Deakin’s Master of Data Science program?",
          a:
            "The Master of Data Science program at Deakin University includes basic and advanced topics. It focuses on data science and business analytics. The curriculum is updated with help from industry experts and academicians. It makes sure learners study the latest topics. Key features of the syllabus include: Core Programming Skills: Training in Python and R for data manipulation, visualization, and exploratory data analysis. Business and Analytical Modules: Subjects like Marketing & CRM, Statistical Methods for Decision Making, Business Finance, and SQL Programming. Advanced Technical Topics: Includes Machine Learning, Time Series Forecasting, and Optimization Techniques to address complex analyt",
        },
      ],
    },
    {
      title: "Eligibility, Admissions, and Fees",
      items: [
        {
          q: "What is the eligibility for a Master's in data science?",
          a:
            "The eligibility criteria for a master’s in data science program are as follows: · Applicants must have a bachelor's degree (minimum 3 years). They can have a degree in a related field or any discipline with at least 2 years of professional work experience. · The applicants must meet Deakin University’s minimal English language requirement.",
        },
        {
          q: "Do I need to give the GRE or GMAT test to qualify for this program?",
          a:
            "No, you are not required to attempt the GRE or GMAT tests. The candidates who meet the eligibility criteria are eligible to pursue this program.",
        },
        {
          q: "What is the admission process to pursue this degree course?",
          a:
            "To enroll, candidates must meet the eligibility criteria outlined earlier. The admission process for eligible applicants is as follows: Step 1: Complete the online application form . Step 2: The admissions committee will review each application, and shortlisted candidates will receive an Offer of Admission. Step 3: Secure your seat by paying the registration fee for the upcoming cohort and submitting the required documents.",
        },
        {
          q: "What are the payment options available to pay my program fee?",
          a:
            "Candidates can pay the program fee through net banking, credit cards, or debit cards.",
        },
        {
          q: "What is the course fee to pursue the Master of Data Science (Global) Program from Deakin University, Australia?",
          a:
            "For the most up-to-date information on the course fee, please refer to the official program page here .",
        },
      ],
    },
    {
      title: "Career-Related Queries",
      items: [
        {
          q: "What career opportunities are available after completing this degree?",
          a:
            "The program provides candidates access to the Great Learning Job Board, where 4000+ organisations approach with opportunities that are shared through the Job Board. Graduates can anticipate a career in data science via roles such as: · Data Scientist : Uncover insights from complex data sets using statistical methods of analysis and predictive modeling. · Business Analyst : Bridge business needs with IT resources by analyzing processes, requirements, and data. · AI/ML Engineer : Design and build AI models for automated learning and prediction. · Data Engineer : Architect and maintain data pipelines for large and complex data sets. · Analytics Consultant : Provide expert advice on data-driven",
        },
        {
          q: "Will I receive any career support after completing the program?",
          a:
            "Yes, you will receive career support from Great Learning, India’s renowned ed-tech platform for professional development and higher education. T&C valid* The career support services include: · E-Portfolio : The program will help students develop an outstanding E-Portfolio to showcase their expertise to potential employers. · Exclusive Job Board : Students will gain access to Great Learning’s Job Board, where 4,267+ hiring companies have extended 18,848+ job offers to date, with industry-relevant job opportunities with an average salary hike of 50%. · Resume Building and Interview Preparation : The program will assist students in building their top-notch resumes to highlight their skills and ",
        },
      ],
    },
  ],
  "walsh-ms-aiml-online": [
    {
      title: "Program Details",
      items: [
        {
          q: "What are the key highlights of the MS in Artificial Intelligence and Machine Learning program?",
          a:
            "The program offers the following key highlights: · A fully online, two-year master’s degree from Walsh College · 12 hands-on projects and over 30 case studies · Capstone projects at the end of Year 1 and Year 2 · An industry-relevant curriculum with dedicated modules on ChatGPT and Generative AI · Instruction from experienced faculty and industry practitioners · Alumni status from Walsh College upon successful completion",
        },
        {
          q: "What is the duration of the MS in Artificial Intelligence and Machine Learning program?",
          a:
            "The MS in Artificial Intelligence and Machine Learning is a two-year, fully online program offered by Walsh College.",
        },
        {
          q: "Is the program offered online or on campus?",
          a:
            "The program is delivered entirely online, allowing learners to study from anywhere.",
        },
        {
          q: "Who offers this program?",
          a:
            "The MS in Artificial Intelligence and Machine Learning program is offered by Walsh College, a private, not-for-profit institution based in the United States.",
        },
        {
          q: "What will I learn in this program?",
          a:
            "On successfully completing this MS in AIML program, you will be able to: · Review and report on AI and Machine Learning processing to understand data within a larger context. · Become an ideal candidate for high-demand fields such as AI research, Data Science, and AI engineering. · Apply new-age AI techniques to solve real-world business problems. · Contribute to cutting-edge AI research and advancements in technology and science. · Develop a mindset for continuous learning in the rapidly evolving fields of AI and ML.",
        },
      ],
    },
    {
      title: "Admissions and Eligibility",
      items: [
        {
          q: "What is the eligibility criteria for this program?",
          a:
            "Applicants must hold a 3 or 4-year bachelor’s degree or equivalent in any discipline from a recognized university or institution. The medium of instruction must be in English. · No GRE/GMAT or any English proficiency test scores are required. Note: Candidates should score a minimum of 2.75 CGPA in the 1st year to be eligible for the 2nd year of the program.",
        },
        {
          q: "Are GRE, GMAT, or English proficiency tests required?",
          a:
            "No. GRE, GMAT, TOEFL, or other English proficiency test scores are not required for admission.",
        },
        {
          q: "Is there a minimum academic requirement to progress in the MS in AIML?",
          a:
            "Yes. Candidates must score a minimum CGPA of 2.75 in the first year to be eligible to continue into the second year of the program.",
        },
        {
          q: "What is the admission process?",
          a:
            "Great Learning provides end-to-end support for the Walsh College application process. Step 1: APPLY ONLINE · Fill out a fast and easy online application form. · No additional tests or prerequisites are needed. Step 2: PRE-SCREENING · Our team will reach out to you to confirm your eligibility for the program. Step 3: APPLICATION ASSESSMENT · The Admissions Team will assess your application and provide a timely response. Step 4: JOIN THE PROGRAM · If selected, you will receive an acceptance letter with instructions on how to pay and join the program. Note: Candidates should score a minimum of 2.75 CGPA in the 1st year to be eligible for the 2nd year of the program. *Admission to the program is",
        },
        {
          q: "Does Great Learning support the admission process?",
          a:
            "Yes. Great Learning provides end-to-end support throughout the Walsh College application process.",
        },
      ],
    },
    {
      title: "Fee and Payment",
      items: [
        {
          q: "What is the total program fee for an MS in AI and ML?",
          a:
            "The total program fee is INR 5,50,000 + GST.",
        },
        {
          q: "Is admission guaranteed after fee payment?",
          a:
            "No. Admission to the program is subject to acceptance by Walsh College.",
        },
      ],
    },
    {
      title: "General Queries",
      items: [
        {
          q: "Is Walsh College accredited?",
          a:
            "Yes. Walsh College is accredited by The Higher Learning Commission (HLC), a regional accreditation agency recognized by the U.S. Department of Education.",
        },
        {
          q: "Is the degree recognized internationally?",
          a:
            "Walsh College is recognized by World Education Services (WES), which helps learners validate their academic credentials for use in the U.S. and Canada.",
        },
        {
          q: "Will I receive alumni status after completing the MS in AIML?",
          a:
            "Yes. Graduates receive alumni status from Walsh College upon successful completion of the program.",
        },
        {
          q: "Does the MS in AIML program include career support?",
          a:
            "Yes. Learners receive career support through resume building, interview preparation, career guidance, and an e-portfolio to showcase projects and skills.",
        },
        {
          q: "Is the curriculum subject to change?",
          a:
            "Yes. The curriculum is indicative and may be updated to reflect academic or industry requirements.",
        },
      ],
    },
  ],
  "ms-data-science-programme": [
    {
      title: "Program Details",
      items: [
        {
          q: "Why choose this Master's in Data Science programme?",
          a:
            "The Master's in Data Science programme from Northwestern University stands out with its remarkable benefits. The exclusive Northwestern advantage, clubbed with the amazing benefits this course has to offer, makes this the right choice for professionals. Here are a few of the benefits of the programme: World Class Education: · Northwestern was ranked in the top 6 U.S. universities (U.S. News & World Report 2025) · Designed and delivered by experienced faculty with industry experience · Physical residencies in Chennai and Gurgaon GLIM campus Comprehensive Learning: · Learn popular programming languages, frameworks, and libraries in a hands-on environment · 100% Live classes · AI as a specialis",
        },
        {
          q: "What are the learning outcomes and goals of this programme?",
          a:
            "The learning outcomes and goals of this master's in data science programme are: The integration of data science and business strategy has created a demand for professionals who can make data-driven decisions that propel their organizations forward. You can build the essential analysis and leadership skills needed for careers in today's data-driven world in Northwestern SPS’s online Master of Science in Data Science Programme. Programme Goals · Articulate analytics as a core strategy of data science · Transform data into actionable insights · Develop statistically sound and robust analytic solutions · Demonstrate leadership · Formulate and manage plans to address business issues · Evaluate co",
        },
        {
          q: "Can I take this Master's in data science degree course from anywhere in the world?",
          a:
            "Yes, candidates from any part of the world can take up the MS in Data Science programme. As this course is offered completely online, you can enroll and learn Data Science from the highly reputed faculty of Northwestern University.",
        },
        {
          q: "How much time will I need to dedicate to the degree every week?",
          a:
            "This is a master’s level degree and will be rigorous in nature. While the time needed will vary depending on prior knowledge, students should plan to spend around 15 - 20 hours every week.",
        },
        {
          q: "Will every subject have a final examination?",
          a:
            "All faculty will decide on the grading mechanism of their respective subjects. The evaluation criteria will be shared by them at the start of every course.",
        },
      ],
    },
    {
      title: "Fee and Payment",
      items: [
        {
          q: "What is the fee for the degree?",
          a:
            "The tuition for this degree is $13,000. This can be paid in 6 equal installments of $2,167 each (payable at the start of every term). Please note that apart from the tuition, students will also need to budget for the following expenses: · A fee of $35 each for online proctored examinations (3 in total) · The cost of travelling, boarding/lodging, and other expenses for the residency sessions (approximately $500 per residency) will have to be borne by the students.",
        },
        {
          q: "What is the application fee for enrolling in this MSc Data Science online programme?",
          a:
            "A $75 non-refundable application fee is required. Pay online with a credit card.",
        },
        {
          q: "Are there any discounts or scholarships available for the degree?",
          a:
            "While there are no scholarships, enrolled students have the flexibility to pay the fees in installments. We also have a tie-up with financial institutions to provide education loans. At this point, there is no discount or other financial aid available.",
        },
      ],
    },
    {
      title: "Admissions and Eligibility",
      items: [
        {
          q: "What are the eligibility criteria for this Master's in data science programme?",
          a:
            "Students should have completed a 4-year U.S. bachelor’s degree or equivalent. · No need to give the GRE or GMAT test to qualify for this MS in data science online programme. · If the medium of instruction were not English, then the student would need to give an English language proficiency test like IELTS or TOEFL. · While knowledge of mathematics and statistics will be useful, it is not a prerequisite.",
        },
        {
          q: "What is the application process?",
          a:
            "The application process to enroll in this Master's in Data Science programme: Step 1: Submit application form Apply online through Northwestern University application portal. Step 2: Application review The admissions committee at Northwestern University will carefully review a submitted application and communicate their decision Step 3: Join program An admission offer will be made to selected candidates. Secure your seat by paying the admission fee.",
        },
        {
          q: "Do I need to submit an SOP for this online Master's in data science programme?",
          a:
            "Yes, you need to submit a 300 - 550-word statement of purpose outlining how the Degree Programme will help them meet their academic and professional goals.",
        },
        {
          q: "How to submit recommendation letters for admission?",
          a:
            "You need to enter the names and email addresses for two recommenders. Reference requests are sent to your recommenders via email.",
        },
        {
          q: "What is the application process for International students?",
          a:
            "Applicants need to demonstrate their English proficiency through an official transcript for a bachelor’s degree or higher from an accredited U.S. university or an official TOEFL/IELTS score.",
        },
      ],
    },
    {
      title: "Career-Related Queries",
      items: [
        {
          q: "What are the several benefits offered by Northwestern University to the learners upon taking up this programme?",
          a:
            "Becoming a Northwestern Alumni offers some excellent benefits: · Learners gain access to global alumni events. · Learners gain access to free learning events, library resources, and much more. · Learners also gain access to Northwestern University's email address. · Learners also get to join a community of award winners and thought leaders in several domains such as Science, Technology, Politics, Arts & Entertainment, and more.",
        },
        {
          q: "What career transitions can I go for if I enroll in this Master's in Data Science programme by the Northwestern School of Professional Studies?",
          a:
            "If you enroll in the Master’s in Data Science program at Northwestern School of Professional Studies, you can pursue various career transitions, such as moving from Associate Architect to Advisory AI Engineer. Other common transitions include advancing from Data Engineer to Senior Data Engineer, AI Developer to Senior AI Developer, Lead Software Engineer to Senior Software Engineer, and Principal Analytics Specialist to Manager of Data Science – Analytics. This program prepares you for growth and leadership roles in the data science and AI fields.",
        },
      ],
    },
  ],
  "pg-program-artificial-intelligence-course": [
    {
      title: "Program Details",
      items: [
        {
          q: "What is this Artificial Intelligence and Machine Learning online course?",
          a:
            "The Post Graduate Program in Artificial Intelligence and Machine Learning is a 12-month online AI certificate program designed to equip professionals with cutting-edge expertise in Generative AI, LLMs (like ChatGPT), Agentic AI, Agentic RAG, and operationalizing AI solutions (MLOps and LLMOps). Developed in partnership with the McCombs School of Business at The University of Texas at Austin and Great Lakes Executive Learning, the program blends academic depth with hands-on application.",
        },
        {
          q: "Who will teach the AI and Machine Learning course online?",
          a:
            "Expert faculty: The program is delivered by faculty from the McCombs School of Business at The University of Texas at Austin and Great Lakes Executive Learning. · Industry mentors: Sessions are led by practitioners who provide real-world context through industry insights, case studies, and project support. · Expert Support: You receive personalized assistance from program managers and mentors throughout your 12-month journey.",
        },
        {
          q: "How will I be evaluated in the AI certificate course, online?",
          a:
            "You will be evaluated through a continuous assessment process involving 11+ hands-on projects, modular quizzes, and industry case studies. The evaluation concludes with a comprehensive Capstone Project where you apply your skills to a real-world problem. Successful completion of these requirements is necessary to earn your dual certificates from the McCombs School of Business at The University of Texas at Austin and Great Lakes Executive Learning.",
        },
        {
          q: "Will there be job or career support at the end of this program?",
          a:
            "While the program does not offer placement guarantees, you receive extensive career support through the GL Excelerate platform. This includes access to a curated job board with opportunities from over 4500+ hiring partners, personalized career mentorship, interview preparation workshops, and resume-building workshops. You will also develop a professional e-portfolio on GitHub to showcase your 11+ hands-on projects and final Capstone Project to potential recruiters",
        },
        {
          q: "What are the key highlights of the Artificial Intelligence and Machine Learning course?",
          a:
            "The key highlights of this PGP-AIML include: · 12-month Comprehensive Learning: A year-long online program featuring live weekend mentorship sessions led by industry experts. · Prestigious Dual Certification: Earn recognized credentials from the McCombs School of Business at The University of Texas at Austin and Great Lakes Executive Learning. · Advanced AI Syllabus: Curriculum includes cutting-edge modules on Generative AI, MLOps, LLMOps, Multimodal AI, Agentic AI, and AI agent development. · Hands-on Application of AI: Gain experience through 11+ industry-relevant AI projects, 60+ case studies, and a final Capstone Project to build a compelling professional portfolio. · Mastery of 38 Langu",
        },
      ],
    },
    {
      title: "Curriculum and Projects",
      items: [
        {
          q: "What will I learn from this online AI and Machine Learning course?",
          a:
            "This AI course syllabus provides a comprehensive journey from AI and Machine Learning basics to advanced AI concepts. You will master: · Core AI & ML: Statistics, Python, SQL, supervised and unsupervised learning, and ensemble techniques · Advanced Technologies: Deep learning, Computer Vision, Natural Language Processing (NLP), and the latest modules in Generative AI, MLOps, Multimodal AI, Agentic AI, Agentic RAG, and LLMOps · Practical Tools: Hands-on proficiency with 38 languages and tools, including Python, TensorFlow, ChatGPT, LangChain, Docker, LangGraph, MLflow, and n8n · Real-World Application: How to solve complex business problems using 11+ industry projects, 60+ case studies, and a",
        },
        {
          q: "What tools and languages are covered in the curriculum?",
          a:
            "You will gain proficiency in 38 in-demand languages, tools, and frameworks essential for AI and ML job roles. Key tools include: · Programming & Data: Python, SQL, NumPy, Pandas, Seaborn, and Matplotlib · Machine Learning, Deep Learning & Computer Vision: TensorFlow, Keras, Scikit-learn, and OpenCV · Generative AI, LLMs & Agentic AI: ChatGPT, Hugging Face, LangChain, Transformers, Gemini, DALL-E, Whisper, LangGraph, LangSmith, Model Context Protocol (MCP), Groq, LlamaCPP, and DSPy · Deployment & MLOps: Docker, Flask, Streamlit, Gradio, MLflow, GitHub, and n8n",
        },
        {
          q: "Are there any projects in this online certificate program?",
          a:
            "Yes. The PGP-AIML program emphasizes \"learning by doing\" through an extensive practical component. You will work on various projects throughout the curriculum: · 11+ Hands-on Projects: Apply your skills to real-world scenarios across industries like finance, healthcare, and retail. · Capstone Project: Complete a final, 4-week integrative project that demonstrates your end-to-end expertise in AI and Machine Learning. · 60+ Case Studies: Analyze diverse business problems to understand how AI solutions are implemented in global organizations. · Professional Portfolio: You will showcase your work on GitHub, helping you build a technical e-portfolio to share with potential recruiters.",
        },
        {
          q: "How does the Python bootcamp help non-programmers?",
          a:
            "The Python bootcamp helps non-programmers by providing a one-month foundational course designed to build their coding skills entirely from scratch. Offered as a pre-program tutorial, it ensures that learners without prior programming experience can seamlessly transition into AI and ML roles.",
        },
        {
          q: "Does the program cover Retrieval-Augmented Generation (RAG)?",
          a:
            "Yes, the curriculum goes beyond traditional RAG to cover Agentic RAG systems, allowing you to create grounded AI assistants for knowledge-driven use cases and evaluate their performance.",
        },
      ],
    },
    {
      title: "Admissions and Eligibility",
      items: [
        {
          q: "What is the AI course eligibility?",
          a:
            "Applicants must hold a Bachelor's degree with a minimum of 50% aggregate marks or equivalent. No prior programming experience is required. For candidates who do not know Python, we oﬀer a pre-program tutorial.",
        },
        {
          q: "What are the prerequisites for pursuing an AI and Machine Learning course?",
          a:
            "To pursue the Post Graduate Program in Artificial Intelligence and Machine Learning, the primary prerequisites are: · Educational Qualification: You must hold a Bachelor’s degree with at least 50% aggregate marks or equivalent. · Coding Background: No prior programming experience is required. The program includes a one-month Python bootcamp to build your coding foundation from scratch. · Mathematical Foundation: While the course teaches practical applications, a basic comfort with high-school level mathematics (specifically statistics and probability) is helpful for understanding AI models. Fee Related Queries",
        },
      ],
    },
    {
      title: "Fee Related Queries",
      items: [
        {
          q: "How much does the AI course cost?",
          a:
            "For specific details regarding the program fee, please refer to the official website or contact the admissions team directly, as fees may vary based on available scholarships or financing options like no-cost EMIs.",
        },
        {
          q: "What are the payment options?",
          a:
            "You can pay the Artificial Intelligence course fee through Net Banking, Credit Cards, or Debit cards. You can also avail of financial aid through Propelld, Eduvance, Liquiloans, and Gyandhan at a 0% interest rate. Please contact your program manager for further assistance.",
        },
        {
          q: "What is the refund policy for the program?",
          a:
            "The refund policy for the Post Graduate Program in Artificial Intelligence and Machine Learning is as follows: · Refund Policy: You can claim a full refund of the program fee (less any applicable taxes) by submitting a written request to the admissions team at least 15 days prior to the program start date. · Request Process: All refund requests must be communicated in writing to the official admissions or program office. · Non-Refundable Period: Refund requests made within 15 days of the program start date or after the program has commenced are generally not eligible for a refund. For specific details regarding your enrollment or to initiate a request, you should contact the admissions team ",
        },
      ],
    },
  ],
  "pg-program-cloud-computing-course": [
    {
      title: "Program details",
      items: [
        {
          q: "What will I learn in the Cloud Computing course and how will this help me progress in my career?",
          a:
            "At the end of the course, you will: · Be able to oversee a company's cloud adoption plans, cloud application design, and cloud architecture. · Be able to design and implement enterprise infrastructure and platforms required for cloud computing. · Be able to analyze system requirements and ensure that systems will be securely integrated with current applications. · Develop the ability to architect a cloud environment and make sound component choices. · Become comfortable working with virtual machines (VM) and the nuances of the most popular tools. · Build the ability to use NIST Cloud Reference Architectures to solve various problems faced as a cloud professional. · Understand trade-offs, and",
        },
        {
          q: "Why should I not just get an AWS certification instead of a PGP in Cloud Computing?",
          a:
            "The Great Lakes PGP Cloud Computing Course goes well beyond preparing you for AWS Certification. The course helps you gain a strong conceptual understanding of the entire cloud ecosystem. Watch this video to learn more.",
        },
        {
          q: "Who is the faculty?",
          a:
            "The faculty members of the PGP Cloud Computing Course are industry experts and leaders in their fields, bringing decades of professional experience and insights. Renowned experts from academia also participate in the program, enriching the learning experience.",
        },
        {
          q: "What is the extent of hands-on exposure? Are there any live projects?",
          a:
            "The Cloud Computing Course includes various real-time projects and a detailed capstone project. You will analyze a real-world problem using a range of tools & techniques that you have learned in live classes.",
        },
        {
          q: "What does the virtual lab look like? Is access to the virtual lab available even beyond Sundays?",
          a:
            "Virtual labs are real cloud environments that you will be using in this program, not a simulation. For AWS, you will get an AWS lab account with promotional credits. For Azure, you will be guided on how to create a Free tier Azure account.",
        },
      ],
    },
  ],
  "pg-program-data-science-business-analytics-course": [
    {
      title: "Program details",
      items: [
        {
          q: "What is the ranking of the UT Austin McCombs School of Business Analytics Course?",
          a:
            "In the QS World University Rankings 2023, the McCombs School of Business at The University of Texas at Austin is ranked #4 worldwide for MS-Business Analytics. It is ranked #7 Public University in the U.S. (U.S. News & World Report, 2024).",
        },
        {
          q: "What is the role of the McCombs School of Business in the PG Program in Data Science with Generative AI?",
          a:
            "The PGP-Data Science with Generative AI curriculum has been designed in collaboration by Great Lakes Executive Learning and the McCombs School of Business at The University of Texas at Austin. The teaching, content, and capstone projects in the program are crafted or approved by faculty from Great Lakes, the McCombs School of Business, and other practicing data scientists and analytics experts. Upon completion, all successful participants get dual certificates from Great Lakes and the McCombs School of Business at The University of Texas at Austin.",
        },
        {
          q: "Will I earn Dual PG certificates after completing this course?",
          a:
            "Yes, you will earn dual PG Certificates from the McCombs School of Business at The University of Texas at Austin and Great Lakes Executive Learning. Earning PG Certificates from one of the top universities in the USA and one of India's top 10 business schools enhances your global credentials",
        },
        {
          q: "How will I be evaluated during the Data Science and Business Analytics Course?",
          a:
            "PGP-Data Science with Generative AI is a holistic and rigorous program that follows a continuous evaluation method. You will be evaluated in this program through case studies, quizzes, assignments, or project reports.",
        },
        {
          q: "How long does it take to complete this Business Analyst course for working professionals?",
          a:
            "This 12-month Post Graduate Program in Data Science covers Generative AI and Business Analytics to equip learners with advanced skills for today’s data-driven world.",
        },
      ],
    },
  ],
};

/** FAQ groups for a course, empty when the page publishes none we can read. */
export const courseFaqFor = (slug: string): CourseFaqGroup[] => courseFaq[slug] ?? [];
