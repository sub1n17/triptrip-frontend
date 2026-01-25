// import type { Config } from 'jest';
// import nextJest from 'next/jest.js';

// const createJestConfig = nextJest({
//     // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
//     dir: './',
// });

// // Add any custom config to be passed to Jest
// // 1. MSW 적용 전
// // const config: Config = {
// //     coverageProvider: 'v8',
// //     testEnvironment: 'jsdom',
// //     // Add more setup options before each test is run
// //     // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
// // };

// // 2. MSW 적용 후 설정
// const config: Config = {
//     coverageProvider: 'v8',
//     testEnvironment: 'jest-fixed-jsdom',
//     // Add more setup options before each test is run
//     setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

//     testEnvironmentOptions: {
//         customExportConditions: ['browser', 'module', 'default'],
//     },

//     transformIgnorePatterns: [
//         'node_modules/(?!(msw|tslib|@apollo/client|graphql|graphql-tag|zen-observable-ts|memoize-one)/)',
//     ],
// };

// // createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// export default createJestConfig(config);

import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    dir: './',
});

const config = {
    testEnvironment: 'jest-fixed-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts', '<rootDir>/setupTests.tsx'],
    transformIgnorePatterns: ['/node_modules/'],
};

export default createJestConfig(config);
