import { e, FunctionComponent } from '../lib/renderer';

type Props = {
  smallBlind: number;
  bigBlind: number;
};

export const BlindsButton: FunctionComponent<Props> = ({
  smallBlind,
  bigBlind,
}) =>
  e(
    'button',
    {
      type: 'button',
      className: 'prefill-blinds',
      'data-small-blind': smallBlind,
      'data-big-blind': bigBlind,
    },
    `${smallBlind}/${bigBlind}`
  );
