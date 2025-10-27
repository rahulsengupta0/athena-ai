import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdFlashOn, MdTextFields, MdWidgets, MdAutoAwesome } from 'react-icons/md';
import styles from './Styles';

const actions = [
  {
    label: 'Auto Design',
    icon: <MdFlashOn size={22} color="#9760ff" />,
    description: 'Generate a design from your idea.',
    path: '/create/ai-design',
  },
  {
    label: 'Smart Copy',
    icon: <MdTextFields size={22} color="#9760ff" />,
    description: 'AI marketing copy, ready to use.',
    path:  '/create/content-writer',
  },
  {
    label: 'Layout Magic',
    icon: <MdWidgets size={22} color="#9760ff" />,
    description: 'Responsive layouts fast.',
    path: '/create/Brand-Builder',
  },
  {
    label: 'AI Enhance',
    icon: <MdAutoAwesome size={22} color="#9760ff" />,
    description: 'Upgrade assets for web.',
    path: '/create/artistic-image',
  },
];

const CARD_SIZE = {
  width: 175,
  height: 165,
  padding: '1.2rem',
};

const QuickActions = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = React.useState(null);

  return (
    <div style={styles.quickActionsContainer}>
      <p style={styles.quickActionsTitle}>Quick Actions</p>
      <p style={styles.quickActionsSubtitle}>Jump into popular workflows</p>
      <div
        style={{
          ...styles.quickActionsGrid,
          gap: '1.2rem',
          justifyContent: 'flex-start',
        }}
      >
        {actions.map((action, idx) => (
          <motion.div
            key={action.label}
            style={{
              background: hovered === idx ? '#f4f0ff' : '#fafafd',
              border: '1px solid #ebe9f5',
              borderRadius: '0.9rem',
              width: CARD_SIZE.width,
              minWidth: CARD_SIZE.width,
              height: CARD_SIZE.height,
              minHeight: CARD_SIZE.height,
              padding: CARD_SIZE.padding,
              boxShadow:
                hovered === idx
                  ? '0 4px 16px rgba(151,96,255,0.13)'
                  : '0 1px 5px rgba(151,96,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              position: 'relative',
              zIndex: hovered === idx ? 2 : 1,
              fontFamily: "'Inter', 'Poppins', Arial, sans-serif",
              transition: 'all 0.2s cubic-bezier(.24,1,.32,1)',
            }}
            whileHover={{
              scale: 1.035,
              boxShadow: '0 10px 28px rgba(151,96,255,0.16)',
              y: -3,
            }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate(action.path)}
          >
            <div
              style={{
                marginBottom: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ede6ff',
                borderRadius: '50%',
                width: 36,
                height: 36,
              }}
            >
              {action.icon}
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: '0.97rem',
                marginBottom: '.25rem',
                color: '#322957',
                textAlign: 'center',
                fontFamily: "'Poppins', 'Inter', sans-serif",
              }}
            >
              {action.label}
            </span>
            <span
              style={{
                color: '#7b7e8c',
                fontSize: '0.84rem',
                textAlign: 'center',
                marginBottom: '0.6rem',
              }}
            >
              {action.description}
            </span>
            <motion.button
              whileHover={{
                backgroundColor: '#9760ff',
                color: '#fff',
                scale: 1.04,
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                marginTop: '0.3rem',
                backgroundColor: '#ede6ff',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.4rem 0',
                width: '100%',
                fontWeight: 600,
                color: '#9760ff',
                fontSize: '0.93rem',
                boxShadow: '0 1px 4px rgba(151,96,255,0.04)',
                cursor: 'pointer',
                transition: 'all 0.18s cubic-bezier(.24,1,.32,1)',
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(action.path);
              }}
            >
              Go
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
