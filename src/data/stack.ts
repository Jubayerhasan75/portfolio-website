// Technologies taken from the CV and the public GitHub repositories and profile README.
// Logos come from the Simple Icons set (CC0); only the icons named here end up in the bundle.
import {
  siC,
  siChartdotjs,
  siCloudinary,
  siCplusplus,
  siCss,
  siDocker,
  siExpress,
  siFramer,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siJquery,
  siJsonwebtokens,
  siJunit5,
  siJupyter,
  siLangchain,
  siLaravel,
  siMongodb,
  siMysql,
  siN8n,
  siNodedotjs,
  siOpenjdk,
  siPhp,
  siPhpmyadmin,
  siPwa,
  siPython,
  siReact,
  siReactquery,
  siSelenium,
  siSocketdotio,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
} from 'simple-icons';

export interface Tech {
  name: string;
  path: string;
  /** Brand colour, or null when the brand mark is black and should follow the text colour. */
  color: string | null;
}

const t = (name: string, icon: { path: string; hex: string }): Tech => {
  const dark = parseInt(icon.hex.slice(0, 2), 16) + parseInt(icon.hex.slice(2, 4), 16) + parseInt(icon.hex.slice(4, 6), 16) < 120;
  return { name, path: icon.path, color: dark ? null : `#${icon.hex}` };
};

export const stack: { group: string; items: Tech[] }[] = [
  {
    group: 'Languages',
    items: [
      t('JavaScript', siJavascript),
      t('TypeScript', siTypescript),
      t('PHP', siPhp),
      t('Python', siPython),
      t('Java', siOpenjdk),
      t('C++', siCplusplus),
      t('C', siC),
      t('HTML5', siHtml5),
      t('CSS', siCss),
    ],
  },
  {
    group: 'Frontend',
    items: [
      t('React', siReact),
      t('Vite', siVite),
      t('Tailwind CSS', siTailwindcss),
      t('TanStack Query', siReactquery),
      t('Framer Motion', siFramer),
      t('PWA', siPwa),
      t('Chart.js', siChartdotjs),
      t('jQuery', siJquery),
    ],
  },
  {
    group: 'Backend & data',
    items: [
      t('Node.js', siNodedotjs),
      t('Express', siExpress),
      t('Socket.IO', siSocketdotio),
      t('JWT', siJsonwebtokens),
      t('MongoDB', siMongodb),
      t('MySQL', siMysql),
      t('Laravel', siLaravel),
      t('Cloudinary', siCloudinary),
    ],
  },
  {
    group: 'AI & automation',
    items: [t('n8n', siN8n), t('LangChain', siLangchain), t('Jupyter', siJupyter)],
  },
  {
    group: 'Tools & testing',
    items: [
      t('Git', siGit),
      t('GitHub', siGithub),
      t('Docker', siDocker),
      t('Vercel', siVercel),
      t('phpMyAdmin', siPhpmyadmin),
      t('Selenium', siSelenium),
      t('JUnit', siJunit5),
    ],
  },
];
