// tests/ball.test.js
import Ball from './ball.mjs';

describe('Ball Tests', () => {
  let ball;

  beforeEach(() => {
    document.body.innerHTML = '<div id="ball"></div>';
    ball = new Ball(document.getElementById('ball'));
  });

  test('Resets the ball position', () => {
    ball.setPosition(30);
    ball.reset();
    expect(ball.getPosition()).toBe(50);
  });

  // Add more tests based on your requirements
});
