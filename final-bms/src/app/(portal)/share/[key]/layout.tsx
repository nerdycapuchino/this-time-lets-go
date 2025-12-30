// src/app/(portal)/share/[key]/layout.tsx
import '@/app/globals.css';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {children}
    </div>
  );
}