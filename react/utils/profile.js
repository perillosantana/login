export const getProfile = data => {
  let profile = null

  if (data && !data.loading && data.getSession && data.getSession.profile &&
    (data.getSession.profile.id || data.getSession.profile.email)) {
    profile = data.getSession.profile
  }

  return profile
}
