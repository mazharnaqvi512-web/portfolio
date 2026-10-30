export interface NavigationItem {
  readonly label: string;
  readonly route: string;
  readonly icon?: string;
  readonly external?: boolean;
  readonly visible: boolean;
  readonly order: number;
}
