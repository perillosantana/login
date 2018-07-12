import { compose, map, fromPairs, split, tail } from 'ramda'

/**
 * Set Cookie from the URL name=value and clean up the URL query params.
 * Used in the OAuth login.
 *
 * @param {String} url To set cookie and cleaned up.
 */
export const setCookie = (url) => {
  const { accountAuthCookieName, authCookieValue } = compose(
    fromPairs, map(split('=')), split('&'), tail
  )(url)
  if (accountAuthCookieName && authCookieValue) {
    const date = new Date()
    const ONE_DAY = 24 * 60 * 60 * 1000
    date.setTime(date.getTime() + ONE_DAY)
    document.cookie = `${accountAuthCookieName}=${authCookieValue};
        expires=${date.toUTCString()};
        path=/;
        Http-Only=true;`
    const cleanUrl = url.substring(0, url.indexOf('?'))
    window.history.replaceState({}, document.title, cleanUrl)
  }
}
