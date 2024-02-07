// LibrarianDashboard.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faPenSquare, faUsers, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import './Test.css';
const Test = () => {
  const [activeSection, setActiveSection] = useState('home');

  const handleRadioChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="wrapper">
      <header>Librarian Dashboard</header>
      <input type="radio" name="slider" checked={activeSection === 'home'} onChange={() => handleRadioChange('home')} id="home" />
      <input type="radio" name="slider" checked={activeSection === 'blog'} onChange={() => handleRadioChange('blog')} id="blog" />
      <input type="radio" name="slider" checked={activeSection === 'code'} onChange={() => handleRadioChange('code')} id="code" />
      <input type="radio" name="slider" checked={activeSection === 'help'} onChange={() => handleRadioChange('help')} id="help" />
      <input type="radio" name="slider" checked={activeSection === 'about'} onChange={() => handleRadioChange('about')} id="about" />

      <nav>
        <label htmlFor="home" className={activeSection === 'home' ? 'home active' : 'home'}>
          <FontAwesomeIcon icon={faHome} size="1.5x" style={{ marginRight: '5px' }} />
          Home
        </label>
        <label htmlFor="blog" className={activeSection === 'blog' ? 'blog active' : 'blog'}>
          <FontAwesomeIcon icon={faUser} size="1.5x" style={{ marginRight: '5px' }} />
          Profile
        </label>
        <label htmlFor="code" className={activeSection === 'code' ? 'code active' : 'code'}>
          <FontAwesomeIcon icon={faPenSquare} size="1.5x" style={{ marginRight: '5px' }} />
          Register
        </label>
        <label htmlFor="help" className={activeSection === 'help' ? 'help active' : 'help'}>
          <FontAwesomeIcon icon={faUsers} size="1.5x" style={{ marginRight: '5px' }} />
          Group Student
        </label>
        <label htmlFor="about" className={activeSection === 'about' ? 'about active' : 'about'}>
          <FontAwesomeIcon icon={faPowerOff} size="1.5x" style={{ marginRight: '5px' }} />
          Sign Out
        </label>
        <div className="slider"></div>
      </nav>

      <section>
        <div className={`content content-1 ${activeSection === 'home' ? 'active' : ''}`}>
          <div className="title">This is a Home content</div>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
        </div>
        <div className={`content content-2 ${activeSection === 'blog' ? 'active' : ''}`}>
          <div className="title">This is a Blog content</div>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
        </div>
        <div className={`content content-3 ${activeSection === 'code' ? 'active' : ''}`}>
          <div className="title">This is a Code content</div>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
        </div>
        <div className={`content content-4 ${activeSection === 'help' ? 'active' : ''}`}>
          <div className="title">This is a Help content</div>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
        </div>
        <div className={`content content-5 ${activeSection === 'about' ? 'active' : ''}`}>
          <div className="title">This is an About content</div>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
        </div>
      </section>
    </div>
  );
};

export default Test;
