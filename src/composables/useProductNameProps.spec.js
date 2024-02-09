import { test, expect } from 'vitest'
import useProductNameProps from './useProductNameProps'

test('get product props with no extra info', () => {
  const originalProductName = 'Simple Product Name'
  const expectedResult = { name: 'Simple Product Name' }

  const result = useProductNameProps(originalProductName)
  expect(result).toEqual(expectedResult)
})

test('get product props with code', () => {
  const originalProductName = 'Product Name # MZ/X'
  const expectedResult = { name: 'Product Name', code: 'MZ/X' }

  const result = useProductNameProps(originalProductName)
  expect(result).toEqual(expectedResult)
})

test('get product props with size', () => {
  const originalProductName = 'Product Name > 500g'
  const expectedResult = { name: 'Product Name', size: '500g' }

  const result = useProductNameProps(originalProductName)
  expect(result).toEqual(expectedResult)
})

test('get product props with ean', () => {
  const originalProductName = 'Product Name < SriRadha'
  const expectedResult = { name: 'Product Name', ean: 'SriRadha' }

  const result = useProductNameProps(originalProductName)
  expect(result).toEqual(expectedResult)
})

test('get product props with code and size', () => {
  const originalProductName = 'Product Name > 500g # MZ/X'
  const expectedResult = { name: 'Product Name', code: 'MZ/X', size: '500g' }

  const result = useProductNameProps(originalProductName)
  expect(result).toEqual(expectedResult)
})

test('get product props with code and ean', () => {
  const originalProductName = 'Product Name # MZ/X < SriRadha'
  const expectedResult = { name: 'Product Name', code: 'MZ/X', ean: 'SriRadha' }

  const result = useProductNameProps(originalProductName)
  expect(result).toEqual(expectedResult)
})

test('get product props with size and ean', () => {
  const originalProductName = 'Product Name > 500g < SriRadha'
  const expectedResult = { name: 'Product Name', size: '500g', ean: 'SriRadha' }

  const result = useProductNameProps(originalProductName)
  expect(result).toEqual(expectedResult)
})

test('get product props with size and code and ean', () => {
  const originalProductName = 'Product Name > 500g # MZ/X < SriRadha'
  const expectedResult = { name: 'Product Name', code: 'MZ/X', size: '500g', ean: 'SriRadha' }

  const result = useProductNameProps(originalProductName)
  expect(result).toEqual(expectedResult)
})

test('get product props with size and code and ean', () => {
  const originalProductName = 'Ásvány karkötő amazonit > 21cm # RAJ < öB97QQSMP7'
  const expectedResult = { name: 'Ásvány karkötő amazonit', code: 'RAJ', size: '21cm', ean: 'öB97QQSMP7' }

  const result = useProductNameProps(originalProductName)
  expect(result).toEqual(expectedResult)
})
