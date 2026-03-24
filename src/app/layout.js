import './globals.css';
import Header from '@/components/Header';
import AuthProvider from '@/components/AuthProvider';

export const metadata = {
  title: 'Sahand Estate',
  description: 'Find your next perfect place with ease',
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang='en'>
        <body className='antialiased'>
          <Header />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
