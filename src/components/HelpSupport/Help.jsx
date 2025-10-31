// Help.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Help.css";

const FAQ = [
  { id: 1, question: "How do I create my first AI design?", answer: "Navigate to the AI Design Generator, enter a detailed prompt describing your vision, and let our AI create stunning designs for you. You can then refine and customize the results.", category: "Getting Started", isPopular: true, tags: ["design","ai","generator"] },
  { id: 2, question: "What file formats are supported?", answer: "We support PNG, JPG, SVG, PDF for images, and MP4, MOV for videos. All exports maintain high quality for professional use.", category: "Getting Started", isPopular: false, tags: ["formats","export"] },
  { id: 3, question: "How do I collaborate with my team?", answer: "Use the Team workspace to invite members, share projects, and work together in real-time. You can assign roles, leave comments, and track changes.", category: "Team & Collaboration", isPopular: true, tags: ["team","collaboration","workspace"] },
  { id: 4, question: "Can I customize AI-generated content?", answer: "Absolutely! All AI-generated content can be edited, refined, and customized using our built-in tools. You have full control over the final output.", category: "AI Tools", isPopular: false, tags: ["customization","ai","editing"] },
];

const TUTORIALS = [
  { id: "t1", title: "Getting Started with AI Design", duration: "5 min read", category: "Getting Started", description: "Learn the basics of creating stunning designs with AI." },
  { id: "t2", title: "Advanced Customization Techniques", duration: "8 min read", category: "AI Tools", description: "Master advanced editing and customization features." },
  { id: "t3", title: "Team Collaboration Guide", duration: "6 min read", category: "Team & Collaboration", description: "Set up and manage team workspaces effectively." },
];

