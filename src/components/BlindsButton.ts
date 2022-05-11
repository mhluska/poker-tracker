import { e, FunctionComponent } from 'tortie-core';

import { state } from '../state';

type Props = {
  smallBlind: number;
  bigBlind: number;
};

export const BlindsButton: FunctionComponent<Props> = ({
  smallBlind,
  bigBlind,
}) => {
  const handleClickPrefillBlinds = () => {
    state.app.newSessionScreen.smallBlind = smallBlind.toString();
    state.app.newSessionScreen.bigBlind = bigBlind.toString();
    state.app.newSessionScreen.maxBuyin = (bigBlind * 100).toString();
  };

  return e(
    'button',
    {
      type: 'button',
      className: 'prefill-blinds',
      onClick: handleClickPrefillBlinds,
    },
    `${smallBlind}/${bigBlind}`
  );
};
