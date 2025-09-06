"use client";
import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function LinkedListNavigation() {
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  // Update navigation button states
  useEffect(() => {
    const updateNavigationState = () => {
      // Use the browser's built-in history tracking
      setCanGoBack(window.history.length > 1 && window.history.state !== null);
      setCanGoForward(typeof window.history.forward === 'function' && window.history.state !== null);
    };

    // Initial update
    updateNavigationState();

    // Listen for navigation events
    window.addEventListener('popstate', updateNavigationState);
    window.addEventListener('pushstate', updateNavigationState);
    window.addEventListener('replacestate', updateNavigationState);

    // Custom events for SPA navigation (if needed)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      window.dispatchEvent(new Event('pushstate'));
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event('replacestate'));
    };

    // Cleanup
    return () => {
      window.removeEventListener('popstate', updateNavigationState);
      window.removeEventListener('pushstate', updateNavigationState);
      window.removeEventListener('replacestate', updateNavigationState);
      
      // Restore original methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Go back in history
  const goBack = () => {
    if (canGoBack) {
      window.history.back();
    }
  };

  // Go forward in history
  const goForward = () => {
    if (canGoForward) {
      window.history.forward();
    }
  };

  return (
    <div className="linked-list-navigation">
      <button
        onClick={goBack}
        disabled={!canGoBack}
        className="nav-button back-button"
        aria-label="Go back"
      >
        <FiChevronLeft size={20} />
      </button>
      <button
        onClick={goForward}
        disabled={!canGoForward}
        className="nav-button forward-button"
        aria-label="Go forward"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
}