import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'vtex.use-svg/Icon'

/**
 * Eyesight disabled icon component in svg
 */
const EyeSightDisable = ({ size, fillColor, viewBox }) => {
  return (
    <Icon
      id="eyesight-disable"
      size={size}
      viewBox={viewBox}
      color={fillColor}
    />
  )
}

EyeSightDisable.propTypes = {
  /* Percentage size of the icon */
  size: PropTypes.number,
  /* Fill color for the icon */
  fillColor: PropTypes.string,
  /* Icon viewBox */
  viewBox: PropTypes.string
}

EyeSightDisable.defaultProps = {
  size: 14,
  fillColor: '#444444',
  viewBox: '0 0 16 16'
}

export default EyeSightDisable
