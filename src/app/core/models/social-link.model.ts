export interface SocialLink {
  readonly platform: 'github' | 'linkedin' | 'email';
  readonly label: string;
  readonly url: string;
  readonly icon: string;
}
