import { e, FunctionComponent } from 'tortie-core';

import { capitalize } from '../../utils';
import './styles.css';

type Props = {
  type: 'dealer' | 'drink';
  value: string;
  onUpdateTip: (tipChange: number) => void;
};

export const TipsSection: FunctionComponent<Props> = ({
  type,
  value,
  onUpdateTip,
}) =>
  e(
    'div',
    { className: 'section' },
    e('span', null, `${capitalize(type)} tips: ${value}`),
    e(
      'div',
      null,
      e(
        'button',
        { className: 'tip-button', onClick: () => onUpdateTip(-1) },
        '-'
      ),
      e(
        'button',
        { className: 'tip-button', onClick: () => onUpdateTip(1) },
        '+'
      )
    )
  );
