//////////////////////////////////////////////////////////////////////////////
// Utilities

import type { Address } from 'abitype'
import { trim } from '../../utils/data/trim.js'
import type {
  CeloTransactionRequest,
  CeloTransactionSerializable,
  TransactionSerializableCIP42,
  TransactionSerializableCIP64,
} from './types.js'

export function isEmpty(
  value: string | undefined | number | BigInt,
): value is undefined {
  return (
    value === 0 ||
    value === 0n ||
    value === undefined ||
    value === null ||
    value === '0' ||
    value === '' ||
    (typeof value === 'string' &&
      (trim(value as Address).toLowerCase() === '0x' ||
        trim(value as Address).toLowerCase() === '0x00'))
  )
}

export function isPresent(
  value: string | undefined | number | BigInt,
): value is string | number | BigInt {
  return !isEmpty(value)
}

export function isEIP1559(
  transaction: CeloTransactionSerializable | CeloTransactionRequest,
): boolean {
  return (
    isPresent(transaction.maxFeePerGas) &&
    isPresent(transaction.maxPriorityFeePerGas)
  )
}

// process as CIP42 if any of these fields are present. realistically gatewayfee is not used but is part of spec
export function isCIP42(
  transaction: CeloTransactionSerializable | CeloTransactionRequest,
): transaction is TransactionSerializableCIP42 {
  const tx = transaction as TransactionSerializableCIP42

  // Enable end-user to force the tx to be considered as a cip42
  if (tx.type === 'cip42') {
    return true
  }

  return (
    isEIP1559(transaction) &&
    (isPresent(tx.feeCurrency) ||
      isPresent(tx.gatewayFeeRecipient) ||
      isPresent(tx.gatewayFee))
  )
}

export function isCIP64(
  transaction: CeloTransactionSerializable | CeloTransactionRequest,
): transaction is TransactionSerializableCIP64 {
  const tx = transaction as TransactionSerializableCIP64

  // Enable end-user to force the tx to be considered as a cip64
  if (tx.type === 'cip64') {
    return true
  }

  return (
    isEIP1559(transaction) &&
    isPresent(tx.feeCurrency) &&
    // @ts-expect-error Property 'gatewayFee' does not exist on type 'TransactionSerializableCIP64'
    isEmpty(tx.gatewayFee) &&
    // @ts-expect-error Property 'gatewayFeeRecipient' does not exist on type 'TransactionSerializableCIP64'
    isEmpty(tx.gatewayFeeRecipient)
  )
}
