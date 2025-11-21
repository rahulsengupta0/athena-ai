import React, { useState } from 'react';

const designOptions = [
  { label: "Mobile App UI Design", value: "mobile" },
  { label: "Web Design UI Photo Generator", value: "web" },
];

export default function UiPhotoGenerator() {
  const [selectedOption, setSelectedOption] = useState(designOptions[0].value);
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");

  const sizes = ['1024x1024', '1280x720', '720x1280'];

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24, background: '#fcf9ef', borderRadius: 12 }}>
      <h2 style={{ marginBottom: 16 }}>UI Photo Generator</h2>
      <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
        {designOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setSelectedOption(opt.value)}
            style={{
              padding: '8px 18px',
              borderRadius: 20,
              background: selectedOption === opt.value ? '#c0a166' : '#eee',
              color: selectedOption === opt.value ? '#fff' : '#000',
              border: 'none',
              fontWeight: 500,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontWeight: 500 }}>Describe Your Design:</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            marginTop: 8,
            padding: 10,
            fontSize: 16,
            borderRadius: 8,
            border: '1px solid #ddd',
            resize: 'vertical',
          }}
          placeholder={'Describe the UI design you want to generate...'}
        />
      </div>
      <div style={{ marginBottom: 12, display: 'flex', gap: 10 }}>
        <span style={{ fontWeight: 500 }}>Size:</span>
        {sizes.map(sz => (
          <button
            key={sz}
            onClick={() => setSize(sz)}
            style={{
              background: size === sz ? '#c0a166' : '#eee',
              color: size === sz ? '#fff' : '#000',
              padding: '4px 14px',
              border: 'none',
              borderRadius: 10,
            }}
          >
            {sz}
          </button>
        ))}
      </div>
      <button
        style={{
          padding: '10px 30px',
          background: "linear-gradient(90deg,#c0a166,#deb47c,#fff3e3)",
          color: '#222',
          borderRadius: 18,
          border: 'none',
          fontWeight: 600,
          fontSize: 15
        }}
      >
        Generate UI Photo
      </button>
    </div>
  );
}
