import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { usePremium } from "@/hooks/usePremium";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Import critical/light pages directly (no lazy loading)
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Help from "@/pages/Help";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/not-found";
import Pricing from "@/pages/Pricing";
import Onboarding from "@/pages/Onboarding";
import OnboardingResult from "@/pages/OnboardingResult";
import SavedRecipes from "@/pages/SavedRecipes";
import AmazonFresh from "@/pages/AmazonFresh";
import DemoLogin from "@/pages/DemoLogin";
import MenuGenerated from "@/pages/MenuGenerated";
import Achievements from "@/pages/Achievements";

// Import lazy components for heavy pages
import {
  LazyAdmin,
  LazyDashboard,
  LazyMenuGenerator,
  LazyMyMenus,
  LazySkinChefChat,
  LazyFridgeVision,
  LazySavingsMode,
  LazyRecipeLibrary,
  LazyQuestionnaire,
  LazyAccount,
  LazyQuestionnaireDemo,
  LazyGeneratorDemo,
  LazySkinChefDemo,
  LazyTourComponents,
  LazyQAComponents,
  preloadCriticalComponents,
  preloadRouteComponents
} from "@/components/LazyComponents";

import React from "react";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Preload critical components on app mount
  React.useEffect(() => {
    if (!isLoading) {
      preloadCriticalComponents();
    }
  }, [isLoading]);

  return (
    <>
      <Navbar />
      <div className="pt-16">
        <Switch>
          {isLoading || !isAuthenticated ? (
            <>
              {/* Public routes for non-authenticated users */}
              <Route path="/" component={Landing} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/help" component={Help} />
              <Route path="/faq" component={FAQ} />
              <Route path="/contact" component={Contact} />
              <Route path="/legal" component={Legal} />
              <Route path="/pricing" component={Pricing} />
              {/* Demo pages for non-authenticated users - lazy loaded */}
              <Route path="/demo/questionnaire">{() => <LazyQuestionnaireDemo />}</Route>
              <Route path="/demo/generator">{() => <LazyGeneratorDemo />}</Route>
              <Route path="/demo/skinchef">{() => <LazySkinChefDemo />}</Route>
              
              {/* Onboarding pages for all users */}
              <Route path="/onboarding" component={Onboarding} />
              <Route path="/onboarding/result" component={OnboardingResult} />
              
              {/* QA and Testing routes (public, noindex) - lazy loaded */}
              <Route path="/qa">{() => <LazyQAComponents.QA />}</Route>
              <Route path="/qa/smoke">{() => <LazyQAComponents.QASmoke />}</Route>
              <Route path="/qa/report">{() => <LazyQAComponents.QAReport />}</Route>
              <Route path="/previews">{() => <LazyQAComponents.Previews />}</Route>
              <Route path="/admin">{() => <LazyAdmin />}</Route>
              
              {/* Demo Tour routes (public, noindex) - lazy loaded */}
              <Route path="/tour/1-onboarding">{() => <LazyTourComponents.TourOnboarding />}</Route>
              <Route path="/tour/2-menu">{() => <LazyTourComponents.TourMenu />}</Route>
              <Route path="/tour/3-recipe">{() => <LazyTourComponents.TourRecipe />}</Route>
              <Route path="/tour/4-shopping-list">{() => <LazyTourComponents.TourShoppingList />}</Route>
              <Route path="/tour/5-paywall">{() => <LazyTourComponents.TourPaywall />}</Route>
              
              {/* Demo auth */}
              <Route path="/auth/demo-login" component={DemoLogin} />
              {/* Redirect authenticated routes to login for non-authenticated users */}
              <Route path="/dashboard" component={Login} />
              <Route path="/generator" component={Login} />

              <Route path="/questionnaire" component={Login} />
            </>
          ) : (
            <>
              {/* Authenticated routes - critical pages loaded directly */}
              <Route path="/" component={Home} />
              <Route path="/menu-generated" component={MenuGenerated} />
              <Route path="/saved-recipes" component={SavedRecipes} />
              <Route path="/amazon-fresh" component={AmazonFresh} />
              <Route path="/achievements" component={Achievements} />
              <Route path="/help" component={Help} />
              <Route path="/faq" component={FAQ} />
              <Route path="/contact" component={Contact} />
              <Route path="/legal" component={Legal} />
              <Route path="/pricing" component={Pricing} />
              
              {/* Heavy authenticated routes - lazy loaded */}
              <Route path="/dashboard">{() => <LazyDashboard />}</Route>
              <Route path="/questionnaire">{() => <LazyQuestionnaire />}</Route>
              <Route path="/menu-generator">{() => <LazyMenuGenerator />}</Route>
              <Route path="/generator">{() => <LazyMenuGenerator />}</Route>
              <Route path="/my-menus">{() => <LazyMyMenus />}</Route>
              <Route path="/savings">{() => <LazySavingsMode />}</Route>
              <Route path="/fridge-vision">{() => <LazyFridgeVision />}</Route>
              <Route path="/recipe-library">{() => <LazyRecipeLibrary />}</Route>
              <Route path="/skinchef">{() => <LazySkinChefChat />}</Route>
              <Route path="/account">{() => <LazyAccount />}</Route>
              
              {/* QA routes also available for authenticated users - lazy loaded */}
              <Route path="/qa">{() => <LazyQAComponents.QA />}</Route>
              <Route path="/qa/smoke">{() => <LazyQAComponents.QASmoke />}</Route>
              <Route path="/previews">{() => <LazyQAComponents.Previews />}</Route>
              <Route path="/admin">{() => <LazyAdmin />}</Route>
            </>
          )}
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
