import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'vtex.use-svg/Icon'

/**
 * Eyesight enabled icon component in svg
 */
const EyeSightEnable = ({ size, fillColor, viewBox }) => {
  return (
    <Icon
      id="eyesight-enable"
      size={size}
      viewBox={viewBox}
      color={fillColor}
    />
  )
}

EyeSightEnable.propTypes = {
  /* Percentage size of the icon */
  size: PropTypes.number,
  /* Fill color for the icon */
  fillColor: PropTypes.string,
  /* Icon viewBox */
  viewBox: PropTypes.string
}

EyeSightEnable.defaultProps = {
  size: 14,
  fillColor: '#444444',
  viewBox: '0 0 16 16'
}

export default EyeSightEnable
