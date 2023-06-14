import { expect, test } from 'vitest'

import type { RpcBlock, RpcTransaction } from '../../types/rpc.js'

import { formatBlock } from './block.js'

const block: RpcBlock = {
  baseFeePerGas: '0x0',
  difficulty: '0x2d3a678cddba9b',
  extraData: '0x',
  gasLimit: '0x1c9c347',
  gasUsed: '0x0',
  hash: '0xebc3644804e4040c0a74c5a5bbbc6b46a71a5d4010fe0c92ebb2fdf4a43ea5dd',
  logsBloom:
    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  miner: '0x0000000000000000000000000000000000000000',
  mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  nonce: '0x0000000000000000',
  number: '0xec6fc6',
  parentHash:
    '0xe55516ad8029e53cd32087f14653d851401b05245abb1b2d6ed4ddcc597ac5a6',
  receiptsRoot:
    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  sealFields: [
    '0x0000000000000000000000000000000000000000000000000000000000000000',
    '0x0000000000000000',
  ],
  sha3Uncles:
    '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
  size: '0x208',
  stateRoot:
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  timestamp: '0x63198f6f',
  totalDifficulty: '0x1',
  transactions: [],
  transactionsRoot:
    '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  uncles: [],
}

test('deserializes block', () => {
  expect(formatBlock(block)).toMatchInlineSnapshot(`
    {
      "baseFeePerGas": 0n,
      "difficulty": 12730590371363483n,
      "extraData": "0x",
      "gasLimit": 29999943n,
      "gasUsed": 0n,
      "hash": "0xebc3644804e4040c0a74c5a5bbbc6b46a71a5d4010fe0c92ebb2fdf4a43ea5dd",
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "miner": "0x0000000000000000000000000000000000000000",
      "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "nonce": "0x0000000000000000",
      "number": 15495110n,
      "parentHash": "0xe55516ad8029e53cd32087f14653d851401b05245abb1b2d6ed4ddcc597ac5a6",
      "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "sealFields": [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000",
      ],
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "size": 520n,
      "stateRoot": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "timestamp": 1662619503n,
      "totalDifficulty": 1n,
      "transactions": [],
      "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "uncles": [],
    }
  `)
})

test('nullish values', () => {
  expect(
    formatBlock({
      ...block,
      difficulty: undefined,
      number: null,
      baseFeePerGas: undefined,
      gasLimit: undefined,
      gasUsed: undefined,
      hash: undefined,
      logsBloom: undefined,
      nonce: undefined,
      size: undefined,
      timestamp: undefined,
      totalDifficulty: undefined,
    }),
  ).toMatchInlineSnapshot(`
    {
      "baseFeePerGas": null,
      "difficulty": undefined,
      "extraData": "0x",
      "gasLimit": undefined,
      "gasUsed": undefined,
      "hash": null,
      "logsBloom": null,
      "miner": "0x0000000000000000000000000000000000000000",
      "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "nonce": null,
      "number": null,
      "parentHash": "0xe55516ad8029e53cd32087f14653d851401b05245abb1b2d6ed4ddcc597ac5a6",
      "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "sealFields": [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000",
      ],
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "size": undefined,
      "stateRoot": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "timestamp": undefined,
      "totalDifficulty": null,
      "transactions": [],
      "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "uncles": [],
    }
  `)
})

 test('with transactions', () => {
    const rpcTransactions: RpcTransaction[] = [
      {
        r: '0x0000000000000',
        s:  '0x0000000000000',
        v: '0x0',
        blockHash: '0x0000000000000',
        blockNumber: '0x0',
        gas: '0x0',
        transactionIndex: '0x0',
        to: '0x0000000000000',
        value: '0x0',
        from: '0x0000000000000',
        maxPriorityFeePerGas: '0x0',
        maxFeePerGas: '0x0',
        hash: '0x0000000000000',
        input: '0x',
        nonce: '0x0',
        accessList: [],
        chainId: `0x01`,
        type: '0x2',
      },
      {
        r: '0x0000000000000',
        s:  '0x0000000000000',
        v: '0x0',
        blockHash: '0x0000000000000',
        blockNumber: '0x0',
        gas: '0x0',
        gasPrice: '0x0',
        transactionIndex: '0x0',
        to: '0x0000000000000',
        value: '0x0',
        from: '0x0000000000000',
        hash: '0x0000000000000',
        input: '0x',
        nonce: '0x0',
        accessList: [],
        chainId: `0x01`,
        type: '0x1',
      },
    ]

    expect(formatBlock({ ...block, transactions: rpcTransactions })).toMatchInlineSnapshot(`
    {
      "baseFeePerGas": 0n,
      "difficulty": 12730590371363483n,
      "extraData": "0x",
      "gasLimit": 29999943n,
      "gasUsed": 0n,
      "hash": "0xebc3644804e4040c0a74c5a5bbbc6b46a71a5d4010fe0c92ebb2fdf4a43ea5dd",
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "miner": "0x0000000000000000000000000000000000000000",
      "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "nonce": "0x0000000000000000",
      "number": 15495110n,
      "parentHash": "0xe55516ad8029e53cd32087f14653d851401b05245abb1b2d6ed4ddcc597ac5a6",
      "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "sealFields": [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x0000000000000000",
      ],
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "size": 520n,
      "stateRoot": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "timestamp": 1662619503n,
      "totalDifficulty": 1n,
      "transactions": [
        {
          "accessList": [],
          "blockHash": "0x0000000000000",
          "blockNumber": 0n,
          "chainId": 1,
          "from": "0x0000000000000",
          "gas": 0n,
          "gasPrice": undefined,
          "hash": "0x0000000000000",
          "input": "0x",
          "maxFeePerGas": 0n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "r": "0x0000000000000",
          "s": "0x0000000000000",
          "to": "0x0000000000000",
          "transactionIndex": 0,
          "type": "eip1559",
          "v": 0n,
          "value": 0n,
        },
        {
          "accessList": [],
          "blockHash": "0x0000000000000",
          "blockNumber": 0n,
          "chainId": 1,
          "from": "0x0000000000000",
          "gas": 0n,
          "gasPrice": 0n,
          "hash": "0x0000000000000",
          "input": "0x",
          "nonce": 0,
          "r": "0x0000000000000",
          "s": "0x0000000000000",
          "to": "0x0000000000000",
          "transactionIndex": 0,
          "type": "eip2930",
          "v": 0n,
          "value": 0n,
        },
      ],
      "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "uncles": [],
    }
    `)
  })
