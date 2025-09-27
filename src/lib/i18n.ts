// Internationalization system for Sweet Trip
export type Language = 'en' | 'es'

export interface Translations {
  // Passport Office
  passportOffice: {
    title: string
    subtitle: string
    passportNumber: string
    accessCode: string
    passportNumberPlaceholder: string
    accessCodePlaceholder: string
    rememberMe: string
    forgotPassword: string
    signIn: string
    signingIn: string
    continueWith: string
    continueAsGuest: string
    noAccount: string
    createPassport: string
    viewPassport: string
    yourPassport: string
    discoverRewards: string
    currentLevel: string
    recentStamps: string
    unlockedAchievements: string
    levelBenefits: string
    exclusiveDiscounts: string
    freeShipping: string
    prioritySupport: string
    points: string
    toNextLevel: string
  }
  
  // Passport Status
  passportStatus: {
    valid: string
    expired: string
    processing: string
    vip: string
  }
  
  // Traveler Levels
  travelerLevels: {
    explorer: string
    adventurer: string
    expert: string
    ambassador: string
  }
  
  // Common
  common: {
    welcome: string
    yourPassport: string
    worldCandies: string
    exploreCandies: string
    buildBox: string
    myPassport: string
    freeShipping: string
    searchPlaceholder: string
  }
  
  // Navigation
  navigation: {
    home: string
    categories: string
    featured: string
    about: string
    contact: string
    worldCup2026: string
    // Submenu items
    byRegion: string
    byType: string
    newArrivals: string
    specialCollections: string
    chocolate: string
    gummies: string
    hardCandy: string
    salty: string
  }
  
  // Footer
  footer: {
    description: string
    quickLinks: string
    categories: string
    contactUs: string
    featuredProducts: string
    aboutUs: string
    privacyPolicy: string
    termsOfService: string
    shippingInfo: string
    returns: string
    copyright: string
  }
  
  // Homepage
  homepage: {
    badge: string
    discoverAdventures: string
    fromAroundWorld: string
    description: string
    limitedTime: string
    freeShipping: string
    readyToExplore: string
    featuredTreats: string
    handPickedFavorites: string
    viewAll: string
  }

  // Legal Pages
  legal: {
    privacyPolicy: {
      title: string
      lastUpdated: string
      introduction: string
      informationWeCollect: string
      howWeUseInfo: string
      informationSharing: string
      dataSecurity: string
      cookies: string
      yourRights: string
      contactUs: string
      changes: string
    }
    termsOfService: {
      title: string
      lastUpdated: string
      acceptance: string
      useOfService: string
      userAccounts: string
      ordersAndPayments: string
      shipping: string
      returns: string
      intellectualProperty: string
      prohibitedUses: string
      termination: string
      disclaimer: string
      limitationOfLiability: string
      governingLaw: string
      changes: string
      contact: string
    }
    shipping: {
      title: string
      subtitle: string
      domesticShipping: string
      internationalShipping: string
      processingTime: string
      shippingRates: string
      tracking: string
      deliveryTime: string
      shippingRestrictions: string
      specialHandling: string
      contactSupport: string
    }
    returns: {
      title: string
      subtitle: string
      returnPolicy: string
      returnWindow: string
      eligibleItems: string
      notEligible: string
      returnProcess: string
      refundProcessing: string
      exchanges: string
      damagedItems: string
      contactUs: string
    }
  }
  
  // Errors
  errors: {
    fillAllFields: string
    signInFailed: string
    socialSignInFailed: string
  }
}

