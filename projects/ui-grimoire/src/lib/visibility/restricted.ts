import type { VisibilityValue } from '../shared/types';

/**
 * The visibility when it restricts who sees the content (Secret MJ, chosen players), null when
 * the whole table sees it: the one rule behind every restricted frame and marker.
 */
export function restrictedVisibility(visibility?: VisibilityValue): VisibilityValue | null {
  return visibility && visibility.level !== 'table' ? visibility : null;
}
