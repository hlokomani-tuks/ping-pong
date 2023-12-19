export default {
    type: 'module',
    moduleFileExtensions: ['js', 'mjs', 'json'],
    transform: {
      '^.+\\.(mjs|js)$': ['esm-jest']
    },
    testMatch: ['**/__tests__/**/*.test.js']

    
  };
  
  