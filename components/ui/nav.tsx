"use client";

import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientBlob } from './GradientBlob';
import { useProjectStore } from '@/stores/projectStore';

interface NavProps {
  projectTitle?: string;
}

const menuItems = [
  { title: 'work', href: '/work' },
  { title: 'about', href: '/about' },
  { title: 'everything else', href: '/everything-else' },
];

export function Nav({ projectTitle }: NavProps) {
  const { projectName } = useProjectStore();

  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);


  return (
    <>
      <GradientBlob />
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 h-32 z-[9999]",
        "flex items-center justify-between px-6",
        "transition-opacity duration-300 mix-blend-difference text-white"
      )}>
        {/* Left section with name and project title */}
        <div className="flex items-center gap-[30px]">
          <div className="text-lg font-medium uppercase cursor-default">
            Jen Liu
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={projectName || "default"}
              className="text-lg cursor-default"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1]
              }}
            >
              {projectName || "Designs with logic and love"}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right section with view switcher and menu */}
        <div className="flex items-center">
          {/* View Switcher */}
          <div className="text-sm text-muted-foreground/50 mr-[20vw] cursor-default">
            GRID / PAN
          </div>

          {/* Menu */}
          <div
            className="relative"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
          >
            <button
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 
                       hover:bg-white/20 transition-all duration-200"
            >
              menu
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full right-0 mb-2 flex flex-col items-end gap-2"
                >
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 
                                 hover:bg-white/20 transition-all duration-200 block whitespace-nowrap"
                      >
                        {item.title}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </>
  );
}
