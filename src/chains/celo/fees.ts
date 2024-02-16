import type { Client } from '~viem/clients/createClient.js'
import {
  type Address,
  type Block,
  type ChainFees,
  type Hex,
  type PrepareTransactionRequestParameters,
} from '~viem/index.js'

import { internal_estimateFeesPerGas } from '~viem/actions/public/estimateFeesPerGas.js'
import { formatters } from './formatters.js'

export const fees = {
  /*
   * Estimate the fees per gas for a transaction
   * If the transaction is to be paid in a token, the fees are estimated in the value of the token
   * otherwise the default estimateFeesPerGas is used.
   *
   * This method is called internally by estimateFeesPerGas
   *
   * @param parameters - {@link EstimateFeesPerGasParameters<typeof celo>}
   *
   */
  estimateFeesPerGas: async (params) => {
    // When using token to pay for fees, we need to estimate the fees in the value of the token
    if (params.request?.feeCurrency) {
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
    return internal_estimateFeesPerGas(params.client, {
      ...params,
      block: params.block as Block,
      chain: params.client.chain,
      request: params.request as PrepareTransactionRequestParameters,
      type: params.type,
      skipChainEstimator: true,
    })
  },
} satisfies ChainFees<typeof formatters>

type RequestGasPriceInFeeCurrencyParams = {
  Method: 'eth_gasPrice'
  Parameters: [Address]
  ReturnType: Hex
}
/*
 * Estimate the fee per gas in the value of the fee token

 *
 * @param client - Client to use
 * @param feeCurrency -  Address of a whitelisted fee token
 * @returns The fee per gas in wei in the value of the  fee token
 *
 */
async function estimateFeePerGasInFeeCurrency(
  client: Client,
  feeCurrency: Address,
) {
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

/*
 * Estimate the max priority fee per gas in the value of the fee token

 *
 * @param client - Client to use
 * @param feeCurrency -  Address of a whitelisted fee token
 * @returns The fee per gas in wei in the value of the  fee token
 *
 */
async function estimateMaxPriorityFeePerGasInFeeCurrency(
  client: Client,
  feeCurrency: Address,
) {
  const feesPerGas =
    await client.request<RequestMaxGasPriceInFeeCurrencyParams>({
      method: 'eth_maxPriorityFeePerGas',
      params: [feeCurrency],
    })
  return BigInt(feesPerGas)
}
