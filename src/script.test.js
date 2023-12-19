// tests/script.test.js
import Script from './script.mjs';

// Mocking Howl library
jest.mock('howler', () => ({
  Howl: jest.fn(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    playing: jest.fn(() => false),
  })),
}));

describe('Script Tests', () => {
  let script;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="ball"></div>
      <div id="player-bouncer"></div>
      <div id="ai-bouncer"></div>
      <div id="player-score"></div>
      <div id="ai-score"></div>
      <div id="pause-button"></div>
      <div id="pause-menu"></div>
      <div id="start-menu"></div>
      <div id="winner-text"></div>
      <div id="game-over-menu"></div>
      <form id="start-form">
        <input id="player-name" type="text" />
        <input id="winning-score" type="number" />
      </form>
    `;

    script = new Script();
  });

  test('Starts the game and sets player name', () => {
    document.getElementById('player-name').value = 'John';
    script.startGame();
    expect(document.getElementById('player-score').getAttribute('data-name')).toBe('John');
  });

  // Add more tests based on your requirements
});
