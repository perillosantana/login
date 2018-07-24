import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Profile icon component in svg
 */
export default class EyeSightDisable extends Component {
  static propTypes = {
    /* Percentage size of the icon */
    size: PropTypes.number,
    /* Fill color for the icon */
    fillColor: PropTypes.string,
  }

  static defaultProps = {
    size: 14,
  }

  render() {
    const { size } = this.props
    return (
      <svg
        width={size}
        height={size}
        viewBox={'0 0 16 16'}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(0, 0)">
          <path fill="#444444" d="M14.6,5.6l-8.2,8.2C6.9,13.9,7.5,14,8,14c3.6,0,6.4-3.1,7.6-4.9c0.5-0.7,0.5-1.6,0-2.3C15.4,6.5,15,6.1,14.6,5.6z"></path>
          <path fill="#444444" d="M14.3,0.3L11.6,3C10.5,2.4,9.3,2,8,2C4.4,2,1.6,5.1,0.4,6.9c-0.5,0.7-0.5,1.6,0,2.2c0.5,0.8,1.4,1.8,2.4,2.7l-2.5,2.5c-0.4,0.4-0.4,1,0,1.4C0.5,15.9,0.7,16,1,16s0.5-0.1,0.7-0.3l14-14c0.4-0.4,0.4-1,0-1.4S14.7-0.1,14.3,0.3z M5.3,9.3C5.1,8.9,5,8.5,5,8c0-1.7,1.3-3,3-3c0.5,0,0.9,0.1,1.3,0.3L5.3,9.3z"></path></g>
      </svg>
    )
  }
}
