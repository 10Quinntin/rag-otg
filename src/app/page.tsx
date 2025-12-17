'use client';

import ChatInterface from '@/components/ChatInterface';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1e1e1e] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl">
          <ChatInterface />
        </div>
      </div>
    </main>
  );
}

