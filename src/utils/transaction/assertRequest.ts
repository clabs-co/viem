import { parseAccount } from '../../accounts/utils/parseAccount.js'
import type { SendTransactionParameters } from '../../actions/wallet/sendTransaction.js'
import { FeeConflictError } from '../../errors/transaction.js'
import type { Chain } from '../../types/chain.js'
import { assertAddress, assertMaxGasFees } from './assertArgsHelpers.js'

export type AssertRequestParameters = Partial<SendTransactionParameters<Chain>>

export function assertRequest(args: AssertRequestParameters) {
  const {
    account: account_,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    to,
  } = args
  const account = account_ ? parseAccount(account_) : undefined
  assertAddress(account?.address)
  assertAddress(to)
  if (
    typeof gasPrice !== 'undefined' &&
    (typeof maxFeePerGas !== 'undefined' ||
      typeof maxPriorityFeePerGas !== 'undefined')
  )
    throw new FeeConflictError()

  assertMaxGasFees({ maxFeePerGas, maxPriorityFeePerGas })
}
