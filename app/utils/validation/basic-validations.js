import validUrl from 'valid-url';
import dateIsValid from 'date-is-valid';
import isNumber from 'is-number';

export function required(field, value, prop) {
  return prop ? !value : false;
}

export function matchField(field, value, prop, allValues) {
  return !allValues[prop] ? false : value !== allValues[prop];
}

export function minLength(field, value, prop) {
  return prop && value ? value.length < prop : false;
}

export function date(field, value) {
  return value
    ? !dateIsValid(value instanceof Date ? value : new Date(value))
    : false;
}

export function number(field, value) {
  return value
    ? !isNumber((value || '').replace(/,/, '.').replace(/\s+/g, ''))
    : false;
}

export function numberRequired(field, value, prop) {
  return prop ? !isNumber(value) : false;
}

export function email(field, value, prop) {
  return prop && value
    ? !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        value,
      )
    : false; // eslint-disable-line max-len
}

export function promise(field, value, prop, allValues) {
  if (typeof prop == 'function') {
    return prop(field, value, allValues);
  }
  throw new Error('FormValidation: type promise must be a function!');
}

export function equalTo(field, value, prop) {
  return !value ? false : prop !== value;
}

export function webSite(field, value, prop) {
  return prop && value ? !validUrl.isWebUri(value) : false;
}

export function country(field, value, prop) {
  return value ? value !== prop : false;
}

export function zipCode(field, value, country) {
  return false;
}
