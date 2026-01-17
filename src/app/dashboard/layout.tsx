import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppStateProvider } from '@/context/AppContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AppStateProvider>
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-[#efe8ff] via-[#e9e3ff] to-[#e1d7ff] text-slate-900">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-[#c7b6ff]/40" />
        <AppSidebar />
        <div className="relative flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="relative grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </div>
      </div>
    </AppStateProvider>
  );
}
