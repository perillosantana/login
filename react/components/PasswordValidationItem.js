import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class PasswordValidationItem extends Component {
  render() {
    const { valid, prefix, label } = this.props

    return (
      <div className={`flex flex-row ${valid ? 'green' : 'red'}`}>
        <div className="w-20">
          <span className="f6">{prefix}</span>
        </div>
        <div className="w-80">
          <span className="f6">{label}</span>
        </div>
      </div >
    )
  }
}

PasswordValidationItem.propTypes = {
  /** Switch the icon to appear with the text (failed or success) */
  valid: PropTypes.bool,
  /** Label to appear before the text */
  prefix: PropTypes.string.isRequired,
  /** Label to appear into the item */
  label: PropTypes.string.isRequired,
}
