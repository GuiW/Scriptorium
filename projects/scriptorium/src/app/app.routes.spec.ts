import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { appConfig } from './app.config';
import { PAGES, pageTitle, type PageId } from './pages';

describe('app routes', () => {
  // The app's own configuration: its routes and its router features.
  beforeEach(() => TestBed.configureTestingModule({ providers: appConfig.providers }));

  it('give every page of the table its own route and title', async () => {
    const harness = await RouterTestingHarness.create();
    const router = TestBed.inject(Router);
    for (const [id, { path }] of Object.entries(PAGES)) {
      await harness.navigateByUrl(`/${path}`);
      expect(router.url, id).toBe(`/${path}`);
      expect(document.title, id).toBe(pageTitle(id as PageId));
    }
  });

  it('open the Quêtes page by default and for an unknown address', async () => {
    const harness = await RouterTestingHarness.create();
    const router = TestBed.inject(Router);
    await harness.navigateByUrl('/');
    expect(router.url).toBe(`/${PAGES.quests.path}`);
    await harness.navigateByUrl('/nulle-part');
    expect(router.url).toBe(`/${PAGES.quests.path}`);
  });
});
