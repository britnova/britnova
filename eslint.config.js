// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginAstro from 'eslint-plugin-astro';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.astro/**',
      '.build/**',
      '.netlify/**',
      'public/**',
      'coverage/**',
      '**/*.min.js',
    ],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules (non-type-checked, matches old parserOptions.project: false)
  ...tseslint.configs.recommended,

  // React rules (JS/JSX/TSX)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { react },
    settings: { react: { version: '19' } },
    rules: {
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },

  // Accessibility rules
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      ...jsxA11y.configs.recommended.rules,
    },
  },

  // Astro component support
  ...eslintPluginAstro.configs.recommended,

  // Prettier — must stay last so it overrides conflicting style rules
  prettierRecommended,

  // Project-specific overrides
  {
    rules: {
      'prettier/prettier': 'error',
    },
  }
);
