import React from 'react';
import T from 'prop-types';

import style from './Profile.scss';

import ProfilePic from './ProfilePic';

import Dropdown from 'components/bootstrap/Dropdown';

const ProfileButton = ({ user, size, children }) => (
  <div className={style.menu}>
    <Dropdown pullRight>
      <Dropdown.Toggle className={style.avatar} role="button">
        <ProfilePic user={user} size={size} />
      </Dropdown.Toggle>
      <Dropdown.Menu>{children}</Dropdown.Menu>
    </Dropdown>
  </div>
);

ProfileButton.propTypes = {
  size: T.number.isRequired,
  children: T.arrayOf(T.element.isRequired).isRequired,
  user: T.shape({
    displayName: T.string.isRequired,
    email: T.string,
  }),
};

ProfileButton.defaultProps = {
  size: 32,
};

export default ProfileButton;
