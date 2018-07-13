import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'

import { translate } from '../utils/translate'

import OAuth from './OAuth'

import GoogleIcon from '../images/GoogleIcon'
import FacebookIcon from '../images/FacebookIcon'

/** LoginOptions tab component. Displays a list of login options */
class LoginOptions extends Component {
  handleOptionClick = el => () => {
    this.props.onOptionsClick(el)
  }

  render() {
    const {
      className,
      title,
      fallbackTitle,
      options,
      intl,
      isAlwaysShown,
      currentStep,
    } = this.props

    const classes = classNames('vtex-login-options', className, {
      'vtex-login-options--sticky': isAlwaysShown,
    })

    return (
      <div className={classes}>
        <h3 className="vtex-login-options__title vtex-login__form-title">
          {title || translate(fallbackTitle, intl)}
        </h3>
        <ul className="vtex-login-options__list">
          {options
            .filter(el => !isAlwaysShown ? true : currentStep !== el)
            .map((el, index) => (
              <li className="vtex-login-options__list-item" key={`login-option-array-${index}`}>
                <button className="vtex-login__button" onClick={this.handleOptionClick(el)}>
                  <span className="f6">
                    {translate(el, intl)}
                  </span>
                </button>
              </li>
            ))
          }
          <li
            className="vtex-login-options__list-item vtex-login-options__list-item--google"
          >
            <OAuth provider="Google">
              <GoogleIcon />
            </OAuth>
          </li>
          <li
            className="vtex-login-options__list-item vtex-login-options__list-item--facebook"
          >
            <OAuth provider="Facebook">
              <FacebookIcon />
            </OAuth>
          </li>
        </ul>
      </div>
    )
  }
}

LoginOptions.propTypes = {
  /** Intl object*/
  intl: intlShape,
  /** Function to change de active tab */
  onOptionsClick: PropTypes.func.isRequired,
  /** Title that will be shown on top */
  title: PropTypes.string.isRequired,
  /** Fallback title that will be shown if there's no title */
  fallbackTitle: PropTypes.string.isRequired,
  /** List of options to be displayed */
  options: PropTypes.arrayOf(PropTypes.string),
  /** Class of the root element */
  className: PropTypes.string,
  /** Whether this component is always rendered */
  isAlwaysShown: PropTypes.bool,
  /** Current option being displayed */
  currentStep: PropTypes.string,
}

export default injectIntl(LoginOptions)
