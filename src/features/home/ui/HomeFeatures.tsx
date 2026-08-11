import type { ReactNode } from "react";
import {
  BadgeCheck,
  CreditCard,
  ShieldCheck,
  Truck,
} from "lucide-react";

export type HomeFeatureIcon = "warranty" | "delivery" | "installment" | "original";

type FeatureItem = {
  icon: HomeFeatureIcon;
  title: string;
  description: string;
};

type HomeFeaturesProps = {
  title: string;
  items: readonly FeatureItem[];
};

const FEATURE_ICONS: Record<HomeFeatureIcon, ReactNode> = {
  warranty: <ShieldCheck className="h-7 w-7" aria-hidden="true" />,
  delivery: <Truck className="h-7 w-7" aria-hidden="true" />,
  installment: <CreditCard className="h-7 w-7" aria-hidden="true" />,
  original: <BadgeCheck className="h-7 w-7" aria-hidden="true" />,
};

export function HomeFeatures({ title, items }: HomeFeaturesProps) {
  return (
    <section className="border-y border-gray-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 md:text-4xl">
          {title}
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-900">
                {FEATURE_ICONS[item.icon]}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
