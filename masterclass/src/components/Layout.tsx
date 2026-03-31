import React from 'react';

interface LayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ sidebar, children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="glass" style={{
        width: '300px',
        padding: '2rem 1.5rem',
        borderLeft: 'none',
        borderTop: 'none',
        borderBottom: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {sidebar}
      </aside>
      
      <main style={{
        flex: 1,
        padding: '3rem 4rem',
        overflowY: 'auto'
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
