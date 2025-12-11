import React from 'react';
import getStyles, { useResponsive } from "./Styles";


const tabList = ['AI Tools', 'Recent', 'Analytics'];

const Tabs = ({ activeTab, setActiveTab }) => {
  const isMobile = useResponsive();
  const styles = getStyles(isMobile);
  
  return (
  <div style={styles.tabsRow}>
    {tabList.map((tab) => (
      <button
        key={tab}
        style={{
          ...styles.tab,
          ...(activeTab === tab
            ? { borderColor: '#9760ff', color: '#9760ff', fontWeight: '900' }
            : {}),
        }}
        onClick={() => setActiveTab(tab)}
      >
        {tab}
      </button>
    ))}
  </div>
);
};

export default Tabs;
