import React from 'react'
import PropTypes from 'prop-types'

/**
 * Eyesight enabled icon component in svg
 */
const EyeSightEnable = ({ size, fillColor }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={size}
      height={size}
      viewBox="0 0 16 16"
    >
      <use
        fill={fillColor}
        href="#eyesight-enable"
        xlinkHref="#eyesight-enable"
      />
    </svg>
  )
}

EyeSightEnable.propTypes = {
  /* Percentage size of the icon */
  size: PropTypes.number,
  /* Fill color for the icon */
  fillColor: PropTypes.string,
}

EyeSightEnable.defaultProps = {
  size: 14,
  fillColor: '#444444',
}

export default EyeSightEnable
