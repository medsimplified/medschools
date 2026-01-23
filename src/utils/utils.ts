export const animationCreate = async () => {
  if (typeof window !== 'undefined') {
    try {
      const { WOW } = await import('wowjs');
      if (WOW && typeof WOW === 'function') {
        new WOW({ live: false }).init();
      }
    } catch (error) {
      // WOW.js is optional for animations, silently ignore if not available
      console.warn('WOW.js not available, skipping animations');
    }
  }
};
