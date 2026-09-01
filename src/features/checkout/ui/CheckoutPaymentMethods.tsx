"use client";

import { useState } from "react";

import type { CheckoutPaymentMethod } from "@/features/checkout/domain/payment-methods";
import { checkoutOptionClass } from "@/features/checkout/ui/checkout-option-styles";
import { CHECKOUT_PAYMENT_WALLET_LOGO_SRC } from "@/features/checkout/ui/checkout-payment-ui";
import {
  CheckoutPaymentMethodIcons,
  type CheckoutPaymentIconKind,
} from "@/features/checkout/ui/CheckoutPaymentMethodIcons";
import { CheckoutRadio } from "@/features/checkout/ui/CheckoutRadio";

export type CheckoutPaymentOption = {
  id: CheckoutPaymentMethod;
  name: string;
  shortName: string;
  description: string;
  iconKind: CheckoutPaymentIconKind;
  walletLogoSrc?: string;
  walletAlt?: string;
};

type CheckoutPaymentMethodsProps = {
  title: string;
  options: CheckoutPaymentOption[];
  value: CheckoutPaymentMethod;
  onChange: (method: CheckoutPaymentMethod) => void;
  disabled: boolean;
};

export function CheckoutPaymentMethods({
  title,
  options,
  value,
  onChange,
  disabled,
}: CheckoutPaymentMethodsProps) {
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  return (
    <section className="rounded-[15px] border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">{title}</h2>
      <div className="space-y-3">
        {options.map((option) => {
          const selected = value === option.id;
          const isCard = option.iconKind === "card-badges";
          const logoError = logoErrors[option.id] ?? false;

          const icons = (
            <CheckoutPaymentMethodIcons
              kind={option.iconKind}
              walletLogoSrc={
                option.walletLogoSrc ?? CHECKOUT_PAYMENT_WALLET_LOGO_SRC
              }
              walletAlt={option.walletAlt ?? option.shortName}
              walletLogoError={logoError}
              onWalletLogoError={() =>
                setLogoErrors((prev) => ({ ...prev, [option.id]: true }))
              }
              mobileCardFramed={isCard}
            />
          );

          if (isCard) {
            return (
              <label key={option.id} className={checkoutOptionClass(selected)}>
                <CheckoutRadio
                  name="paymentMethod"
                  value={option.id}
                  checked={selected}
                  onChange={() => onChange(option.id)}
                  disabled={disabled}
                  className="self-center"
                />

                <div className="flex w-full min-w-0 flex-1 flex-col items-start gap-1.5 lg:hidden">
                  <span className="font-medium text-gray-900">
                    {option.shortName}
                  </span>
                  {icons}
                </div>

                <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex lg:gap-4">
                  <div className="flex shrink-0 items-center">{icons}</div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900">
                      {option.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.description}
                    </div>
                  </div>
                </div>
              </label>
            );
          }

          return (
            <label key={option.id} className={checkoutOptionClass(selected)}>
              <CheckoutRadio
                name="paymentMethod"
                value={option.id}
                checked={selected}
                onChange={() => onChange(option.id)}
                disabled={disabled}
              />

              <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-4">
                <div className="flex shrink-0 items-center">{icons}</div>
                <div className="min-w-0">
                  {option.iconKind === "cash" ? (
                    <>
                      <div className="font-medium text-gray-900">
                        {option.name}
                      </div>
                      {option.description ? (
                        <div className="hidden text-sm text-gray-600 lg:block">
                          {option.description}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900 lg:hidden">
                        {option.shortName}
                      </span>
                      <div className="hidden lg:block">
                        <div className="font-medium text-gray-900">
                          {option.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {option.description}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
}
