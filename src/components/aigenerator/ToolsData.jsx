import {
  MdOutlineDesignServices,
  MdOutlineContentPaste,
  MdViewQuilt,
  MdImage,
} from 'react-icons/md';

export const tools = [
  {
    title: 'Design Generator',
    tag: 'Popular',
    icon: <MdOutlineDesignServices size={34} color="#9760ff" />,
    desc: 'Create stunning designs from text prompts using advanced AI',
    accuracy: 95,
    to: '/create/ai-design',
  },
  {
    title: 'Content Creator',
    tag: 'Pro',
    icon: <MdOutlineContentPaste size={34} color="#9760ff" />,
    desc: 'Generate compelling copy and marketing content instantly',
    accuracy: 88,
    to: '/create/content-writer',
  },
  {
    title: 'Layout Builder',
    tag: 'New',
    icon: <MdViewQuilt size={34} color="#9760ff" />,
    desc: 'Smart layout generation for web and mobile interfaces',
    accuracy: 92,
    to: '/create/brand-builder',
  },
  {
    title: 'Image Enhancer',
    tag: 'Beta',
    icon: <MdImage size={34} color="#9760ff" />,
    desc: 'AI-powered image editing and enhancement tools',
    accuracy: 78,
    to: '/create/image-enhancer',
  },
];
