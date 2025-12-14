import './global.css';

export const metadata = {
  title: 'Vero Builder - Dnyanjyoti Education',
  description: 'Campaign builder for Dnyanjyoti Education',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
