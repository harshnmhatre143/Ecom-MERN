
import React from 'react';


const About = () => {
  const socialStyle = {
    color: '#f97316',
    fontWeight: '600',
    textDecoration: 'none'
  };

  return (
    <div style={{
      maxWidth: '900px',
      margin: '40px auto',
      padding: '30px',
      background: '#fff',
      border: '1px solid #e4e4e7',
      borderRadius: '10px',
      color: '#18181b',
      textAlign: 'center'
    }}>
      <img
        src="/profile.jpg"
        alt="@theshivanshvasu"
        style={{
          width: '140px',
          height: '140px',
          objectFit: 'cover',
          borderRadius: '50%',
          border: '3px solid #f97316',
          marginBottom: '20px'
        }}
      />

      <h2>About Me</h2>

      <h3 style={{ color: '#f97316', marginBottom: '15px' }}>
        Harsh Mhatre (@HarshMhatre)
      </h3>

      <p style={{
        color: '#52525b',
        lineHeight: '1.8',
        marginBottom: '25px'
      }}>
        Welcome! I'm Harsh Mhatre. This website is a project built to demonstrate
        my web development skills and create a simple shopping experience.
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <a href="https://harshmhatre.com" target="_blank" rel="noreferrer" style={socialStyle}>Website</a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" style={socialStyle}>Instagram</a>
        <a href="https://linkedin.com/in/" target="_blank" rel="noreferrer" style={socialStyle}>LinkedIn</a>
        <a href="https://x.com" target="_blank" rel="noreferrer" style={socialStyle}>X</a>
        <a href="https://whatsapp.com" target="_blank" rel="noreferrer" style={socialStyle}>WhatsApp</a>
        <a href="https://linktr.ee" target="_blank" rel="noreferrer" style={socialStyle}>Linktree</a>
      </div>
    </div>
  );
};

export default About;
