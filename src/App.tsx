import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Collections from './pages/Collections';
import Bridal from './pages/Bridal';
import GoldRates from './pages/GoldRates';
import About from './pages/About';
import Contact from './pages/Contact';
import AppDownload from './pages/AppDownload';
import PrivateCatalogue from './pages/PrivateCatalogue';
import CatalogueAdmin   from './pages/CatalogueAdmin';
import SwarnaSamriddhi from './pages/SwarnaSamriddhi'; // ← ADDED IMPORT

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages with standard Navbar and Footer */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="collections" element={<Collections />} />
          <Route path="bridal" element={<Bridal />} />
          <Route path="gold-rates" element={<GoldRates />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="app" element={<AppDownload />} />
        </Route>

        {/* Standalone pages — outside Layout (no standard navbar/footer) */}
        <Route path="catalogue" element={<PrivateCatalogue />} />
        <Route path="srj" element={<CatalogueAdmin />} />
        <Route path="offer" element={<SwarnaSamriddhi />} /> {/* ← ADDED ROUTE */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
