import React from 'react'
import PropTypes from 'prop-types'

export default function FormTitle({ children }) {
  return (
    <h3 className="vtex-login__form-title t-body v-mid ttu tc relative pv2 ph3 br2">
      {children}
    </h3>
  )
}

FormTitle.propTypes = {
  children: PropTypes.node,
}

