import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { NAVIGATION_ITEMS } from '../../core/config/navigation-config';
import { Header } from './header';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([{ path: '**', children: [] }])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('renders a link for every visible navigation item, and none for hidden ones', () => {
    const visibleItems = NAVIGATION_ITEMS.filter((item) => item.visible);
    const links = Array.from(element.querySelectorAll('nav[aria-label="Primary"] a'));
    expect(links.length).toBe(visibleItems.length);

    const labels = links.map((link) => link.textContent?.trim());
    for (const item of visibleItems) {
      expect(labels).toContain(item.label);
    }
    for (const item of NAVIGATION_ITEMS.filter((navItem) => !navItem.visible)) {
      expect(labels).not.toContain(item.label);
    }
  });

  it('marks the active route via routerLinkActive', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl(NAVIGATION_ITEMS[1].route);
    fixture.detectChanges();

    const activeLink = element.querySelector('nav[aria-label="Primary"] a.text-accent');
    expect(activeLink?.textContent?.trim()).toBe(NAVIGATION_ITEMS[1].label);
  });
});
