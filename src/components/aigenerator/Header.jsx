import React from 'react';
import { MdOutlineDesignServices } from 'react-icons/md';
import styles from './Styles';

const Header = () => (
  <div style={{
    background: '#fbf9ff',
    borderRadius: '1.5rem',
    padding: '2.5rem 2.5rem 2rem 2.5rem',
    boxShadow: '0 6px 32px rgba(151,96,255,0.08)',
    marginBottom: '2.4rem'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1.2rem',
      marginBottom: '0.6rem'
    }}>
      <div style={{
        ...styles.titleIconBackground,
        width: 54,
        height: 54,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(90deg,#e9d5ff,#f3e8ff 90%)'
      }}>
        <MdOutlineDesignServices size={34} color="#9760ff" />
      </div>
      <div>
        <h1 style={{
          ...styles.mainTitle,
          fontSize: '2.4rem',
          fontWeight: '900',
          margin: 0,
          letterSpacing: '0.01rem',
          background: 'linear-gradient(90deg,#a084ee,#8f5cf7 80%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          AI Generator Studio
        </h1>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '0.7rem'
        }}>
          <span style={{ ...styles.badge, ...styles.badgeGreen, fontWeight: 800 }}>
            <span style={{ fontSize: 16, marginRight: 2 }}>●</span>
            AI Models Online
          </span>
          <span style={{ ...styles.badge, ...styles.badgeGray }}>
            47 generations today
          </span>
        </div>
      </div>
    </div>
    <p style={{
      ...styles.subtitle,
      marginTop: '1.4rem',
      fontSize: '1.04rem',
      color: '#6c5ce7',
      fontWeight: 600,
    }}>
      Create amazing content with advanced AI tools
    </p>
    {/* Optional: Add a divider or gradient underline for extra modern appeal */}
    <div style={{
      marginTop: '1.1rem',
      width: 80,
      height: 4,
      borderRadius: 99,
      background: 'linear-gradient(90deg,#a084ee,#8f5cf7 80%)',
      opacity: 0.12
    }} />
  </div>
);

export default Header;
