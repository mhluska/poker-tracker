import { e, FunctionComponent } from 'recat-core';

import { appSelectors } from '../selectors';
import { Screen } from '../types';
import { state } from '../state';

export const SessionsList: FunctionComponent = () => {
  const navigateToSession = (sessionId: string) => {
    state.app.currentSessionId = sessionId;
    state.app.screen = Screen.ShowSession;
  };

  const handleClickClearPastSessions = (event: Event) => {
    event.preventDefault();
    state.app.currentSessionId = '';
    state.app.sessions = {};
  };

  return e(
    'div',
    null,
    e(
      'ol',
      null,
      ...appSelectors.recentSessions.map((session) =>
        e(
          'li',
          null,
          e(
            'a',
            {
              href: `/#/sessions/${session.session.attributes.id}`,
              // TODO: For links to work seamlessly, we'd need to add a router.
              // Or in this case we should build one as `recat-router` since
              // everything is intentionally custom-built.
              onClick: () => navigateToSession(session.session.attributes.id),
            },
            session.title()
          ),
          e('span', null, ` ${session.startTime()}`)
        )
      )
    ),
    appSelectors.recentSessions.length > 0
      ? e(
          'a',
          { href: '#', onClick: handleClickClearPastSessions },
          'Clear sessions'
        )
      : null
  );
};
