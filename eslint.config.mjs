import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';

export default tseslint.config([
  {
    ignores: [
      'dist/',
      'dist_backup/',
      'temp/',
      '*.backup',
      '*.tmp',
      '.astro/',
      'node_modules/',
      '.agents/',
      'tests/',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
]);
