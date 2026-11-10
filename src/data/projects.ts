// Project content is taken from the CV, the repositories' READMEs and file trees, and the live sites.
// Screenshots in /public/img are real captures of the deployed apps (see scripts/prepare-assets.mjs).

export type Stage =
  | { kind: 'duo'; shots: Shot[]; phone: string }
  | { kind: 'monitor'; shots: Shot[]; zoom?: boolean; video?: { src: string; poster: string; label: string } }
  | { kind: 'phone'; shot: Shot; fit?: 'contain' | 'cover'; bg?: string }
  | { kind: 'image'; shot: Shot }
  | { kind: 'phones'; shots: Shot[] }
  | { kind: 'gallery'; shots: Shot[] }
  | { kind: 'window'; shot: Shot; title: string }
  | { kind: 'repo'; repo: string; lines: string[] }
  | { kind: 'flow'; caption: string; steps: string[] }
  | { kind: 'paper'; venue: string; title: string; authors: string; date: string; doi: string };

export interface Shot {
  src: string;
  alt: string;
  /** A 3840 px sibling named <src>-4k.webp exists and is offered to large screens. */
  hi?: boolean;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  meta: string;
  title: string;
  sub: string;
  desc: string;
  tags: string[];
  stage: Stage;
  links: ProjectLink[];
  note?: string;
  detail?: {
    lead: string;
    sections: { h: string; items: string[] }[];
    stack: { layer: string; items: string }[];
    gallery?: (Shot & { cap: string; phone?: boolean })[];
  };
}

export interface Room {
  slug: string;
  nav: string;
  plate: string;
  title: string;
  tagline: string;
  points: string[];
  intro: string;
  door: string;
  doorDark: string;
  projects: Project[];
}

const gh = (repo: string) => `https://github.com/Jubayerhasan75/${repo}`;
const hi = (name: string, alt: string): Shot => ({ src: `/img/${name}.webp`, alt, hi: true });

