import { uuid, toISOString } from '../utils';
import { appState } from '../state';

export class Session {
  id: string;

  static create(
    casinoName: string,
    smallBlind: number,
    bigBlind: number,
    maxBuyin: number,
  ) {
    const id = uuid();

    appState.sessions[id] = {
      id: uuid(),
      casinoName,
      smallBlind,
      bigBlind,
      maxBuyin,
      notes: '',
      cashoutAmount: 0,
      dealerTips: 0,
      drinkTips: 0,
      buyins: [],
    };

    return new this(id);
  }

  constructor(id: string) {
    this.id = id;

    if (!this.attributes) {
      throw new Error(`Session ${id} does not exist`);
    }
  }

  get attributes() {
    return appState.sessions[this.id];
  }

  get startTime() {
    return this.attributes.startTime
      ? new Date(this.attributes.startTime)
      : null;
  }

  get endTime() {
    return this.attributes.endTime ? new Date(this.attributes.endTime) : null;
  }

  start() {
    if (this.startTime) {
      throw new Error('Session already started');
    }

    if (this.endTime) {
      throw new Error('Session already ended');
    }

    this.attributes.startTime = toISOString(new Date());
    this.attributes.buyins.push({
      amount: this.attributes.maxBuyin,
      time: this.attributes.startTime,
    });
  }

  rebuy(amount: number) {
    this.attributes.buyins.push({
      amount,
      time: new Date().toISOString(),
    });
  }

  rebuyMax() {
    this.rebuy(this.attributes.maxBuyin);
  }

  end(cashoutAmount: number, notes: string) {
    this.attributes.cashoutAmount = cashoutAmount;
    this.attributes.endTime = toISOString(new Date());
    this.attributes.notes = notes;
  }

  undoEnd() {
    this.attributes.cashoutAmount = 0;
    delete this.attributes.endTime;
  }

  buyinsTotal() {
    return this.attributes.buyins.reduce(
      (prev, current) => prev + current.amount,
      0
    );
  }

  updateTip(type: 'dealerTips' | 'drinkTips', change: number) {
    if (this.attributes[type] + change < 0) {
      return;
    }

    this.attributes[type] += change;
  }

  updateDealerTip(change: number) {
    this.updateTip('dealerTips', change);
  }

  updateDrinkTip(change: number) {
    this.updateTip('drinkTips', change);
  }
}
