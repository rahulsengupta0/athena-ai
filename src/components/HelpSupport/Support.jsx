// Support.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Support.css";

const FAQ_DATA = [
  { id: 1, question: "How accurate is the AI content generation?", answer: "Our AI maintains 94%+ accuracy across all tools. Quality scores are shown for each generation, and you can regenerate if needed.", category: "AI Tools", isPopular: true, tags: ["ai","accuracy","quality","generation"], icon: "🤖" },
  { id: 2, question: "Can I train the AI with my brand guidelines?", answer: "Yes! Use the Brand Builder to upload your style guide, colors, fonts, and logos. The AI will learn and apply your brand consistently.", category: "AI Tools", isPopular: false, tags: ["brand","training","guidelines","customization"], icon: "🎨" },
  { id: 3, question: "What languages are supported for content writing?", answer: "We support 25+ languages including English, Spanish, French, German, Chinese, Japanese, and more. Quality varies by language.", category: "AI Tools", isPopular: false, tags: ["languages","content","writing","international"], icon: "🌍" },
  { id: 4, question: "How do I invite team members?", answer: "Go to Team Management, click 'Invite Member', enter their email and select a role. They'll receive an invitation to join your workspace.", category: "Team & Collaboration", isPopular: true, tags: ["team","invite","collaboration","management"], icon: "👥" },
  { id: 5, question: "What are the different user roles?", answer: "Owner has full access, Admins can manage team and projects, Members can create and collaborate. Each role has specific permissions for security.", category: "Team & Collaboration", isPopular: false, tags: ["roles","permissions","security","access"], icon: "🔐" },
  { id: 6, question: "How do I export my projects?", answer: "Click the export button in any project, choose your preferred format and quality settings, then download directly to your device or save to cloud storage.", category: "Getting Started", isPopular: true, tags: ["export","download","projects","cloud"], icon: "📤" },
  { id: 7, question: "What's the difference between Pro and Free plans?", answer: "Pro plans include unlimited AI generations, advanced editing tools, team collaboration features, priority support, and commercial usage rights.", category: "Account & Billing", isPopular: true, tags: ["pricing","pro","features","comparison"], icon: "💎" },
  { id: 8, question: "How do I cancel my subscription?", answer: "Go to Settings > Billing, click 'Manage Subscription', and follow the cancellation process. You'll retain access until the end of your billing period.", category: "Account & Billing", isPopular: false, tags: ["cancel","billing","subscription","settings"], icon: "❌" },
];

const CATEGORIES = ["All Categories", "AI Tools", "Team & Collaboration", "Getting Started", "Account & Billing"];
const motionAccordion = { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.19, ease: "easeOut" }, };

