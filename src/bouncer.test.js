// tests/bouncer.test.js
import Bouncer from './bouncer.mjs';

describe('Bouncer Tests', () => {
  let bouncer;

  beforeEach(() => {
    document.body.innerHTML = '<div class="bouncer"></div>';
    bouncer = new Bouncer(document.querySelector('.bouncer'));
  });

  test('Resets the bouncer position', () => {
    bouncer.setPosition(30);
    bouncer.reset();
    expect(bouncer.getPosition()).toBe(50);
  });

  // Add more tests based on your requirements
});
