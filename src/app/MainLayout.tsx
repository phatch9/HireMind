import { Outlet } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* Animated Mesh Background */}
      <div className="mesh-background">
        <div className="mesh-blob"></div>
      </div>
      
      <div className="app-layout">
        <NavBar />
        <main className="container animate-fade-in">
          {children || <Outlet />}
        </main>
      </div>
    </ThemeProvider>
  );
}
