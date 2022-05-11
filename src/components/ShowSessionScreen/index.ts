import { e, FunctionComponent } from 'tortie-core';

import { NumberInput, TipsSection, Timer } from '../../components';
import { Session as SessionDecorator } from '../../decorators';
import { appSelectors } from '../../selectors';
import { Screen } from '../../types';
import { Api } from '../../services';
import { state } from '../../state';
import './styles.css';

const apiService = new Api();

export const ShowSessionScreen: FunctionComponent = () => {
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

  const handleSubmitRebuyForm = (event: Event) => {
    event.preventDefault();

    if (!appSelectors.currentSession) {
      return;
    }

    appSelectors.currentSession.rebuy(
      parseFloat(state.app.showSessionScreen.rebuyAmount)
    );
    state.app.showSessionScreen.rebuyAmount = '';
  };

  const navigateToIntroScreen = () => {
    window.history.pushState({}, '', '#');
    state.app.screen = Screen.Intro;
  };

  const saveToGoogleSheet = async () => {
    if (!appSelectors.currentSession) {
      return;
    }

    appSelectors.currentSession.end(
      parseFloat(state.app.showSessionScreen.cashoutAmount),
      state.app.showSessionScreen.notes
    );

    state.app.showSessionScreen.isSavingSession = true;

    let response;

    try {
      response = await apiService.saveSession(
        appSelectors.currentSession,
        state.app.cachedAdminPassword ?? state.app.showSessionScreen.adminPassword
      );
    } finally {
      state.app.showSessionScreen.isSavingSession = false;
    }

    if (response.ok) {
      if (!state.app.cachedAdminPassword) {
        state.app.cachedAdminPassword = state.app.showSessionScreen.adminPassword;
      }

      alert('Success!');
      navigateToIntroScreen();
    } else {
      alert('Something went wrong.');

      // TODO: Use changesets so we don't have to do this.
      appSelectors.currentSession.undoEnd();
    }
  };

  const handleSubmitEndSessionForm = (event: Event) => {
    event.preventDefault();
    saveToGoogleSheet();
  };

  return e(
    'div',
    { className: 'screen' },
    e('h1', { className: 'session-title' }, session.title()),
    e('div', null, e('span', null, `Profit: $${session.profit()}`)),
    e('div', null, e('span', null, `Start time: ${session.startTime()}`)),
    appSelectors.currentSession.startTime &&
      e(
        'div',
        null,
        e(
          'span',
          null,
          'Time elapsed: ',
          e(Timer, { startTime: appSelectors.currentSession.startTime })
        )
      ),

    e(
      'form',
      { className: 'section', onSubmit: handleSubmitRebuyForm },
      e(NumberInput, {
        placeholder: appSelectors.currentSession.attributes.maxBuyin.toString(),
        value: state.app.showSessionScreen.rebuyAmount,
        onInput: (event) =>
          (state.app.showSessionScreen.rebuyAmount = (
            event.target as HTMLInputElement
          ).value),
      }),
      e('input', { type: 'submit', value: 'Rebuy' }),
      e('input', {
        onClick: () => appSelectors.currentSession?.rebuyMax(),
        type: 'button',
        value: 'Max',
      })
    ),

    e(TipsSection, {
      type: 'dealer',
      value: session.dealerTips(),
      onUpdateTip: (change) =>
        appSelectors.currentSession?.updateDealerTip(change),
    }),
    e(TipsSection, {
      type: 'drink',
      value: session.drinkTips(),
      onUpdateTip: (change) =>
        appSelectors.currentSession?.updateDrinkTip(change),
    }),

    e(
      'form',
      { className: 'section', onSubmit: handleSubmitEndSessionForm },
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
        e(NumberInput, {
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
            null,
            e('label', null, e('span', null, 'Password')),
            e('input', {
              type: 'password',
              autocomplete: 'current-password',
              required: true,
              onInput: (event) =>
                (state.app.showSessionScreen.adminPassword = (
                  event.target as HTMLInputElement
                ).value),
            })
          ),

      e('input', {
        type: 'submit',
        value: 'End Session',
        disabled: state.app.showSessionScreen.isSavingSession,
      })
    )
  );
};
