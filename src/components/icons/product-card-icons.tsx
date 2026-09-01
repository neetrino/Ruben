import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Figma product-card wishlist heart (outline). */
export function ProductCardHeartIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <path
        d="M13.364 20.446L11.669 22L9.974 20.446C8.013 18.624 6.388 17.055 5.099 15.741C3.82 14.417 2.802 13.233 2.045 12.187C1.28 11.132 0.747 10.168 0.448 9.295C0.149 8.413 0 7.511 0 6.59C0 4.71 0.612 3.142 1.835 1.885C3.059 0.628 4.586 0 6.416 0C7.425 0 8.387 0.221 9.302 0.662C10.217 1.094 11.007 1.712 11.67 2.518C12.333 1.712 13.122 1.094 14.037 0.662C14.953 0.221 15.915 0 16.923 0C18.754 0 20.281 0.628 21.504 1.885C22.728 3.142 23.339 4.71 23.339 6.59C23.339 7.511 23.19 8.413 22.891 9.295C22.592 10.168 22.064 11.132 21.308 12.187C20.542 13.233 19.52 14.417 18.24 15.741C16.951 17.055 15.326 18.624 13.365 20.446ZM11.67 18.763C13.538 17.046 15.074 15.573 16.279 14.345C17.484 13.118 18.436 12.048 19.137 11.137C19.837 10.225 20.327 9.415 20.608 8.705C20.878 7.995 21.014 7.29 21.014 6.59C21.014 5.391 20.621 4.393 19.837 3.597C19.062 2.791 18.091 2.389 16.923 2.389C16.008 2.389 15.163 2.657 14.388 3.194C13.603 3.722 13.066 4.393 12.777 5.209H10.563C10.274 4.393 9.737 3.722 8.952 3.194C8.177 2.657 7.332 2.389 6.416 2.389C5.249 2.389 4.278 2.791 3.503 3.597C2.718 4.393 2.326 5.391 2.326 6.59C2.326 7.29 2.466 7.995 2.746 8.705C3.017 9.415 3.503 10.225 4.203 11.137C4.904 12.048 5.856 13.118 7.061 14.345C8.266 15.573 9.802 17.046 11.67 18.763Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Figma product-card compare (swap arrows). */
export function ProductCardCompareIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 19 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <path
        d="M0 7.237L1.355 5.85L4.948 9.58V0H6.849V9.58L10.442 5.85L11.797 7.237L5.899 13.36L0 7.237ZM7.203 17.763L13.101 11.64L19 17.763L17.645 19.15L14.052 15.42V25H12.151V15.42L8.558 19.15L7.203 17.763Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Figma product-card add-to-cart plus. */
export function ProductCardPlusIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <path
        d="M7.962 10.038H0V7.962H7.962V0H10.038V7.962H18V10.038H10.038V18H7.962V10.038Z"
        fill="currentColor"
      />
    </svg>
  );
}
