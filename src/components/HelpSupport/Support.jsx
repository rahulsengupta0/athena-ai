import React, { useState, useEffect } from 'react';
import './Support.css';
import ChatModal from './ChatModal'
import EmailSupport from './EmailSupport';

const Support = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'chat' | 'email' | 'phone' | 'docs'

  const categories = [
    'All Categories',
    'AI Tools',
    'Team & Collaboration',
    'Getting Started',
    'Account & Billing'
  ];

  const faqData = [
    {
      id: 1,
      question: "How accurate is the AI content generation?",
      answer: "Our AI maintains 94%+ accuracy across all tools. Quality scores are shown for each generation, and you can regenerate if needed.",
      category: "AI Tools",
      isPopular: true,
      tags: ["ai", "accuracy", "quality", "generation"],
      icon: "🤖"
    },
    {
      id: 2,
      question: "Can I train the AI with my brand guidelines?",
      answer: "Yes! Use the Brand Builder to upload your style guide, colors, fonts, and logos. The AI will learn and apply your brand consistently.",
      category: "AI Tools",
      isPopular: false,
      tags: ["brand", "training", "guidelines", "customization"],
      icon: "🎨"
    },
    {
      id: 3,
      question: "What languages are supported for content writing?",
      answer: "We support 25+ languages including English, Spanish, French, German, Chinese, Japanese, and more. Quality varies by language.",
      category: "AI Tools",
      isPopular: false,
      tags: ["languages", "content", "writing", "international"],
      icon: "🌍"
    },
    {
      id: 4,
      question: "How do I invite team members?",
      answer: "Go to Team Management, click 'Invite Member', enter their email and select a role. They'll receive an invitation to join your workspace.",
      category: "Team & Collaboration",
      isPopular: true,
      tags: ["team", "invite", "collaboration", "management"],
      icon: "👥"
    },
    {
      id: 5,
      question: "What are the different user roles?",
      answer: "Owner has full access, Admins can manage team and projects, Members can create and collaborate. Each role has specific permissions for security.",
      category: "Team & Collaboration",
      isPopular: false,
      tags: ["roles", "permissions", "security", "access"],
      icon: "🔐"
    },
    {
      id: 6,
      question: "How do I export my projects?",
      answer: "Click the export button in any project, choose your preferred format and quality settings, then download directly to your device or save to cloud storage.",
      category: "Getting Started",
      isPopular: true,
      tags: ["export", "download", "projects", "cloud"],
      icon: "📤"
    },
    {
      id: 7,
      question: "What's the difference between Pro and Free plans?",
      answer: "Pro plans include unlimited AI generations, advanced editing tools, team collaboration features, priority support, and commercial usage rights.",
      category: "Account & Billing",
      isPopular: true,
      tags: ["pricing", "pro", "features", "comparison"],
      icon: "💎"
    },
    {
      id: 8,
      question: "How do I cancel my subscription?",
      answer: "Go to Settings > Billing, click 'Manage Subscription', and follow the cancellation process. You'll retain access until the end of your billing period.",
      category: "Account & Billing",
      isPopular: false,
      tags: ["cancel", "billing", "subscription", "settings"],
      icon: "❌"
    }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'All Categories' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactSupport = () => {
    // Add contact support logic here
    console.log('Opening contact support...');
  };

  const handleFeedback = () => {
    // Add feedback logic here
    console.log('Opening feedback form...');
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  const renderModalContent = () => {
    if (!modalType) return null;

    if (modalType === 'chat') {
      return <ChatModal onClose={() => setModalType(null)} />;
    }


    if (modalType === 'email') {
      return <EmailSupport onClose={() => setModalType(null)} />;
    }

    if (modalType === 'phone') {
      return (
        <div className="modal-body">
          <h3>Phone Support</h3>
          <p>Call us at <strong>+1 (800) 555-0199</strong> Mon–Fri, 9am–6pm (UTC).</p>
          <div className="contact-actions">
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

  const groupedFAQs = filteredFAQs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {});

  return (
    <div className="support-container">
      {/* Header Section */}
      {/* <div className="support-header">
        <div className="header-content">
          <div className="header-left">
            <div className="support-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="header-text">
              <h1>Help & Support</h1>
              <p>Find answers, tutorials, and get help from our team</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="feedback-btn" onClick={handleFeedback}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Feedback
            </button>
            <button className="contact-support-btn" onClick={handleContactSupport}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Contact Support
            </button>
          </div>
        </div>
      </div> */}

      {/* Search Section
      <div className="search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search for help articles, tutorials, and more..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {isSearching && (
              <div className="search-loading">
                <div className="loading-spinner"></div>
              </div>
            )}
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div> */}

      {/* Filters Section */}
      {/* <div className="filters-section">
        <div className="filters-container">
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div> */}

      {/* FAQ Content */}
      <div className="faq-content">
        {Object.entries(groupedFAQs).map(([category, faqs]) => (
          <div key={category} className="faq-section">
            <h2 className="section-title">{category}</h2>
            <div className="faq-list">
              {faqs.map((faq) => (
                <div key={faq.id} className={`faq-item ${expandedFAQ === faq.id ? 'expanded' : ''}`}>
                  <div 
                    className="faq-question"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <div className="question-content">
                      <span className="faq-icon">{faq.icon}</span>
                      <span className="question-text">{faq.question}</span>
                    </div>
                    <div className="faq-badges">
                      {faq.isPopular && <span className="popular-badge">Popular</span>}
                      <span className={`expand-icon ${expandedFAQ === faq.id ? 'expanded' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                  {expandedFAQ === faq.id && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                      <div className="faq-tags">
                        {faq.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                      <div className="faq-actions">
                        <button className="helpful-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 10V19H4C3.46957 19 2.96086 18.7893 2.58579 18.4142C2.21071 18.0391 2 17.5304 2 17V12C2 11.4696 2.21071 10.9609 2.58579 10.5858C2.96086 10.2107 3.46957 10 4 10H7ZM7 10V5C7 4.46957 7.21071 3.96086 7.58579 3.58579C7.96086 3.21071 8.46957 3 9 3H13.5L15.5 5H19C19.5304 5 20.0391 5.21071 20.4142 5.58579C20.7893 5.96086 21 6.46957 21 7V12C21 12.5304 20.7893 13.0391 20.4142 13.4142C20.0391 13.7893 19.5304 14 19 14H15.5L13.5 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Helpful
                        </button>
                        <button className="not-helpful-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 14V5H20C20.5304 5 21.0391 5.21071 21.4142 5.58579C21.7893 5.96086 22 6.46957 22 7V12C22 12.5304 21.7893 13.0391 21.4142 13.4142C21.0391 13.7893 20.5304 14 20 14H17ZM17 14V19H13.5L11.5 21H9C8.46957 21 7.96086 20.7893 7.58579 20.4142C7.21071 20.0391 7 19.5304 7 19V14H4C3.46957 14 2.96086 13.7893 2.58579 13.4142C2.21071 13.0391 2 12.5304 2 12V7C2 6.46957 2.21071 5.96086 2.58579 5.58579C2.96086 5.21071 3.46957 5 4 5H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Not Helpful
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="modal-close" onClick={closeModal} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;

