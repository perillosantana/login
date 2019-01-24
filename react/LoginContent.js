import React, { Component } from 'react'

import { compose } from 'ramda'
import PropTypes from 'prop-types'
import { graphql, Query } from 'react-apollo'

// import { Transition } from 'react-spring'
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
    session: PropTypes.object,
    /** Function called after login success */
    loginCallback: PropTypes.func,
    /* Reused props */
    emailAndPasswordTitle: LoginPropTypes.emailAndPasswordTitle,
    accessCodeTitle: LoginPropTypes.accessCodePlaceholder,
    emailPlaceholder: LoginPropTypes.emailPlaceholder,
    passwordPlaceholder: LoginPropTypes.passwordPlaceholder,
    accessCodePlaceholder: LoginPropTypes.accessCodePlaceholder,
    showPasswordVerificationIntoTooltip: LoginPropTypes.showPasswordVerificationIntoTooltip,
  }

  render = () => {
    const {
      sessionData,
    } = this.props

    // Redirect the user to the returnURL if they are logged in and no "profile" props was passed and the user is at "/login"
    // Otherwise just render account options

    const alreadyLoadedSession = !!sessionData
    const isLoggedIn = getProfile(sessionData)

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
              loginCallback={this.props.loginCallback}
            />
          )
        }}
      </Query>
    )
  }
}

const content = withSession()(LoginContent)

content.schema = {
  title: 'editor.loginPage.title',
  type: 'object',
  properties: LoginSchema,
}

export default content

