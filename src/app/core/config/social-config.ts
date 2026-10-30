import type { SocialLink } from '../models/social-link.model';
import { GITHUB_CONFIG } from './github-config';

/** Single source of truth for social/contact links — see spec section 54. */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    platform: 'github',
    label: 'GitHub',
    url: `https://github.com/${GITHUB_CONFIG.username}`,
    icon: 'pi pi-github',
  },
  {
    platform: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/syed-mazhar-hussain-b62421202/',
    icon: 'pi pi-linkedin',
  },
  {
    platform: 'email',
    label: 'Email',
    url: 'mailto:mazharnaqvi64456@gmail.com',
    icon: 'pi pi-envelope',
  },
];
