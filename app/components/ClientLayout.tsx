// components/ClientLayout.tsx
'use client';

import { GridProvider } from '@/app/context/GridContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <GridProvider>{children}</GridProvider>;
}