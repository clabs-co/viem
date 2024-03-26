import { describe, expect, test, vi } from 'vitest'
import { http, createTestClient } from '~viem/index.js'
import { celo } from '../index.js'

const client = createTestClient({
  transport: http(),
  chain: celo,
  mode: 'anvil',
})

describe('celo/fees', () => {
  test("doesn't call the client when feeCurrency is not provided", async () => {
    const requestMock = vi.spyOn(client, 'request')

    expect(celo.fees.estimateFeesPerGas).toBeTypeOf('function')

    // @ts-ignore
    const fees = await celo.fees.estimateFeesPerGas({
      client,
      request: {},
    } as any)

    expect(fees).toBeNull()
    expect(requestMock).not.toHaveBeenCalled()
  })

  test('calls the client when feeCurrency is provided', async () => {
    const requestMock = vi.spyOn(client, 'request')
    requestMock.mockImplementation((request) => {
      switch (request.method) {
        case 'eth_gasPrice':
          return '11619349802'
        case 'eth_maxPriorityFeePerGas':
          return '2323869960'
      }
    })

    expect(celo.fees.estimateFeesPerGas).toBeTypeOf('function')

    // @ts-ignore
    const fees = await celo.fees.estimateFeesPerGas({
      client,
      request: {
        feeCurrency: '0xfee',
      },
    } as any)

    expect(fees).toMatchInlineSnapshot(`
        {
          "maxFeePerGas": 11619349802n,
          "maxPriorityFeePerGas": 2323869960n,
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
