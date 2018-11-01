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
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <use fill={fillColor} href="#eyesight-enable" />
      </svg>
    )
  }
}