export const rooms: Room[] = [
  {
    slug: 'full-stack',
    nav: 'Full-Stack',
    plate: 'Full-Stack Developer',
    title: 'Full-Stack Development',
    tagline: 'React front ends, Node.js APIs, MongoDB',
    points: [
      'React & TypeScript interfaces',
      'Node.js, Express & REST APIs',
      'Real-time with Socket.IO',
      'JWT auth & MongoDB data models',
      'Installable PWAs & automated tests',
    ],
    intro:
      'Web applications built end to end: React and TypeScript on the front, Node.js, Express and MongoDB behind it, deployed and live.',
    door: '#22304a',
    doorDark: '#1c2840',
    projects: [
      {
        id: 'johans-hub',
        meta: 'E-commerce platform · Live',
        title: "Johan's Hub",
        sub: "Online store for a premium men's t-shirt brand",
        desc: 'A MERN e-commerce platform covering the whole shopping journey: product search and filters, cart, multi-step checkout and order tracking, with an admin dashboard for running the store.',
        tags: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
        stage: {
          kind: 'duo',
          phone: '/img/jh-collection-m.webp',
          shots: [
            { src: '/img/jh-home.webp', alt: "Johan's Hub homepage with the seasonal offer banner" },
            { src: '/img/jh-collection.webp', alt: "Johan's Hub collection page with filters and product grid" },
            { src: '/img/jh-product.webp', alt: "Johan's Hub product page with size and colour selection" },
            { src: '/img/jh-home-s1.webp', alt: "Johan's Hub Shop by Style section" },
          ],
        },
        links: [
          { label: 'Visit live site', href: 'https://johans-hub-tau.vercel.app' },
          { label: 'GitHub', href: gh('johans-hub') },
        ],
        detail: {
          lead: "Johan's Hub is a full-stack store for a Bangladeshi t-shirt brand. Shoppers browse a catalogue, filter by category, colour and price, pick a size and colour, and check out with Cash on Delivery or a manual mobile payment (bKash or Nagad). The owner manages products, orders and homepage banners from an admin panel, without touching code.",
          sections: [
            {
              h: 'Storefront',
              items: [
                'Product catalogue with search, category, colour and price filters, sorting and pagination',
                'Product pages with size and colour selection, sale pricing and stock status',
                'Shopping cart and favourites',
                'Multi-step checkout: Cash on Delivery and manual mobile payment',
                'Customer accounts with order history',
              ],
            },
            {
              h: 'Admin dashboard',
              items: [
                'Create, edit and delete products with image uploads',
                'Order management with status updates and sales statistics',
                'Editable homepage banners, no code required',
                'Role-based access control: admin and customer',
              ],
            },
            {
              h: 'Engineering',
              items: [
                'JWT authentication with hashed passwords',
                'Prices and stock validated on the server, not trusted from the client',
                'Cloudinary image hosting',
                'Responsive UI with Framer Motion transitions',
                'Automated API tests',
              ],
            },
          ],
          stack: [
            { layer: 'Frontend', items: 'React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router' },
            { layer: 'Backend', items: 'Node.js, Express, MongoDB, Mongoose, JWT, Cloudinary' },
            { layer: 'Hosting', items: 'Vercel' },
          ],
          gallery: [
            { src: '/img/jh-home.webp', alt: 'Homepage', cap: 'Homepage: seasonal banner carousel managed from the admin panel' },
            { src: '/img/jh-collection.webp', alt: 'Collection', cap: 'Collection: filters for category, colour and price, with sorting' },
            { src: '/img/jh-product.webp', alt: 'Product page', cap: 'Product page: size and colour selection, sale price and stock status' },
            { src: '/img/jh-home-s1.webp', alt: 'Shop by Style', cap: 'Shop by Style: category entry points on the homepage' },
            { src: '/img/jh-home-s3.webp', alt: 'Footer', cap: 'Closing banner and footer' },
            { src: '/img/jh-login.webp', alt: 'Sign in', cap: 'Sign-in: checkout and order history sit behind customer accounts' },
            { src: '/img/jh-home-m.webp', alt: 'Mobile homepage', cap: 'Mobile homepage', phone: true },
            { src: '/img/jh-collection-m.webp', alt: 'Mobile collection', cap: 'Mobile collection with a Filters & Sort sheet', phone: true },
          ],
        },
      },
      {
        id: 'adda',
        meta: 'Real-time chat app · Live',
        title: 'Adda',
        sub: 'End-to-end encrypted messenger, installable as a PWA',
        desc: 'A real-time chat app built on WebSockets with one-to-one and group messaging, end-to-end encryption (Web Crypto API, AES-256-GCM), secure authentication and push notifications, validated by 360+ automated tests.',
        tags: ['React', 'Node.js', 'Express', 'Socket.IO', 'MongoDB', 'PWA'],
        stage: {
          kind: 'gallery',
          shots: [
            hi('adda-slide-1', 'Adda: a private, real-time messenger'),
            hi('adda-slide-2', 'Adda chat list on a phone: simple, private, real time'),
            hi('adda-slide-3', 'Adda conversation with a shared photo, end-to-end encrypted'),
          ],
        },
        links: [
          { label: 'Visit live app', href: 'https://adda-chat.vercel.app' },
          { label: 'GitHub', href: gh('adda-realtime-chat-app') },
        ],
        detail: {
          lead: 'Adda is a private messenger for friends: one-to-one chats and groups of up to 50 people. Messages, photos and videos are encrypted on the device, so only the people in a chat can read them. It runs in any modern browser and installs like a native app on Android, iOS, Windows, macOS and Linux.',
          sections: [
            {
              h: 'Messaging',
              items: [
                'One-to-one and group chat over WebSockets, with messages kept in order',
                'Sent, delivered and seen ticks, typing indicator, online status and last seen',
                'Reactions, replies, edit, unsend, pinned messages and in-chat search',
                'Photos and videos sent encrypted; videos up to 100 MB are sent in parts',
                'Offline outbox: messages written without internet send once, when the connection returns',
              ],
            },
            {
              h: 'Security',
              items: [
                'End-to-end encryption with the Web Crypto API (ECDH, HKDF, AES-GCM)',
                'Group keys are re-made when a member leaves or is removed',
                'Argon2id password hashing, HttpOnly session cookies, rate limiting and security headers',
                'Device list with remote sign-out and security alerts for account changes',
              ],
            },
            {
              h: 'App and quality',
              items: [
                'Installable PWA with push notifications and in-app updates',
                'Friend requests, blocking, reporting and per-person privacy settings',
                'Unit, integration and Playwright end-to-end tests: 360+ automated tests',
              ],
            },
          ],
          stack: [
            { layer: 'Frontend', items: 'React, Vite, React Router, TanStack Query, Tailwind CSS, Socket.IO client, Workbox' },
            { layer: 'Backend', items: 'Node.js, Express, Socket.IO, MongoDB, Mongoose, Zod, web-push' },
            { layer: 'Quality', items: 'Vitest, Testing Library, Supertest, Playwright, ESLint' },
            { layer: 'Hosting', items: 'Vercel, Render, MongoDB Atlas, Cloudinary' },
          ],
          gallery: [
            { src: '/img/adda-home.webp', alt: 'Adda sign-in', cap: 'Sign-in screen (the rest of the app requires an account)' },
            { src: '/img/adda-home-m.webp', alt: 'Adda sign-in on mobile', cap: 'Mobile sign-in', phone: true },
          ],
        },
      },
      {
        id: 'ki-hoto-jodi',
        meta: 'Web app · Live',
        title: 'Ki Hoto Jodi?',
        sub: 'A Bengali "what if" habit-impact calculator',
        desc: 'Shows the long-term money and time saved by small changes to daily habits. Pick a scenario such as quitting smoking or walking instead of taking a rickshaw, adjust the numbers and see yearly and five-year results with a chart.',
        tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Recharts'],
        stage: {
          kind: 'duo',
          phone: '/img/kihoto-home-m.webp',
          shots: [{ src: '/img/kihoto-home.webp', alt: 'Ki Hoto Jodi calculator with scenarios and a savings chart' }],
        },
        links: [
          { label: 'Visit live site', href: 'https://ki-hoto-jodi.vercel.app' },
          { label: 'GitHub', href: gh('Ki_hoto_jodi') },
        ],
      },
    ],
  },
  {
    slug: 'ai-automation',
    nav: 'AI Automation',
    plate: 'AI Automation',
    title: 'AI Automation',
    tagline: 'n8n workflows that do the follow-up',
    points: [
      'n8n workflow design',
      'Lead generation & outreach',
      'Reply follow-ups & meeting booking',
      'LLM agents with structured output',
      'Dashboards with live data sync',
    ],
    intro:
      'Workflow automation built in n8n: lead generation, outreach, follow-ups and email handling, with dashboards that show what the workflows are doing.',
    door: '#4a3540',
    doorDark: '#3f2d37',
    projects: [
      {
        id: 'client-automation',
        meta: 'Digital Automation & IT Solutions · Jun 2026 — Now',
        title: 'Lead-to-meeting workflows',
        sub: 'AI Automation & Web Developer · Remote',
        desc: 'n8n workflows for lead generation, personalized outreach, reply follow-ups and meeting booking across three business use cases, with web-based dashboards that sync live data to track leads, replies and booked meetings.',
        tags: ['n8n', 'Workflow automation', 'Dashboards', 'Live data sync'],
        stage: {
          kind: 'monitor',
          shots: [],
          video: {
            src: '/video/lead-automation.mp4',
            poster: '/img/lead-automation-poster.webp',
            label: 'Animation of the lead-to-meeting pipeline: find leads, email, track replies, book the meeting',
          },
        },
        note: 'Client work, so the workflows themselves are not public.',
        links: [{ label: 'Company site', href: 'https://digimationtech.com/' }],
      },
      {
        id: 'customer-leads',
        meta: 'Lead automation · Dashboard',
        title: 'Customer Lead Finder',
        sub: 'Targeted customer leads by country and industry',
        desc: 'Takes a target country and business type and automatically collects matching customer leads with their contact details. A dashboard synced live from Google Sheets shows total leads, emails sent, replies, invalid addresses, an industry split, an outreach funnel and a map of where the leads are.',
        tags: ['Lead generation', 'Automation', 'Google Sheets sync', 'Dashboard'],
        stage: { kind: 'monitor', shots: [hi('customer-leads', 'Customer leads dashboard: totals, industry split, outreach funnel and lead map')] },
        links: [],
      },
      {
        id: 'agency-leads',
        meta: 'Lead automation · Dashboard',
        title: 'Student Agency Leads',
        sub: 'Every student agency in a country, city by city',
        desc: 'Choose a country and the workflow gathers leads for student agencies across its cities. The dashboard tracks agencies scraped, emails found and sent, replies and invalid addresses, with a per-country breakdown of coverage and reply rate.',
        tags: ['Lead generation', 'Web scraping', 'Automation', 'Dashboard'],
        stage: { kind: 'monitor', shots: [hi('agency-leads', 'Agency lead dashboard: agencies scraped per country, lead status and country statistics')] },
        links: [],
      },
      {
        id: 'university-agentship',
        meta: 'Lead automation · AI agent',
        title: 'University Agentship',
        sub: 'University outreach across many countries, from lead to meeting',
        desc: 'Collects university leads across many countries, then an agent takes over: it sends the outreach, follows up automatically and emails to arrange meetings. The dashboard shows universities scraped per country, emails found and sent, replies and email coverage.',
        tags: ['Lead generation', 'AI agent', 'Auto follow-up', 'Meeting booking', 'Dashboard'],
        stage: { kind: 'monitor', shots: [hi('university-agentship', 'University agentship dashboard: universities scraped per country and lead status breakdown')] },
        links: [],
      },
      {
        id: 'ausbildung-agentship',
        meta: 'Lead automation · Germany',
        title: 'Ausbildung Agentship',
        sub: 'Partnership outreach to Ausbildung organisations in Germany',
        desc: 'Finds organisations in Germany that work with Ausbildung (vocational training), collects their details as leads, emails them automatically and sets up meetings. The dashboard breaks the leads down by city, with emails found, sent and replied.',
        tags: ['Lead generation', 'Automated email', 'Meeting booking', 'Dashboard'],
        stage: { kind: 'monitor', shots: [hi('ausbildung', 'Ausbildung partnership dashboard: leads collected per German city and lead status')] },
        links: [],
      },
      {
        id: 'phd-leads',
        meta: 'Lead automation · Research',
        title: 'PhD Leads',
        sub: 'PhD programmes, professors and contact emails, collected automatically',
        desc: 'Scrapes PhD opportunities by country: the programme, the professor, the department and a contact email. You search by topic, field, professor or university, filter by area, university and department, and email a lead straight from its card.',
        tags: ['Web scraping', 'Lead generation', 'Search & filters', 'Dashboard'],
        stage: {
          kind: 'monitor',
          shots: [
            hi('phd-overview', 'PhD Leads overview: search box, lead totals and top universities'),
            hi('phd-leads', 'PhD Leads list: lead cards with programme, department and email actions'),
          ],
        },
        links: [],
      },
      {
        id: 'facebook-automation',
        meta: 'Social automation',
        title: 'Facebook Automation',
        sub: 'Posts on schedule and answers messages',
        desc: 'Publishes pictures and videos to a Facebook page automatically and replies to incoming messages without anyone at the keyboard.',
        tags: ['Automation', 'Auto-posting', 'Auto-reply'],
        stage: {
          kind: 'flow',
          caption: 'What the automation does, drawn as a diagram',
          steps: ['Picture or video queued', 'Automatic post to the page', 'Incoming message', 'Automatic reply'],
        },
        links: [],
      },
      {
        id: 'ai-email-agent',
        meta: 'n8n workflow · Open source',
        title: 'AI Email Executive Agent',
        sub: 'An inbox assistant that reads, triages and replies',
        desc: 'Watches Gmail for unread mail, has an AI agent analyse tone, intent, urgency and phishing risk, then writes a reply. Normal emails are answered automatically; risky or critical ones become drafts for a person to review.',
        tags: ['n8n', 'OpenAI GPT-4o-mini', 'Gmail API', 'Structured output', 'Memory'],
        stage: {
          kind: 'window',
          title: 'n8n — AI Email Executive Agent',
          shot: { src: '/img/ai-workflow.webp', alt: 'n8n canvas: Gmail trigger, AI agent with model, memory and tools, an IF node, then send or draft' },
        },
        links: [{ label: 'GitHub', href: gh('ai-email-executive-agent') }],
        detail: {
          lead: 'An n8n workflow that behaves like an executive assistant for an inbox. The agent returns a structured JSON verdict for each email, and an IF node decides whether the reply is sent or held as a draft.',
          sections: [
            {
              h: 'How it works',
              items: [
                'A Gmail trigger watches for unread emails',
                'An AI agent analyses tone, intent, urgency, priority and risk',
                'A structured output parser turns the analysis into JSON',
                'An IF node routes the result: NORMAL is replied to, CRITICAL becomes a draft',
              ],
            },
            {
              h: 'Agent setup',
              items: [
                'OpenAI GPT-4o-mini chat model',
                'Buffer memory for continuity across a conversation',
                'Wikipedia tool for quick fact lookups',
              ],
            },
          ],
          stack: [{ layer: 'Tools', items: 'n8n, OpenAI GPT-4o-mini, Gmail API, Structured Output Parser, Memory Buffer' }],
          gallery: [{ src: '/img/ai-workflow.webp', alt: 'n8n workflow canvas', cap: 'The workflow on the n8n canvas, from the repository' }],
        },
      },
    ],
  },
  {
    slug: 'php-mysql',
    nav: 'PHP & MySQL',
    plate: 'PHP & MySQL',
    title: 'PHP & MySQL Systems',
    tagline: 'Role-based systems for schools and teams',
    points: [
      'Role-based access control',
      'Admin dashboards & CRUD',
      'Relational schema design in MySQL',
      'Sessions & input sanitising',
      'Charts with Chart.js',
    ],
    intro:
      'Management systems written in PHP and MySQL: role-based dashboards, content approval flows, notice boards and result charts.',
    door: '#7a8670',
    doorDark: '#66705d',
    projects: [
      {
        id: 'edusync',
        meta: 'Class management system',
        title: 'EduSync',
        sub: 'Role-based platform for schools',
        desc: 'Connects super admins, principals, teachers and students. Teachers upload study materials that an admin approves, announcements target specific classes and sections, and students follow their results on progress charts.',
        tags: ['PHP', 'MySQL', 'JavaScript', 'Chart.js'],
        stage: { kind: 'monitor', zoom: true, shots: [hi('edusync-landing', 'EduSync landing screen with sign-in and register buttons')] },
        links: [{ label: 'GitHub', href: gh('EduSync-Management-System') }],
      },
      {
        id: 'school-website',
        meta: 'School management system',
        title: 'Shishu Bidya Niketon',
        sub: 'Website and admin panel for a school',
        desc: 'A public school website backed by a protected admin dashboard: student and teacher records, a notice board that updates the homepage, admissions, a gallery of events and a contact form that delivers messages to the admin panel.',
        tags: ['PHP', 'MySQL', 'Tailwind CSS', 'JavaScript'],
        stage: {
          kind: 'repo',
          repo: 'School_Website',
          lines: [
            'index.php',
            'admission.php',
            'gallery.php',
            'contact.php',
            'admin/dashboard.php',
            'admin/manage_students.php',
            'admin/manage_teachers.php',
            'admin/manage_notices.php',
            'admin/manage_admission.php',
            'admin/manage_slider.php',
          ],
        },
        links: [{ label: 'GitHub', href: gh('School_Website') }],
      },
      {
        id: 'workflow-app',
        meta: 'Task tracker · Live',
        title: 'WorkFlow',
        sub: 'Daily task tracker',
        desc: 'A daily task tracker with accounts and a dashboard, built with a PHP and MySQL API and a vanilla JavaScript front end split into auth, tasks and dashboard modules.',
        tags: ['PHP', 'MySQL', 'Vanilla JS', 'CSS'],
        stage: {
          kind: 'phones',
          shots: [
            hi('workflow-mobile-dashboard', 'WorkFlow on a phone: dashboard with task counts and recent activity'),
            hi('workflow-mobile-menu', 'WorkFlow on a phone: navigation drawer with daily log, to-do list and calendar'),
          ],
        },
        links: [
          { label: 'Visit live site', href: 'http://workflow-app.lovestoblog.com/' },
          { label: 'GitHub', href: gh('WorkFlow_App') },
        ],
      },
    ],
  },
  {
    slug: 'research-ml',
    nav: 'Research & ML',
    plate: 'Research & ML',
    title: 'Research & Machine Learning',
    tagline: 'Preprints, a capstone and model comparisons',
    points: [
      'Two TechRxiv preprints',
      'IoT & edge-AI capstone',
      'Self-supervised learning on MRI',
      'Model comparison & statistics',
      'Classical game AI',
    ],
    intro:
      'Research and coursework in machine learning: two preprints, a capstone on earthquake early warning and a comparison of self-supervised models on MRI scans.',
    door: '#a4552c',
    doorDark: '#8c4826',
    projects: [
      {
        id: 'sotorkobd',
        meta: 'Capstone project · East West University',
        title: 'SotorkoBD',
        sub: 'IoT & edge-AI earthquake early warning system',
        desc: 'Capstone project that detects seismic P-waves on edge devices and sends real-time alerts to a mobile application.',
        tags: ['IoT', 'Edge AI', 'Mobile application'],
        stage: {
          kind: 'flow',
          caption: 'How an alert travels, drawn as a diagram',
          steps: ['Seismic sensor', 'Edge device', 'P-wave detection', 'Real-time alert', 'Mobile app'],
        },
        links: [],
      },
      {
        id: 'loan-approval',
        meta: 'Preprint · 2025',
        title: 'Loan Approval Prediction by Machine Learning Algorithm',
        sub: 'TechRxiv',
        desc: 'A preprint on predicting loan approval with machine learning algorithms, written with Md Abul Bashar Sarkar.',
        tags: ['Machine learning', 'Jupyter Notebook'],
        stage: {
          kind: 'paper',
          venue: 'TechRxiv Preprint',
          title: 'Loan Approval Prediction by Machine Learning Algorithm',
          authors: 'Md Jubayer Hasan, Md Abul Bashar Sarkar',
          date: 'October 2025',
          doi: '10.36227/techrxiv.176114300.08690733/v1',
        },
        links: [
          { label: 'View paper', href: 'https://doi.org/10.36227/techrxiv.176114300.08690733/v1' },
          { label: 'GitHub', href: gh('Loan-Approval-Prediction') },
        ],
      },
      {
        id: 'fuel-efficiency',
        meta: 'Preprint · 2025',
        title: 'Predicting Fuel Efficiency through Machine Learning Analysis of Auto MPG Datasets',
        sub: 'TechRxiv',
        desc: 'A preprint on predicting fuel efficiency from the Auto MPG dataset with machine learning, written with Md Abul Bashar Sarkar.',
        tags: ['Machine learning', 'Auto MPG dataset'],
        stage: {
          kind: 'paper',
          venue: 'TechRxiv Preprint',
          title: 'Predicting Fuel Efficiency through Machine Learning Analysis of Auto MPG Datasets',
          authors: 'Md Abul Bashar Sarkar, Md Jubayer Hasan',
          date: 'October 2025',
          doi: '10.36227/techrxiv.176119012.21190063/v1',
        },
        links: [{ label: 'View paper', href: 'https://doi.org/10.36227/techrxiv.176119012.21190063/v1' }],
      },
      {
        id: 'alzheimers-ssl',
        meta: 'Course project · CSE 475 Machine Learning',
        title: "Alzheimer's Detection with Self-Supervised Learning",
        sub: 'SimCLR, BYOL and MAE against a supervised baseline',
        desc: "Compares three self-supervised learning frameworks for classifying Alzheimer's disease from MRI scans, evaluated on 1% to 50% labelled data, with ablation studies and Friedman and Nemenyi significance tests.",
        tags: ['Python', 'SimCLR', 'BYOL', 'MAE', 'Vision Transformer'],
        stage: { kind: 'image', shot: hi('alzheimers', "Project cover: Alzheimer's disease detection, self-supervised learning from MRI scans") },
        links: [{ label: 'GitHub', href: gh('Alzheimer-s-Disease-Detection-using-SSL') }],
      },
      {
        id: 'gomoku',
        meta: 'Web game · Classical AI',
        title: 'Gomoku',
        sub: 'Five-in-a-row against a Minimax opponent',
        desc: 'A browser Gomoku game on a 10×10 board. The computer searches four moves deep with Minimax and Alpha-Beta pruning, scoring patterns such as open threes and blocked fours to decide whether to defend or attack.',
        tags: ['JavaScript', 'Minimax', 'Alpha-Beta pruning', 'jQuery'],
        stage: { kind: 'phone', fit: 'contain', bg: '#ececec', shot: hi('gomoku', 'Gomoku board mid-game against the AI') },
        links: [{ label: 'GitHub', href: gh('gomoku-web') }],
      },
    ],
  },
];

export const roomBySlug = (slug: string) => rooms.find((r) => r.slug === slug);
