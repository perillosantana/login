import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { Spinner } from 'vtex.styleguide'
import { AuthService } from 'vtex.react-vtexid'

function OAuthAutoRedirect({ intl, provider, redirect }) {
  useEffect(() => {
    redirect()
  }, [])
  return (
    <div className="w-100 flex flex-column pv5">
      <p className="tc ph4">
        {intl.formatMessage(
          {
            id: 'store/login.autoRedirect.message',
          },
          { provider }
        )}
      </p>
      <div className="self-center c-emphasis">
        <Spinner color="currentColor" size={24} />
      </div>
    </div>
  )
}
OAuthAutoRedirect.propTypes = {
  redirect: PropTypes.func.isRequired,
  provider: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  intl: intlShape,
}

function Wrapper({ provider, ...props }) {
  return (
    <AuthService.OAuthRedirect useNewSession provider={provider}>
      {({ loading, action: redirectToOAuthPage }) => (
        <OAuthAutoRedirect
          {...props}
          loading={loading}
          provider={provider}
          redirect={redirectToOAuthPage}
        />
      )}
    </AuthService.OAuthRedirect>
  )
}
Wrapper.propTypes = {
  provider: PropTypes.string.isRequired,
}

export default injectIntl(Wrapper)
