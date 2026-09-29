import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { COLOR_TOKENS, ThemeService } from '@scriptorium/ui-grimoire';

/** TEMPORARY — checks the theme foundations (tokens, fonts, gr-btn buttons) in both themes. */
@Component({
  selector: 'app-theme-test',
  templateUrl: './theme-test.html',
  styleUrl: './theme-test.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeTest {
  protected readonly themeService = inject(ThemeService);
  protected readonly colors = COLOR_TOKENS;
}
