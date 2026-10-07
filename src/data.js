import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaBootstrap, FaGitAlt, FaPlug, FaServer } from 'react-icons/fa'
import { SiExpo, SiTypescript, SiJavascript } from 'react-icons/si'

export const ME = {
  name: 'Amna Ashraf',
  email: 'amnaharaf272@gmail.com',
  github: 'https://github.com/Amna-Coder404',
  linkedin: 'https://www.linkedin.com/in/amna-coder200/',
}

// level: 1 = Intermediate, 2 = Proficient, 3 = Advanced
export const SKILLS = [
  {
    group: 'Mobile',
    items: [
      { name: 'React Native', icon: FaReact, level: 2, text: 'Cross-platform mobile app development using React' },
      { name: 'Expo', icon: SiExpo, level: 2, text: 'Fast and efficient React Native development workflow' },
      { name: 'REST APIs', icon: FaPlug, level: 2, text: 'Connecting applications with real-world backend APIs' },
      { name: 'Backend Integration', icon: FaServer, level: 1, text: 'Authentication, databases, and backend services' },
    ],
  },
  {
    group: 'Web',
    items: [
      { name: 'React', icon: FaReact, level: 3, text: 'Efficient, component-based UI development' },
      { name: 'JavaScript', icon: SiJavascript, level: 2, text: 'Dynamic, interactive, and functional web experiences' },
      { name: 'TypeScript', icon: SiTypescript, level: 2, text: 'Typed JavaScript for safer and scalable code' },
      { name: 'HTML5', icon: FaHtml5, level: 3, text: 'Semantic and accessible web structure' },
      { name: 'CSS3', icon: FaCss3Alt, level: 3, text: 'Modern, responsive, and adaptive styling' },
      { name: 'Bootstrap', icon: FaBootstrap, level: 3, text: 'Responsive design with prebuilt UI components' },
    ],
  },
  {
    group: 'Backend & Tools',
    items: [
      { name: 'Node.js', icon: FaNodeJs, level: 1, text: 'Server-side JavaScript and backend development' },
      { name: 'Git / GitHub', icon: FaGitAlt, level: 2, text: 'Version control and collaboration for projects' },
    ],
  },
]

export const LEVELS = { 1: 'Intermediate', 2: 'Proficient', 3: 'Advanced' }

export const JOURNEY = [
  { when: '2022-2023', title: 'Started coding', text: 'Began building real-world projects and sharpening problem solving.' },
  { when: 'Web', title: 'React for the web', text: 'Clean, responsive, component-based interfaces.' },
  { when: 'Mobile', title: 'React Native + Expo', text: 'Now my main focus: apps that feel smooth and native.' },
  { when: 'Learning now', title: 'Backend and UI/UX', text: 'Auth, databases, services, and modern design thinking.' },
  { when: 'Goal', title: 'Full-Stack Software Engineer', text: 'Complete applications across web and mobile.' },
]

// Add new projects here. type: 'mobile' | 'web'
export const PROJECTS = [
  {
    title: 'Docy',
    type: 'mobile',
    text: 'A mobile document toolkit app: everything you need to handle documents in one place.',
    tags: ['React Native', 'Expo'],
    color: '#3D4BFF',
    link: '',
  },
  {
    title: 'EasyPaisa Clone',
    type: 'mobile',
    text: 'A university project recreating a mobile wallet experience with smooth navigation.',
    tags: ['Expo', 'expo-router'],
    color: '#14B38B',
    link: '',
  },
]
