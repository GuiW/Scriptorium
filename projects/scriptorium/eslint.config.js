// @ts-check
const { defineConfig } = require('eslint/config');
const rootConfig = require('../../eslint.config.js');

module.exports = defineConfig([
  ...rootConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      // A feature's routes are loaded lazily with import(); a static import would put the whole
      // page in the main bundle. What the app needs eagerly lives in the feature's /data entry.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@scriptorium/feature-quests',
              message:
                'Load QUESTS_ROUTES with import() only; import the model and the store from @scriptorium/feature-quests/data.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    rules: {},
  },
]);
