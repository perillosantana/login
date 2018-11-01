import React from 'react'
import PropTypes from 'prop-types'

/**
 * Eyesight disabled icon component in svg
 */
const EyeSightDisable = ({ size, fillColor }) => {
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
        href="#eyesight-disable"
        xlinkHref="#eyesight-disable"
      />
    </svg>
  )
}

EyeSightDisable.propTypes = {
  /* Percentage size of the icon */
  size: PropTypes.number,
  /* Fill color for the icon */
  fillColor: PropTypes.string,
}

EyeSightDisable.defaultProps = {
  size: 14,
  fillColor: '#444444',
}

export default EyeSightDisable
