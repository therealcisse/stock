import React from 'react';
import T from 'prop-types';

import focusNode from 'focusNode';

import raf from 'utils/requestAnimationFrame';

import {
  VisibilityOnIcon,
  VisibilityOffIcon,
} from 'components/icons/MaterialIcons';

import Button from 'components/bootstrap/Button';

import style from './PasswordInput.scss';

export default class PasswordInput extends React.Component {
  state = { private: true };
  constructor() {
    super();

    this.onTogglePrivacy = this.onTogglePrivacy.bind(this);
  }
  onTogglePrivacy() {
    this.setState(
      {
        private: !this.state.private,
      },
      () => {
        raf(() => {
          focusNode(this.refs.input);
        });
      },
    );
  }
  render() {
    const { inputProps, inputClassName, ...otherProps } = this.props;
    return (
      <div className={style.root}>
        <input
          className={inputClassName}
          type={this.state.private ? 'password' : 'text'}
          {...inputProps}
          {...otherProps}
          ref="input"
        />
        <Button
          data-password-input-button
          className={style.button}
          onClick={this.onTogglePrivacy}
          role="button"
        >
          {this.state.private ? (
            <VisibilityOffIcon size={18} />
          ) : (
            <VisibilityOnIcon size={18} />
          )}
        </Button>
      </div>
    );
  }
}

PasswordInput.propTypes = {
  inputProps: T.object.isRequired,
  inputClassName: T.string.isRequired,
};
