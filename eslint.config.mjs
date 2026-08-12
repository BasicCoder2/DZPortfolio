import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import next from '@next/eslint-plugin-next'
import react from 'eslint-plugin-react'

/**
 * ESLint (flat config) for the DZPortfolio Next.js 16 app.
 *
 * Next.js 16 removed `next lint`; linting is now driven by the ESLint CLI
 * directly (`npm run lint` -> `eslint .`). This is a native flat config —
 * no `@eslint/eslintrc` FlatCompat shim — to avoid the circular-reference
 * crash that `eslint-config-next`'s legacy eslintrc preset triggers under
 * FlatCompat. See docs/DECISIONS.md for the rationale.
 */
export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.next-motion-build/**',
      '**/out/**',
      '**/build/**',
      '**/dist/**',
      'next-env.d.ts',
      '*.tsbuildinfo',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Next.js core-web-vitals rules (self-contained; registers '@next/next').
  next.configs['core-web-vitals'],

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // TypeScript strict rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',

      // React rules
      'react/self-closing-comp': 'error',
      'react/jsx-sort-props': ['warn', { callbacksLast: true, shorthandFirst: true }],

      // Import rules — enforce absolute @ alias over relative paths
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: 'Use absolute imports with @ alias instead.',
            },
          ],
        },
      ],

      // Code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        URL: 'readonly',
        WebSocket: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
      },
    },
  }
)
