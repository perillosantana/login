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

  renderVerticalItems = fields => (
    this.renderItems(fields, false)
  )

  renderItems = (fields, half) => (
    fields.map(
      field => (
        <div className={`mt2 ${half ? 'w-50' : ''}`} key={field.id}>
          <PasswordValidationItem
            label={field.label}
            prefix={field.prefix}
            valid={field.valid}
          />
        </div>
      )
    )
  )

  renderHorizontalItems = fields => {
    const chunkFields = this.chunkArray(fields, 2)
    const leftItems = this.renderItems(chunkFields[0], true)
    const rightItems = this.renderItems(chunkFields[1], true)

    return (
      <Fragment>
        <div className="flex flex-row mr2">
          {leftItems}
        </div>
        <div className="flex flex-row">
          {rightItems}
        </div>
      </Fragment>
    )
  }

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
