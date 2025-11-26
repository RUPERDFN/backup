import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, Settings, Home, ClipboardList, Calculator, HelpCircle, Mail, Menu, X, ChefHat, Calendar, Crown, CreditCard, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get subscription status for authenticated users
  const { data: subscriptionData } = useQuery({
    queryKey: ['/api/subscription/status'],
    enabled: !!user && isAuthenticated,
  });

  // Public navbar for non-authenticated users
  if (!isAuthenticated) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-chalk-green/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <img src="/logo.PNG" alt="TheCookFlow" className="h-12 w-auto" />
            </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/demo/questionnaire">
              <Button
                variant="ghost"
                className={`text-chalk hover:text-chalk-green transition-colors ${
                  location === "/demo/questionnaire" ? "text-chalk-green" : ""
                }`}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Cuestionario
              </Button>
            </Link>

            <Link href="/demo/generator">
              <Button
                variant="ghost"
                className={`text-chalk hover:text-chalk-green transition-colors ${
                  location === "/demo/generator" ? "text-chalk-green" : ""
                }`}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Generador
              </Button>
            </Link>



            <Link href="/demo/skinchef">
              <Button
                variant="ghost"
                className={`text-chalk hover:text-chalk-green transition-colors ${
                  location === "/demo/skinchef" ? "text-chalk-green" : ""
                }`}
              >
                <ChefHat className="h-4 w-4 mr-2" />
                SkinChef
              </Button>
            </Link>

            <Link href="/help">
              <Button
                variant="ghost"
                className={`text-chalk hover:text-chalk-green transition-colors ${
                  location === "/help" ? "text-chalk-green" : ""
                }`}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Ayuda
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                variant="ghost"
                className={`text-chalk hover:text-chalk-green transition-colors ${
                  location === "/contact" ? "text-chalk-green" : ""
                }`}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contacto
              </Button>
            </Link>
          </div>

          {/* Desktop Auth Buttons & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* Auth buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/pricing">
                <Button
                  variant="ghost"
                  className="text-chalk hover:text-chalk-green"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Precios
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-chalk-green text-chalk hover:bg-chalk-green hover:text-black"
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-chalk-green text-black hover:bg-chalk-green/80">
                  Registrarse
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-chalk hover:text-chalk-green"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-chalk-green/30 bg-black/90">
            <div className="px-4 py-3 space-y-2">
              <Link href="/demo/questionnaire">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-chalk hover:text-chalk-green"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Cuestionario
                </Button>
              </Link>
              <Link href="/demo/generator">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-chalk hover:text-chalk-green"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Generador
                </Button>
              </Link>

              <Link href="/demo/skinchef">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-chalk hover:text-chalk-green"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChefHat className="h-4 w-4 mr-2" />
                  SkinChef
                </Button>
              </Link>
              <Link href="/help">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-chalk hover:text-chalk-green"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Ayuda
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-chalk hover:text-chalk-green"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contacto
                </Button>
              </Link>
              <div className="border-t border-chalk-green/30 pt-2 space-y-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full border-chalk-green text-chalk hover:bg-chalk-green hover:text-black"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    className="w-full bg-chalk-green text-black hover:bg-chalk-green/80"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Registrarse
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-chalk-green/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <img src="/logo.PNG" alt="TheCookFlow" className="h-12 w-auto" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className={`text-chalk hover:text-chalk-green transition-colors ${
                  location === "/dashboard" ? "text-chalk-green" : ""
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Inicio
              </Button>
            </Link>
            
            <Link href="/questionnaire">
              <Button
                variant="ghost"
                className={`text-chalk hover:text-chalk-green transition-colors ${
                  location === "/questionnaire" ? "text-chalk-green" : ""
                }`}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Cuestionario
              </Button>
            </Link>

            <Link href="/my-menus">
              <Button
                variant="ghost"
                className={`text-chalk hover:text-chalk-green transition-colors ${
                  location === "/my-menus" ? "text-chalk-green" : ""
                }`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Mis Menús
              </Button>
            </Link>

            <Link href="/achievements">
              <Button
                variant="ghost"
                className={`text-chalk hover:text-chalk-green transition-colors ${
                  location === "/achievements" ? "text-chalk-green" : ""
                }`}
                data-testid="navbar-achievements"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Logros
              </Button>
            </Link>

            <Link href="/skinchef">
              <Button
                variant="ghost"
                className={`text-chalk hover:text-chalk-green transition-colors ${
                  location === "/skinchef" ? "text-chalk-green" : ""
                }`}
              >
                <ChefHat className="h-4 w-4 mr-2" />
                SkinChef
              </Button>
            </Link>

            <Link href="/help">
              <Button
                variant="ghost"
                className={`text-chalk hover:text-chalk-green transition-colors ${
                  location === "/help" ? "text-chalk-green" : ""
                }`}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Ayuda
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                variant="ghost"
                className={`text-chalk hover:text-chalk-green transition-colors ${
                  location === "/contact" ? "text-chalk-green" : ""
                }`}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contacto
              </Button>
            </Link>
          </div>

          {/* Desktop User Menu & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-chalk hover:text-chalk-green"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Desktop User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hidden md:flex items-center space-x-2 text-chalk hover:text-chalk-green"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {user?.firstName} {user?.lastName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-black/90 border-chalk-green/30">
              <div className="p-2">
                <p className="text-sm font-medium text-chalk-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-chalk">{user?.email}</p>
                {subscriptionData && (
                  <div className="mt-2">
                    {(subscriptionData as any).subscriptionStatus === 'active' ? (
                      <div className="flex items-center text-xs text-green-400">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium Activo
                      </div>
                    ) : (subscriptionData as any).isTrialActive ? (
                      <div className="flex items-center text-xs text-blue-400">
                        <Settings className="h-3 w-3 mr-1" />
                        {Math.max(0, Math.ceil((new Date((subscriptionData as any).trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} días de prueba
                      </div>
                    ) : (
                      <div className="flex items-center text-xs text-red-400">
                        <X className="h-3 w-3 mr-1" />
                        Período expirado
                      </div>
                    )}
                  </div>
                )}
              </div>
              <DropdownMenuSeparator className="bg-chalk-green/30" />
              
              <Link href="/dashboard">
                <DropdownMenuItem className="text-chalk hover:text-chalk-green cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
              </Link>
              
              <Link href="/account">
                <DropdownMenuItem className="text-chalk hover:text-chalk-green cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Mi Cuenta
                </DropdownMenuItem>
              </Link>
              
              <Link href="/pricing">
                <DropdownMenuItem className="text-chalk hover:text-chalk-green cursor-pointer">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Suscripción
                </DropdownMenuItem>
              </Link>
              
              <Link href="/questionnaire">
                <DropdownMenuItem className="text-chalk hover:text-chalk-green cursor-pointer">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Editar Preferencias
                </DropdownMenuItem>
              </Link>
              
              <DropdownMenuSeparator className="bg-chalk-green/30" />
              
              <DropdownMenuItem 
                onClick={logout}
                className="text-red-400 hover:text-red-300 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile menu for authenticated users */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-chalk-green/30 bg-black/90">
            <div className="px-4 py-3 space-y-2">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-chalk hover:text-chalk-green"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Inicio
                </Button>
              </Link>
              <Link href="/questionnaire">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-chalk hover:text-chalk-green"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Cuestionario
                </Button>
              </Link>

              <Link href="/my-menus">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-chalk hover:text-chalk-green"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Mis Menús
                </Button>
              </Link>


              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-chalk hover:text-chalk-green"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="border-t border-chalk-green/30 pt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-300"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}