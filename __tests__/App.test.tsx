/**
 * @format
 */

// Simple test to verify the app can be imported
describe('App', () => {
  it('App module can be imported without errors', () => {
    const App = require('../App').default;
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });
});
