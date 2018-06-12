import React, { Component } from "react";
import { injectIntl, intlShape } from "react-intl";
import { Button } from "vtex.styleguide";
import { Link } from 'render';

// Component that shows account options to the user.
class AccountOptions extends Component {
  static propTypes = {
    /** Intl object*/
    intl: intlShape
  };

  handleClickButton = path => location.assign(path);

  render() {
    const {
      intl: { formatMessage }
    } = this.props;
    return (
      <div className="vtex-login__account-options items-center w-100">
        <div className="ma4 min-h-2 b--light-gray">
          <Link page={"store/account"}>
            <Button
              variation="tertiary"
              size="small"
              onClick={() => this.handleClickButton("account")}
            >
              <div className="f7">
                {formatMessage({ id: "login.my-account" })}
              </div>
            </Button>
          </Link>
        </div>
        <div className="ma4 min-h-2 b--light-gray">
          <Link page={"store/account/orders"}>
            <Button
              variation="tertiary"
              size="small"
            >
              <div className="f7">{formatMessage({ id: "login.my-orders" })}</div>
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default injectIntl(AccountOptions);
