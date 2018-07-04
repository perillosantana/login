export const isValidPassword = password => {
  const pattern = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
  return pattern.test(password)
}

export const isValidEmail = email => {
  const pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i)
  return pattern.test(email)
}

export const isValidAccessCode = code => {
  const pattern = new RegExp(/^[0-9]{6}$/)
  return pattern.test(code)
}
