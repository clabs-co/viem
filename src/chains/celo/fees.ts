import type { Client } from '~viem/clients/createClient.js'
import { type Address, type ChainFees, type Hex } from '~viem/index.js'

import { internal_estimateFeesPerGas } from '~viem/actions/public/estimateFeesPerGas.js'
import { formatters } from './formatters.js'

export const fees = {
  estimateFeesPerGas: async (params) => {
    console.info('params', params)
    // When using token to pay for fees, we need to estimate the fees in the value of the token
    if (params.request?.feeCurrency) {
      console.log('params.request.feeCurrency', params.request.feeCurrency)
      const [maxFeePerGas, maxPriorityFeePerGas] = await Promise.all([
        estimateFeePerGasInFeeCurrency(
          params.client,
          params.request.feeCurrency,
        ),
        estimateMaxPriorityFeePerGasInFeeCurrency(
          params.client,
          params.request.feeCurrency,
        ),
      ])

      return {
        maxFeePerGas,
        maxPriorityFeePerGas,
      }
    }
    return internal_estimateFeesPerGas(params.client, {...params, skipChainEstimator: true} as any, )
  },
} satisfies ChainFees<typeof formatters>

type RequestGasPriceInFeeCurrencyParams = {
  Method: 'eth_gasPrice'
  Parameters: [Address]
  ReturnType: Hex
}

async function estimateFeePerGasInFeeCurrency(
  client: Client,
  feeCurrency: Address,
) {
  console.log('request', client.request)
  const fee = await client.request<RequestGasPriceInFeeCurrencyParams>({
    method: 'eth_gasPrice',
    params: [feeCurrency],
  })
  return BigInt(fee)
}

type RequestMaxGasPriceInFeeCurrencyParams = {
  Method: 'eth_maxPriorityFeePerGas'
  Parameters: [Address]
  ReturnType: Hex
}

async function estimateMaxPriorityFeePerGasInFeeCurrency(
  client: Client,
  feeCurrency: Address,
) {
  console.log('request', client.request)
  const feesPerGas =
    await client.request<RequestMaxGasPriceInFeeCurrencyParams>({
      method: 'eth_maxPriorityFeePerGas',
      params: [feeCurrency],
    })
  return BigInt(feesPerGas)
}
