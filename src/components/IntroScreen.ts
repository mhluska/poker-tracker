import { e } from '../lib/renderer';

export const IntroScreen = () => (
  e(
    'div',
    { id: 'intro-screen', className: 'screen' },
    e('button', { id: 'new-session-button' }, 'Start Session')
  )
);
