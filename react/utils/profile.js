import { path } from 'ramda'

export const getProfile = data => {
  let profile = path(['getSession', 'profile'], data)

  if (!path(['id'], profile) && !path(['email'], profile)) {
    profile = null
  }

  return profile
}
