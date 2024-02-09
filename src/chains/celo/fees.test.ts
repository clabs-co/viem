import { describe, expect, test, vi } from 'vitest'
import { getBlock } from '~viem/actions/public/getBlock.js'
import {
  http,
  type ChainEstimateFeesPerGasFnParameters,
  createPublicClient,
} from '~viem/index.js'
import { celo } from '../index.js'
import { fees } from './fees.js'
import { formatters } from './formatters.js'

const client = createPublicClient({
  transport: http(),
  chain: celo,
})

const randomness = {
  committed:
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  revealed:
    '0x0000000000000000000000000000000000000000000000000000000000000000',
} as const

type ChainEstimateParams = ChainEstimateFeesPerGasFnParameters<
  typeof formatters
>

const baseParams = {
  client,
  multiply: (x: bigint) => (x * 102n) / 100n,
  type: 'eip1559',
} satisfies Partial<ChainEstimateParams>

describe('celo/fees', () => {
  describe('estimateFeesPerGas()', () => {
    test('default', async () => {
      const block = await getBlockWithRandomness()
      const params: ChainEstimateParams = {
        ...baseParams,
        // @ts-expect-error -- how does one get the right kind of block?
        block,
        request: { to: '0xto', value: 0n },
      }
      const { maxFeePerGas, maxPriorityFeePerGas } =
        await fees.estimateFeesPerGas(params)
      expect(maxFeePerGas).toBeTypeOf('bigint')
      expect(maxPriorityFeePerGas).toBeTypeOf('bigint')
    })

    test('feeCurrency', async () => {
      vi.spyOn(client, 'request')
      const block = await getBlockWithRandomness()
      const params: ChainEstimateParams = {
        ...baseParams,
        // @ts-expect-error  -- how does one get the right kind of block?
        block: { ...block, randomness },
        request: {
          feeCurrency: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
        },
      }
      const { maxFeePerGas, maxPriorityFeePerGas } =
        await fees.estimateFeesPerGas(params)
      expect(maxFeePerGas).toBeTypeOf('bigint')
      expect(maxPriorityFeePerGas).toBeTypeOf('bigint')

      expect(client.request).toHaveBeenCalledWith({
        method: 'eth_gasPrice',
        params: ['0x765DE816845861e75A25fCA122bb6898B8B1282a'],
      })
      expect(client.request).toHaveBeenCalledWith({
        method: 'eth_maxPriorityFeePerGas',
        params: ['0x765DE816845861e75A25fCA122bb6898B8B1282a'],
      })
    })
  })
})

async function getBlockWithRandomness() {
  const block = await getBlock(client)
  console.log('block', block)
  return { ...block, randomness }
}
