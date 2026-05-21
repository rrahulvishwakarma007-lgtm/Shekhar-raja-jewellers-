import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFAB from './WhatsAppFAB';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e8e0d0' }}>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
