import { e } from '../lib/renderer';
import { NumberInput, BlindsButton, SuggestedCasino } from '../components';
import { state } from '../state';
import { appSelectors } from '../selectors';

export const NewSessionScreen = () => {
  const handleSelectSuggestedCasino = (casinoName: string) => {
    state.app.newSessionScreen.casinoName = casinoName;
  };

  return e(
    'NewSessionScreen',
    { tagName: 'div', id: 'new-session-screen', className: 'screen' },
    SuggestedCasino({ onSelect: handleSelectSuggestedCasino }),
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
            placeholder: appSelectors.mostFrequentCasinoName ?? 'Bellagio',
            required: true,
            value: state.app.newSessionScreen.casinoName,
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
            value: state.app.newSessionScreen.smallBlind,
            max: 100,
          }),
          NumberInput({
            id: 'big-blind-input',
            placeholder: '5',
            value: state.app.newSessionScreen.bigBlind,
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
            value: state.app.newSessionScreen.maxBuyin,
          })
        )
      ),
      e('div', null, e('input', { type: 'submit', value: 'Start Session' }))
    )
  );
};
