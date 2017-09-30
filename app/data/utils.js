// @flow

import invariant from 'invariant';

import { MONETARY_UNIT } from 'vars';

export class Money {
  static fromDatabase(value: number): number {
    return value;
  }

  static toDatabase(value: number): number {
    return Math.trunc(value * MONETARY_UNIT);
  }
}
