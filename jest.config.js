export default {
  preset: 'ts-jest/presets/js-with-ts-esm',  // usar preset com suporte ESM
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // trate ts/tsx como ESM
};
