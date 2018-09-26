import { path } from 'ramda'

export const getProfile = data => path(['getSession', 'profile'], data)
