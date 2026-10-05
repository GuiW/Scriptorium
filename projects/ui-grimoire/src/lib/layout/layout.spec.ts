import { BreakpointObserver, type BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, map } from 'rxjs';
import { LayoutService, injectLayout } from './layout';

/** A viewport whose width the test sets; answers the `(min-width: Npx)` queries. */
class FakeViewport {
  readonly width = new BehaviorSubject(390);
  private matches(query: string): boolean {
    return this.width.value >= Number(/min-width: (\d+)px/.exec(query)![1]);
  }
  isMatched(query: string | string[]): boolean {
    return [query].flat().some((q) => this.matches(q));
  }
  observe(query: string | string[]) {
    return this.width.pipe(
      map((): BreakpointState => ({ matches: this.isMatched(query), breakpoints: {} })),
    );
  }
}

@Component({ template: `{{ layout() }}` })
class Host {
  readonly layout = injectLayout();
}

describe('injectLayout', () => {
  afterEach(() => delete document.documentElement.dataset['layout']);

  it('sets the layout on <html> for the styles, from the start and on every change', () => {
    const viewport = new FakeViewport();
    viewport.width.next(1440);
    TestBed.configureTestingModule({
      providers: [{ provide: BreakpointObserver, useValue: viewport }],
    });
    const layout = TestBed.inject(LayoutService);
    const attribute = () => document.documentElement.dataset['layout'];

    expect(attribute()).toBe('desktop');
    for (const [width, expected] of [
      [1024, 'tablet'],
      [390, 'mobile'],
      [1200, 'desktop'],
    ] as const) {
      viewport.width.next(width);
      expect(attribute(), `${width}px`).toBe(expected);
      expect(layout.layout(), `${width}px`).toBe(expected);
    }
  });

  it('follows the mobile, tablet and desktop widths', async () => {
    const viewport = new FakeViewport();
    TestBed.configureTestingModule({
      providers: [{ provide: BreakpointObserver, useValue: viewport }],
    });
    const fixture = TestBed.createComponent(Host);
    const text = async () => {
      await fixture.whenStable();
      return (fixture.nativeElement as HTMLElement).textContent;
    };

    expect(await text()).toBe('mobile');
    for (const [width, layout] of [
      [767, 'mobile'],
      [768, 'tablet'],
      [1024, 'tablet'],
      [1199, 'tablet'],
      [1200, 'desktop'],
      [1440, 'desktop'],
      [390, 'mobile'],
    ] as const) {
      viewport.width.next(width);
      expect(await text(), `${width}px`).toBe(layout);
    }
  });
});
