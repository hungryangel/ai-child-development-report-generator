// path: src/app/layout.tsx
// import '@mantine/core/styles.css';        // Mantine 스타일 주석 처리
// import '@mantine/dates/styles.css';       // Mantine 스타일 주석 처리
// import '@mantine/notifications/styles.css'; // Mantine 스타일 주석 처리
import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next'
import { ReactNode } from 'react';
// import { ColorSchemeScript, MantineProvider } from '@mantine/core'; // Mantine import 주석 처리
// import { Notifications } from '@mantine/notifications';               // Mantine import 주석 처리
import UnifiedNavigation from '@/components/UnifiedNavigation';

export const metadata: Metadata = {
  title: 'AI 아동발달 평가서 생성기',
  description:
    '2024 개정 표준보육과정 기반 전문가 수준의 아동발달 평가서를 AI로 간편하게 생성하세요',
  keywords: ['아동발달', '평가서', 'AI', '표준보육과정', '누리과정', '보육교사'],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* <ColorSchemeScript /> */}  {/* Mantine ColorSchemeScript 주석 처리 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {/* MantineProvider와 Notifications 제거 후 Tailwind로 대체 */}
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
          {/* 알림을 위한 컨테이너 - 필요시 별도 구현 */}
          <div id="notifications" className="fixed top-4 right-4 z-50 space-y-2"></div>

          <UnifiedNavigation />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </div>

        <Analytics />
      </body>
    </html>
  );
}
