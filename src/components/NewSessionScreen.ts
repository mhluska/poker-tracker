import { e } from '../lib/renderer';
import { NumberInput, BlindsButton } from '../components';
import { appState } from '../state';

export const NewSessionScreen = () => {
  return e(
    'NewSessionScreen',
    { tagName: 'div', id: 'new-session-screen', className: 'screen' },
    e(
      'form',
      { id: 'new-session-form' },
      e(
        'div',
        null,
        e(
          'label',
          null,
          e('span', null, 'Casino Name'),
          e('input', {
            id: 'casino-name-input',
            type: 'text',
            placeholder: 'Bellagio',
            required: true,
            value: appState.newSessionScreen.casinoName,
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
          NumberInput({
            id: 'small-blind-input',
            placeholder: '2',
            value: appState.newSessionScreen.smallBlind,
            max: 100,
          }),
          NumberInput({
            id: 'big-blind-input',
            placeholder: '5',
            value: appState.newSessionScreen.bigBlind,
            max: 200,
          })
        ),
        BlindsButton({ smallBlind: 1, bigBlind: 2 }),
        BlindsButton({ smallBlind: 1, bigBlind: 3 }),
        BlindsButton({ smallBlind: 2, bigBlind: 5 }),
        BlindsButton({ smallBlind: 5, bigBlind: 10 })
      ),
      e(
        'div',
        null,
        e(
          'label',
          null,
          e('span', null, 'Max Buyin'),
          NumberInput({
            id: 'max-buyin-input',
            placeholder: '500',
            value: appState.newSessionScreen.maxBuyin,
          })
        )
      ),
      e(
        'div',
        null,
        e(
          'label',
          null,
          e('span', null, 'Max Players'),
          NumberInput({
            id: 'max-players-input',
            placeholder: '8',
            max: 10,
            value: appState.newSessionScreen.maxPlayers,
          })
        )
      ),
      e('div', null, e('input', { type: 'submit', value: 'Start Session' }))
    )
  );
};
