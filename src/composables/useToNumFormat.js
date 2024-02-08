const toNumFormat = (value, decimals = 0, dec_point, thousands_sep) => {
  let n = value,
    c = isNaN((decimals = Math.abs(decimals))) ? 2 : decimals
  let d = dec_point == undefined ? ',' : dec_point
  let t = thousands_sep == undefined ? ' ' : thousands_sep,
    s = n < 0 ? '-' : ''
  let i = parseInt((n = Math.abs(+n || 0).toFixed(c))) + ''
  let j = i.length
  j = j > 3 ? j % 3 : 0
  return (
    s +
    (j ? i.substr(0, j) + t : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : '')
  )
}

export default toNumFormat

// TODO used at only one place
