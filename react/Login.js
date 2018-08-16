import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { Button } from 'vtex.styleguide'
import { injectIntl } from 'react-intl'
import { Link } from 'render'
import { setCookie } from './utils/set-cookie'
import LoginContent from './LoginContent'

import { truncateString } from './utils/format-string'
import ProfileIcon from './images/ProfileIcon'
import GET_USER_PROFILE from './queries/profile.gql'
import { translate } from './utils/translate'
import { LoginSchema } from './schema'
import { LoginPropTypes } from './propTypes'

import './global.css'

/** Canonical login that calls a mutation to retrieve the authentication token */
class Login extends Component {
  static propTypes = LoginPropTypes

  boxRef_ = React.createRef()

  state = {
    isBoxOpen: false,
    renderIconAsLink: false,
    profile: null,
  }

  handleDocumentMouseUp = e => {
    const { isBoxOpen } = this.state
    const target = e.target

    if (this.boxRef_.current && (
      !this.boxRef_.current.contains(target) || target.hasAttribute('closeonclick')
    )) {
      isBoxOpen && this.setState({ isBoxOpen: false })
      this.removeListeners()

      target.dispatchEvent(new Event('closeonclick'))
    }
  }

  /** Function called after login success */
  onHandleLogin = () => {
    this.props.data.refetch().then(({ data: { profile } }) => {
      this.setState({ profile })
    })
  }

  componentDidMount() {
    if (location.href.indexOf('accountAuthCookieName') > 0) {
      setCookie(location.href)
    }

    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.setState({ profile: this.props.data.profile })
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.profile && this.props.data) {
      const { profile } = this.props.data
      if (profile === prevState.profile) {
        return null
      }
      this.setState({ profile })
    }
  }

  componentWillUnmount() {
    this.removeListeners()

    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const WIDTH_THRESHOLD = 640

    if (window.innerWidth < WIDTH_THRESHOLD && !this.state.renderIconAsLink) {
      this.setState({
        renderIconAsLink: true,
      })
    } else if (window.innerWidth >= WIDTH_THRESHOLD && this.state.renderIconAsLink) {
      this.setState({
        renderIconAsLink: false,
      })
    }
  }

  removeListeners = () => {
    document.removeEventListener('mouseup', this.handleDocumentMouseUp)
  }

  handleProfileIconClick = () => {
    document.addEventListener('mouseup', this.handleDocumentMouseUp)

    this.setState({ isBoxOpen: !this.state.isBoxOpen })
  }

  renderIcon() {
    const { renderIconAsLink, profile } = this.state

    if (renderIconAsLink) {
      const linkTo = profile ? '/account' : '/login'
      return (
        <Link to={linkTo} className="vtex-login__button--link tc">
          <ProfileIcon />
        </Link>
      )
    }

    return (
      <Button
        variation="tertiary"
        size="small"
        icon
        onClick={this.handleProfileIconClick}
      >
        <ProfileIcon />
      </Button>
    )
  }

  render() {
    const { intl, ...others } = this.props
    const { isBoxOpen, profile } = this.state

    return (
      <div className="vtex-login__container flex items-center f6 fr">
        {profile && (
          <div className="vtex-login__profile order-1">
            {translate('login.hello', intl)} {truncateString(profile.firstName) || truncateString(profile.email)}
          </div>
        )}
        <div className="relative">
          {this.renderIcon()}
          <div
            className={`vtex-login__box absolute right-0 z-max ${isBoxOpen ? 'flex' : 'dn'}`}
            ref={this.boxRef_}
          >
            <div className="vtex-login__arrow-up absolute top-0 right-0 shadow-3 bg-white" />
            <div className="vtex-login__content-container shadow-3 mt3">
              <LoginContent
                profile={profile}
                loginCallback={this.onHandleLogin}
                isInitialScreenOptionOnly
                {...others} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const options = {
  options: () => ({ ssr: false }),
}

const LoginWithIntl = injectIntl(graphql(GET_USER_PROFILE, options)(Login))

LoginWithIntl.schema = {
  title: 'editor.login.title',
  type: 'object',
  properties: {
    ...LoginSchema,
  },
}

export default LoginWithIntl
