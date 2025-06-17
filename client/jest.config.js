// jest.config.js
export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setup-test.js"],
  transformIgnorePatterns: [
    "/node_modules/(?!(nanoid)/)"  // 👈 allow nanoid to be transformed
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js"
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.{spec,test}.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/dist/**",
    "!**/build/**",
    "!vite.config.ts",
    "!**/coverage/**"
  ]
};
