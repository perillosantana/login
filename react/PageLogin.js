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
import AccountOptions from './components/AccountOptions'

class LoginContent extends Component {
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

    // Redirect the user to the returnURL if they are logged in and no "profile" props was passed and the user is at "/login"
    // Otherwise just render account options

    const alreadyLoadedSession = false

    if (alreadyLoadedSession) {
      return (
        <div className="vtex-login-content flex relative bg-base justify-around overflow-hidden">
          <div className="vtex-login-content__form--step-0">
            <AccountOptions />
          </div>
        </div>
      )
    }


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

LoginContent.schema = {
  title: 'editor.loginPage.title',
  type: 'object',
  properties: LoginSchema,
}

export default withSession()(LoginContent)

