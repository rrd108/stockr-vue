const useProductNameProps = originalProductName => {
  // Use a regular expression for more efficient matching and capturing
  // ([^>#<]*) - any characters that is not #, >, or < = product _name_
  // (?:>([^>#<]*))? - an optional "> followed by any characters that is not #, >, or <" = product _size_
  // (?:#([^>#<]*))? - an optional: "# followed by any characters that is not #, >, or <" = product _code_
  // (?:<([^>#<]*))? - an optional "< followed by any characters that is not #, >, or <" = product _ean_
  const match = originalProductName.match(/^([^>#<]*)(?:>([^>#<]*))?(?:#([^>#<]*))?(?:<([^>#<]*))?$/)

  const data = {
    name: match?.[1]?.trim() || originalProductName,
    size: match?.[2]?.trim(),
    code: match?.[3]?.trim(),
    ean: match?.[4]?.trim(),
  }

  // Filter out keys with null values
  return Object.fromEntries(Object.entries(data).filter(([_, value]) => value))
}

export default useProductNameProps
