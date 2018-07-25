import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { Input } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import PasswordValidationItem from './PasswordValidationItem'
import { translate } from '../utils/translate'

class PasswordInput extends Component {
  state = {
    showVerification: false,
  }

  handlePasswordChange = event => {
    const lowerCaseLetters = /[a-z]/g
    const upperCaseLetters = /[A-Z]/g
    const numbers = /[0-9]/g

    const value = event.target.value

    this.setState({
      containsLowerLetter: value.match(lowerCaseLetters),
      containsUpperLetter: value.match(upperCaseLetters),
      containsNumber: value.match(numbers),
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
    } = this.state

    const {
      intl,
      password,
    } = this.props

    return (
      <div>
        <Input
          type="password"
          value={password}
          onChange={this.handlePasswordChange}
          placeholder={this.props.placeholder}
          onBlur={() => this.setState({ showVerification: false })}
          onFocus={() => this.setState({ showVerification: true })}
        >
        </Input>
        {showVerification &&
          <div className="flex flex-row pt4">
            <div className="flex flex-column mr4">
              <PasswordValidationItem label={translate('login.password.uppercaseLetter', intl)} valid={containsUpperLetter} />
              <PasswordValidationItem label={translate('login.password.lowercaseLetter', intl)} valid={containsLowerLetter} />
            </div>
            <div className="flex flex-column">
              <PasswordValidationItem label={translate('login.password.number', intl)} valid={containsNumber} />
              <PasswordValidationItem label={translate('login.password.eightCharacteres', intl)} valid={atLeastEightCharacteres} />
            </div>
          </div>
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
  /** Function to change de active tab */
  onStateChange: PropTypes.func.isRequired,
  /** Intl object*/
  intl: intlShape,
}

export default injectIntl(PasswordInput)
