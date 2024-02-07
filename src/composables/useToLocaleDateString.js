const toLocaleDateString = (value) => {
  // TODO get locale string from api (user)
  if (value === '') return
  return new Date(value).toLocaleDateString('hu-HU')
}

export default toLocaleDateString
