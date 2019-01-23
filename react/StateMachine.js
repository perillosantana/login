import React, { Component } from 'react'
import loginMachine from './utils/loginMachine'
import { interpret } from 'xstate/lib/interpreter'
import PropTypes from 'prop-types'

const generateTransitionHandlers = (sendEvent, transitions) => {
  return Object.keys(transitions).reduce((acc, key) => {
    acc[key] = () => sendEvent(transitions[key])
    return acc
  }, {})
}

class StateMachine extends Component {
  constructor(props) {
    super(props)

    const loginMachineService = interpret(
      loginMachine
      .withContext({
        isUserIdentified: this.props.isUserIdentified,
        isUserLoggedIn: this.props.isUserLoggedIn,
      })
      .withConfig({
        actions: this.props.actions
      })
    ).onTransition(nextState => {
      console.log(nextState.value)
    })

    loginMachineService.start()

    this.state = {
      loginMachineService: loginMachineService,
      currentState: loginMachineService.state,
    }
  }

  sendEvent = (event) => {
    this.state.loginMachineService.send(event)
    this.setState((state) => ({ currentState: state.loginMachineService.state }))
  }

  render = () => {
    const { sendEvent, props: { transitionsMapping } } = this
    return (
      <React.Fragment>
        {
          this.props.children(
            {
              sendEvent,
              state: this.state.currentState.toStrings().pop(),
              transitionHandlers: generateTransitionHandlers(
                sendEvent,
                transitionsMapping,
              ),
            }
          )
        }
      </React.Fragment>
    )
  }
}

StateMachine.propTypes = {
  children: PropTypes.any,
  isUserIdentified: PropTypes.bool,
  isUserLogged: PropTypes.bool,
  transitionsMapping: PropTypes.object,
}

export default StateMachine
