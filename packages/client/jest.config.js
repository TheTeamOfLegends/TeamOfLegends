import dotenv from 'dotenv'
dotenv.config()

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
    ".+\\.(svg|css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.tsx'],
  globals: {
    __SERVER_PORT__: process.env.SERVER_PORT || 3000,
    __INTERNAL_SERVER_URL__: process.env.__INTERNAL_SERVER_URL__ || 'http://localhost:3001',
    __EXTERNAL_SERVER_URL__: process.env.__EXTERNAL_SERVER_URL__ || 'https://ya-praktikum.tech/api',
  },
}
