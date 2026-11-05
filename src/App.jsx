import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Involvement from './components/Involvement';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; // Optional
import Assistant from './assistant/Assistant.jsx';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Involvement />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop /> {/* Optional */}
      <Assistant />
    </div>
  );
}

export default App;
