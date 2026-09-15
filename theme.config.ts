/**
 * Client theme — change this file to rebrand the store.
 * Colors, copy, currency, nav, and homepage content all live here.
 */

export type Locale = "en" | "ar";
export type Localized = Record<Locale, string>;

export const locales: Locale[] = ["en", "ar"];
export const defaultLocale: Locale = "en";
export const defaultThemeMode: "light" | "dark" = "light";

export const theme = {
  brand: {
    name: "ORYX",
    display: "Oryx",
    tagline: {
      en: "Own The Court",
      ar: "امتلك الملعب",
    } satisfies Localized,
    description: {
      en: "Durable yet light, it stands up to intense play while providing superior moisture control, allowing you to focus purely on your game.",
      ar: "متين وخفيف في آنٍ واحد، يصمد أمام اللعب المكثف ويمنح تحكماً فائقاً بالرطوبة لتبقى مركّزاً على مباراتك.",
    } satisfies Localized,
    instagram: "@oryx",
    logo: "/logo.png",
    logoInverse: "/logo-inverse.png",
  },

  colors: {
    light: {
      accent: "#000000",
      accentLight: "#1a1a1a",
      accentDark: "#433625",
      bg: "#ffffff",
      bgAlt: "#f5f5f5",
      surface: "#ffffff",
      text: "#000000",
      muted: "#000000b5",
      border: "#eae8e6",
      sale: "#7d5449",
      footer: "#e9e4e0",
      navSolid: "#ffffff",
      buttonText: "#ffffff",
    },
    dark: {
      accent: "#ffffff",
      accentLight: "#e6e6e6",
      accentDark: "#e9e4e0",
      bg: "#1a1a1a",
      bgAlt: "#111111",
      surface: "#242424",
      text: "#ffffff",
      muted: "#ffffffcf",
      border: "#333333",
      sale: "#c4a59c",
      footer: "#2a241f",
      navSolid: "#1a1a1a",
      buttonText: "#000000",
    },
  },

  commerce: {
    currency: "QAR",
    freeShippingFrom: 500,
    shippingFee: 25,
    promoCode: "OX25",
    promoPercent: 25,
    countries: ["🇶🇦 Qatar", "🇦🇪 UAE", "🇸🇦 KSA", "🇰🇼 Kuwait", "🇧🇭 Bahrain", "🇴🇲 Oman"],
    payments: ["VISA", "MC", "AMEX", "MADA", "KNET", "TABBY"],
    checkoutCountries: ["Qatar", "UAE", "KSA", "Kuwait", "Bahrain", "Oman"],
  },

  nav: {
    primary: [
      { key: "home", href: "/" },
      { key: "categories", href: "/shop" },
      { key: "contactUs", href: "/contact" },
      { key: "faqs", href: "/faq" },
    ],
  },

  announcement: {
    en: "LAUNCH SPECIAL OFFER - 25% OFF PADEL RACKETS",
    ar: "عرض الإطلاق الخاص — خصم 25% على مضارب البادل",
  } satisfies Localized,

  hero: {
    img: "/theme/hero.jpg",
    headline: { en: "Own The Court", ar: "امتلك الملعب" } satisfies Localized,
    cta: { key: "shopNow", href: "/shop" },
  },

  pullQuote: {
    text: {
      en: "Durable yet light, it stands up to intense play while providing superior moisture control, allowing you to focus purely on your game.",
      ar: "متين وخفيف في آنٍ واحد، يصمد أمام اللعب المكثف ويمنح تحكماً فائقاً بالرطوبة لتبقى مركّزاً على مباراتك.",
    } satisfies Localized,
    cta: { key: "learnMore", href: "/shop" },
  },

  bestseller: {
    img: "/theme/bestseller.jpg",
    eyebrow: { en: "OUR BESTSELLING PRODUCT", ar: "أكثر منتجاتنا مبيعاً" } satisfies Localized,
    title: { en: "The Oryx Padel Racket", ar: "مضرب أوريكس للبادل" } satisfies Localized,
    body: {
      en: "Made with care and unconditionally loved by our customers, this signature bestseller exceeds all expectations.",
      ar: "صُنع بعناية ويحظى بحب عملائنا بلا قيد، هذا المنتج الأيقوني يتجاوز كل التوقعات.",
    } satisfies Localized,
    cta: { key: "shopNow", href: "/shop" },
  },

  collections: [
    {
      slug: "accessories",
      href: "/shop/accessories",
      img: "/theme/collection-accessories.jpg",
      name: { en: "accessories", ar: "إكسسوارات" } satisfies Localized,
    },
    {
      slug: "rackets",
      href: "/shop/rackets",
      img: "/theme/collection-rackets.jpg",
      name: { en: "Rackets", ar: "مضارب" } satisfies Localized,
    },
    {
      slug: "clothes",
      href: "/shop/clothes",
      img: "/theme/collection-clothes.jpg",
      name: { en: "clothes", ar: "ملابس" } satisfies Localized,
    },
    {
      slug: "tools",
      href: "/shop/tools",
      img: "/theme/collection-tools.jpg",
      name: { en: "tools", ar: "أدوات" } satisfies Localized,
    },
  ],

  marquee: {
    accent: { en: [] as string[], ar: [] as string[] },
    muted: { en: [] as string[], ar: [] as string[] },
  },
  press: [] as { name: string; sub: string }[],
  instagram: [] as { img: string; handle: string }[],

  social: {
    facebook: "https://www.facebook.com",
    instagram: "https://www.instagram.com",
    youtube: "https://www.youtube.com",
    tiktok: "https://www.tiktok.com",
    twitter: "https://www.twitter.com",
  },

  pages: {
    about: {
      en: "Oryx builds padel equipment for players who want durable, light kit that stands up to intense play. From signature rackets to court essentials, every piece is finished to keep you focused on the game.",
      ar: "تصنع أوريكس معدات البادل للاعبين الذين يريدون قطعاً متينة وخفيفة تصمد أمام اللعب المكثف. من المضارب الأيقونية إلى أساسيات الملعب، كل قطعة تُنجَز لتبقيك مركّزاً على المباراة.",
    } satisfies Localized,
    privacy: {
      en: "We collect only the information needed to process orders, manage accounts, and send newsletters you opt into. We do not sell personal data. For questions, contact us through the contact page.",
      ar: "نجمع فقط المعلومات اللازمة لمعالجة الطلبات وإدارة الحسابات والنشرات التي تشترك فيها. لا نبيع البيانات الشخصية. للأسئلة تواصل معنا عبر صفحة الاتصال.",
    } satisfies Localized,
    terms: {
      en: "By placing an order you agree that items are sold as described, shipping times are estimates, and returns follow the 14-day policy on unused goods with tags attached.",
      ar: "بتقديم الطلب توافق على وصف المنتجات، وأن أوقات الشحن تقديرية، وأن الإرجاع خلال 14 يوماً للقطع غير المستخدمة مع البطاقات.",
    } satisfies Localized,
  },

  faqs: [
    {
      q: { en: "What is your return policy?", ar: "ما هي سياسة الإرجاع؟" },
      a: { en: "14-day hassle-free returns on unused items with tags attached.", ar: "إرجاع خلال 14 يوماً دون عناء للقطع غير المستخدمة مع البطاقات." },
    },
    {
      q: { en: "Do you ship across the GCC?", ar: "هل تشحنون في دول الخليج؟" },
      a: { en: "Yes. Free shipping on orders above the threshold to Qatar, UAE, KSA, Kuwait, Bahrain, and Oman.", ar: "نعم. شحن مجاني فوق الحد الأدنى إلى قطر والإمارات والسعودية والكويت والبحرين وعُمان." },
    },
    {
      q: { en: "How do I track my order?", ar: "كيف أتتبع طلبي؟" },
      a: { en: "You will receive a tracking update by email once your order ships. You can also view status in My Account.", ar: "يصلك تحديث بالبريد عند الشحن، ويمكنك متابعة الحالة من حسابك." },
    },
    {
      q: { en: "What currency do you charge in?", ar: "بأي عملة يتم الدفع؟" },
      a: { en: "All prices are in QAR as shown at checkout.", ar: "جميع الأسعار بالريال القطري كما تظهر عند الدفع." },
    },
  ],

  categoryNames: {
    accessories: { en: "accessories", ar: "إكسسوارات" },
    rackets: { en: "Rackets", ar: "مضارب" },
    clothes: { en: "clothes", ar: "ملابس" },
    tools: { en: "tools", ar: "أدوات" },
    "t-shirts": { en: "T-Shirts", ar: "تيشيرتات" },
    shirts: { en: "Shirts", ar: "قمصان" },
    joggers: { en: "Joggers", ar: "جوغر" },
    shorts: { en: "Shorts", ar: "شورتات" },
    hoodies: { en: "Hoodies", ar: "هوديز" },
    activewear: { en: "Activewear", ar: "ملابس رياضية" },
    "new-arrivals": { en: "New Arrivals", ar: "وصل حديثاً" },
  } as Record<string, Localized>,
};

export function loc(value: Localized, locale: Locale): string {
  return value[locale] || value.en;
}

export function themeCss(): string {
  const toVars = (palette: typeof theme.colors.light) =>
    [
      `--gold:${palette.accent}`,
      `--gold-light:${palette.accentLight}`,
      `--gold-dark:${palette.accentDark}`,
      `--black:${palette.text}`,
      `--warm-white:${palette.bg}`,
      `--off-white:${palette.bgAlt}`,
      `--sand:${palette.border}`,
      `--muted:${palette.muted}`,
      `--surface:${palette.surface}`,
      `--sale:${palette.sale}`,
      `--footer:${palette.footer}`,
      `--nav-solid:${palette.navSolid}`,
      `--accent-ink:${palette.buttonText}`,
      `--footer-ink:${palette.accentDark}`,
    ].join(";");

  return `:root{${toVars(theme.colors.light)}}[data-theme="dark"]{${toVars(theme.colors.dark)}}`;
}
