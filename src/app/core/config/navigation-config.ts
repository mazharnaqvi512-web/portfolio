import { environment } from '../../../environments/environment';
import type { NavigationItem } from '../models/navigation-item.model';
import { ROUTE_PATHS } from '../constants/route.constants';

/**
 * Single source of truth for primary nav — Header/MobileNavigation/Footer
 * all render from this, filtered to `visible` items only. Blog's
 * visibility is feature-flag-driven (spec section 52); every other entry
 * is core portfolio content and always shown.
 */
export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { label: 'Home', route: '/', visible: true, order: 1 },
  { label: 'About', route: `/${ROUTE_PATHS.about}`, visible: true, order: 2 },
  { label: 'Experience', route: `/${ROUTE_PATHS.experience}`, visible: true, order: 3 },
  { label: 'Skills', route: `/${ROUTE_PATHS.skills}`, visible: true, order: 4 },
  { label: 'Projects', route: `/${ROUTE_PATHS.projects}`, visible: true, order: 5 },
  { label: 'Services', route: `/${ROUTE_PATHS.services}`, visible: true, order: 6 },
  {
    label: 'Blog',
    route: `/${ROUTE_PATHS.blog}`,
    visible: environment.featureFlags.blog,
    order: 7,
  },
  { label: 'Resume', route: `/${ROUTE_PATHS.resume}`, visible: true, order: 8 },
  { label: 'Contact', route: `/${ROUTE_PATHS.contact}`, visible: true, order: 9 },
];
