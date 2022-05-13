import { e, FunctionComponent } from 'recat-core';

import { IntroScreen, NewSessionScreen, ShowSessionScreen } from '..';
import { AppFooter } from '..';
import { Screen } from '../../types';
import { state } from '../../state';
import './styles.css';

const selectScreen = (screen: Screen) => {
  switch (screen) {
    case Screen.Intro:
      return IntroScreen;
    case Screen.NewSession:
      return NewSessionScreen;
    case Screen.ShowSession:
      return ShowSessionScreen;
    default:
      throw new Error(`Unknown screen ${state.app.screen}`);
  }
};

export const App: FunctionComponent = () => {
  const Screen = selectScreen(state.app.screen);
  return e('div', { className: 'app' }, e(Screen), e(AppFooter));
};
