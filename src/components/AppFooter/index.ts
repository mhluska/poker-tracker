import { e, useEffect, useState } from 'recat-core';
import './styles.css';

const MILLISECONDS_IN_ONE_SECOND = 1000;

export const AppFooter = () => {
  const [footerHidden, setFooterHidden] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFooterHidden(true);
    }, 3 * MILLISECONDS_IN_ONE_SECOND);
  }, []);

  return e(
    'div',
    {
      className: `app-footer ${footerHidden ? 'app-footer--invisible' : ''}`,
    },
    'Powered by ',
    e(
      'a',
      {
        href: 'https://github.com/mhluska/recat',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      'recat'
    )
  );
};
