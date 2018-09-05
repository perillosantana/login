import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { Button } from 'vtex.styleguide'
import { injectIntl } from 'react-intl'
import { Link } from 'render'
import { setCookie } from './utils/set-cookie'
import OutsideClickHandler from 'react-outside-click-handler'
import LoginContent from './LoginContent'

import { truncateString } from './utils/format-string'
import ProfileIcon from './images/ProfileIcon'
import GET_USER_PROFILE from './queries/profile.gql'
import { translate } from './utils/translate'
import { LoginSchema } from './schema'
import { LoginPropTypes } from './propTypes'

import './global.css'

const DEFAULT_CLASSES = 'white'

/** Canonical login that calls a mutation to retrieve the authentication token */
class Login extends Component {
  static propTypes = LoginPropTypes

  static defaultProps = {
    labelClasses: DEFAULT_CLASSES,
    iconClasses: DEFAULT_CLASSES,
  }

  state = {
    isBoxOpen: false,
    renderIconAsLink: false,
    profile: null,
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

  renderIcon() {
    const { renderIconAsLink, profile } = this.state
    const { iconSize, iconLabel, labelClasses, iconClasses, intl } = this.props
    const iconContent = (
      <Fragment>
        <div className={`${iconClasses}`}>
          <ProfileIcon size={iconSize} fillColor="currentColor" />
        </div>
        {profile ? (
          <span className={`vtex-login__profile order-1 f6 pl4 ${labelClasses}`}>
            {translate('login.hello', intl)}{' '}
            {truncateString(profile.firstName) || truncateString(profile.email)}
          </span>
        ) : (
          iconLabel && <span className={`vtex-login__label f6 pl4 ${labelClasses}`}>{iconLabel}</span>
        )}
      </Fragment>
    )

    if (renderIconAsLink) {
      const linkTo = profile ? '/account' : '/login'
      return (
        <Link
          to={linkTo}
          className="vtex-login__button--link tc flex items-center"
        >
          {iconContent}
        </Link>
      )
    }

    return (
      <Button variation="tertiary" icon onClick={this.handleProfileIconClick}>
        <div
          className="flex items-center"
          ref={e => {
            this.iconRef = e
          }}
        >
          {iconContent}
        </div>
      </Button>
    )
  }

  render() {
    const { ...others } = this.props
    const { isBoxOpen, profile } = this.state

    const boxPositionStyle = {
      right: this.iconRef && this.iconRef.offsetWidth - 21,
    }

    return (
      <div className="vtex-login__container flex items-center f6 fr">
        <div className="relative">
          {this.renderIcon()}
          <OutsideClickHandler onOutsideClick={this.handleOutSideBoxClick}>
            <div
              className={`vtex-login__box absolute z-max ${
                isBoxOpen ? 'flex' : 'dn'
              }`}
              style={boxPositionStyle}
            >
              <div className="vtex-login__arrow-up absolute top-0 right-0 shadow-3 bg-white" />
              <div className="vtex-login__content-container shadow-3 mt3">
                <LoginContent
                  profile={profile}
                  loginCallback={this.onHandleLogin}
                  isInitialScreenOptionOnly
                  {...others}
                />
              </div>
            </div>
          </OutsideClickHandler>
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
