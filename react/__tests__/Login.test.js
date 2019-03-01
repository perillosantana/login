import React from 'react'
import { render } from 'react-testing-library'

import Login from '../Login'
import messages from '../../messages/en-US.json'

describe('<Login /> component', () => {
  const intl = {
    formatMessage: ({ id }) => messages[id],
  }

  it('should match snapshot', () => {
    const { asFragment } = render(<Login />)
    expect(asFragment()).toMatchSnapshot()
  })
})
