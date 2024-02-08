const toNum = (value, precision) => {
  if (!value) return 0
  return precision ? parseFloat(value).toFixed(precision) : parseInt(value || 0)
}

export default toNum
