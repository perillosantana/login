import React, { Component } from 'react'

// import PropTypes from 'prop-types'
import { Query } from 'react-apollo'

import { withSession } from 'vtex.render-runtime'

import { LoginSchema } from './schema'
import { LoginPropTypes } from './propTypes'
import { getProfile } from './utils/profile'
import { session as GET_SESSION } from 'vtex.store-resources/Queries'

import './global.css'
import SignIn from './components/SignIn'

class PageLogin extends Component {
  static propTypes = {
    /* Props from storefront */
    emailAndPasswordTitle: LoginPropTypes.emailAndPasswordTitle,
    accessCodeTitle: LoginPropTypes.accessCodePlaceholder,
    emailPlaceholder: LoginPropTypes.emailPlaceholder,
    passwordPlaceholder: LoginPropTypes.passwordPlaceholder,
    accessCodePlaceholder: LoginPropTypes.accessCodePlaceholder,
    showPasswordVerificationIntoTooltip: LoginPropTypes.showPasswordVerificationIntoTooltip,
  }

  render = () => {
    return (
      <Query
        query={GET_SESSION}
        ssr={false}
      >
        {({data: session, loading}) => {
          const profile = getProfile(session)
          return (
            !loading && <SignIn
              profile={profile}
              {...this.props}
            />
          )
        }}
      </Query>
    )
  }
}

PageLogin.schema = {
  title: 'editor.loginPage.title',
  type: 'object',
  properties: LoginSchema,
}

export default withSession()(PageLogin)
