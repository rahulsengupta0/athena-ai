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
