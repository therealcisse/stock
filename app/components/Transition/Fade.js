import React from 'react';

import Transition, {
  ENTERED,
  ENTERING,
} from 'react-transition-group/Transition';

import style from './Fade.scss';

const FADE_DURATION = 200;

const fadeStyles = {
  [ENTERING]: 'show',
  [ENTERED]: 'show',
};

const Fade = ({ children, ...props }) => {
  return (
    <Transition {...props} timeout={FADE_DURATION}>
      {(status, innerProps) =>
        React.cloneElement(children, {
          ...innerProps,
          style: { transitionDuration: FADE_DURATION },
          className: `${style.fade} ${style[fadeStyles[status]]} ${children.props
            .className}`,
        })}
    </Transition>
  );
};

export default Fade;
