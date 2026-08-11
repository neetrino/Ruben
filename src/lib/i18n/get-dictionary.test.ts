import { describe, expect, it } from "vitest";

import { getDictionary } from "@/lib/i18n/get-dictionary";

describe("getDictionary", () => {
  it("merges namespace files into the storefront dictionary shape", () => {
    const dictionary = getDictionary("en");

    expect(dictionary.brand).toBe("White-Shop");
    expect(dictionary.nav.home).toBe("Home");
    expect(dictionary.home.title).toBe("White Shop");
    expect(dictionary.home.whyTitle).toBe("Why choose us");
    expect(dictionary.home.partnersTitle).toBe("Our partners");
    expect(dictionary.footer.social).toBe("Social");
    expect(dictionary.contact.title).toBe("Contact");
    expect(dictionary.cartDrawer.title).toBe("Shopping Cart");
    expect(dictionary.checkout.title).toBe("Checkout");
    expect(dictionary.catalog.sortPopular).toBe("Popular");
    expect(dictionary.catalog.clearFilters).toBe("Clear filters");
    expect(dictionary.compare.empty).toBe("Your compare list is empty.");
    expect(dictionary.nav.compare).toBe("Compare");
    expect(dictionary.admin.nav.dashboard).toBe("Dashboard");
    expect(dictionary.admin.common.save).toBe("Save");
    expect(dictionary.legal.privacy.title).toBe("Privacy Policy");
    expect(dictionary.legal.terms.title).toBe("Terms & Conditions");
    expect(dictionary.legal.refund.title).toBe("Refund Policy");
    expect(dictionary.legal.delivery.title).toBe("Delivery Policy");
    expect(dictionary.footer.refundPolicy).toBe("Refund Policy");
    expect(dictionary.footer.deliveryPolicy).toBe("Delivery Policy");
  });

  it("loads Armenian and Russian namespaces", () => {
    expect(getDictionary("hy").nav.home).toBe("Գլխավոր");
    expect(getDictionary("hy").admin.nav.dashboard).toBe("Վահանակ");
    expect(getDictionary("hy").legal.privacy.title).toBe(
      "Գաղտնիության քաղաքականություն",
    );
    expect(getDictionary("ru").nav.home).toBe("Главная");
    expect(getDictionary("ru").admin.nav.dashboard).toBe("Дашборд");
    expect(getDictionary("ru").legal.refund.title).toBe("Политика возврата");
  });
});
