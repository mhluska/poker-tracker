import { IntroScreen, NewSessionScreen, ShowSessionScreen } from '.';
import { Screen } from '../types';
import { state } from '../state';

export const App = () => {
  switch (state.app.screen) {
    case Screen.Intro:
      return IntroScreen();
    case Screen.NewSession:
      return NewSessionScreen();
    case Screen.ShowSession:
      return ShowSessionScreen();
    default:
      throw new Error(`Unknown screen ${state.app.screen}`);
  }
};
