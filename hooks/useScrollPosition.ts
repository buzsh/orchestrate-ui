import { useEffect, useRef } from 'react';

export const useScrollPosition = (key: string) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Restore scroll position on mount
    const savedPosition = localStorage.getItem(key);
    if (savedPosition && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedPosition);
    }

    // Save scroll position on unmount
    return () => {
      if (scrollRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        localStorage.setItem(key, scrollRef.current.scrollTop.toString());
      }
    };
  }, [key]);

  const handleScroll = () => {
    if (scrollRef.current) {
      localStorage.setItem(key, scrollRef.current.scrollTop.toString());
    }
  };

  return { scrollRef, handleScroll };
}; 
