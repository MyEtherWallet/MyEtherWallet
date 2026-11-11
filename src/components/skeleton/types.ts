/**
 * Skeleton design-library types (Figma: MEW Web App — Design Library ›
 * ⚒️ Utils › Skeleton, component set 2930:104). The Figma `State (for
 * prototyping only)` axis is the shimmer animation, not a prop.
 */
export const SKELETON_SHAPES = [
  'rectangle',
  'rectangle-rounded',
  'square',
  'circle',
] as const
export type SkeletonShape = (typeof SKELETON_SHAPES)[number]

/**
 * Figma Shape → corner radius. `rectangle` is "Rectangle (4px corner)",
 * `rectangle-rounded` is "Rectangle (12px corner)". The square and circle
 * layers are less wide, so their gradient runs at a steeper angle.
 */
export const SKELETON_SHAPE_CLASS: Record<SkeletonShape, string> = {
  rectangle: 'rounded-[4px]',
  'rectangle-rounded': 'rounded-12',
  square: 'rounded-[4px] [--skeleton-angle:-88.44deg]',
  circle: 'rounded-full [--skeleton-angle:-88.44deg]',
}
