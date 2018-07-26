import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Profile icon component in svg
 */
export default class EyeSightEnable extends Component {
  static propTypes = {
    /* Percentage size of the icon */
    size: PropTypes.number,
    /* Fill color for the icon */
    fillColor: PropTypes.string,
  }

  static defaultProps = {
    size: 14,
    fillColor: '#444444',
  }

  render() {
    const { size, fillColor } = this.props
    return (
      <svg
        width={size}
        height={size}
        viewBox={'0 0 16 16'}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(0, 0)">
          <path fill={fillColor} d="M8,14c3.6,0,6.4-3.1,7.6-4.9c0.5-0.7,0.5-1.6,0-2.3C14.4,5.1,11.6,2,8,2C4.4,2,1.6,5.1,0.4,6.9c-0.5,0.7-0.5,1.6,0,2.2C1.6,10.9,4.4,14,8,14z M8,5c1.7,0,3,1.3,3,3s-1.3,3-3,3S5,9.7,5,8S6.3,5,8,5z"></path>
        </g>
      </svg>
    )
  }
}
