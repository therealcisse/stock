import React from 'react';
import T from 'prop-types';

import style from './Profile.scss';

import ProfilePic from './ProfilePic';

const ProfileMenuItem = ({ user, size }) => (
  <div className={style.profile}>
    <div className={style.profileAvatar}>
      <ProfilePic user={user} square size={size} />
    </div>
    <div className={style.profileInfo}>
      <div className={style.profileName}>{user && user.displayName}</div>
      <div className={style.profileEmail}>{user && user.email}</div>
    </div>
  </div>
);

ProfileMenuItem.propTypes = {
  user: T.shape({
    displayName: T.string.isRequired,
    email: T.string,
  }),
  size: T.number.isRequired,
};

ProfileMenuItem.defaultProps = {
  size: 48,
};

export default ProfileMenuItem;
