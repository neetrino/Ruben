const CART_TARGET_ATTR = "data-cart-target";
const FLY_DURATION_MS = 700;

function visibleIntersectionArea(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const left = Math.max(0, rect.left);
  const top = Math.max(0, rect.top);
  const right = Math.min(vw, rect.right);
  const bottom = Math.min(vh, rect.bottom);
  const width = Math.max(0, right - left);
  const height = Math.max(0, bottom - top);
  return width * height;
}

/** Prefer the cart icon that is currently most visible (header vs mobile nav). */
export function findCartFlyTarget(): HTMLElement | null {
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>(`[${CART_TARGET_ATTR}]`),
  );
  if (targets.length === 0) return null;

  let best: HTMLElement | null = null;
  let bestArea = 0;
  for (const target of targets) {
    const area = visibleIntersectionArea(target);
    if (area > bestArea) {
      best = target;
      bestArea = area;
    }
  }
  return bestArea > 0 ? best : targets[0] ?? null;
}

type FlyToCartOptions = {
  from: DOMRect | HTMLElement;
  imageUrl?: string | null;
};

/**
 * Animates a mini product image from the add-to-cart control to the cart icon.
 */
export function flyToCart({ from, imageUrl }: FlyToCartOptions): void {
  if (typeof document === "undefined") return;

  const target = findCartFlyTarget();
  if (!target) return;

  const fromRect =
    from instanceof HTMLElement ? from.getBoundingClientRect() : from;
  const toRect = target.getBoundingClientRect();
  if (fromRect.width === 0 || toRect.width === 0) return;

  const size = 48;
  const startX = fromRect.left + fromRect.width / 2 - size / 2;
  const startY = fromRect.top + fromRect.height / 2 - size / 2;
  const endX = toRect.left + toRect.width / 2 - size / 2;
  const endY = toRect.top + toRect.height / 2 - size / 2;

  const ghost = document.createElement("div");
  ghost.setAttribute("aria-hidden", "true");
  ghost.style.cssText = [
    "position:fixed",
    `left:${startX}px`,
    `top:${startY}px`,
    `width:${size}px`,
    `height:${size}px`,
    "border-radius:14px",
    "overflow:hidden",
    "z-index:9999",
    "pointer-events:none",
    "box-shadow:0 8px 24px rgba(0,0,0,0.2)",
    "background:#eaeaea",
    "will-change:transform,opacity",
    `transition:transform ${FLY_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${FLY_DURATION_MS}ms ease`,
    "transform:translate3d(0,0,0) scale(1)",
    "opacity:1",
  ].join(";");

  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "";
    img.draggable = false;
    img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block";
    ghost.appendChild(img);
  }

  document.body.appendChild(ghost);

  const dx = endX - startX;
  const dy = endY - startY;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ghost.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(0.35)`;
      ghost.style.opacity = "0.35";
    });
  });

  window.setTimeout(() => {
    ghost.remove();
    target.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.18)" },
        { transform: "scale(1)" },
      ],
      { duration: 320, easing: "ease-out" },
    );
  }, FLY_DURATION_MS);
}

export const CART_FLY_TARGET_ATTR = CART_TARGET_ATTR;
