import { BigNumber } from 'ethers'

import { validateForm } from './transactionForm.helper'

// This is an example test file, would obviously need more tests
// Preferably Cypress and react-testing-library
describe('transactionForm helper unit tests', () => {
  describe('validateForm', () => {
    it('given initial form state, disables send button', () => {
      const actual = validateForm(false, 0, undefined)
      const expected = {
        isSendDisabled: true,
      }

      expect(actual).toStrictEqual(expected)
    })

    it('given edited form and an empty value, disables send button and returns an error', () => {
      const actual = validateForm(true, 0, undefined)
      const expected = {
        isSendDisabled: true,
        message: 'Please enter amount',
      }

      expect(actual).toStrictEqual(expected)
    })

    it('given unsufficient balance, disables send button and returns an error', () => {
      const actual = validateForm(true, 100, BigNumber.from(99))
      const expected = {
        isSendDisabled: true,
        message: 'Please come back from the moon.',
      }

      expect(actual).toStrictEqual(expected)
    })
  })
})
