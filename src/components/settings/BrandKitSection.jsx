import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const emptyForm = {
  name: '',
  tagline: '',
  primaryColor: '',
  secondaryColor: '',
  logoUrl: '',
};

const BrandKitSection = () => {
  const [kits, setKits] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const data = await api.getBrandKits();
      setKits(data || []);
    } catch (e) {
      console.error(e);
      alert('Failed to load brand kits');
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Brand Name is required');
      return;
    }
    setSubmitting(true);
    try {
      await api.createBrandKit(form);
      setForm(emptyForm);
      await load();
      alert('Brand kit created');
    } catch (e) {
      console.error(e);
      alert('Failed to create brand kit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this brand kit?')) return;
    try {
      await api.deleteBrandKit(id);
      await load();
    } catch (e) {
      console.error(e);
      alert('Failed to delete brand kit');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Brand Kit</h2>
        <p style={{ color: '#64748b', margin: '6px 0 0' }}>Create and manage your brand styles and logo</p>
      </div>

      <form onSubmit={handleSubmit} style={{
        border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 24
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Brand Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Acme Inc"
              style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="Build something great"
              style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Primary Color</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="color"
                value={form.primaryColor || '#000000'}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                style={{ width: 48, height: 40, border: '1px solid #e5e7eb', borderRadius: 8 }}
              />
              <input
                type="text"
                value={form.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                placeholder="#000000"
                style={{ flex: 1, padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Secondary Color</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="color"
                value={form.secondaryColor || '#000000'}
                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                style={{ width: 48, height: 40, border: '1px solid #e5e7eb', borderRadius: 8 }}
              />
              <input
                type="text"
                value={form.secondaryColor}
                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                placeholder="#000000"
                style={{ flex: 1, padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}
              />
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Logo URL</label>
            <input
              type="url"
              value={form.logoUrl}
              onChange={(e) => handleChange('logoUrl', e.target.value)}
              placeholder="https://..."
              style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}
            />
            <div style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>
              You can paste a logo URL for now. We’ll add in-app logo generation here.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '10px 16px', background: '#111827', color: 'white', border: 'none', borderRadius: 8,
              fontWeight: 600, cursor: 'pointer', opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? 'Saving...' : 'Create Brand Kit'}
          </button>
        </div>
      </form>

      <div>
        <h3 style={{ margin: '0 0 12px' }}>Your Brand Kits</h3>
        {kits.length === 0 ? (
          <div style={{ color: '#64748b' }}>No brand kits yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {kits.map(k => (
              <div key={k._id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700 }}>{k.name}</div>
                  <button
                    onClick={() => handleDelete(k._id)}
                    style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                    aria-label="Delete brand kit"
                  >
                    Delete
                  </button>
                </div>
                <div style={{ color: '#64748b', marginTop: 4 }}>{k.tagline}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: k.primaryColor || '#e5e7eb', border: '1px solid #e5e7eb' }} />
                    <code>{k.primaryColor || '—'}</code>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: k.secondaryColor || '#e5e7eb', border: '1px solid #e5e7eb' }} />
                    <code>{k.secondaryColor || '—'}</code>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  {k.logoUrl ? (
                    <img src={k.logoUrl} alt="Logo" style={{ maxWidth: 160, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  ) : (
                    <div style={{ color: '#94a3b8' }}>No logo</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandKitSection;


