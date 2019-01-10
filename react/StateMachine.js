import React, { Component } from 'react'
import loginMachine from './utils/loginMachine'
import { interpret } from 'xstate/lib/interpreter'
import PropTypes from 'prop-types'

class StateMachine extends Component {
  constructor(props) {
    super(props)

    const loginMachineService = interpret(loginMachine.withContext({
      userStored: this.props.userStored,
    }))

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
    return (
      <React.Fragment>
        {
          this.props.children(
            {
              sendEvent: this.sendEvent,
              state: this.state.currentState,
            }
          )
        }
      </React.Fragment>
    )
  }
}

StateMachine.propTypes = {
  children: PropTypes.any,
  userStored: PropTypes.bool,
}

export default StateMachine
