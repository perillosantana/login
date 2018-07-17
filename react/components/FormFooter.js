import React from 'react'
import PropTypes from 'prop-types'

export default function FormFooter({ children }) {
  return (
    <div className="vtex-login__form-footer flex mt3">
      {children}
    </div>
  )
}

FormFooter.propTypes = {
  children: PropTypes.node,
}
