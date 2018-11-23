import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'vtex.use-svg/Icon'
/**
 * Profile icon component in svg
 */
const ProfileIcon = ({ size, fillColor, viewBox }) => {
  return (
    <Icon
      id="profile"
      size={size}
      viewBox={viewBox}
      color={fillColor}
    />
  )
}

ProfileIcon.propTypes = {
  /* Percentage size of the icon */
  size: PropTypes.number,
  /* Fill color for the icon */
  fillColor: PropTypes.string,
  /* Icon Viewbox */
  viewBox: PropTypes.string
}

ProfileIcon.defaultProps = {
  size: 20,
  fillColor: 'currentColor',
  viewBox: '0 0 22 22'
}

export default ProfileIcon
