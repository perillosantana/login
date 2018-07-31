import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import PasswordValidationItem from './PasswordValidationItem'

export default class PasswordValidationContent extends Component {
  renderItems = fields => fields.map(
    field => (
      <div className="mt2" key={field.id}>
        <PasswordValidationItem
          label={field.label}
          prefix={field.prefix}
          valid={field.valid}
        />
      </div>
    )
  )

  render() {
    const { fields } = this.props

    const content = this.renderItems(fields)

    return (
      <Fragment>
        {content}
      </Fragment>
    )
  }
}

PasswordValidationContent.propTypes = {
  fields: PropTypes.array.isRequired,
}
