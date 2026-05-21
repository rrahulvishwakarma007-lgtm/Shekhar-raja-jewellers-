import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Collections from './pages/Collections';
import Bridal from './pages/Bridal';
import GoldRates from './pages/GoldRates';
import About from './pages/About';
import Contact from './pages/Contact';
import AppDownload from './pages/AppDownload';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
