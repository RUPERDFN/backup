import { lazy } from "react";
import loadable from "@loadable/component";
import { Loader2 } from "lucide-react";

// Loading fallback component
const LoadingFallback = ({ text = "Cargando..." }: { text?: string }) => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center space-x-2">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="text-muted-foreground">{text}</span>
    </div>
  </div>
);

// Heavy components loaded lazily
export const LazyAdmin = loadable(() => import("@/pages/Admin"), {
  fallback: <LoadingFallback text="Cargando panel de administración..." />
});

export const LazyDashboard = loadable(() => import("@/pages/Dashboard"), {
  fallback: <LoadingFallback text="Cargando dashboard..." />
});

export const LazyMenuGenerator = loadable(() => import("@/pages/MenuGenerator"), {
  fallback: <LoadingFallback text="Cargando generador de menús..." />
});

export const LazyMyMenus = loadable(() => import("@/pages/MyMenus"), {
  fallback: <LoadingFallback text="Cargando mis menús..." />
});

export const LazySkinChefChat = loadable(() => import("@/pages/SkinChefChat"), {
  fallback: <LoadingFallback text="Cargando SkinChef..." />
});

export const LazyFridgeVision = loadable(() => import("@/pages/FridgeVision"), {
  fallback: <LoadingFallback text="Cargando visión de nevera..." />
});

export const LazySavingsMode = loadable(() => import("@/pages/SavingsMode"), {
  fallback: <LoadingFallback text="Cargando modo ahorro..." />
});

export const LazyRecipeLibrary = loadable(() => import("@/pages/RecipeLibrary"), {
  fallback: <LoadingFallback text="Cargando biblioteca de recetas..." />
});

// Chart components (heavy due to recharts)
export const LazyChartComponents = loadable(() => import("@/components/charts/ChartComponents"), {
  fallback: <LoadingFallback text="Cargando gráficos..." />
});

// Form components that might be heavy
export const LazyQuestionnaire = loadable(() => import("@/pages/Questionnaire"), {
  fallback: <LoadingFallback text="Cargando cuestionario..." />
});

// Account and settings (form-heavy)
export const LazyAccount = loadable(() => import("@/pages/Account"), {
  fallback: <LoadingFallback text="Cargando cuenta..." />
});

// Demo components (only loaded when needed)
export const LazyQuestionnaireDemo = loadable(() => import("@/pages/examples/QuestionnaireDemo"), {
  fallback: <LoadingFallback text="Cargando demo..." />
});

export const LazyGeneratorDemo = loadable(() => import("@/pages/examples/GeneratorDemo"), {
  fallback: <LoadingFallback text="Cargando demo..." />
});

export const LazySkinChefDemo = loadable(() => import("@/pages/examples/SkinChefDemo"), {
  fallback: <LoadingFallback text="Cargando demo..." />
});

// Tour components (only loaded during onboarding)
export const LazyTourComponents = {
  TourOnboarding: loadable(() => import("@/pages/TourOnboarding")),
  TourMenu: loadable(() => import("@/pages/TourMenu")),
  TourRecipe: loadable(() => import("@/pages/TourRecipe")),
  TourShoppingList: loadable(() => import("@/pages/TourShoppingList")),
  TourPaywall: loadable(() => import("@/pages/TourPaywall")),
};

// QA and testing components (only loaded in development)
export const LazyQAComponents = {
  QA: loadable(() => import("@/pages/QA")),
  QASmoke: loadable(() => import("@/pages/QASmoke")),
  QAReport: loadable(() => import("@/pages/QAReport")),
  Previews: loadable(() => import("@/pages/Previews")),
};

// Preload critical components on user interaction
export const preloadCriticalComponents = () => {
  // Preload components likely to be used soon
  LazyMenuGenerator.preload();
  LazyDashboard.preload();
  LazyMyMenus.preload();
};

// Preload components based on route hints
export const preloadRouteComponents = (nextRoute: string) => {
  switch (nextRoute) {
    case "/menu-generator":
      LazyMenuGenerator.preload();
      LazyQuestionnaire.preload();
      break;
    case "/dashboard":
      LazyDashboard.preload();
      LazyChartComponents.preload();
      break;
    case "/my-menus":
      LazyMyMenus.preload();
      break;
    case "/skinchef":
      LazySkinChefChat.preload();
      break;
    case "/fridge-vision":
      LazyFridgeVision.preload();
      break;
    case "/savings":
      LazySavingsMode.preload();
      break;
    case "/account":
      LazyAccount.preload();
      break;
    case "/admin":
      LazyAdmin.preload();
      LazyChartComponents.preload();
      break;
  }
};