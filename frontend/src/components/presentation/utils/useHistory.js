import { useState, useEffect } from 'react';

/**
 * Custom hook for managing undo/redo history
 * @param {Array} initialSlides - Initial slides state
 * @returns {Object} History management functions and state
 */
export const useHistory = (initialSlides) => {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize history with initial state
  useEffect(() => {
    if (history.length === 0 && initialSlides.length > 0) {
      const initialState = JSON.parse(JSON.stringify(initialSlides));
      setHistory([initialState]);
      setHistoryIndex(0);
    }
  }, []);

  /**
   * Save a new state to history
   * @param {Array} newSlides - New slides state to save
   */
  const saveToHistory = (newSlides) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newSlides)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  /**
   * Undo to previous state
   * @param {Array} currentSlides - Current slides state
   * @param {Function} setSlides - Function to update slides
   * @param {string} activeSlideId - Currently active slide ID
   * @param {Function} setActiveSlideId - Function to update active slide ID
   * @param {Function} setSelectedLayerId - Function to clear selected layer
   * @returns {boolean} Whether undo was successful
   */
  const handleUndo = (currentSlides, setSlides, activeSlideId, setActiveSlideId, setSelectedLayerId) => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const restoredSlides = JSON.parse(JSON.stringify(history[newIndex]));
      setSlides(restoredSlides);
      
      // Update active slide if it still exists
      if (restoredSlides.length > 0) {
        const currentActive = restoredSlides.find(s => s.id === activeSlideId);
        if (!currentActive) {
          setActiveSlideId(restoredSlides[0].id);
        }
      }
      setSelectedLayerId(null);
      return true;
    }
    return false;
  };

  /**
   * Redo to next state
   * @param {Array} currentSlides - Current slides state
   * @param {Function} setSlides - Function to update slides
   * @param {string} activeSlideId - Currently active slide ID
   * @param {Function} setActiveSlideId - Function to update active slide ID
   * @param {Function} setSelectedLayerId - Function to clear selected layer
   * @returns {boolean} Whether redo was successful
   */
  const handleRedo = (currentSlides, setSlides, activeSlideId, setActiveSlideId, setSelectedLayerId) => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const restoredSlides = JSON.parse(JSON.stringify(history[newIndex]));
      setSlides(restoredSlides);
      
      // Update active slide if it still exists
      if (restoredSlides.length > 0) {
        const currentActive = restoredSlides.find(s => s.id === activeSlideId);
        if (!currentActive) {
          setActiveSlideId(restoredSlides[0].id);
        }
      }
      setSelectedLayerId(null);
      return true;
    }
    return false;
  };

  return {
    history,
    historyIndex,
    historyLength: history.length,
    saveToHistory,
    handleUndo,
    handleRedo,
  };
};

