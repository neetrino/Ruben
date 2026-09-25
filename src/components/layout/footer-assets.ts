/** Static Figma assets for the storefront footer (118:968–970). */
export const FOOTER_ASSETS = {
  tiles: "/assets/footer/tiles.webp",
  logo: "/assets/footer/logo.svg",
  instagram: "/assets/footer/instagram.svg",
  facebook: "/assets/footer/facebook.svg",
  whatsapp: "/assets/footer/whatsapp.svg",
} as const;

/**
 * Payment method logos — sizes match Kamancha footer pills
 * (`h-10 bg-white rounded-[15px] px-4`, logo `height` + `width: auto`).
 */
export const FOOTER_PAYMENT_METHODS = [
  {
    id: "mastercard",
    label: "Mastercard",
    src: "/assets/footer/payments/mastercard.webp",
    width: 34,
    height: 26,
  },
  {
    id: "arca",
    label: "Arca",
    src: "/assets/footer/payments/arca.webp",
    width: 66,
    height: 17,
  },
  {
    id: "idram",
    label: "Idram",
    src: "/assets/footer/payments/idram.webp",
    width: 73,
    height: 21,
  },
  {
    id: "visa",
    label: "Visa",
    src: "/assets/footer/payments/visa.webp",
    width: 55,
    height: 18,
  },
] as const;
