import {defineConfig, globalIgnores} from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    files: ['app/**/Header.tsx'],
    rules: {
      'react-hooks/immutability': 'off',
    },
  },
  {
    files: [
      'components/CampaignGoalReachedNotice.tsx',
      'components/CookieBanner.tsx',
    ],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  globalIgnores([
    '.netlify/**',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
