import React from 'react'
import { renderWithIntl } from 'intl-utils'

import Login from '../Login'

describe('<Login /> component', () => {
  it('should match snapshot when loading', () => {
    const { asFragment } = renderWithIntl(
      <Login
        data={{
          loading: true,
          refetch: () => {},
        }}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
