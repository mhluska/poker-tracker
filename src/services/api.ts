import { Environments } from '../types';
import { Session } from '../models';
import { environment } from '../constants';

export class Api {
  origin() {
    if (environment === Environments.Development) {
      return 'http://localhost:3000';
    } else {
      return 'https://blackjack-trainer-api.herokuapp.com';
    }
  }

  request(path: string, body: unknown, requestOptions: RequestInit) {
    const url = `${this.origin()}/api/v1${path}`;

    return window.fetch(url, {
      method: requestOptions.method,
      headers: {
        ...requestOptions.headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  post(path: string, body: unknown, requestOptions: RequestInit) {
    return this.request(path, body, { method: 'POST', ...requestOptions });
  }

  saveSession(session: Session, adminPassword: string) {
    return this.post(
      '/poker_sessions',
      {
        data: {
          type: 'poker_session',
          attributes: session.attributes,
        },
      },
      {
        headers: {
          'Poker-Sessions-Admin-Password': adminPassword,
        },
      }
    );
  }
}
