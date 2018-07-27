import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Tooltip extends Component {
  render() {
    const { children, title } = this.props

    return (
      <div className="vtex-tooltip__container pa5 br2 absolute z-max">
        {title &&
          <div className="mb3">
            <span className="f5 ttu">
              {title}
            </span>
          </div>
        }
        {children}
      </div>
    )
  }
}

Tooltip.propTypes = {
  /** Title to appear into the Tooltip */
  title: PropTypes.string,
  /** Children to appear inside the Tooltip */
  children: PropTypes.object.isRequired,
}
