import React from 'react'

export const ExtensionContainer = ({ id }) => (
  <div className="ExtensionContainer-mock">{id}</div>
)

export const Link = ({ page, className, children }) => (
  <a href={page} className={className}>
    {children}
  </a>
)

export const withRuntimeContext = comp => comp
export const withSession = () => comp => comp
