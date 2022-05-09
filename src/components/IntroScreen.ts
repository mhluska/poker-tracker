import { e } from 'tortie-core';

export const IntroScreen = () => (
  e(
    'div',
    { id: 'intro-screen', className: 'screen' },
    e('button', { id: 'new-session-button' }, 'Start Session')
  )
);
