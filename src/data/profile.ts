// Every fact in this file comes from the CV (Jubayer_Hasan_CV6_final.pdf) or the public GitHub profile.

export const profile = {
  name: 'Md. Jubayer Hasan',
  shortName: 'Jubayer',
  monogram: 'JH',
  headline: 'Software Engineer · Full-Stack Developer · AI Automation',
  summary:
    'Final-year Computer Science and Engineering student and full-stack developer experienced in web applications and AI-powered workflow automation using React, TypeScript, Node.js, MongoDB and n8n.',
  location: 'Fatullah, Narayanganj, Bangladesh',
  timeZone: 'Asia/Dhaka',
  email: 'jubayerhasanrohan@gmail.com',
  phone: '+880 1305-315806',
  phoneHref: 'tel:+8801305315806',
  linkedin: 'https://www.linkedin.com/in/jubayer-hasan-196088267/',
  github: 'https://github.com/Jubayerhasan75',
  cv: '/Jubayer_Hasan_CV.pdf',
};

/** Roles on the hero flip calendar. `article` keeps "I am a / an" grammatical. */
export const roles: { word: string; article: 'a' | 'an' }[] = [
  { word: 'Full-Stack Developer', article: 'a' },
  { word: 'Software Engineer', article: 'a' },
  { word: 'Automation Developer', article: 'an' },
  { word: 'CSE Undergraduate', article: 'a' },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['JavaScript', 'TypeScript', 'PHP', 'Python', 'Java', 'C/C++', 'SQL'] },
  { group: 'Frontend', items: ['React', 'Vite', 'Tailwind CSS', 'TanStack Query', 'HTML5', 'CSS3', 'PWA'] },
  { group: 'Backend & data', items: ['Node.js', 'Express', 'REST APIs', 'Socket.IO', 'JWT', 'MongoDB', 'MySQL'] },
  { group: 'Testing', items: ['JUnit', 'Selenium', 'Load testing'] },
  { group: 'Automation & tools', items: ['n8n', 'Docker', 'phpMyAdmin', 'Git', 'GitHub'] },
];

export interface Chapter {
  year: number;
  when: string;
  title: string;
  org: string;
  href?: string;
  points: string[];
}

/** Newest first — the story section scrolls back in time. */
export const story: Chapter[] = [
  {
    year: 2026,
    when: 'Jun 2026 — Now',
    title: 'AI Automation & Web Developer',
    org: 'Digital Automation & IT Solutions · Remote',
    href: 'https://digimationtech.com/',
    points: [
      'Built n8n workflows for lead generation, personalized outreach, reply follow-ups and meeting booking across three business use cases.',
      'Developed web-based dashboards with live data sync to track leads, replies and booked meetings.',
    ],
  },
  {
    year: 2025,
    when: 'Oct 2025',
    title: 'Two research preprints',
    org: 'TechRxiv',
    points: [
      'Loan Approval Prediction by Machine Learning Algorithm.',
      'Predicting Fuel Efficiency through Machine Learning Analysis of Auto MPG Datasets.',
    ],
  },
  {
    year: 2022,
    when: '2022 — Dec 2026 (expected)',
    title: 'BSc in Computer Science & Engineering',
    org: 'East West University, Dhaka',
    points: [
      'Final-year student; capstone project SotorkoBD, an IoT and edge-AI earthquake early warning system.',
      'Coursework projects span full-stack web apps, PHP and MySQL systems and machine learning.',
    ],
  },
  {
    year: 2021,
    when: '2021',
    title: 'Higher Secondary Certificate (HSC)',
    org: 'Dhaka Imperial College',
    points: [],
  },
  {
    year: 2019,
    when: '2019',
    title: 'Secondary School Certificate (SSC)',
    org: "Motijheel Govt. Boys' High School",
    points: [],
  },
];
