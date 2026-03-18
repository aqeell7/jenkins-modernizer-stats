import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '2px solid #ccc', paddingBottom: '1rem' }}>
        <h1>Jenkins Plugin Modernizer</h1>
        <p>Ecosystem Health Dashboard Prototype</p>
      </header>
      
      <main>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p>Chart container ready. Data pending...</p>
        </div>
      </main>
    </div>
  );
};

export default App;