import { e } from 'recat-core';

import { Screen } from '../types';
import { state } from '../state';
import { SessionsList } from './SessionsList';

export const IntroScreen = () => {
  const navigateToNewSessionScreen = () => {
    window.history.pushState({}, '', '#/sessions/new');
    state.app.screen = Screen.NewSession;
  };

  return e(
    'div',
    { className: 'screen' },
    e('button', { onClick: navigateToNewSessionScreen }, 'New Session'),
    e(SessionsList)
  );
}
