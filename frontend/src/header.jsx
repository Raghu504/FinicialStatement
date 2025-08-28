import React from 'react';
import { Menu, X, BarChart2 } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="header5">
      <nav className="nav-container5">
        <div className="nav-content5">
          <div className="logo-container5">
            <BarChart2 className="logo-icon5" />
            <a href="/" className="logo-text5">FinanceAI</a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="desktop-nav5">
            <a href="/features" className="nav-link5">Features</a>
            <a href="/pricing" className="nav-link5">Pricing</a>
            <a href="/about" className="nav-link5">About</a>
            <a href='/login' className='nav-link5'>Login/Signup</a>
          </div>

          {/* Mobile Menu Button */}
        
        </div>

        {/* Mobile Navigation */}
      
      </nav>
    </header>
  );
};

export default Header;