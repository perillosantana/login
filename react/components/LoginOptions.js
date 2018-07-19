import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'
import { ExtensionPoint } from 'render'
import { Button } from 'vtex.styleguide'

import { translate } from '../utils/translate'

import OAuth from './OAuth'

import GoogleIcon from '../images/GoogleIcon'
import FacebookIcon from '../images/FacebookIcon'
import FormTitle from './FormTitle'

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
        <FormTitle>
          {title || translate(fallbackTitle, intl)}
        </FormTitle>
        <ul className="vtex-login-options__list list pa0">
          {options
            .filter(el => !isAlwaysShown ? true : currentStep !== el)
            .map((el, index) => (
              <li className="vtex-login-options__list-item mb3" key={`login-option-array-${index}`}>
                <div className="vtex-login__button">
                  <Button variation="secondary" onClick={this.handleOptionClick(el)}>
                    <span className="f6">
                      {translate(el, intl)}
                    </span>
                  </Button>
                </div>
              </li>
            ))
          }
          <li
            className="vtex-login-options__list-item vtex-login-options__list-item--google mb3"
          >
            <OAuth provider="Google">
              <GoogleIcon />
            </OAuth>
          </li>
          <li
            className="vtex-login-options__list-item vtex-login-options__list-item--facebook mb3"
          >
            <OAuth provider="Facebook">
              <FacebookIcon />
            </OAuth>
          </li>
          <li className="vtex-login-options__list-item vtex-login-options__list-item--custom mb3">
            <ExtensionPoint id="custom" />
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
