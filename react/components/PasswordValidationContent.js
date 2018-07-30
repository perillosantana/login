import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import PasswordValidationItem from './PasswordValidationItem'

export default class PasswordValidationContent extends Component {
  chunkArray = (myArray, chunkSize) => {
    var results = []

    while (myArray.length) {
      results.push(myArray.splice(0, chunkSize))
    }

    return results
  }

  renderVerticalitems = fields => fields.map(
    field => (
      <div className="mt2" key={field.id}>
        <PasswordValidationItem
          label={field.label}
          valid={field.valid}
        />
      </div>
    )
  )

  renderHorizontalitems = fields => {
    const chunkFields = this.chunkArray(fields, 2)
    const leftitems = this.renderVerticalitems(chunkFields[0])
    const rightitems = this.renderVerticalitems(chunkFields[1])

    return (
      <div className="flex flex-row">
        <div className="flex flex-column mr2">
          {leftitems}
        </div>
        <div className="flex flex-column">
          {rightitems}
        </div>
      </div>
    )
  }

  render() {
    const { fields, horizontal } = this.props

    const content = horizontal ? this.renderHorizontalitems(fields) : this.renderVerticalitems(fields)

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
