module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', 'functions/**/*.{js,jsx,ts,tsx}'],
  moduleNameMapper: {
    /* Handle CSS imports (with CSS modules)
    https://jestjs.io/docs/webpack#mocking-css-modules */
    '^.+\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    // '<rootDir>/functions/',
    '<rootDir>/*/*/__test__/__snapshots__',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      { presets: ['@babel/preset-env', '@babel/preset-typescript'] },
    ],
  },
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
  setupFilesAfterEnv: [require.resolve('@testing-library/jest-dom/extend-expect')],
};
