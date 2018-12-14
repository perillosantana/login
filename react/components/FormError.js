import React from 'react'
import PropTypes from 'prop-types'

export default function FormError({ children, show }) {
  if (!show) {
    return null
  }

  return (
    <div className="vtex-login__form-error t-small tc pa1 mv1 mh0">
      {children}
    </div>
  )
}

FormError.defaultProps = {
  show: false,
}

FormError.propTypes = {
  children: PropTypes.node,
  show: PropTypes.bool,
}
