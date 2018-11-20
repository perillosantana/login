import React from 'react'
import PropTypes from 'prop-types'

/**
 * Profile icon component in svg
 */
const ProfileIcon = ({ size, fillColor }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      color={fillColor}
    >
      <use href="#profile" xlinkHref="#profile" />
    </svg>
  )
}

ProfileIcon.propTypes = {
  /* Percentage size of the icon */
  size: PropTypes.number,
  /* Fill color for the icon */
  fillColor: PropTypes.string,
}

ProfileIcon.defaultProps = {
  size: 20,
  fillColor: 'currentColor',
}

export default ProfileIcon
