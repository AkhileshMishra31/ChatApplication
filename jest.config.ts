import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "<rootDir>/__tests__/coverage",
  coverageProvider: "v8",
  globalSetup: "<rootDir>/globalSetup.ts",
  globalTeardown: "<rootDir>/globalTeardown.ts",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ["<rootDir>/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  reporters: ["default"],
  collectCoverageFrom: [
    "**/src/**/*.{ts,js}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/src/sockets/**",
    "!**/src/types/**",
    "!**/src/utils/**",
    "!**/src/middlewares/global/**",
  ],
};

export default config
