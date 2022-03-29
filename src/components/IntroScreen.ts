import { e } from '../lib/renderer';

export const IntroScreen = () => {
  return e(
    'IntroScreen',
    { tagName: 'div', id: 'intro-screen', className: 'screen' },
    e('button', { id: 'new-session-button' }, 'Start Session')
  );
};
