import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

const BROWSER_FILES = ['packages/**/*.js', 'apps/**/*.js', 'examples/**/*.js']
const NODE_FILES = ['**/*.config.js']

export default defineConfig([
  globalIgnores(['**/dist', 'coverage', '.claude']),
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
  },
  {
    files: BROWSER_FILES,
    languageOptions: { globals: globals.browser },
  },
  {
    files: NODE_FILES,
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.js'],
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  prettier,
])