const translations: Record<Language, Translations> = {
  en: {
    passportOffice: {
      title: '🛂 Sweet Trip Passport Office',
      subtitle: 'Renew Your Sweet Passport',
      passportNumber: 'Passport Number',
      accessCode: 'Access Code',
      passportNumberPlaceholder: 'Enter your passport number (email)',
      accessCodePlaceholder: 'Enter your access code',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot your password?',
      signIn: 'Sign In',
      signingIn: 'Signing in...',
      continueWith: 'Or continue with',
      continueAsGuest: 'Continue as Guest',
      noAccount: "Don't have an account?",
      createPassport: 'Create your Passport here',
      viewPassport: 'View Passport',
      yourPassport: 'Your Sweet Trip Passport',
      discoverRewards: 'Discover the rewards that await you',
      currentLevel: 'Current Level',
      recentStamps: 'Recent Stamps',
      unlockedAchievements: 'Unlocked Achievements',
      levelBenefits: 'Level Benefits',
      exclusiveDiscounts: 'Exclusive discounts',
      freeShipping: 'Free shipping on orders $60+',
      prioritySupport: 'Priority support',
      points: 'pts',
      toNextLevel: 'to next level'
    },
    passportStatus: {
      valid: 'Valid',
      expired: 'Expired',
      processing: 'Processing',
      vip: 'VIP'
    },
    travelerLevels: {
      explorer: 'Explorer',
      adventurer: 'Adventurer',
      expert: 'Expert',
      ambassador: 'Ambassador'
    },
    common: {
      welcome: 'Welcome Back!',
      yourPassport: 'Your Passport to the World\'s Candies',
      worldCandies: 'Your Passport to the World\'s Candies',
      exploreCandies: 'Explore Candies',
      buildBox: 'Build Your Box',
      myPassport: 'My Passport',
      freeShipping: 'Free shipping on orders over $60!',
      searchPlaceholder: 'Search for exotic candies...'
    },
    navigation: {
      home: 'Home',
      categories: 'Categories',
      featured: 'Featured',
      about: 'About',
      contact: 'Contact',
      worldCup2026: 'World Cup 2026',
      // Submenu items
      byRegion: 'By Region',
      byType: 'By Type',
      newArrivals: 'New Arrivals',
      specialCollections: 'Special Collections',
      chocolate: 'Chocolate',
      gummies: 'Gummies',
      hardCandy: 'Hard Candy',
      salty: 'Salty Snacks'
    },
    footer: {
      description: 'Discover Candy from Around the World. We bring you the most exotic and delicious treats from every corner of the globe.',
      quickLinks: 'Quick Links',
      categories: 'Categories',
      contactUs: 'Contact Us',
      featuredProducts: 'Featured Products',
      aboutUs: 'About Us',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      shippingInfo: 'Shipping Info',
      returns: 'Returns',
      copyright: '© 2025 Sweet Trip. All rights reserved.'
    },
    homepage: {
      badge: '🌍 50+ Countries • 🍭 1000+ Products',
      discoverAdventures: 'Discover Sweet Adventures',
      fromAroundWorld: 'From Around the World',
      description: 'Embark on a sweet adventure and discover exotic flavors, unique treats, and authentic candies from every corner of the globe.',
      limitedTime: '⚡ LIMITED TIME',
      freeShipping: 'Free shipping on orders $60+',
      readyToExplore: 'Ready to explore?',
      featuredTreats: '🌟 Featured Sweet Treats',
      handPickedFavorites: 'Hand-picked favorites from around the world',
      viewAll: 'View All'
    },
    legal: {
      privacyPolicy: {
        title: 'Privacy Policy',
        lastUpdated: 'Last updated: September 23, 2024',
        introduction: 'At Sweet Trip, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.',
        informationWeCollect: 'Information We Collect',
        howWeUseInfo: 'How We Use Your Information',
        informationSharing: 'Information Sharing and Disclosure',
        dataSecurity: 'Data Security',
        cookies: 'Cookies and Tracking Technologies',
        yourRights: 'Your Rights and Choices',
        contactUs: 'Contact Us',
        changes: 'Changes to This Privacy Policy'
      },
      termsOfService: {
        title: 'Terms of Service',
        lastUpdated: 'Last updated: September 23, 2024',
        acceptance: 'Acceptance of Terms',
        useOfService: 'Use of Our Service',
        userAccounts: 'User Accounts and Registration',
        ordersAndPayments: 'Orders and Payments',
        shipping: 'Shipping and Delivery',
        returns: 'Returns and Refunds',
        intellectualProperty: 'Intellectual Property Rights',
        prohibitedUses: 'Prohibited Uses',
        termination: 'Termination',
        disclaimer: 'Disclaimer of Warranties',
        limitationOfLiability: 'Limitation of Liability',
        governingLaw: 'Governing Law',
        changes: 'Changes to Terms',
        contact: 'Contact Information'
      },
      shipping: {
        title: 'Shipping Information',
        subtitle: 'Fast, reliable shipping to bring the world\'s candies to your doorstep',
        domesticShipping: 'Domestic Shipping (US)',
        internationalShipping: 'International Shipping',
        processingTime: 'Processing Time',
        shippingRates: 'Shipping Rates',
        tracking: 'Order Tracking',
        deliveryTime: 'Delivery Timeframes',
        shippingRestrictions: 'Shipping Restrictions',
        specialHandling: 'Special Handling',
        contactSupport: 'Need Help?'
      },
      returns: {
        title: 'Returns & Exchanges',
        subtitle: 'Hassle-free returns and exchanges for your peace of mind',
        returnPolicy: 'Our Return Policy',
        returnWindow: 'Return Window',
        eligibleItems: 'Eligible Items',
        notEligible: 'Items Not Eligible for Return',
        returnProcess: 'How to Return Items',
        refundProcessing: 'Refund Processing',
        exchanges: 'Exchanges',
        damagedItems: 'Damaged or Defective Items',
        contactUs: 'Contact Customer Service'
      }
    },
    errors: {
      fillAllFields: 'Please fill in all fields',
      signInFailed: 'Failed to sign in',
      socialSignInFailed: 'Failed to sign in with'
    }
  },
  es: {
    passportOffice: {
      title: '🛂 Oficina de Pasaportes Sweet Trip',
      subtitle: 'Renueva tu Pasaporte Dulce',
      passportNumber: 'Número de Pasaporte',
      accessCode: 'Código de Acceso',
      passportNumberPlaceholder: 'Ingresa tu número de pasaporte (email)',
      accessCodePlaceholder: 'Ingresa tu código de acceso',
      rememberMe: 'Recordarme',
      forgotPassword: '¿Olvidaste tu contraseña?',
      signIn: 'Iniciar Sesión',
      signingIn: 'Iniciando sesión...',
      continueWith: 'O continúa con',
      continueAsGuest: 'Continuar como Invitado',
      noAccount: '¿No tienes cuenta?',
      createPassport: 'Crea tu Pasaporte aquí',
      viewPassport: 'Ver Pasaporte',
      yourPassport: 'Tu Pasaporte Sweet Trip',
      discoverRewards: 'Descubre las recompensas que te esperan',
      currentLevel: 'Nivel actual',
      recentStamps: 'Estampas Recientes',
      unlockedAchievements: 'Logros Desbloqueados',
      levelBenefits: 'Beneficios de tu Nivel',
      exclusiveDiscounts: 'Descuentos exclusivos',
      freeShipping: 'Envío gratis en pedidos $60+',
      prioritySupport: 'Soporte prioritario',
      points: 'pts',
      toNextLevel: 'para siguiente nivel'
    },
    passportStatus: {
      valid: 'Válido',
      expired: 'Expirado',
      processing: 'En Proceso',
      vip: 'VIP'
    },
    travelerLevels: {
      explorer: 'Explorador',
      adventurer: 'Aventurero',
      expert: 'Experto',
      ambassador: 'Embajador'
    },
    common: {
      welcome: '¡Bienvenido de Vuelta!',
      yourPassport: 'Tu Pasaporte a los Dulces del Mundo',
      worldCandies: 'Tu Pasaporte a los Dulces del Mundo',
      exploreCandies: 'Explorar Dulces',
      buildBox: 'Arma tu Caja',
      myPassport: 'Mi Pasaporte',
      freeShipping: '¡Envío gratis en pedidos sobre $60!',
      searchPlaceholder: 'Buscar dulces exóticos...'
    },
    navigation: {
      home: 'Inicio',
      categories: 'Categorías',
      featured: 'Destacados',
      about: 'Acerca de',
      contact: 'Contacto',
      worldCup2026: 'Copa del Mundo 2026',
      // Submenu items
      byRegion: 'Por Región',
      byType: 'Por Tipo',
      newArrivals: 'Nuevos',
      specialCollections: 'Colecciones Especiales',
      chocolate: 'Chocolate',
      gummies: 'Gomitas',
      hardCandy: 'Caramelos Duros',
      salty: 'Botanas Saladas'
    },
    footer: {
      description: 'Descubre Dulces de Todo el Mundo. Te traemos los tratamientos más exóticos y deliciosos de cada rincón del planeta.',
      quickLinks: 'Enlaces Rápidos',
      categories: 'Categorías',
      contactUs: 'Contáctanos',
      featuredProducts: 'Productos Destacados',
      aboutUs: 'Acerca de Nosotros',
      privacyPolicy: 'Política de Privacidad',
      termsOfService: 'Términos de Servicio',
      shippingInfo: 'Información de Envío',
      returns: 'Devoluciones',
      copyright: '© 2025 Sweet Trip. Todos los derechos reservados.'
    },
    homepage: {
      badge: '🌍 50+ Países • 🍭 1000+ Productos',
      discoverAdventures: 'Descubre Aventuras Dulces',
      fromAroundWorld: 'De Todo el Mundo',
      description: 'Embárcate en una aventura dulce y descubre sabores exóticos, golosinas únicas y caramelos auténticos de cada rincón del planeta.',
      limitedTime: '⚡ TIEMPO LIMITADO',
      freeShipping: 'Envío gratis en pedidos $60+',
      readyToExplore: '¿Listo para explorar?',
      featuredTreats: '🌟 Golosinas Destacadas',
      handPickedFavorites: 'Favoritos seleccionados a mano de todo el mundo',
      viewAll: 'Ver Todo'
    },
    legal: {
      privacyPolicy: {
        title: 'Política de Privacidad',
        lastUpdated: 'Última actualización: 23 de septiembre, 2024',
        introduction: 'En Sweet Trip, estamos comprometidos a proteger tu privacidad y garantizar la seguridad de tu información personal. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos tus datos cuando visitas nuestro sitio web o realizas una compra.',
        informationWeCollect: 'Información que Recopilamos',
        howWeUseInfo: 'Cómo Usamos tu Información',
        informationSharing: 'Compartir y Divulgación de Información',
        dataSecurity: 'Seguridad de Datos',
        cookies: 'Cookies y Tecnologías de Seguimiento',
        yourRights: 'Tus Derechos y Opciones',
        contactUs: 'Contáctanos',
        changes: 'Cambios a esta Política de Privacidad'
      },
      termsOfService: {
        title: 'Términos de Servicio',
        lastUpdated: 'Última actualización: 23 de septiembre, 2024',
        acceptance: 'Aceptación de Términos',
        useOfService: 'Uso de Nuestro Servicio',
        userAccounts: 'Cuentas de Usuario y Registro',
        ordersAndPayments: 'Pedidos y Pagos',
        shipping: 'Envío y Entrega',
        returns: 'Devoluciones y Reembolsos',
        intellectualProperty: 'Derechos de Propiedad Intelectual',
        prohibitedUses: 'Usos Prohibidos',
        termination: 'Terminación',
        disclaimer: 'Descargo de Garantías',
        limitationOfLiability: 'Limitación de Responsabilidad',
        governingLaw: 'Ley Aplicable',
        changes: 'Cambios a los Términos',
        contact: 'Información de Contacto'
      },
      shipping: {
        title: 'Información de Envío',
        subtitle: 'Envío rápido y confiable para llevar los dulces del mundo a tu puerta',
        domesticShipping: 'Envío Nacional (EE.UU.)',
        internationalShipping: 'Envío Internacional',
        processingTime: 'Tiempo de Procesamiento',
        shippingRates: 'Tarifas de Envío',
        tracking: 'Seguimiento de Pedidos',
        deliveryTime: 'Tiempos de Entrega',
        shippingRestrictions: 'Restricciones de Envío',
        specialHandling: 'Manejo Especial',
        contactSupport: '¿Necesitas Ayuda?'
      },
      returns: {
        title: 'Devoluciones y Cambios',
        subtitle: 'Devoluciones y cambios sin complicaciones para tu tranquilidad',
        returnPolicy: 'Nuestra Política de Devoluciones',
        returnWindow: 'Ventana de Devolución',
        eligibleItems: 'Artículos Elegibles',
        notEligible: 'Artículos No Elegibles para Devolución',
        returnProcess: 'Cómo Devolver Artículos',
        refundProcessing: 'Procesamiento de Reembolsos',
        exchanges: 'Cambios',
        damagedItems: 'Artículos Dañados o Defectuosos',
        contactUs: 'Contactar Servicio al Cliente'
      }
    },
    errors: {
      fillAllFields: 'Por favor llena todos los campos',
      signInFailed: 'Error al iniciar sesión',
      socialSignInFailed: 'Error al iniciar sesión con'
    }
  }
}

export function getTranslations(language: Language): Translations {
  return translations[language]
}

export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.')
  let value: any = translations[language]
  
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
  }
  
  return value
}
