const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/**
 * Whether the visitor has asked for reduced motion.
 *
 * The CSS side of this preference is handled by media queries; this is the
 * JavaScript side, for motion that is driven by a timer rather than by a
 * keyframe — the typed bio, principally.
 *
 * `matchMedia` is optional-called because jsdom does not implement it, and a
 * missing implementation should mean "no preference expressed", not a crash.
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia?.(REDUCED_MOTION).matches ?? false
}
