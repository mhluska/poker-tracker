import { IntroScreen, NewSessionScreen, ShowSessionScreen } from '.';
import { Screen } from '../types';
import { appState } from '../state';

export const App = () => {
  switch (appState.screen) {
    case Screen.Intro:
      return IntroScreen();
    case Screen.NewSession:
      return NewSessionScreen();
    case Screen.ShowSession:
      return ShowSessionScreen();
    default:
      throw new Error(`Unknown screen ${appState.screen}`);
  }
};
