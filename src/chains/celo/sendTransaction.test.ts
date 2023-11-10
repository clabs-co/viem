import { describe, expect, test, vi } from 'vitest'
import {
  createTransport,
  type EIP1193RequestFn,
  createWalletClient,
  type WalletRpcSchema,
  type PublicRpcSchema,
} from '../../index.js'
import type { CeloTransactionSerialized } from './types.js'
import { celo } from '../index.js'
import { generateRandomAddress } from './utils.js'
import { privateKeyToAccount } from '~viem/accounts/privateKeyToAccount.js'
import { accounts } from '~test/src/constants.js'
import { parseTransactionCelo } from './parsers.js'

describe('sendTransaction', () => {
  test('provides valid transaction params to sign for eth_sendRawTransaction (local account)', async () => {
    let rawTransaction: CeloTransactionSerialized | undefined

    const feeCurrencyAddress = generateRandomAddress()
    const transactionHash = generateRandomAddress()
    const toAddress = generateRandomAddress()

    const mockTransport = () =>
      createTransport({
        key: 'mock',
        name: 'Mock Transport',
        request: vi.fn(async (request) => {
          if (request.method === 'eth_chainId') {
            return celo.id
          }

          if (request.method === 'eth_getBlockByNumber') {
            // We just need baseFeePerGas for gas estimation
            return {
              baseFeePerGas: '0x12a05f200',
            }
          }

          if (request.method === 'eth_estimateGas') {
            return 1n
          }

          if (request.method === 'eth_getTransactionCount') {
            return 0
          }

          if (request.method === 'eth_sendRawTransaction') {
            rawTransaction = (
              request.params as Array<CeloTransactionSerialized>
            )[0]

            return transactionHash
          }

          return null
        }) as EIP1193RequestFn<WalletRpcSchema & PublicRpcSchema>,
        type: 'mock',
      })
    const client = createWalletClient({
      transport: mockTransport,
      chain: celo,
      // We need a local account
      account: privateKeyToAccount(accounts[0].privateKey),
    })

    const hash = await client.sendTransaction({
      value: 1n,
      to: toAddress,
      feeCurrency: feeCurrencyAddress,
      maxFeePerGas: 123n,
      maxPriorityFeePerGas: 123n,
    })

    expect(hash).toEqual(transactionHash)
    expect(rawTransaction).not.toBeUndefined()

    if (rawTransaction) {
      expect(parseTransactionCelo(rawTransaction).type).toEqual('cip64')
    }
  })
})
