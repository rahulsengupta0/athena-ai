import React from 'react';
import { MdOutlineDesignServices } from 'react-icons/md';
import styles from './styles';

const Header = () => (
  <div style={styles.header}>
    <div style={styles.titleRow}>
      <div style={styles.titleIconBackground}>
        <MdOutlineDesignServices size={28} color="#9760ff" />
      </div>
      <h1 style={styles.mainTitle}>AI Generator Studio</h1>
    </div>
    <div style={styles.badgeRow}>
      <span style={{ ...styles.badge, ...styles.badgeGreen }}>AI Models Online</span>
      <span style={{ ...styles.badge, ...styles.badgeGray }}>47 generations today</span>
    </div>
    <p style={styles.subtitle}>Create amazing content with advanced AI tools</p>
  </div>
);

export default Header;
