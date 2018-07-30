import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import PasswordValidationItem from './PasswordValidationItem'

export default class PasswordValidationContent extends Component {
  render() {
    const { fields } = this.props
    return (
      <Fragment>
        {
          fields.map(field => (
            <PasswordValidationItem
              key={field.id}
              label={field.label}
              valid={field.valid}
            />
          )
          )
        }
      </Fragment>
    )
  }
}

PasswordValidationContent.propTypes = {
  fields: PropTypes.array.isRequired,
}
