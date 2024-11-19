"use client";

import React, { createContext, useState, useContext } from 'react';

interface ProjectContextType {
  hoveredProject: string | null;
  setHoveredProject: (title: string | null) => void;
}

export const ProjectContext = createContext<ProjectContextType>({
  hoveredProject: null,
  setHoveredProject: () => {},
});

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <ProjectContext.Provider value={{ hoveredProject, setHoveredProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
