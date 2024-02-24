module.exports = {
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
  };