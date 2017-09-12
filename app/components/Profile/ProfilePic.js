import React from 'react';
import T from 'prop-types';

import Avatar from 'components/Avatar';

function getInitials(name) {
  // const parts = name.split(' ');
  // let initials = '';
  // for(let i = 0 ; i < parts.length ; i++) {
  //   initials += parts[i].substr(0, 1).toUpperCase();
  // }
  // return initials;

  try {
    const parts = name.split(/\s+/);
    if (parts.length >= 3) {
      return parts[1][0];
    }
  } catch (e) {}

  return name[0];
}

const ProfilePic = ({ user, size, ...props }) => {
  if (user) {
    if (user.displayName || user.name) {
      return (
        <Avatar size={size} textSizeRatio={1.75} {...props}>
          {getInitials(user.displayName || user.name)}
        </Avatar>
      );
    } else {
      return (
        <Avatar size={size} textSizeRatio={1.75} {...props}>
          @
        </Avatar>
      );
    }
  }
  return null;
};

ProfilePic.propTypes = {
  user: T.shape({
    displayName: T.string.isRequired,
  }),
  size: T.number.isRequired,
};

ProfilePic.defaultProps = {
  size: 32,
};

export default ProfilePic;
