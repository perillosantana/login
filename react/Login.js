import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { Button } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import { Link } from 'render'
import { setCookie } from './utils/set-cookie'
import LoginContent from './LoginContent'

import { truncateString } from './utils/truncate-string'
import ProfileIcon from './images/ProfileIcon'
import GET_USER_PROFILE from './queries/profile.gql'
import { translate } from './utils/translate'
import './global.css'

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
        this.setState({ isBoxOpen: false })
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
