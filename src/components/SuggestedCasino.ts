import { e } from '../lib/renderer';
import { appSelectors } from '../selectors';

type Props = {
  onSelect: (casinoName: string) => void;
};

export const SuggestedCasino = ({ onSelect }: Props) => {
  const casinoName = appSelectors.mostFrequentCasinoName;
  if (!casinoName) {
    return null;
  }

  return e(
    'div',
    null,
    `Play at ${casinoName} again?`,
    e('button', { onClick: () => onSelect(casinoName) }, 'OK')
  );
};
