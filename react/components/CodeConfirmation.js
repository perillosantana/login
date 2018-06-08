import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Button } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'
import { graphql } from 'react-apollo'
import Cookie from 'js-cookie'

import accessKeySignIn from '../mutations/accessKeySignIn.gql'

import { translate } from '../utils'

/** CodeConfirmation tab component. Receive the code from an input and call the signIn mutation */
class CodeConfirmation extends Component {
  handleInputChange = event => {
    this.props.onStateChange({ code: event.target.value })
  }
  handleOnSubmit = () => {
    const temporarySession = Cookie.get('temporarySession')
    console.log(temporarySession)
    const { accessKeySignIn, email, code } = this.props
    if (code !== '') {
      accessKeySignIn({
        variables: {
          authInput: { email, code, temporarySession }
        }
      }).then(
        res => {
          console.log(res)
        },
        err => {
          console.log(err)
        }
      )
    }
  }

  render() {
    const {
      goBack,
      confirm,
      intl,
      onStateChange,
      titleLabel,
      previous,
      code,
    } = this.props

    return (
      <div className="vtex-login__code-confirmation">
        <h3 className="fw5 ttu br2 fw4 v-mid relative tc pv3 ph5 f6 rebel-pink">
          {translate(titleLabel, intl)}
        </h3>
        <Input value={code} onChange={this.handleInputChange} />
        <div className="bt mt5 min-h-2 b--light-gray">
          <div className="fl mt4">
            <Button variation="secondary" size="small"
              onClick={() => onStateChange({ step: previous })}>
              {translate(goBack, intl)}
            </Button>
          </div>
          <div className="fr mt4">
            <Button size="small" onClick={() => this.handleOnSubmit()}>
              {translate(confirm, intl)}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

CodeConfirmation.propTypes = {
  /** Email set on state */
  email: PropTypes.string.isRequired,
  /** Code set on state */
  code: PropTypes.string.isRequired,
  /** Previous step */
  previous: PropTypes.number.isRequired,
  /** Title that will be shown on top */
  titleLabel: PropTypes.string.isRequired,
  /** Locales go back string id */
  goBack: PropTypes.string.isRequired,
  /** Locales confirm string id */
  confirm: PropTypes.string.isRequired,
  /** Function to change de active tab */
  onStateChange: PropTypes.func.isRequired,
  /** Graphql property to call a mutation */
  accessKeySignIn: PropTypes.func.isRequired,
  /** Intl object*/
  intl: intlShape,
}

export default injectIntl(
  graphql(accessKeySignIn, { name: 'accessKeySignIn' })(CodeConfirmation)
)
