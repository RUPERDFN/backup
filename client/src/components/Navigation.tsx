import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Menu, LogOut, User, ChefHat, BarChart3, HelpCircle, Mail } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Inicio", icon: ChefHat },
    { href: "/generator", label: "Generador", icon: ChefHat },

    { href: "/help", label: "Ayuda", icon: HelpCircle },
    { href: "/contact", label: "Contacto", icon: Mail },
  ];

  const authenticatedNavItems = [
    { href: "/dashboard", label: "Panel", icon: User },
    ...navItems.slice(1), // Skip "Inicio" for authenticated users
  ];

  const currentNavItems = isAuthenticated ? authenticatedNavItems : navItems;

  if (isLoading) {
    return (
      <nav className="navigation">
        <div className="contenedor-navegacion">
          <div className="flex justify-between items-center h-28">
            <div className="flex-shrink-0 flex items-center">
              <img src="/logo-new.PNG" alt="TheCookFlow" className="h-24" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navigation" aria-label="Navegación principal">
      <div className="contenedor-navegacion">
        <div className="flex justify-between items-center h-28">
          {/* Logo */}
          <Link 
            href={isAuthenticated ? "/dashboard" : "/"} 
            className="flex-shrink-0"
            aria-label="Ir a la página de inicio de TheCookFlow"
          >
            <img src="/logo-new.PNG" alt="TheCookFlow - Planificador de menús con IA" className="h-24" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 transition-colors duration-200 ${
                    isActive 
                      ? "text-chalk-green" 
                      : "text-chalk hover:text-chalk-green"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-chalk-yellow text-sm">
                  Hola, {user?.firstName || 'Usuario'}
                </span>
                <button
                  onClick={() => window.location.href = '/api/logout'}
                  className="btn-chalk"
                  aria-label="Cerrar sesión de TheCookFlow"
                  data-testid="logout-button"
                >
                  <LogOut size={16} className="mr-1" aria-hidden="true" />
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => window.location.href = '/api/login'}
                className="btn-primary-chalk"
                aria-label="Iniciar sesión en TheCookFlow"
                data-testid="login-button"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-chalk hover:text-chalk-green p-2"
              aria-label={mobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              data-testid="mobile-menu-toggle"
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden bg-blackboard/95 border-t border-chalk/20"
          >
            <div className="px-4 py-4 space-y-4">
              {currentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? "bg-chalk-green/20 text-chalk-green" 
                        : "text-chalk hover:text-chalk-green hover:bg-chalk/10"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="border-t border-chalk/20 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="text-chalk-yellow text-sm">
                      Hola, {user?.firstName || 'Usuario'}
                    </div>
                    <button
                      onClick={() => window.location.href = '/api/logout'}
                      className="btn-chalk w-full"
                    >
                      <LogOut size={16} className="mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => window.location.href = '/api/login'}
                    className="btn-primary-chalk w-full"
                  >
                    Iniciar Sesión
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}