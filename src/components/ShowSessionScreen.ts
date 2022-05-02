import { e } from '../lib/renderer';
import { NumberInput, TipsSection } from '../components';
import { Session as SessionDecorator } from '../decorators';
import { appSelectors } from '../selectors';
import { state } from '../state';

export const ShowSessionScreen = () => {
  if (!appSelectors.currentSession) {
    return null;
  }

  const session = new SessionDecorator(appSelectors.currentSession);

  const handleNotesInput = (event: Event) => {
    if (event.target) {
      state.app.showSessionScreen.notes = (<HTMLInputElement>(
        event.target
      )).value;
    }
  };

  const handleCashoutAmountInput = (event: Event) => {
    if (event.target) {
      state.app.showSessionScreen.cashoutAmount = (<HTMLInputElement>(
        event.target
      )).value;
    }
  };

  return e(
    'ShowSessionScreen',
    { tagName: 'div', id: 'show-session-screen', className: 'screen' },
    e('h1', { id: 'session-title' }, session.title()),
    e('div', null, e('span', null, `Profit: $${session.profit()}`)),
    e('div', null, e('span', null, `Start time: $${session.startTime()}`)),
    e('div', null, e('span', null, `Time elapsed: ${session.timeElapsed()}`)),

    e(
      'form',
      { id: 'rebuy-form', className: 'section' },
      NumberInput({
        id: 'rebuy-amount-input',
        placeholder: appSelectors.currentSession.attributes.maxBuyin.toString(),
        value: state.app.showSessionScreen.rebuyAmount,
      }),
      e('input', { type: 'submit', value: 'Rebuy' }),
      e('input', { id: 'rebuy-max-button', type: 'button', value: 'Max' })
    ),

    TipsSection({ type: 'dealer', value: session.dealerTips() }),
    TipsSection({ type: 'drink', value: session.drinkTips() }),

    e(
      'form',
      { id: 'end-session-form', className: 'section' },
      e('input', {
        className: 'hidden',
        type: 'text',
        autocomplete: 'username',
      }),

      e(
        'label',
        { className: 'section' },
        e('div', null, 'Notes'),
        e('textarea', {
          onInput: handleNotesInput,
        })
      ),

      e(
        'label',
        { className: 'section' },
        e('div', null, 'Cashout Amount'),
        NumberInput({
          min: 0,
          value: state.app.showSessionScreen.cashoutAmount,
          placeholder: (
            appSelectors.currentSession.attributes.maxBuyin * 3
          ).toString(),
          onInput: handleCashoutAmountInput,
        })
      ),

      state.app.cachedAdminPassword
        ? ''
        : e(
            'div',
            { id: 'admin-password-area' },
            e('label', null, e('span', null, 'Password')),
            e('input', {
              id: 'admin-password-input',
              type: 'password',
              autocomplete: 'current-password',
              required: true,
            })
          ),

      e('input', {
        id: 'end-session-submit-button',
        type: 'submit',
        value: 'End Session',
        disabled: state.app.showSessionScreen.isSavingSession,
      })
    )
  );
};
