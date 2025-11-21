import { Navigation } from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className = "" }: LayoutProps) {
  return (
    <div className="min-h-screen bg-blackboard text-chalk font-chalk chalk-texture">
      {/* Skip to main content link para accesibilidad */}
      <a href="#main-content" className="skip-to-main">
        Saltar al contenido principal
      </a>
      
      <Navigation />
      
      <main 
        id="main-content" 
        className={`pt-16 ${className}`}
        role="main"
        aria-label="Contenido principal"
      >
        {children}
      </main>
    </div>
  );
}
