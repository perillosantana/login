import React from 'react'
import { renderWithIntl } from 'intl-utils'

import Login from '../Login'

describe('<Login /> component', () => {
  it('should match snapshot when loading', () => {
    const { asFragment } = renderWithIntl(
      <Login
        isBoxOpen
        data={{
          loading: true,
          refetch: () => {},
        }}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot without profile', () => {
    const { asFragment } = renderWithIntl(
      <Login
        isBoxOpen
        data={{
          loading: false,
          refetch: () => {},
        }}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot with profile without name', () => {
    const { asFragment } = renderWithIntl(
      <Login
        isBoxOpen
        data={{
          loading: false,
          refetch: () => {},
          getSession: {
            profile: {
              email: 'email@vtex.com',
              id: 'id',
            },
          },
        }}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot with profile with name', () => {
    const { asFragment } = renderWithIntl(
      <Login
        isBoxOpen
        data={{
          loading: false,
          refetch: () => {},
          getSession: {
            profile: {
              email: 'email@vtex.com',
              firstName: 'firstName',
              lastName: 'lastName',
              id: 'id',
            },
          },
        }}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
