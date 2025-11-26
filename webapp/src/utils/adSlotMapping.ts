// Mapa rápido "archivo → slot" según especificaciones exactas del experto
// Expert specifications implemented with precise frequency rules

export const AD_SLOT_MAPPING = {
  // Web PWA/TWA Implementation
  web: {
    // src/pages/HomeFeed.tsx → Native (#feed-grid): after 6º y cada 8
    homeFeed: {
      file: 'webapp/src/pages/Home.tsx',
      component: 'NativeFeed',
      selector: '#feed-grid',
      type: 'native',
      placement: 'after_6th_every_8',
      slotId: 'home-feed-native',
      rules: {
        minItemsBefore: 3,
        firstAt: 6,
        frequency: 7 // average of 6-8
      }
    },

    // src/pages/RecipeDetail.tsx → Banner (.ad-banner--detail) bajo .tips-section
    recipeDetail: {
      file: 'webapp/src/pages/RecipeDetail.tsx', // To be created
      component: 'BannerDetail',
      selector: '.ad-banner--detail',
      type: 'banner',
      placement: 'below_tips_section',
      slotId: 'recipe-detail-banner',
      rules: {
        refreshInterval: 75000, // 60-90s average
        noRefreshBelow: 60000
      }
    },

    // src/pages/ShoppingList.tsx → Banner (.ad-banner--shopping) tras .totals
    shoppingList: {
      file: 'webapp/src/pages/MenuGenerated.tsx',
      component: 'BannerShopping',
      selector: '.ad-banner--shopping',
      type: 'banner',
      placement: 'after_totals',
      slotId: 'shopping-banner',
      rules: {
        sticky: true, // desktop only
        refreshInterval: 75000
      }
    },

    // src/pages/MenuResult.tsx → Interstitial en onMenuGenerated()
    menuResult: {
      file: 'webapp/src/pages/MenuGenerated.tsx',
      component: 'InterstitialAd',
      trigger: 'onMenuGenerated',
      type: 'interstitial',
      placement: 'post_render',
      slotId: 'post-menu-interstitial',
      rules: {
        globalCooldown: 120000, // ≤ 1 cada 120s
        maxPerSession: 1,
        timeout: 1500 // fallback if no load
      }
    },

    // src/components/PremiumActionBar.tsx → Rewarded en CTA
    premiumActions: {
      file: 'webapp/src/components/PremiumActionBar.tsx',
      component: 'RewardedAd',
      trigger: 'premium_action_buttons',
      type: 'rewarded',
      placement: 'on_cta_click',
      slotId: 'premium-rewarded',
      rules: {
        maxPerSession: 2, // ≤ 2 por sesión total
        resetOnAppOpen: true,
        actions: ['EXPORT_PDF', 'SECOND_MENU', 'COMPARE_PRICES']
      }
    },

    // src/pages/SavedRecipes.tsx → Native discreto
    savedRecipes: {
      file: 'webapp/src/pages/SavedRecipes.tsx',
      component: 'RecipeFeed',
      type: 'native',
      placement: 'end_of_first_scroll',
      slotId: 'saved-recipes-native',
      rules: {
        discreteMode: true, // baja presión publicitaria
        onlyAfter4thItem: true
      }
    }
  },

  // Android Native Implementation (equivalent mapping)
  android: {
    homeFeed: {
      file: 'android/app/src/main/java/adapters/HomeFeedAdapter.kt',
      positions: [6, 14, 22], // 6/14/22...
      type: 'native'
    },
    
    recipeDetail: {
      file: 'android/app/src/main/java/fragments/RecipeDetailFragment.kt',
      placement: 'below_tips',
      type: 'banner'
    },
    
    shoppingList: {
      file: 'android/app/src/main/java/fragments/ShoppingListFragment.kt',
      placement: 'after_totals',
      type: 'banner'
    },
    
    menuResult: {
      file: 'android/app/src/main/java/activities/MenuResultActivity.kt',
      trigger: 'post_render',
      type: 'interstitial'
    },
    
    premiumActions: {
      files: [
        'android/app/src/main/java/activities/ExportPdfActivity.kt',
        'android/app/src/main/java/fragments/ComparePricesFragment.kt'
      ],
      trigger: 'cta_click',
      type: 'rewarded'
    },
    
    appOpen: {
      file: 'android/app/src/main/java/MyApp.kt',
      type: 'app_open',
      maxPerDay: 1
    }
  }
};

// Frequency Rules Implementation
export const FREQUENCY_RULES = {
  premium: {
    condition: 'IS_PREMIUM === true',
    action: 'oculta_todo' // Hide all ads
  },
  
  interstitial: {
    globalCooldown: 120000, // ≤ 1 cada 120s
    maxPerSession: 1
  },
  
  rewarded: {
    maxPerSession: 2, // ≤ 2 por sesión
    resetCondition: 'al_abrir_app'
  },
  
  appOpen: {
    maxPerDay: 1, // Android only
    resetCondition: 'daily'
  },
  
  banners: {
    minRefreshInterval: 60000, // sin refresh < 60-90s
    maxRefreshInterval: 90000,
    averageRefresh: 75000
  },
  
  native: {
    minItemsBefore: 3, // no antes del ítem 3
    frequency: [6, 8], // 1 cada 6-8 tarjetas
    averageFrequency: 7
  },
  
  spacing: {
    margin: '12-16px', // ESPACIADO libre alrededor
    purpose: 'evitar_clics_accidentales'
  },
  
  gdpr: {
    requirement: 'mostrar_cmp_antes_primera_impresion',
    implementation: 'IAB_TCF_v2'
  }
};

// Blocked Zones (No ads allowed)
export const BLOCKED_ZONES = [
  '#onboarding',
  '#auth', // login/registro
  '#checkout', // páginas de pago
  '#cook-steps' // modo cocinando y temporizadores
];