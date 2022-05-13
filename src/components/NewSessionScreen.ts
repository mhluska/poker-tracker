import { e } from 'recat-core';

import { NumberInput, BlindsButton, SuggestedCasino } from '../components';
import { state } from '../state';
import { appSelectors } from '../selectors';
import { Screen } from '../types';
import { Session } from '../models';

export const NewSessionScreen = () => {
  const handleSelectSuggestedCasino = (casinoName: string) => {
    state.app.newSessionScreen.casinoName = casinoName;
  };

  const navigateToShowSessionScreen = (session: Session) => {
    window.history.pushState({}, '', `#/sessions/${session.id}`);
    state.app.currentSessionId = session.id;
    state.app.screen = Screen.ShowSession;
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();

    const session = Session.create(
      state.app.newSessionScreen.casinoName,
      parseInt(state.app.newSessionScreen.smallBlind),
      parseInt(state.app.newSessionScreen.bigBlind),
      parseInt(state.app.newSessionScreen.maxBuyin)
    );

    session.start();

    navigateToShowSessionScreen(session);
  };

  return e(
    'div',
    { className: 'screen' },
    e(SuggestedCasino, { onSelect: handleSelectSuggestedCasino }),
    e(
      'form',
      { onSubmit: handleSubmit },
      e(
        'div',
        null,
        e(
          'label',
          null,
          e('span', null, 'Casino Name'),
          e('input', {
            type: 'text',
            placeholder: appSelectors.mostFrequentCasinoName ?? 'Bellagio',
            required: true,
            value: state.app.newSessionScreen.casinoName,
            onInput: (event) =>
              (state.app.newSessionScreen.casinoName = (
                event.target as HTMLInputElement
              ).value),
          })
        )
      ),
      e(
        'div',
        null,
        e(
          'label',
          null,
          e('span', null, 'Blinds'),
          e(NumberInput, {
            placeholder: '2',
            value: state.app.newSessionScreen.smallBlind,
            max: 100,
            onInput: (event) =>
              (state.app.newSessionScreen.smallBlind = (
                event.target as HTMLInputElement
              ).value),
          }),
          e(NumberInput, {
            placeholder: '5',
            value: state.app.newSessionScreen.bigBlind,
            max: 200,
            onInput: (event) =>
              (state.app.newSessionScreen.bigBlind = (
                event.target as HTMLInputElement
              ).value),
          })
        ),
        e(BlindsButton, { smallBlind: 1, bigBlind: 2 }),
        e(BlindsButton, { smallBlind: 1, bigBlind: 3 }),
        e(BlindsButton, { smallBlind: 2, bigBlind: 5 }),
        e(BlindsButton, { smallBlind: 5, bigBlind: 10 })
      ),
      e(
        'div',
        null,
        e(
          'label',
          null,
          e('span', null, 'Max Buyin'),
          e(NumberInput, {
            placeholder: '500',
            value: state.app.newSessionScreen.maxBuyin,
            onInput: (event) =>
              (state.app.newSessionScreen.maxBuyin = (
                event.target as HTMLInputElement
              ).value),
          })
        )
      ),
      e('div', null, e('input', { type: 'submit', value: 'Start Session' }))
    )
  );
};
