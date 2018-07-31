import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import PasswordValidationItem from './PasswordValidationItem'

export default class PasswordValidationContent extends Component {
  renderVerticalItems = fields => fields.map(
    field => (
      <div className="mt2" key={field.id}>
        <PasswordValidationItem
          label={field.label}
          valid={field.valid}
        />
      </div>
    )
  )

  renderHorizontalItems = fields => (
    <div className="mt4">
      {fields.map(
        field => (
          <div className="mt2 w-50 fr" key={field.id}>
            <PasswordValidationItem
              label={field.label}
              valid={field.valid}
            />
          </div>
        )
      )
      }
    </div>
  )

  render() {
    const { fields, horizontal } = this.props

    const content = horizontal ? this.renderHorizontalItems(fields) : this.renderVerticalItems(fields)

    return (
      <Fragment>
        {content}
      </Fragment>
    )
  }
}

PasswordValidationContent.propTypes = {
  fields: PropTypes.array.isRequired,
  horizontal: PropTypes.bool,
}
