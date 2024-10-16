import { describe, expect, test, vi } from 'vitest'
import { celo } from '~viem/chains/index.js'
import { http, createTestClient } from '~viem/index.js'

const client = createTestClient({
  transport: http(),
  chain: celo,
  mode: 'anvil',
})

describe('celo/fees', () => {
  const celoestimateFeesPerGasFn = celo.fees.estimateFeesPerGas
  if (typeof celoestimateFeesPerGasFn !== 'function') return

  test("doesn't call the client when feeCurrency is not provided", async () => {
    const requestMock = vi.spyOn(client, 'request')

    expect(celo.fees.estimateFeesPerGas).toBeTypeOf('function')

    const fees = await celoestimateFeesPerGasFn({
      client,
      request: {},
    } as any)

    expect(fees).toBeNull()
    expect(requestMock).not.toHaveBeenCalled()
  })

  test('calls the client when feeCurrency is provided', async () => {
    const requestMock = vi.spyOn(client, 'request')

		const baseFee = 15057755162n
		const priorityFee = 602286n

    // @ts-ignore
    requestMock.mockImplementation((request) => {
      if (request.method === 'eth_gasPrice') return baseFee.toString()
      if (request.method === 'eth_maxPriorityFeePerGas') return priorityFee.toString()
      return
    })

    expect(celo.fees.estimateFeesPerGas).toBeTypeOf('function')

    const fees = await celoestimateFeesPerGasFn({
      client,
      request: {
        feeCurrency: '0xfee',
      },
    } as any)

    // The fees maxFeePerGas is calculated as (baseFee * multiplier) + maxPriorityFeePerGas
    // Which is ((15057755162-602286) * 150 / 100) + 602286 = 22586331600
    expect(fees).toMatchInlineSnapshot(`
        {
          "maxFeePerGas": ${baseFee + priorityFee}n,
          "maxPriorityFeePerGas": ${priorityFee}n,
        }
      `)
    expect(requestMock).toHaveBeenCalledWith({
      method: 'eth_maxPriorityFeePerGas',
      params: ['0xfee'],
    })
    expect(requestMock).toHaveBeenCalledWith({
      method: 'eth_gasPrice',
      params: ['0xfee'],
    })
  })
})
