import { e, useState, useEffect, FunctionComponent } from 'recat-core';
import { formatDuration } from '../utils';

type Props = {
  startTime: Date;
};

const MILLISECONDS_IN_ONE_SECOND = 1000;

export const Timer: FunctionComponent<Props> = ({ startTime }) => {
  const [timeElaped, setTimeElapsed] = useState('');

  useEffect(() => {
    const updateTimeElapsed = () => {
      setTimeElapsed(formatDuration(Date.now() - startTime.getTime()));
    };

    setInterval(updateTimeElapsed, MILLISECONDS_IN_ONE_SECOND);
    updateTimeElapsed();
  }, []);

  return e('span', null, timeElaped.toString());
};
