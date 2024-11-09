// app/layout.tsx
'use client';

import { GridProvider } from '@/app/context/GridContext';
import { useEffect } from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const setBodyHeight = () => {
      document.body.style.height = `${window.innerHeight}px`;
    };

    setBodyHeight();
    window.addEventListener('resize', setBodyHeight);
    return () => window.removeEventListener('resize', setBodyHeight);
  }, []);

  return (
    <html lang="en">
      <body className="overscroll-none select-none">
        <GridProvider>
          {/* Main Content */}
          <main 
            className="z-0"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              contain: 'content'
            }}
            data-router-wrapper=""
            data-scroll-container=""
          >
            <div 
              data-router-view="home"
              style={{ transform: 'translate3d(0px, 0px, 0px)' }}
            >
              {children}
            </div>
          </main>

          {/* Background Elements */}
          <div id="background" className="duration-1000 ease-in-out-cubic fixed inset-0 transition-[background-color] z-[-2] bg-primary" />
          <div id="curtain" className="bottom-0 fixed left-0 pointer-events-none right-0 top-0 z-[-1]" />
          
          {/* Border Elements */}
          <div className="borders fixed h-full left-0 scale-[1.2] top-0 w-full z-[-3]">
            <div className="bg-gray border-left fixed h-screen left-[8vw] top-0 w-[1px] z-[-3]" />
            <div className="bg-black border-anim border-left fixed h-screen left-[8vw] scale-y-0 top-0 w-[1px] z-[-3]" />
            <div className="bg-gray border-right fixed h-screen right-[8vw] top-0 w-[1px] z-[-3]" />
            <div className="bg-black border-anim border-right fixed h-screen right-[8vw] scale-y-0 top-0 w-[1px] z-[-3]" />
          </div>
        </GridProvider>
      </body>
    </html>
  );
}