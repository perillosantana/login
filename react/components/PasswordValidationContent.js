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

  renderVerticalItens = fields => fields.map(
    field => (
      <div className="mt2" key={field.id}>
        <PasswordValidationItem
          label={field.label}
          valid={field.valid}
        />
      </div>
    )
  )

  renderHorizontalItens = fields => {
    const chunkFields = this.chunkArray(fields, 2)
    const leftItens = this.renderVerticalItens(chunkFields[0])
    const rightItens = this.renderVerticalItens(chunkFields[1])

    return (
      <div className="flex flex-row">
        <div className="flex flex-column mr2">
          {leftItens}
        </div>
        <div className="flex flex-column">
          {rightItens}
        </div>
      </div>
    )
  }

  render() {
    const { fields, horizontal } = this.props

    const content = horizontal ? this.renderHorizontalItens(fields) : this.renderVerticalItens(fields)

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
