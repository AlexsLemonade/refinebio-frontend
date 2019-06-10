const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};
// ref https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#srcsetuptestsjs-1
global.localStorage = localStorageMock;

// Remove warning when running tests
// thanks to https://github.com/facebook/create-react-app/issues/3199#issuecomment-332634063
global.requestAnimationFrame = callback => setTimeout(callback, 0);
