import { FunctionComponent, e } from 'tortie-core';
import { IntroScreen, NewSessionScreen, ShowSessionScreen } from '.';
import { Screen } from '../types';
import { state } from '../state';

export const App: FunctionComponent = () => {
  switch (state.app.screen) {
    case Screen.Intro:
      return e(IntroScreen);
    case Screen.NewSession:
      return e(NewSessionScreen);
    case Screen.ShowSession:
      return e(ShowSessionScreen);
    default:
      throw new Error(`Unknown screen ${state.app.screen}`);
  }
};
