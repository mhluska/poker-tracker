import { Environments } from './types';

const getEnvironment = () => {
  if (window.location.hostname === 'localhost') {
    return Environments.Development;
  } else {
    return Environments.Production;
  }
};

export const environment = getEnvironment();
