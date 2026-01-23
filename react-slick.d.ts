declare module 'react-slick' {
  import React from 'react';
  
  interface Settings {
    accessibility?: boolean;
    adaptiveHeight?: boolean;
    afterChange?: (index: number) => void;
    appendDots?: (dots: React.ReactNode) => React.ReactNode;
    arrows?: boolean;
    autoplay?: boolean;
    autoplaySpeed?: number;
    beforeChange?: (currentSlide: number, nextSlide: number) => void;
    centerMode?: boolean;
    centerPadding?: string;
    className?: string;
    cssEase?: string;
    customPaging?: (i: number) => React.ReactNode;
    dots?: boolean;
    dotsClass?: string;
    draggable?: boolean;
    easing?: string;
    fade?: boolean;
    focusOnSelect?: boolean;
    infinite?: boolean;
    initialSlide?: number;
    lazyLoad?: string | boolean;
    nextArrow?: React.ReactNode;
    pauseOnFocus?: boolean;
    pauseOnHover?: boolean;
    prevArrow?: React.ReactNode;
    responsive?: Array<{
      breakpoint: number;
      settings: Settings;
    }>;
    rows?: number;
    rtl?: boolean;
    slide?: string;
    slidesPerRow?: number;
    slidesToScroll?: number;
    slidesToShow?: number;
    speed?: number;
    swipe?: boolean;
    swipeToSlide?: boolean;
    touchMove?: boolean;
    touchThreshold?: number;
    useCSS?: boolean;
    useTransform?: boolean;
    variableWidth?: boolean;
    vertical?: boolean;
    waitForAnimate?: boolean;
    [key: string]: any;
  }

  const Slider: React.ComponentType<Settings & { children?: React.ReactNode }>;
  export default Slider;
}
