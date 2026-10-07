import {
  FaReact,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaBootstrap,
  FaGitAlt,
  FaDatabase,
  FaServer,
} from 'react-icons/fa'

import {
  SiMongodb,
  SiExpress,
  SiJavascript,
  SiTypescript,
} from 'react-icons/si'

export const ME = {
  name: 'Monsaf Ali',
  email: 'monsafali272@gmail.com',
  github: 'https://github.com/monsafali',
  linkedin: 'https://linkedin.com/in/monsaf-ali-',
}

// level: 1 = Intermediate, 2 = Proficient, 3 = Advanced
export const SKILLS = [
  {
    group: 'Frontend',
    items: [
      {
        name: 'React.js',
        icon: FaReact,
        level: 3,
        text: 'Building dynamic, component-based and high-performance web applications',
      },
      {
        name: 'JavaScript',
        icon: SiJavascript,
        level: 3,
        text: 'Creating interactive, functional and scalable web experiences',
      },
      {
        name: 'TypeScript',
        icon: SiTypescript,
        level: 2,
        text: 'Typed JavaScript for safer and maintainable applications',
      },
      {
        name: 'HTML5',
        icon: FaHtml5,
        level: 3,
        text: 'Semantic and accessible web application structure',
      },
      {
        name: 'CSS3',
        icon: FaCss3Alt,
        level: 3,
        text: 'Responsive and modern web styling',
      },
      {
        name: 'Bootstrap',
        icon: FaBootstrap,
        level: 3,
        text: 'Responsive interfaces using reusable UI components',
      },
    ],
  },

  {
    group: 'Backend',
    items: [
      {
        name: 'Node.js',
        icon: FaNodeJs,
        level: 3,
        text: 'Building scalable server-side applications and REST APIs',
      },
      {
        name: 'Express.js',
        icon: SiExpress,
        level: 3,
        text: 'Developing secure and structured backend APIs',
      },
      {
        name: 'MongoDB',
        icon: SiMongodb,
        level: 3,
        text: 'Designing and managing NoSQL databases for web applications',
      },
      {
        name: 'REST APIs',
        icon: FaServer,
        level: 3,
        text: 'Developing and integrating APIs for full-stack applications',
      },
    ],
  },

  {
    group: 'Database & Tools',
    items: [
      {
        name: 'MongoDB',
        icon: SiMongodb,
        level: 3,
        text: 'NoSQL database development and data management',
      },
      {
        name: 'Git / GitHub',
        icon: FaGitAlt,
        level: 3,
        text: 'Version control, project management and collaboration',
      },
    ],
  },
]

export const LEVELS = {
  1: 'Intermediate',
  2: 'Proficient',
  3: 'Advanced',
}

export const JOURNEY = [
  {
    when: '2022-2023',
    title: 'Started coding',
    text: 'Started building real-world applications and developing strong problem-solving skills.',
  },
  {
    when: 'Frontend',
    title: 'React.js Development',
    text: 'Focused on building responsive, interactive and component-based web applications.',
  },
  {
    when: 'Backend',
    title: 'Node.js + Express',
    text: 'Expanded into backend development by building APIs and server-side applications.',
  },
  {
    when: 'Database',
    title: 'MongoDB',
    text: 'Learned database design and integration to build complete full-stack applications.',
  },
  {
    when: 'Now',
    title: 'MERN Stack Development',
    text: 'Building secure, responsive and user-friendly applications using MongoDB, Express, React and Node.js.',
  },
  {
    when: 'Goal',
    title: 'Professional Software Developer',
    text: 'Continue creating scalable full-stack solutions and solving real-world business problems.',
  },
]

// Add new projects here. type: 'web' | 'mobile'
export const PROJECTS = [
  {
    title: 'E-Stamp Management System',
    type: 'web',
    text: 'A web-based E-Stamp Management System designed to manage and streamline digital stamp-related processes.',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    color: '#3D4BFF',
    link: 'https://lnkd.in/dc_Tgkkm',
  },
]