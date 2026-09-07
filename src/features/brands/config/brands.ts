/**
 * Storefront partner brands (v1 — static; no brands CMS).
 * Shared by the brands page; catalog filter UI keeps its own option list.
 */
export const STOREFRONT_BRANDS = [
  {
    id: "makita",
    name: "Makita",
    summary: {
      en: "Professional power tools and outdoor equipment.",
      hy: "Պրոֆեսիոնալ էլեկտրագործիքներ և այգու սարքավորումներ։",
      ru: "Профессиональный электроинструмент и садовая техника.",
    },
  },
  {
    id: "bosch",
    name: "Bosch",
    summary: {
      en: "Reliable tools and home solutions for every job.",
      hy: "Հուսալի գործիքներ և լուծումներ տան և աշխատանքի համար։",
      ru: "Надёжный инструмент и решения для дома и работы.",
    },
  },
  {
    id: "dewalt",
    name: "DeWalt",
    summary: {
      en: "Heavy-duty tools built for demanding sites.",
      hy: "Դիմացկուն գործիքներ պահանջկոտ աշխատանքի համար։",
      ru: "Прочный инструмент для сложных задач на объекте.",
    },
  },
  {
    id: "milwaukee",
    name: "Milwaukee",
    summary: {
      en: "High-performance cordless systems for trades.",
      hy: "Բարձր արդյունավետության անլար համակարգեր մասնագետների համար։",
      ru: "Высокопроизводительные аккумуляторные системы для профи.",
    },
  },
  {
    id: "hitachi",
    name: "Hitachi",
    summary: {
      en: "Precision tools and equipment with lasting quality.",
      hy: "Ճշգրիտ գործիքներ և սարքավորումներ երկարակյաց որակով։",
      ru: "Точный инструмент и оборудование с долгим сроком службы.",
    },
  },
] as const;

export type StorefrontBrand = (typeof STOREFRONT_BRANDS)[number];
