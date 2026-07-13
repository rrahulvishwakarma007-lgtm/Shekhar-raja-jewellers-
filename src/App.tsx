import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Collections from './pages/Collections';
import Bridal from './pages/Bridal';
import GoldRates from './pages/GoldRates';
import About from './pages/About';
import Contact from './pages/Contact';
import AppDownload from './pages/AppDownload';
import PrivateCatalogue from './pages/PrivateCatalogue';   // ← ADD
import CatalogueAdmin   from './pages/CatalogueAdmin';     // ← ADD

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="collections" element={<Collections />} />
          <Route path="bridal" element={<Bridal />} />
          <Route path="gold-rates" element={<GoldRates />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="app" element={<AppDownload />} />
        </Route>

        {/* Private catalogue — outside Layout (no navbar/footer) */}
        <Route path="catalogue"           element={<PrivateCatalogue />} />  {/* ← ADD */}
        <Route path="srj" element={<CatalogueAdmin />}  />  {/* ← ADD */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;