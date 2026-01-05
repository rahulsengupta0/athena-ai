import React from 'react';
import getStyles, { useResponsive } from "./Styles";
import modernuithumbnail from '../../assets/aigenerator/modern-ui-landing.jpg';
import blogcontentthumbnail from '../../assets/aigenerator/ai-blog-outline.jpg';
import dashboardthumbnail from '../../assets/aigenerator/dashboard-layout.jpg';

const Recent = () => {
  const isMobile = useResponsive();
  const styles = getStyles(isMobile);

  const [hoveredIdx, setHoveredIdx] = React.useState(null);
  const [activeBtn, setActiveBtn] = React.useState(null);

  const recentItems = [
    {
      id: 1,
      title: 'Modern UI Landing Page',
      type: 'Design Generator',
      date: 'October 22, 2025',
      thumbnail: modernuithumbnail,
      status: 'completed'
    },
    {
      id: 2,
      title: 'AI Blog Content Outline',
      type: 'Content Creator', 
      date: 'October 20, 2025',
      thumbnail: blogcontentthumbnail,
      status: 'completed'
    },
    {
      id: 3,
      title: 'Dashboard Layout Concept',
      type: 'Layout Builder',
      date: 'October 18, 2025',
      thumbnail: dashboardthumbnail,
      status: 'processing'
    },
  ];

  const handleOpen = (item) => {
    console.log('Opening:', item.title);
  };

  return (
    <div style={{ ...styles.quickActionsContainer, marginTop: '3rem' }}>
      <p style={styles.quickActionsTitle}>Recent Activity</p>
      <p style={styles.quickActionsSubtitle}>Your latest generated projects</p>

      <div style={styles.grid}>
        {recentItems.map((item, idx) => (
          <div
            key={item.id}
            style={hoveredIdx === idx ? { ...styles.card, ...styles.cardHover } : styles.card}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            onClick={() => handleOpen(item)}
          >
            {/* Thumbnail */}
            <div style={styles.thumbnailContainer}>
              <img
                src={item.thumbnail}
                alt={item.title}
                style={{
                  ...styles.imageThumbnail,
                  transform: hoveredIdx === idx ? 'scale(1.08)' : 'scale(1)',
                }}
              />
              <div style={{
                ...styles.statusBadge,
                backgroundColor: item.status === 'completed' ? '#e3f9e5' : '#fff3cd',
                color: item.status === 'completed' ? '#05944f' : '#856404'
              }}>
                {item.status === 'completed' ? '✓ Completed' : '⟳ Processing'}
              </div>
            </div>

            {/* Content */}
            <div style={styles.cardHeader}>
              <span style={styles.tag}>{item.type}</span>
              <span style={styles.title}>{item.title}</span>
            </div>
            
            <div style={styles.description}>
              Generated on {item.date}
            </div>

            {/* Action Button */}
            <button
              style={{
                ...styles.startButton,
                ...(hoveredIdx === idx ? styles.startButtonHover : {}),
                ...(activeBtn === idx ? styles.startButtonActive : {}),
              }}
              onMouseDown={() => setActiveBtn(idx)}
              onMouseUp={() => setActiveBtn(null)}
              onClick={(e) => {
                e.stopPropagation();
                handleOpen(item);
              }}
            >
              {item.status === 'processing' ? 'View Progress' : 'Open Project'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recent;
