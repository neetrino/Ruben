import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { hashPassword } from "@/lib/auth/password";
import * as schema from "@/db/schema";
import { getSeedEnv } from "@/db/seed/env";
import { seedElectronicsProductImages } from "@/db/seed/electronics-media";
import { seedIds } from "@/db/seed/ids";

async function seed(): Promise<void> {
  const env = getSeedEnv();
  const db = drizzle(neon(env.DATABASE_URL), { schema });

  const now = new Date();
  const adminPasswordHash = await hashPassword(env.SEED_ADMIN_PASSWORD);
  const customerEmail = env.SEED_CUSTOMER_EMAIL ?? "customer@white-shop.local";
  const customerPassword = env.SEED_CUSTOMER_PASSWORD ?? env.SEED_ADMIN_PASSWORD;
  const customerPasswordHash = await hashPassword(customerPassword);

  await db
    .insert(schema.users)
    .values({
      id: seedIds.adminUser,
      email: env.SEED_ADMIN_EMAIL.toLowerCase(),
      emailVerifiedAt: now,
      passwordHash: adminPasswordHash,
      passwordUpdatedAt: now,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      status: "ACTIVE",
      termsAcceptedAt: now,
      termsVersion: "1.0",
    })
    .onConflictDoUpdate({
      target: schema.users.id,
      set: {
        email: env.SEED_ADMIN_EMAIL.toLowerCase(),
        passwordHash: adminPasswordHash,
        passwordUpdatedAt: now,
        role: "ADMIN",
        status: "ACTIVE",
        updatedAt: now,
      },
    });

  await db
    .insert(schema.users)
    .values({
      id: seedIds.customerUser,
      email: customerEmail.toLowerCase(),
      emailVerifiedAt: now,
      passwordHash: customerPasswordHash,
      passwordUpdatedAt: now,
      firstName: "Demo",
      lastName: "Customer",
      role: "CUSTOMER",
      status: "ACTIVE",
      termsAcceptedAt: now,
      termsVersion: "1.0",
    })
    .onConflictDoUpdate({
      target: schema.users.id,
      set: {
        email: customerEmail.toLowerCase(),
        passwordHash: customerPasswordHash,
        passwordUpdatedAt: now,
        role: "CUSTOMER",
        status: "ACTIVE",
        updatedAt: now,
      },
    });

  await db
    .insert(schema.categories)
    .values([
      {
        id: seedIds.categoryApparel,
        translations: {
          hy: {
            title: "Հագուստ",
            slug: "hagust",
            description: "Հիմնական հագուստի կատեգորիա",
          },
          en: {
            title: "Apparel",
            slug: "apparel",
            description: "Core apparel category",
          },
          ru: {
            title: "Одежда",
            slug: "odezhda",
            description: "Основная категория одежды",
          },
        },
        sortOrder: 1,
        status: "ACTIVE",
      },
      {
        id: seedIds.categoryElectronics,
        translations: {
          hy: {
            title: "Էլեկտրոնիկա",
            slug: "elektronika",
            description: "Գաջեթներ և աքսեսուարներ",
          },
          en: {
            title: "Electronics",
            slug: "electronics",
            description: "Gadgets and accessories",
          },
          ru: {
            title: "Электроника",
            slug: "elektronika",
            description: "Гаджеты и аксессуары",
          },
        },
        sortOrder: 2,
        status: "ACTIVE",
      },
    ])
    .onConflictDoUpdate({
      target: schema.categories.id,
      set: {
        status: "ACTIVE",
        updatedAt: now,
      },
    });

  await db
    .insert(schema.products)
    .values([
      {
        id: seedIds.productTee,
        sku: "WS-TEE-001",
        translations: {
          hy: {
            title: "White Tee",
            slug: "white-tee",
            description: "Classic white t-shirt",
          },
          en: {
            title: "White Tee",
            slug: "white-tee",
            description: "Classic white t-shirt",
          },
          ru: {
            title: "White Tee",
            slug: "white-tee",
            description: "Classic white t-shirt",
          },
        },
        priceAmount: 12000,
        compareAtAmount: 15000,
        stockOnHand: 50,
        lowStockThreshold: 5,
        status: "ACTIVE",
        isFeatured: true,
      },
      {
        id: seedIds.productHoodie,
        sku: "WS-HOODIE-001",
        translations: {
          hy: {
            title: "Studio Hoodie",
            slug: "studio-hoodie",
            description: "Soft studio hoodie",
          },
          en: {
            title: "Studio Hoodie",
            slug: "studio-hoodie",
            description: "Soft studio hoodie",
          },
          ru: {
            title: "Studio Hoodie",
            slug: "studio-hoodie",
            description: "Soft studio hoodie",
          },
        },
        priceAmount: 28000,
        stockOnHand: 25,
        lowStockThreshold: 3,
        status: "ACTIVE",
        isFeatured: true,
      },
      {
        id: seedIds.productWirelessEarbuds,
        sku: "WS-EARBUDS-001",
        translations: {
          hy: {
            title: "Անլար ականջակալներ",
            slug: "anlar-akanjakalner",
            description: "Bluetooth ականջակալներ՝ աղմուկի ճնշմամբ",
          },
          en: {
            title: "Wireless Earbuds",
            slug: "wireless-earbuds",
            description: "Bluetooth earbuds with noise reduction",
          },
          ru: {
            title: "Беспроводные наушники",
            slug: "besprovodnye-naushniki",
            description: "Bluetooth-наушники с шумоподавлением",
          },
        },
        priceAmount: 45000,
        compareAtAmount: 52000,
        stockOnHand: 40,
        lowStockThreshold: 5,
        status: "ACTIVE",
        isFeatured: true,
      },
      {
        id: seedIds.productSmartWatch,
        sku: "WS-WATCH-001",
        translations: {
          hy: {
            title: "Խելացի ժամացույց",
            slug: "khelaci-zhamacuyc",
            description: "Ֆիտնես ժամացույց՝ սրտի ռիթմի մոնիտորինգով",
          },
          en: {
            title: "Smart Watch",
            slug: "smart-watch",
            description: "Fitness smartwatch with heart-rate monitoring",
          },
          ru: {
            title: "Умные часы",
            slug: "umnye-chasy",
            description: "Фитнес-часы с мониторингом пульса",
          },
        },
        priceAmount: 89000,
        compareAtAmount: 99000,
        stockOnHand: 20,
        lowStockThreshold: 3,
        status: "ACTIVE",
        isFeatured: true,
      },
      {
        id: seedIds.productUsbCHub,
        sku: "WS-HUB-001",
        translations: {
          hy: {
            title: "USB-C հաբ",
            slug: "usb-c-hab",
            description: "7-պորտանի USB-C հաբ՝ HDMI-ով",
          },
          en: {
            title: "USB-C Hub",
            slug: "usb-c-hub",
            description: "7-port USB-C hub with HDMI",
          },
          ru: {
            title: "USB-C хаб",
            slug: "usb-c-khab",
            description: "7-портовый USB-C хаб с HDMI",
          },
        },
        priceAmount: 22000,
        stockOnHand: 35,
        lowStockThreshold: 5,
        status: "ACTIVE",
        isFeatured: false,
      },
      {
        id: seedIds.productPowerBank,
        sku: "WS-POWER-001",
        translations: {
          hy: {
            title: "Power Bank 20000mAh",
            slug: "power-bank-20000",
            description: "Արագ լիցքավորմամբ շարժական մարտկոց",
          },
          en: {
            title: "Power Bank 20000mAh",
            slug: "power-bank-20000",
            description: "Portable battery with fast charging",
          },
          ru: {
            title: "Power Bank 20000mAh",
            slug: "power-bank-20000",
            description: "Портативный аккумулятор с быстрой зарядкой",
          },
        },
        priceAmount: 18000,
        compareAtAmount: 21000,
        stockOnHand: 60,
        lowStockThreshold: 8,
        status: "ACTIVE",
        isFeatured: true,
      },
      {
        id: seedIds.productBluetoothSpeaker,
        sku: "WS-SPEAKER-001",
        translations: {
          hy: {
            title: "Bluetooth բարձրախոս",
            slug: "bluetooth-bardzrakhos",
            description: "Ջրակայուն շարժական բարձրախոս",
          },
          en: {
            title: "Bluetooth Speaker",
            slug: "bluetooth-speaker",
            description: "Waterproof portable speaker",
          },
          ru: {
            title: "Bluetooth-колонка",
            slug: "bluetooth-kolonka",
            description: "Водонепроницаемая портативная колонка",
          },
        },
        priceAmount: 32000,
        stockOnHand: 28,
        lowStockThreshold: 4,
        status: "ACTIVE",
        isFeatured: true,
      },
    ])
    .onConflictDoUpdate({
      target: schema.products.id,
      set: {
        status: "ACTIVE",
        updatedAt: now,
      },
    });

  await db
    .insert(schema.productCategories)
    .values([
      {
        id: seedIds.productCategoryTee,
        productId: seedIds.productTee,
        categoryId: seedIds.categoryApparel,
        isPrimary: true,
        sortOrder: 1,
      },
      {
        id: seedIds.productCategoryHoodie,
        productId: seedIds.productHoodie,
        categoryId: seedIds.categoryApparel,
        isPrimary: true,
        sortOrder: 2,
      },
      {
        id: seedIds.productCategoryWirelessEarbuds,
        productId: seedIds.productWirelessEarbuds,
        categoryId: seedIds.categoryElectronics,
        isPrimary: true,
        sortOrder: 1,
      },
      {
        id: seedIds.productCategorySmartWatch,
        productId: seedIds.productSmartWatch,
        categoryId: seedIds.categoryElectronics,
        isPrimary: true,
        sortOrder: 2,
      },
      {
        id: seedIds.productCategoryUsbCHub,
        productId: seedIds.productUsbCHub,
        categoryId: seedIds.categoryElectronics,
        isPrimary: true,
        sortOrder: 3,
      },
      {
        id: seedIds.productCategoryPowerBank,
        productId: seedIds.productPowerBank,
        categoryId: seedIds.categoryElectronics,
        isPrimary: true,
        sortOrder: 4,
      },
      {
        id: seedIds.productCategoryBluetoothSpeaker,
        productId: seedIds.productBluetoothSpeaker,
        categoryId: seedIds.categoryElectronics,
        isPrimary: true,
        sortOrder: 5,
      },
    ])
    .onConflictDoNothing({ target: schema.productCategories.id });

  await db
    .insert(schema.deliveryRules)
    .values({
      id: seedIds.deliveryArmenia,
      countryCode: "Armenia",
      city: "Yerevan",
      priceAmount: 1500,
      freeThresholdAmount: 50000,
      estimatedDaysMin: 1,
      estimatedDaysMax: 3,
      isActive: true,
      priority: 100,
    })
    .onConflictDoUpdate({
      target: schema.deliveryRules.id,
      set: {
        isActive: true,
        countryCode: "Armenia",
        city: "Yerevan",
        priceAmount: 1500,
        freeThresholdAmount: 50000,
        updatedAt: now,
      },
    });

  await db
    .insert(schema.heroSlides)
    .values({
      id: seedIds.heroHome,
      translations: {
        hy: {
          title: "White Shop",
          subtitle: "New collection",
          buttonLabel: "Browse",
          buttonUrl: "/hy/products",
        },
        en: {
          title: "White Shop",
          subtitle: "New collection",
          buttonLabel: "Shop now",
          buttonUrl: "/en/products",
        },
        ru: {
          title: "White Shop",
          subtitle: "New collection",
          buttonLabel: "Browse",
          buttonUrl: "/ru/products",
        },
      },
      sortOrder: 1,
      isActive: true,
    })
    .onConflictDoUpdate({
      target: schema.heroSlides.id,
      set: {
        isActive: true,
        updatedAt: now,
      },
    });

  await db
    .insert(schema.promotions)
    .values({
      id: seedIds.promoWelcome,
      kind: "COUPON",
      code: "WELCOME10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      maxDiscountAmount: 5000,
      minimumOrderAmount: 10000,
      totalUsageLimit: 1000,
      perUserUsageLimit: 1,
      isActive: true,
      priority: 10,
      allowStacking: false,
      startsAt: now,
    })
    .onConflictDoUpdate({
      target: schema.promotions.id,
      set: {
        isActive: true,
        discountValue: 10,
        updatedAt: now,
      },
    });

  await db
    .insert(schema.blogPosts)
    .values({
      id: seedIds.blogWelcome,
      authorUserId: seedIds.adminUser,
      status: "PUBLISHED",
      publishedAt: now,
      translations: {
        hy: {
          title: "Welcome to White Shop",
          slug: "bari-galust",
          excerpt: "Store launch",
          content: "<p>White Shop is ready.</p>",
        },
        en: {
          title: "Welcome to White Shop",
          slug: "welcome",
          excerpt: "Store launch note",
          content: "<p>White Shop is ready.</p>",
        },
        ru: {
          title: "Welcome to White Shop",
          slug: "dobro-pozhalovat",
          excerpt: "Store launch",
          content: "<p>White Shop is ready.</p>",
        },
      },
      tags: ["news", "launch"],
    })
    .onConflictDoUpdate({
      target: schema.blogPosts.id,
      set: {
        status: "PUBLISHED",
        updatedAt: now,
      },
    });

  await db
    .insert(schema.storeSettings)
    .values([
      {
        key: "store.identity",
        value: {
          version: 1,
          name: "White Shop",
          defaultLocale: "hy",
          defaultCurrency: "AMD",
        },
      },
      {
        key: "store.maintenance",
        value: { version: 1, enabled: false },
      },
    ])
    .onConflictDoUpdate({
      target: schema.storeSettings.key,
      set: {
        updatedAt: now,
      },
    });

  await db
    .insert(schema.appMeta)
    .values({
      key: "seed.version",
      value: "1",
    })
    .onConflictDoUpdate({
      target: schema.appMeta.key,
      set: {
        value: "1",
        updatedAt: now,
      },
    });

  const electronicsImages = await seedElectronicsProductImages(env.DATABASE_URL);

  console.info(
    JSON.stringify({
      level: "info",
      message: "seed.complete",
      adminEmail: env.SEED_ADMIN_EMAIL.toLowerCase(),
      customerEmail: customerEmail.toLowerCase(),
      products: [
        "WS-TEE-001",
        "WS-HOODIE-001",
        "WS-EARBUDS-001",
        "WS-WATCH-001",
        "WS-HUB-001",
        "WS-POWER-001",
        "WS-SPEAKER-001",
      ],
      electronicsImages,
      coupon: "WELCOME10",
    }),
  );
}

seed().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    JSON.stringify({ level: "error", message: "seed.failed", error: message }),
  );
  process.exitCode = 1;
});
