import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GroundTruth • Verifiable AI Fact-Checking & Grounding Benchmark',
  description: 'Decomposing AI answers into atomic claims, grounding each in live SerpApi evidence, and ranking models by verifiable factual grounding.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" class="dark scroll-smooth">
      <body class="bg-[#050811] text-[#F3F4F6] antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

