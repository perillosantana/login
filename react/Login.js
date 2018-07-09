import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { Button } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import { compose, map, fromPairs, split, tail } from 'ramda'
import { Link } from 'render'

import LoginContent from './LoginContent'

import { truncateString } from './utils/truncate-string'
import ProfileIcon from './images/ProfileIcon'
import GET_USER_PROFILE from './queries/profile.gql'
import { translate } from './utils/translate'
import './global.css'

/**
 * Set Cookie from the URL name=value and clean up the URL query params.
 * Used in the OAuth login.
 *
 * @param {String} url To set cookie and cleaned up.
 */
const setCookie = (url) => {
  const { accountAuthCookieName, authCookieValue } = compose(
    fromPairs, map(split('=')), split('&'), tail
  )(url)
  if (accountAuthCookieName && authCookieValue) {
    const date = new Date()
    const ONE_DAY = 24 * 60 * 60 * 1000
    date.setTime(date.getTime() + ONE_DAY)
    document.cookie = `${accountAuthCookieName}=${authCookieValue};
      expires=${date.toUTCString()};
      path=/;
      Http-Only=true;`
    const cleanUrl = url.substring(0, url.indexOf('?'))
    window.history.replaceState({}, document.title, cleanUrl)
  }
}

/** Canonical login that calls a mutation to retrieve the authentication token */
class Login extends Component {
  static propTypes = {
    /** Intl object*/
    intl: intlShape,
    data: PropTypes.shape({}).isRequired,
  }

  boxRef_ = React.createRef()

  state = {
    isBoxOpen: false,
    renderIconAsLink: false,
  }

  handleDocumentMouseUp = e => {
    const { isBoxOpen } = this.state

    const target = e.target

    if (this.boxRef_.current && !this.boxRef_.current.contains(target)) {
      if (isBoxOpen) {
        this.setState({
          isBoxOpen: false,
        })
      }

      this.removeListeners()
    }
  }

  componentDidMount() {
    if (location.href.indexOf('accountAuthCookieName') > 0) {
      setCookie(location.href)
    }

    window.addEventListener('resize', this.handleResize)

    this.handleResize()
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
    console.log(this.state)
    document.addEventListener('mouseup', this.handleDocumentMouseUp)

    this.setState({
      isBoxOpen: !this.state.isBoxOpen,
    })
  }

  renderIcon() {
    const { renderIconAsLink } = this.state

    if (renderIconAsLink) {
      return (
        <Link to="/login" className="vtex-login__button--link">
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
    const { data: { profile }, intl } = this.props
    const { isBoxOpen } = this.state

    return (
      <div className="vtex-login__container flex items-center relative f6 fr">
        {profile && (
          <div className="vtex-login__profile">
            {translate('login.hello', intl)} {truncateString(profile.firstName) || truncateString(profile.email)}
          </div>
        )}
        {this.renderIcon()}
        {isBoxOpen && (
          <div
            className="vtex-login__box absolute right-0 z-max flex"
            ref={this.boxRef_}
          >
            <div className="vtex-login__arrow-up absolute top-0 right-0 shadow-3" />
            <div className="shadow-3 mt3">
              <LoginContent profile={profile} isInitialScreenOptionOnly />
            </div>
          </div>
        )}
      </div>
    )
  }
}

const options = {
  options: () => ({
    ssr: false,
  }),
}

export default injectIntl(
  graphql(GET_USER_PROFILE, options)(Login)
)