const CATEGORIES = ["All Categories","Getting Started","AI Tools","Team & Collaboration"];
const QUICK = ["FAQ","Tutorials","Contact","Feedback"];
const accordionVariants = {
  initial: { height:0, opacity:0 },
  animate: { height: "auto", opacity:1 },
  exit: { height:0, opacity:0 },
  transition: { duration:0.22 }
};

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedFilter, setSelectedFilter] = useState("FAQ");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("help:bookmarks") || "[]"); } catch { return []; }
  });
  const [votes, setVotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("help:votes") || "{}"); } catch { return {}; }
  });

  const searchTimer = useRef(null);

  // Debounced search
  useEffect(() => {
    setIsSearching(true);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setIsSearching(false), 300);
    return () => clearTimeout(searchTimer.current);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem("help:bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);
  useEffect(() => {
    localStorage.setItem("help:votes", JSON.stringify(votes));
  }, [votes]);

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQ.filter(
      f =>
        (selectedCategory === "All Categories" ? true : f.category === selectedCategory) &&
        (!q ||
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          f.tags.some(t => t.includes(q)))
    );
  }, [searchQuery, selectedCategory]);

  const filteredTutorials = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TUTORIALS.filter(
      t =>
        (selectedCategory === "All Categories" ? true : t.category === selectedCategory) &&
        (!q ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q))
    );
  }, [searchQuery, selectedCategory]);

  function toggleFAQ(id) { setExpandedFAQ(prev => prev === id ? null : id); }
  function toggleBookmark(id) { setBookmarks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); }
  function vote(id, v) { setVotes(prev => ({...prev, [id]: v})); }

  // small highlight for matches
  const highlight = (text) => {
    if (!searchQuery) return text;
    try {
      const q = searchQuery.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
      const re = new RegExp(`(${q})`,"ig");
      return text.split(re).map((p,i) => re.test(p) ? <mark key={i} className="hl" style={{background:'#f3e8ff',color:'#7c3aed'}}>{p}</mark> : <span key={i}>{p}</span>);
    } catch { return text; }
  };

  return (
    <div className="help-container">
      {/* Header */}
      <div className="help-header">
        <div className="header-content">
          <div className="header-left">
            <div className="help-icon" aria-hidden>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4"/><path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913" stroke="currentColor" strokeWidth="1.2"/></svg>
            </div>
            <div className="header-text">
              <h1>Help & Support</h1>
              <p>Find answers, tutorials, and get help from our team</p>
            </div>
          </div>
          <div>
            <button className="contact-support-btn" onClick={() => alert("Contact support opened (placeholder)")}>Contact Support</button>
          </div>
        </div>
      </div>
      <div className="search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#b194e9" strokeWidth="1.2"/></svg>
            <input className="search-input" placeholder="Search for help articles, tutorials, and more..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {isSearching && <div className="search-loading"><div className="loading-spinner" /></div>}
          </div>
        </div>
      </div>
      <div className="filters-section">
        <div className="filters-container">
          <div className="quick-filters">
            {QUICK.map(q => (
              <button key={q} className={`quick-filter-btn ${selectedFilter === q ? 'active' : ''}`} onClick={() => setSelectedFilter(q)}>
                {q}
              </button>
            ))}
          </div>
          <div className="category-filters">
            {CATEGORIES.map(cat => (
              <button key={cat} className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`} onClick={() => setSelectedCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="content-section">
        <AnimatePresence mode="wait">
          {selectedFilter === "FAQ" && (
            <motion.div key="faq" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}}>
              <h2 className="section-title">FAQ</h2>
              <div className="faq-list">
                {filteredFaqs.length === 0 && <div style={{padding:"32px 0",textAlign:"center",color:"#b7a0d3"}}>No results found.</div>}
                {filteredFaqs.map(f => {
                  const expanded = expandedFAQ === f.id;
                  return (
                    <div key={f.id} className={`faq-item${expanded ? " expanded" : ""}`}>
                      <div role="button" tabIndex={0} aria-expanded={expanded} className="faq-question"
                           onClick={() => toggleFAQ(f.id)}
                           onKeyDown={e => { if (e.key === "Enter" || e.key === " ") toggleFAQ(f.id); }}>
                        <span className="question-text">{highlight(f.question)}</span>
                        <div className="faq-badges">
                          {f.isPopular && <span className="popular-badge">Popular</span>}
                          <button className={`bookmark-btn ${bookmarks.includes(f.id) ? 'bookmarked' : ''}`}
                                   style={{background:"none",border:"none",fontSize:"1em",cursor:"pointer",color:"#a066f7"}}
                                   onClick={e => { e.stopPropagation(); toggleBookmark(f.id); }}>
                            {bookmarks.includes(f.id) ? '★' : '☆'}
                          </button>
                          <span className={`chev${expanded ? " rot" : ""}`}>▾</span>
                        </div>
                      </div>
                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div variants={accordionVariants} initial="initial" animate="animate" exit="exit" className="faq-answer">
                            <p>{highlight(f.answer)}</p>
                            <div>
                              {f.tags.map(t => <span key={t} className="tag">{t}</span>)}
                            </div>
                            <div style={{marginTop:10,display:"flex",gap:8}}>
                              <button className={`helpful-btn ${votes[f.id] === 'helpful' ? 'active' : ''}`} onClick={() => vote(f.id,'helpful')}>👍 Helpful</button>
                              <button className={`not-helpful-btn ${votes[f.id] === 'not-helpful' ? 'active' : ''}`} onClick={() => vote(f.id,'not-helpful')}>👎 Not Helpful</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
          {selectedFilter === "Tutorials" && (
            <motion.div key="tuts" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}}>
              <h2 className="section-title">Tutorials</h2>
              <div className="tutorials-grid">
                {filteredTutorials.map(t => (
                  <motion.div key={t.id} className="tutorial-card" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
                    <div className="tutorial-header">
                      <h3 className="tutorial-title">{t.title}</h3>
                      <span className="tutorial-duration">{t.duration}</span>
                    </div>
                    <p className="tutorial-description">{t.description}</p>
                    <div className="tutorial-footer">
                      <span className="tutorial-category">{t.category}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          {selectedFilter === "Contact" && (
            <motion.div key="contact" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}}>
              <h2 className="section-title">Contact Support</h2>
              <div className="contact-options">
                <div className="contact-card">
                  <div className="contact-icon">💬</div>
                  <h3>Live Chat</h3>
                  <p>Get instant help from our support team</p>
                  <button className="contact-btn">Start Chat</button>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">📧</div>
                  <h3>Email Support</h3>
                  <p>Send us a detailed message</p>
                  <button className="contact-btn">Send Email</button>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">📞</div>
                  <h3>Phone Support</h3>
                  <p>Speak directly with our team</p>
                  <button className="contact-btn">Call Now</button>
                </div>
              </div>
            </motion.div>
          )}
          {selectedFilter === "Feedback" && (
            <motion.div key="feedback" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}}>
              <h2 className="section-title">Share Your Feedback</h2>
              <div className="feedback-form">
                <div className="form-group">
                  <label>Feedback Type</label>
                  <select className="form-select">
                    <option>Feature Request</option>
                    <option>Bug Report</option>
                    <option>General Feedback</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Your Message</label>
                  <textarea className="form-textarea" rows={5} placeholder="Tell us what you think..." />
                </div>
                <button className="submit-feedback-btn">Submit Feedback</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