export default function Support() {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isSearching, setIsSearching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("support:bookmarks") || "[]"); } catch { return []; }
  });
  const [votes, setVotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("support:votes") || "{}"); } catch { return {}; }
  });

  const [agentsOnline, setAgentsOnline] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAgentsOnline(Math.random() > 0.4), 500);
    return () => clearTimeout(t);
  }, []);

  // Debounced search
  const [searchResults, setSearchResults] = useState(FAQ_DATA);
  const searchDebounceRef = useRef(null);
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    setIsSearching(true);
    searchDebounceRef.current = setTimeout(() => {
      const q = searchQuery.trim().toLowerCase();
      let results = FAQ_DATA.filter((f) => (selectedCategory === "All Categories" ? true : f.category === selectedCategory));
      if (q) {
        results = results.filter((f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          f.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      setSearchResults(results);
      setIsSearching(false);
    }, 220);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchQuery, selectedCategory]);

  useEffect(() => { localStorage.setItem("support:bookmarks", JSON.stringify(bookmarks)); }, [bookmarks]);
  useEffect(() => { localStorage.setItem("support:votes", JSON.stringify(votes)); }, [votes]);

  const toggleFAQ = (id) => setExpandedFAQ(expandedFAQ === id ? null : id);
  const toggleBookmark = (id) => setBookmarks((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const setVote = (id, val) => setVotes((prev) => ({ ...prev, [id]: val }));
  const clearSearch = () => setSearchQuery("");
  const openModal = (type) => { setModalType(type); setIsModalOpen(true); };
  const closeModal = () => { setModalType(null); setIsModalOpen(false); };

  const highlight = (text) => {
    if (!searchQuery) return text;
    try {
      const q = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(${q})`, "ig");
      return text.split(re).map((part, i) =>
        re.test(part) ? <mark key={i} style={{ background: "#f3e8ff", color: "#7918f2" }}>{part}</mark> : <span key={i}>{part}</span>
      );
    } catch {
      return text;
    }
  };

  const grouped = useMemo(() => {
    const map = {};
    searchResults.forEach((f) => {
      if (!map[f.category]) map[f.category] = [];
      map[f.category].push(f);
    });
    return map;
  }, [searchResults]);

  // Modals (reuse your modal render logic)
  const renderModalContent = () => {
    if (!modalType) return null;
    if (modalType === 'chat') {
      return (
        <div className="modal-body">
          <h3>Live Chat</h3>
          <p>Start a conversation with our support team. Typical reply time: under 2 minutes.</p>
          <div className="chat-window">
            <div className="chat-message bot">Hi! How can we help you today?</div>
            <div className="chat-message user">I have a question about billing.</div>
          </div>
          <div className="chat-input-row" style={{display:"flex",gap:"9px"}}>
            <input className="chat-input" placeholder="Type your message..." />
            <button className="primary-btn">Send</button>
          </div>
        </div>
      );
    }
    if (modalType === 'email') {
      return (
        <div className="modal-body">
          <h3>Email Support</h3>
          <p>Send us a detailed message and we’ll get back to you within 24 hours.</p>
          <div className="form-grid">
            <input className="form-input" placeholder="Your email" type="email" />
            <input className="form-input" placeholder="Subject" />
            <textarea className="form-textarea" placeholder="Describe your issue..." rows="6" />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="secondary-btn" onClick={closeModal}>Cancel</button>
              <button className="primary-btn">Send Email</button>
            </div>
          </div>
        </div>
      );
    }
    if (modalType === 'phone') {
      return (
        <div className="modal-body">
          <h3>Phone Support</h3>
          <p>Call us at <strong>+1 (800) 555-0199</strong> Mon–Fri, 9am–6pm (UTC).</p>
          <div className="contact-actions" style={{display:'flex',gap:10}}>
            <a className="primary-btn" href="tel:+18005550199">Call Now</a>
            <a className="secondary-btn" href="https://cal.com" target="_blank" rel="noreferrer">Schedule a Call</a>
          </div>
        </div>
      );
    }
    if (modalType === 'docs') {
      return (
        <div className="modal-body">
          <h3>Documentation</h3>
          <p>Browse our guides and tutorials to learn everything about Athena AI.</p>
          <ul className="doc-links">
            <li><a href="#" className="doc-link">Getting Started Guide</a></li>
            <li><a href="#" className="doc-link">AI Tools Handbook</a></li>
            <li><a href="#" className="doc-link">Team Collaboration</a></li>
            <li><a href="#" className="doc-link">Billing & Accounts</a></li>
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="support-container">
      {/* Header
      <div className="support-header">
        <div className="header-left">
          <div className="support-icon" aria-hidden>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4"/><path d="M9 9c.4-1 1-1.5 3-1.5s2.6.5 3 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </div>
          <div className="header-text">
            <h1>Help & Support</h1>
            <p>Find answers, tutorials, and get help from our team</p>
            <div style={{marginTop:8}}><span className={`agent-pill ${agentsOnline ? 'online' : 'offline'}`}>{agentsOnline ? 'Agents online' : 'No agents available'}</span></div>
          </div>
        </div>
        <div className="header-actions">
          <button className="feedback-btn" onClick={() => openModal('email')}>Feedback</button>
          <button className="contact-support-btn" onClick={() => openModal('chat')}>Contact Support</button>
        </div>
      </div> */}

      {/* Search
      <div className="search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#a066f7" strokeWidth="1.2"/><path d="M21 21L16.65 16.65" stroke="#a066f7" strokeWidth="1.2" strokeLinecap="round"/></svg>
            <input className="search-input" placeholder="Search for help articles, tutorials, and more..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} aria-label="Search help" />
            {isSearching ? <div className="search-loading"><div className="loading-spinner" /></div> : (searchQuery ? <button className="clear-search" onClick={clearSearch} aria-label="Clear search">✕</button> : null)}
          </div>
        </div>
      </div> */}

      {/* Filters */}
      <div className="filters-section">
        <div className="category-filters" role="tablist">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`} onClick={() => setSelectedCategory(cat)} role="tab" aria-selected={selectedCategory === cat}>
                {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Content */}
      <div className="faq-content">
        {Object.keys(grouped).length === 0 && <div className="no-results" style={{textAlign:'center',color:'#9a86b8',padding:'72px 0'}}>No results. Try different keywords or categories.</div>}
        {Object.entries(grouped).map(([category, faqs]) => (
          <div key={category} className="faq-section">
            <h2 className="section-title">{category}</h2>
            <div className="faq-list">
              {faqs.map(faq => {
                const isExpanded = expandedFAQ === faq.id;
                return (
                  <div key={faq.id} className={`faq-item ${isExpanded ? 'expanded' : ''}`}>
                    <div
                      id={`faq-${faq.id}`}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      aria-controls={`faq-answer-${faq.id}`}
                      className="faq-question"
                      onClick={() => toggleFAQ(faq.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFAQ(faq.id);} }}
                    >
                      <div className="question-content">
                        <span className="faq-icon">{faq.icon}</span>
                        <div>
                          <div className="question-text">{highlight(faq.question)}</div>
                        </div>
                      </div>
                      <div className="faq-badges">
                        {faq.isPopular && <span className="popular-badge">Popular</span>}
                        <button className={`bookmark-btn ${bookmarks.includes(faq.id) ? 'bookmarked' : ''}`} style={{background:'none',border:'none',color:'#a066f7',fontSize:'1.2em',cursor:'pointer'}} onClick={(e) => { e.stopPropagation(); toggleBookmark(faq.id); }}>{bookmarks.includes(faq.id) ? '★' : '☆'}</button>
                        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`} aria-hidden>▾</span>
                      </div>
                    </div>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key={`answer-${faq.id}`}
                          id={`faq-answer-${faq.id}`}
                          role="region"
                          aria-labelledby={`faq-${faq.id}`}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          variants={motionAccordion}
                          className="faq-answer"
                        >
                          <p>{highlight(faq.answer)}</p>
                          <div className="faq-tags">
                            {faq.tags.map((tag, idx) => <span key={idx} className="tag">{tag}</span>)}
                          </div>
                          <div className="faq-actions">
                            <button className={`helpful-btn ${votes[faq.id] === 'helpful' ? 'active' : ''}`} onClick={() => setVote(faq.id, 'helpful')}>👍 Helpful</button>
                            <button className={`not-helpful-btn ${votes[faq.id] === 'not-helpful' ? 'active' : ''}`} onClick={() => setVote(faq.id, 'not-helpful')}>👎 Not Helpful</button>
                            <button className="open-contact-btn" onClick={() => openModal('email')}>Contact Support</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="quick-actions-grid">
          <div className="quick-action-card">
            <div className="action-icon">💬</div>
            <h3>Live Chat</h3>
            <p>Get instant help from our support team</p>
            <button className="action-btn" onClick={() => openModal('chat')}>Start Chat</button>
          </div>
          <div className="quick-action-card">
            <div className="action-icon">📧</div>
            <h3>Email Support</h3>
            <p>Send us a detailed message</p>
            <button className="action-btn" onClick={() => openModal('email')}>Send Email</button>
          </div>
          <div className="quick-action-card">
            <div className="action-icon">📞</div>
            <h3>Phone Support</h3>
            <p>Speak directly with our team</p>
            <button className="action-btn" onClick={() => openModal('phone')}>Call Now</button>
          </div>
          <div className="quick-action-card">
            <div className="action-icon">📚</div>
            <h3>Documentation</h3>
            <p>Browse our comprehensive guides</p>
            <button className="action-btn" onClick={() => openModal('docs')}>View Docs</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
              <motion.div className="modal" initial={{ scale: 0.98, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 12 }} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <button className="modal-close" onClick={closeModal} aria-label="Close">✕</button>
                </div>
                {renderModalContent()}
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
