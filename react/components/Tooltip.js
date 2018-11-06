import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class Tooltip extends Component {
  render() {
    const { children, title, top } = this.props

    const classes = classNames('vtex-tooltip__container pa5 br2 absolute z-max', {
      'vtex-tooltip__container-top': top,
      'vtex-tooltip__container-left': !top,
    })

    return (
      <div className={classes}>
        <div className="pa2">
          {title &&
            <div className="mb3">
              <span className="t-action b ttu c-on-base--inverted">
                {title}
              </span>
            </div>
          }
          {children}
        </div>
      </div>
    )
  }
}

Tooltip.propTypes = {
  /** Title to appear into the Tooltip */
  title: PropTypes.string,
  /** Children to appear inside the Tooltip */
  children: PropTypes.object.isRequired,
  /** Set the tooltip position */
  top: PropTypes.bool,
}
