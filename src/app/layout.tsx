import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

export const metadata = {
  title: 'AI 아동발달 평가서 생성기',
  description: '2024 개정 표준보육과정 기반 전문가 수준의 아동발달 평가서를 AI로 간편하게 생성하세요',
  keywords: '아동발달, 평가서, AI, 2024 개정 표준보육과정, 보육교사',
  authors: [{ name: 'AI Child Development Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <MantineProvider
          theme={{
            primaryColor: 'indigo',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
            headings: {
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
            },
            colors: {
              indigo: [
                '#eef2ff',
                '#ddd6fe',
                '#c4b5fd',
                '#a78bfa',
                '#8b5cf6',
                '#7c3aed',
                '#6d28d9',
                '#5b21b6',
                '#4c1d95',
                '#3730a3'
              ],
            },
            defaultRadius: 'md',
            shadows: {
              sm: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
              md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          <Notifications position="top-right" zIndex={1000} />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}