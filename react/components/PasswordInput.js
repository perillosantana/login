import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { Input } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/translate'
import EyeSightEnable from '../images/EyeSightEnable'
import EyeSightDisable from '../images/EyeSightDisable'
import Tooltip from './Tooltip'
import PasswordValidationContent from './PasswordValidationContent'
import { isMobile } from 'react-device-detect'

class PasswordInput extends Component {
  state = {
    showVerification: false,
    showPassword: false,
  }

  handleEyeIcon = () => this.setState({ showPassword: !this.state.showPassword })

  handlePasswordChange = event => {
    const lowerCaseLetters = /[a-z]/g
    const upperCaseLetters = /[A-Z]/g
    const numbers = /[0-9]/g

    const value = event.target.value

    this.setState({
      containsLowerLetter: value.match(lowerCaseLetters) && value.match(lowerCaseLetters).length > 0,
      containsUpperLetter: value.match(upperCaseLetters) && value.match(upperCaseLetters).length > 0,
      containsNumber: value.match(numbers) && value.match(numbers).length > 0,
      atLeastEightCharacteres: value.length >= 8,
    })

    this.props.onStateChange({ password: value })
  }

  render() {
    const {
      showVerification,
      containsLowerLetter,
      containsUpperLetter,
      containsNumber,
      atLeastEightCharacteres,
      showPassword,
    } = this.state

    const {
      intl,
      password,
      showPasswordVerificationIntoTooltip,
    } = this.props

    const fields = [
      {
        id: 0,
        prefix: 'ABC',
        label: translate('login.password.uppercaseLetter', intl),
        valid: containsUpperLetter,
      },
      {
        id: 1,
        prefix: 'abc',
        label: translate('login.password.lowercaseLetter', intl),
        valid: containsLowerLetter,
      },
      {
        id: 2,
        prefix: '123',
        label: translate('login.password.number', intl),
        valid: containsNumber,
      },
      {
        id: 3,
        prefix: '***',
        label: translate('login.password.eightCharacteres', intl),
        valid: atLeastEightCharacteres,
      },
    ]

    return (
      <div className="relative">
        <Input
          type={`${showPassword ? 'text' : 'password'}`}
          value={password}
          onChange={this.handlePasswordChange}
          placeholder={this.props.placeholder}
          onBlur={() => this.setState({ showVerification: false })}
          onFocus={() => this.setState({ showVerification: true })}
          suffixIcon={(
            <span className="pointer" onClick={this.handleEyeIcon}>
              {showPassword ? <EyeSightDisable /> : <EyeSightEnable />}
            </span>
          )}
        />
        {showVerification && (
          (!showPasswordVerificationIntoTooltip)
            ? (
              <div className="pa2">
                <PasswordValidationContent fields={fields} />
              </div>
            )
            : (
              isMobile
                ? (
                  <Tooltip top title={translate('login.password.tooltip.title', intl)}>
                    <PasswordValidationContent fields={fields} />
                  </Tooltip>
                )
                : (
                  <Tooltip title={translate('login.password.tooltip.title', intl)}>
                    <PasswordValidationContent fields={fields} />
                  </Tooltip>
                )
            )
        )
        }
      </div>
    )
  }
}

PasswordInput.propTypes = {
  /** Password set on state */
  password: PropTypes.string.isRequired,
  /** Placeholder to appear into the input */
  placeholder: PropTypes.string.isRequired,
  /** Set the type of password verification ui */
  showPasswordVerificationIntoTooltip: PropTypes.bool,
  /** Function to change de active tab */
  onStateChange: PropTypes.func.isRequired,
  /** Intl object*/
  intl: intlShape,
}

export default injectIntl(PasswordInput)
