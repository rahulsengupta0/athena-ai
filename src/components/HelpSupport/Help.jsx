import React, { useState, useEffect } from 'react';
import './Help.css';


const Help = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

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
      return (
        <div className="modal-body">
          <h3>Live Chat</h3>
          <p>Start a conversation with our support team. Typical reply time: under 2 minutes.</p>
          <div className="chat-window">
            <div className="chat-message bot">Hi! How can we help you today?</div>
            <div className="chat-message user">I have a question about billing.</div>
          </div>
          <div className="chat-input-row">
            <input className="chat-input" placeholder="Type your message..." />
            <button className="chat-send">Send</button>
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
          </div>
          <button className="primary-btn">Send Email</button>
        </div>
      );
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

    return null;
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedFilter, setSelectedFilter] = useState('FAQ');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const categories = [
    'All Categories',
    'Getting Started',
    'AI Tools',
    'Team & Collaboration'
  ];

  const quickFilters = [
    'FAQ',
    'Tutorials',
    'Contact',
    'Feedback'
  ];

  const faqData = [
    {
      id: 1,
      question: "How do I create my first AI design?",
      answer: "Navigate to the AI Design Generator, enter a detailed prompt describing your vision, and let our AI create stunning designs for you. You can then refine and customize the results.",
      category: "Getting Started",
      isPopular: true,
      tags: ["design", "ai", "generator", "tutorial"]
    },
    {
      id: 2,
      question: "What file formats are supported?",
      answer: "We support PNG, JPG, SVG, PDF for images, and MP4, MOV for videos. All exports maintain high quality for professional use.",
      category: "Getting Started",
      isPopular: false,
      tags: ["formats", "export", "images", "videos"]
    },
    {
      id: 3,
      question: "How do I collaborate with my team?",
      answer: "Use the Team workspace to invite members, share projects, and work together in real-time. You can assign roles, leave comments, and track changes.",
      category: "Team & Collaboration",
      isPopular: true,
      tags: ["team", "collaboration", "workspace", "sharing"]
    },
    {
      id: 4,
      question: "Can I customize AI-generated content?",
      answer: "Absolutely! All AI-generated content can be edited, refined, and customized using our built-in tools. You have full control over the final output.",
      category: "AI Tools",
      isPopular: false,
      tags: ["customization", "ai", "editing", "tools"]
    },
    {
      id: 5,
      question: "How do I export my projects?",
      answer: "Click the export button in any project, choose your preferred format and quality settings, then download directly to your device or save to cloud storage.",
      category: "Getting Started",
      isPopular: false,
      tags: ["export", "download", "projects", "cloud"]
    },
    {
      id: 6,
      question: "What's the difference between Pro and Free plans?",
      answer: "Pro plans include unlimited AI generations, advanced editing tools, team collaboration features, priority support, and commercial usage rights.",
      category: "Getting Started",
      isPopular: true,
      tags: ["pricing", "pro", "features", "comparison"]
    }
  ];

  const tutorialData = [
    {
      id: 1,
      title: "Getting Started with AI Design",
      duration: "5 min read",
      category: "Getting Started",
      description: "Learn the basics of creating stunning designs with AI"
    },
    {
      id: 2,
      title: "Advanced Customization Techniques",
      duration: "8 min read",
      category: "AI Tools",
      description: "Master advanced editing and customization features"
    },
    {
      id: 3,
      title: "Team Collaboration Guide",
      duration: "6 min read",
      category: "Team & Collaboration",
      description: "Set up and manage team workspaces effectively"
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

  const filteredTutorials = tutorialData.filter(tutorial => {
    const matchesCategory = selectedCategory === 'All Categories' || tutorial.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactSupport = () => {
    // Add contact support logic here
    console.log('Opening contact support...');
  };

  const renderContent = () => {
    if (selectedFilter === 'FAQ') {
      return (
        <div className="faq-section">
          <h2 className="section-title">Getting Started</h2>
          <div className="faq-list">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className={`faq-item ${expandedFAQ === faq.id ? 'expanded' : ''}`}>
                <div 
                  className="faq-question"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <span className="question-text">{faq.question}</span>
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
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (selectedFilter === 'Tutorials') {
      return (
        <div className="tutorials-section">
          <h2 className="section-title">Tutorials</h2>
          <div className="tutorials-grid">
            {filteredTutorials.map((tutorial) => (
              <div key={tutorial.id} className="tutorial-card">
                <div className="tutorial-header">
                  <h3 className="tutorial-title">{tutorial.title}</h3>
                  <span className="tutorial-duration">{tutorial.duration}</span>
                </div>
                <p className="tutorial-description">{tutorial.description}</p>
                <div className="tutorial-footer">
                  <span className="tutorial-category">{tutorial.category}</span>
                  <button className="read-more-btn">Read More</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (selectedFilter === 'Contact') {
      return (
        <div className="contact-section">
          <h2 className="section-title">Contact Support</h2>
          <div className="contact-options">
            <div className="contact-card">
              <div className="contact-icon">💬</div>
              <h3>Live Chat</h3>
              <p>Get instant help from our support team</p>
              <button className="contact-btn" onClick={() => openModal('chat')}>Start Chat</button>
            </div>

            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h3>Email Support</h3>
              <p>Send us a detailed message</p>
              <button className="contact-btn" onClick={() => openModal('email')}>Send Email</button>
            </div>

            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Phone Support</h3>
              <p>Speak directly with our team</p>
              <button className="contact-btn" onClick={() => openModal('phone')}>Call Now</button>
            </div>
          </div>
        </div>
      );
    }


    if (selectedFilter === 'Feedback') {
      return (
        <div className="feedback-section">
          <h2 className="section-title">Share Your Feedback</h2>
          <div className="feedback-form">
            <div className="form-group">
              <label htmlFor="feedback-type">Feedback Type</label>
              <select id="feedback-type" className="form-select">
                <option>Feature Request</option>
                <option>Bug Report</option>
                <option>General Feedback</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="feedback-message">Your Message</label>
              <textarea 
                id="feedback-message" 
                className="form-textarea"
                placeholder="Tell us what you think..."
                rows="5"
              ></textarea>
            </div>
            <button className="submit-feedback-btn">Submit Feedback</button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="help-container">
      <div className="help-header">
        <div className="header-content">
          <div className="header-left">
            <div className="help-icon">
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
          <button className="contact-support-btn" onClick={handleContactSupport}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Contact Support
          </button>
        </div>
      </div>

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
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters-container">
          <div className="quick-filters">
            {quickFilters.map((filter) => (
              <button
                key={filter}
                className={`quick-filter-btn ${selectedFilter === filter ? 'active' : ''}`}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* 👇 Hide category filters when Contact or Feedback is selected */}
          {selectedFilter !== 'Contact' && selectedFilter !== 'Feedback' && (
          <div
            className={`category-filters ${
              selectedFilter === 'Contact' || selectedFilter === 'Feedback' ? 'hidden' : ''
            }`}
          >
            {selectedFilter !== 'Contact' && selectedFilter !== 'Feedback' &&
              categories.map((category) => (
                <button
                  key={category}
                  className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
          </div>

          )}
        </div>
      </div>


            <div className="content-section">
              {renderContent()}
            </div>

            {isModalOpen && (
              <div className="modal-overlay" onClick={closeModal}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <button className="modal-close" onClick={closeModal} aria-label="Close">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

export default Help;
