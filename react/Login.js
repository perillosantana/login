import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { withSession } from 'render'
import { compose } from 'ramda'

import GET_USER_PROFILE from './queries/session.gql'
import LoginComponent from './components/LoginComponent'
import { setCookie } from './utils/set-cookie'
import { LoginSchema } from './schema'
import { LoginContainerProptypes } from './propTypes'

import './global.css'

const DEFAULT_CLASSES = 'white'

/** Canonical login that calls a mutation to retrieve the authentication token */
export default class Login extends Component {
  static propTypes = LoginContainerProptypes

  static defaultProps = {
    labelClasses: DEFAULT_CLASSES,
    iconClasses: DEFAULT_CLASSES,
  }

  state = {
    isBoxOpen: false,
    renderIconAsLink: false,
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()

    if (location.href.indexOf('accountAuthCookieName') > 0) {
      setCookie(location.href)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const WIDTH_THRESHOLD = 640

    if (window.innerWidth < WIDTH_THRESHOLD && !this.state.renderIconAsLink) {
      this.setState({
        renderIconAsLink: true,
      })
    } else if (
      window.innerWidth >= WIDTH_THRESHOLD &&
      this.state.renderIconAsLink
    ) {
      this.setState({
        renderIconAsLink: false,
      })
    }
  }

  handleProfileIconClick = () => {
    this.setState({ isBoxOpen: !this.state.isBoxOpen })
  }

  handleOutSideBoxClick = () => {
    this.setState({ isBoxOpen: false })
  }

  render() {
    return (
      <LoginWithSession
        {...this.props}
        {...this.state}
        onOutSideBoxClick={this.handleOutSideBoxClick}
        onProfileIconClick={this.handleProfileIconClick}
      />
    )
  }
}

Login.schema = {
  title: 'editor.login.title',
  type: 'object',
  properties: {
    ...LoginSchema,
  },
}

const options = {
  options: () => ({ ssr: false }),
}

const LoginWithSession = withSession(
  { loading: () => <div></div> }
)(compose(
  injectIntl,
  graphql(GET_USER_PROFILE, options),
)(LoginComponent))
