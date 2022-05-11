import { e, FunctionComponent } from 'tortie-core';

import { capitalize } from '../../utils';
import './styles.css';

type Props = {
  type: 'dealer' | 'drink';
  value: string;
};

export const TipsSection: FunctionComponent<Props> = ({ type, value }) =>
  e(
    'div',
    { className: 'section' },
    e('span', null, `${capitalize(type)} tips: ${value}`),
    e(
      'div',
      null,
      e(
        'button',
        { className: 'tip-button', id: `decrement-${type}-tip-button` },
        '-'
      ),
      e(
        'button',
        { className: 'tip-button', id: `increment-${type}-tip-button` },
        '+'
      )
    )
  );
