import { InvalidAddressError } from '../../errors/address.js'
import { InvalidChainIdError } from '../../errors/chain.js'
import { FeeCapTooHighError, TipAboveFeeCapError } from '../../errors/node.js'
import { isAddress } from '../address/isAddress.js'

// UTILS
// maxFeePerGas must be less than 2^256 - 1: however writing like that caused exceptions to be raised
const MAX_MAX_FEE_PER_GAS =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n

export function assertMaxGasFees({
  maxPriorityFeePerGas,
  maxFeePerGas,
}: {
  maxPriorityFeePerGas: bigint | undefined
  maxFeePerGas: bigint | undefined
}) {
  if (maxFeePerGas && maxFeePerGas > MAX_MAX_FEE_PER_GAS)
    throw new FeeCapTooHighError({ maxFeePerGas })

  if (
    maxPriorityFeePerGas &&
    maxFeePerGas &&
    maxPriorityFeePerGas > maxFeePerGas
  )
    throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas })
}

export function assertAddress(to: string | undefined) {
  if (to && !isAddress(to)) throw new InvalidAddressError({ address: to })
}

export function assertChainNumberValid(chainId: number) {
  if (chainId <= 0) throw new InvalidChainIdError({ chainId })
}
