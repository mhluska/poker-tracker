import { Session as SessionModel } from '../models';
import { formatDuration } from '../utils';

export class Session {
  session: SessionModel;

  constructor(session: SessionModel) {
    this.session = session;
  }

  drinkTips() {
    return `$${this.session.attributes.drinkTips ?? 0}`;
  }

  dealerTips() {
    return `$${this.session.attributes.dealerTips ?? 0}`;
  }

  blinds() {
    return `${this.session.attributes.smallBlind}/${this.session.attributes.bigBlind}`;
  }

  maxBuyin() {
    return `$${this.session.attributes.maxBuyin} max`;
  }

  title() {
    return [
      this.session.attributes.casinoName,
      this.blinds(),
      this.maxBuyin(),
    ].join(' ');
  }

  startTime() {
    return this.session.startTime?.toLocaleString() ?? '';
  }

  profit() {
    const cashoutAmount = this.session.attributes.cashoutAmount ?? 0;
    return (cashoutAmount - this.session.buyinsTotal()).toString();
  }

  timeElapsed() {
    if (!this.session.startTime) {
      return '';
    }

    return formatDuration(Date.now() - this.session.startTime.getTime());
  }
}
