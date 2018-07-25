import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { IconDeny, IconCheck } from 'vtex.styleguide'

export default class PasswordValidationItem extends Component {
  render() {
    return (
      <Fragment>
        {this.props.valid ? <IconCheck size={10} color="#BDBDBD" /> : <IconDeny size={10} color="#BDBDBD" />}
        <span className="ml2 f7 mid-gray">{this.props.label}</span>
      </Fragment>
    )
  }
}

PasswordValidationItem.propTypes = {
  /** Switch the icon to appear with the text (failed or success) */
  valid: PropTypes.bool,
  /** Label to appear into the item */
  label: PropTypes.string.isRequired,
}
