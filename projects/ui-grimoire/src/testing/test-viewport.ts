import { BreakpointObserver, type BreakpointState } from '@angular/cdk/layout';
import type { Provider } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

/**
 * A viewport of a chosen width for tests: it stands in for the CDK BreakpointObserver, which
 * jsdom cannot drive, and answers the `(min-width: Npx)` queries of LayoutService.
 */
export class TestViewport {
  private readonly width$: BehaviorSubject<number>;

  constructor(width: number) {
    this.width$ = new BehaviorSubject(width);
  }

  /** Changes the width; LayoutService follows, as on a real resize. */
  resize(width: number): void {
    this.width$.next(width);
  }

  isMatched(query: string | string[]): boolean {
    return [query].flat().some((q) => this.width$.value >= minWidth(q));
  }

  observe(query: string | string[]) {
    return this.width$.pipe(
      map((): BreakpointState => ({ matches: this.isMatched(query), breakpoints: {} })),
    );
  }
}

function minWidth(query: string): number {
  const match = /min-width: (\d+)px/.exec(query);
  if (!match) throw new Error(`TestViewport only answers (min-width: Npx) queries, not ${query}`);
  return Number(match[1]);
}

/** Provides a viewport of `width` pixels, or the given TestViewport to resize it during a test. */
export function provideTestViewport(viewport: number | TestViewport): Provider {
  return {
    provide: BreakpointObserver,
    useValue: typeof viewport === 'number' ? new TestViewport(viewport) : viewport,
  };
}
