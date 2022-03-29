import { e } from '../lib/renderer';

type Props = {
  smallBlind: number;
  bigBlind: number;
};

export const BlindsButton = ({ smallBlind, bigBlind }: Props) =>
  e(
    'BlindsButton',
    {
      tagName: 'button',
      type: 'button',
      className: 'prefill-blinds',
      'data-small-blind': smallBlind,
      'data-big-blind': bigBlind,
    },
    `${smallBlind}/${bigBlind}`
  );
