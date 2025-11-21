import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Tabs from './Tabs';
import ToolCard from './ToolCard';
import QuickActions from './QuickActions';
import { tools } from './ToolsData';
import getStyles, { useResponsive } from "./Styles";
import Recent from './Recent';
import Analytics from './Analytics';

const AiGeneratorPage = () => {
  const isMobile = useResponsive();
  const styles = getStyles(isMobile);
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('AI Tools');
  const [hoveredTool, setHoveredTool] = React.useState(null);
  const [btnActive, setBtnActive] = React.useState(null);

  const tools = [
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
      to: '/docGenerator',
    },
    {
      title: 'Layout Builder',
      tag: 'New',
      icon: <MdViewQuilt size={34} color="#9760ff" />,
      desc: 'Smart layout generation for web and mobile interfaces',
      accuracy: 92,
      to: '/create/ai-design',
    },
    {
      title: 'Image Enhancer',
      tag: 'Beta',
      icon: <MdImage size={34} color="#9760ff" />,
      desc: 'AI-powered image editing and enhancement tools',
      accuracy: 78,
      to: '/create/image-creator',
    },
  ];

  const quickActions = [
    { label: 'Auto Design', icon: <MdFlashOn size={24} style={styles.quickActionIcon} /> },
    { label: 'Smart Copy', icon: <MdTextFields size={24} style={styles.quickActionIcon} /> },
    { label: 'Layout Magic', icon: <MdWidgets size={24} style={styles.quickActionIcon} /> },
    { label: 'AI Enhance', icon: <MdAutoAwesome size={24} style={styles.quickActionIcon} /> },
  ];

  return (
    <div style={styles.page}>
      <Header />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'AI Tools' && (
        <>
          <div style={styles.grid}>
            {tools.map((tool, idx) => (
              <ToolCard
                key={tool.title}
                tool={tool}
                idx={idx}
                hoveredTool={hoveredTool}
                setHoveredTool={setHoveredTool}
                navigate={navigate}
              />
            ))}
          </div>
          <QuickActions />
        </>
      )}
      {activeTab === 'Recent' && <Recent />}
      {activeTab === 'Analytics' && <Analytics />}
    </div>
  );
};

export default AiGeneratorPage;
