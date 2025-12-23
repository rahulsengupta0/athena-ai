import React from 'react';

const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Poppins',
  'Lato',
  'Raleway',
  'Merriweather',
  'Playfair Display',
  'Inter',
  'Nunito',
  'Ubuntu',
];

const FontFamilySelector = ({ value, onChange }) => {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Font Family</span>
      <select
        value={value || 'Poppins'}
        onChange={(e) => onChange(e.target.value)}
        style={{
          borderRadius: 12,
          border: '1px solid rgba(148, 163, 184, 0.35)',
          padding: '8px 10px',
          fontSize: '0.9rem',
          fontFamily: 'inherit',
          background: '#fff',
          cursor: 'pointer',
        }}
      >
        {FONT_FAMILIES.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </select>
    </label>
  );
};

export default FontFamilySelector;


















