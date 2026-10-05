import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestViewport, provideTestViewport } from '../../testing/test-viewport';
import { LayoutService, injectLayout } from './layout';

@Component({ template: `{{ layout() }}` })
class Host {
  readonly layout = injectLayout();
}

describe('injectLayout', () => {
  afterEach(() => delete document.documentElement.dataset['layout']);

  it('sets the layout on <html> for the styles, from the start and on every change', () => {
    const viewport = new TestViewport(1440);
    TestBed.configureTestingModule({ providers: [provideTestViewport(viewport)] });
    const layout = TestBed.inject(LayoutService);
    const attribute = () => document.documentElement.dataset['layout'];

    expect(attribute()).toBe('desktop');
    for (const [width, expected] of [
      [1024, 'tablet'],
      [390, 'mobile'],
      [1200, 'desktop'],
    ] as const) {
      viewport.resize(width);
      expect(attribute(), `${width}px`).toBe(expected);
      expect(layout.layout(), `${width}px`).toBe(expected);
    }
  });

  it('follows the mobile, tablet and desktop widths', async () => {
    const viewport = new TestViewport(390);
    TestBed.configureTestingModule({ providers: [provideTestViewport(viewport)] });
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
      viewport.resize(width);
      expect(await text(), `${width}px`).toBe(layout);
    }
  });
});
