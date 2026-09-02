// src/animations/variants.js
//
// Central place for every Framer Motion animation used across GoFood.
// Import from here instead of redefining initial/animate/transition
// objects inline on each page.

export const easeOut = [0.22, 1, 0.36, 1];

/**
 * Factory for a staggered fade + rise variant. Use when a page's stagger
 * timing doesn't match the two presets below — keeps the {hidden,show}
 * boilerplate and easing in one place while letting each page keep its
 * own exact numbers instead of forcing a single timing everywhere.
 *
 * Usage: const fadeUp = makeStagger({ y: 24, delayStep: 0.08, duration: 0.45 });
 */
export function makeStagger({ y = 20, delayStep = 0.06, duration = 0.4 } = {}) {
  return {
    hidden: { opacity: 0, y },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * delayStep, duration, ease: easeOut },
    }),
  };
}

/**
 * Staggered fade + rise. Use with `variants={fadeUp} custom={index}`
 * on a list of children. Matches the timing used on Cart's cart items
 * and OrderDetails' item rows (delay 0.07s/step, 22px rise).
 */
export const fadeUp = makeStagger({ y: 22, delayStep: 0.07, duration: 0.42 });

/**
 * Faster, shorter-throw version for denser grids/lists — matches Admin's
 * stat cards and order rows (delay 0.05s/step, 14px rise).
 */
export const fadeUpCompact = makeStagger({ y: 14, delayStep: 0.05, duration: 0.4 });

/** Exit animation for items leaving a stagger list (e.g. removing a cart item). */
export const exitLeft = {
  opacity: 0,
  x: -30,
  transition: { duration: 0.28 },
};

/**
 * Factory for the main frosted-card entrance (fade + rise + scale).
 * Usage: const cardEntrance = makeCardEntrance({ y: 40 }); // Signup's smaller rise
 */
export function makeCardEntrance({ y = 50, duration = 0.6 } = {}) {
  return {
    hidden: { opacity: 0, y, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration, ease: easeOut } },
  };
}

/**
 * Default card entrance — matches Cart, OrderDetails, Orders, and Profile
 * (all use y:50). Signup uses a smaller y:40 rise; import makeCardEntrance
 * directly for that case.
 */
export const cardEntrance = makeCardEntrance();


/** Plain fade, for banners / errors / empty states. */
export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};

/** Value pop, e.g. quantity or total price changing. */
export const valuePop = {
  initial: { scale: 1.15, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.25 },
};

/** Infinite opacity pulse used by skeleton/shimmer loading blocks. */
export const pulseShimmer = (delay = 0) => ({
  animate: { opacity: [0.4, 0.8, 0.4] },
  transition: { duration: 1.4, repeat: Infinity, delay },
});

/** Shared hover/tap scale used on icon buttons throughout the app. */
export const iconButtonTap = { scale: 0.93 };
export const iconButtonHover = { scale: 1.1 };