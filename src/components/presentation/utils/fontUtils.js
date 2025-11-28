export const getKonvaFontStyle = (fontStyle, fontWeight) => {
  const parts = [];

  if (fontStyle === 'italic') {
    parts.push('italic');
  }

  if (fontWeight === 'bold' || fontWeight === '700' || fontWeight === 700) {
    parts.push('bold');
  }

  return parts.length ? parts.join(' ') : 'normal';
};

