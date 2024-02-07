const toCurrency = (value, currency = 'HUF', decimals = 2) => {
  if (isNaN(value)) {
    return 0
  }

  if (currency == 'HUF') {
    decimals = 0
  }

  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export default toCurrency
