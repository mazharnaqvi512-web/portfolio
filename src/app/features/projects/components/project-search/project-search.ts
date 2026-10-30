import { Component, model } from '@angular/core';

@Component({
  selector: 'app-project-search',
  template: `
    <div class="relative">
      <i
        class="pi pi-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
      ></i>
      <input
        type="search"
        [value]="query()"
        (input)="query.set(inputValue($event))"
        placeholder="Search projects by name, technology or category..."
        aria-label="Search projects"
        class="w-full rounded-pill border border-border bg-surface py-2.5 pl-10 pr-4 text-small text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
      />
    </div>
  `,
})
export class ProjectSearch {
  readonly query = model('');

  protected inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
