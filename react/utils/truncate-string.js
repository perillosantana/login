export const truncateString = str => {
  const MAX_LENGTH = 7
  return str <= MAX_LENGTH ? str : str.substring(0, MAX_LENGTH).concat('...')
}
