import type { Address } from 'abitype'

import type { Block, BlockTag } from '../types/block.js'
import type { FeeValuesEIP1559 } from '../types/fee.js'
import type { Hex } from '../types/misc.js'
import type {
  Index,
  Quantity,
  RpcBlock,
  RpcTransactionRequest as RpcTransactionRequest_,
  RpcTransaction as RpcTransaction_,
  TransactionType,
} from '../types/rpc.js'
import type {
  AccessList,
  TransactionBase,
  TransactionRequestBase,
  TransactionRequest as TransactionRequest_,
  TransactionSerializable,
  TransactionSerializableBase,
  TransactionSerialized,
  Transaction as Transaction_,
} from '../types/transaction.js'
import type { ExactPartial, NeverBy, OneOf } from '../types/utils.js'

type CeloBlockExclude =
  | 'difficulty'
  | 'gasLimit'
  | 'mixHash'
  | 'nonce'
  | 'uncles'

export type CeloBlockOverrides = {
  randomness: {
    committed: Hex
    revealed: Hex
  }
}
export type CeloBlock<
  TIncludeTransactions extends boolean = boolean,
  TBlockTag extends BlockTag = BlockTag,
> = NeverBy<
  Block<
    bigint,
    TIncludeTransactions,
    TBlockTag,
    CeloTransaction<TBlockTag extends 'pending' ? true : false>
  >,
  CeloBlockExclude
> &
  CeloBlockOverrides

export type CeloRpcBlockOverrides = {
  randomness: {
    committed: Hex
    revealed: Hex
  }
}
export type CeloRpcBlock<
  TBlockTag extends BlockTag = BlockTag,
  TIncludeTransactions extends boolean = boolean,
> = NeverBy<
  RpcBlock<
    TBlockTag,
    TIncludeTransactions,
    RpcTransaction<TBlockTag extends 'pending' ? true : false>
  >,
  CeloBlockExclude
> &
  CeloRpcBlockOverrides

export type CeloRpcTransaction<TPending extends boolean = boolean> =
  | RpcTransaction<TPending>
  | RpcTransactionCIP42<TPending>
  | RpcTransactionCIP64<TPending>
  | RpcTransactionCIP66<TPending>

export type CeloRpcTransactionRequest =
  | RpcTransactionRequest
  | RpcTransactionRequestCIP64
  | RpcTransactionRequestCIP66

export type CeloTransaction<TPending extends boolean = boolean> =
  | Transaction<TPending>
  | TransactionCIP42<TPending>
  | TransactionCIP64<TPending>
  | TransactionCIP66<TPending>

export type CeloTransactionRequest =
  | TransactionRequest
  | TransactionRequestCIP64
  | TransactionRequestCIP66

export type CeloTransactionSerializable = OneOf<
  | TransactionSerializable
  | TransactionSerializableCIP64
  | TransactionSerializableCIP66
>

export type CeloTransactionSerialized<
  TType extends CeloTransactionType = CeloTransactionType,
> =
  | TransactionSerialized<TType>
  | TransactionSerializedCIP42
  | TransactionSerializedCIP64
  | TransactionSerializedCIP66

export type CeloTransactionType = TransactionType | 'cip42' | 'cip64' | 'cip66'

type RpcTransaction<TPending extends boolean = boolean> =
  RpcTransaction_<TPending> & {
    feeCurrency: Address | null
    maxFeeInFeeCurrency?: bigint | undefined
    gatewayFee: Hex | null
    gatewayFeeRecipient: Address | null
  }

type RpcTransactionRequest = RpcTransactionRequest_ & {
  feeCurrency?: Address | undefined
  maxFeeInFeeCurrency?: bigint | null
}

export type RpcTransactionCIP42<TPending extends boolean = boolean> = Omit<
  TransactionBase<Quantity, Index, TPending>,
  'typeHex'
> &
  FeeValuesEIP1559<Quantity> & {
    feeCurrency: Address | null
    maxFeeInFeeCurrency?: undefined
    gatewayFee: Hex | null
    gatewayFeeRecipient: Address | null
    type: '0x7c'
  }

export type RpcTransactionCIP64<TPending extends boolean = boolean> = Omit<
  TransactionBase<Quantity, Index, TPending>,
  'typeHex'
> &
  FeeValuesEIP1559<Quantity> & {
    feeCurrency: Address | null
    maxFeeInFeeCurrency?: undefined
    gatewayFee?: undefined
    gatewayFeeRecipient?: undefined
    type: '0x7b'
  }

export type RpcTransactionCIP66<TPending extends boolean = boolean> = Omit<
  TransactionBase<Quantity, Index, TPending>,
  'typeHex'
> &
  FeeValuesEIP1559<Quantity> & {
    feeCurrency: Address
    maxFeeInFeeCurrency: Quantity
    gatewayFee?: undefined
    gatewayFeeRecipient?: undefined
    type: '0x7a'
  }

export type RpcTransactionRequestCIP64 = TransactionRequestBase<
  Quantity,
  Index
> &
  ExactPartial<FeeValuesEIP1559<Quantity>> & {
    accessList?: AccessList | undefined
    feeCurrency?: Address | undefined
    maxFeeInFeeCurrency?: undefined
    type?: '0x7b' | undefined
  }

export type RpcTransactionRequestCIP66 = TransactionRequestBase<
  Quantity,
  Index
> &
  ExactPartial<FeeValuesEIP1559<Quantity>> & {
    accessList?: AccessList | undefined
    feeCurrency?: Address | undefined
    maxFeeInFeeCurrency?: Quantity | undefined
    type?: '0x7a' | undefined
  }

type Transaction<TPending extends boolean = boolean> = Transaction_<
  bigint,
  number,
  TPending
> & {
  feeCurrency: Address | null
  maxFeeInFeeCurrency: bigint | undefined
  gatewayFee: bigint | null
  gatewayFeeRecipient: Address | null
}

export type TransactionCIP42<TPending extends boolean = boolean> =
  TransactionBase<bigint, number, TPending> &
    FeeValuesEIP1559 & {
      feeCurrency: Address | null
      maxFeeInFeeCurrency?: undefined
      gatewayFee: bigint | null
      gatewayFeeRecipient: Address | null
      type: 'cip42'
    }

export type TransactionCIP64<TPending extends boolean = boolean> =
  TransactionBase<bigint, number, TPending> &
    FeeValuesEIP1559 & {
      feeCurrency: Address | null
      maxFeeInFeeCurrency?: undefined
      gatewayFee?: undefined
      gatewayFeeRecipient?: undefined
      type: 'cip64'
    }

export type TransactionCIP66<TPending extends boolean = boolean> =
  TransactionBase<bigint, number, TPending> &
    FeeValuesEIP1559 & {
      feeCurrency: Address
      maxFeeInFeeCurrency: bigint
      gatewayFee?: undefined
      gatewayFeeRecipient?: undefined
      type: 'cip66'
    }

type TransactionRequest = TransactionRequest_ & {
  feeCurrency?: Address | undefined
  maxFeeInFeeCurrency?: bigint | undefined
}

export type TransactionRequestCIP64 = TransactionRequestBase &
  ExactPartial<FeeValuesEIP1559> & {
    accessList?: AccessList | undefined
    feeCurrency?: Address | undefined
    maxFeeInFeeCurrency?: undefined
    type?: 'cip64' | undefined
  }

export type TransactionRequestCIP66<TQuantity = bigint> =
  TransactionRequestBase &
    ExactPartial<FeeValuesEIP1559> & {
      accessList?: AccessList | undefined
      feeCurrency?: Address | undefined
      maxFeeInFeeCurrency?: TQuantity | undefined
      gatewayFee?: undefined
      gatewayFeeRecipient?: undefined
      type?: 'cip66' | undefined
    }

export type TransactionSerializableCIP42<
  TQuantity = bigint,
  TIndex = number,
> = TransactionSerializableBase<TQuantity, TIndex> &
  ExactPartial<FeeValuesEIP1559<TQuantity>> & {
    accessList?: AccessList | undefined
    feeCurrency?: Address | undefined
    maxFeeInFeeCurrency?: undefined
    gatewayFeeRecipient?: Address | undefined
    gatewayFee?: TQuantity | undefined
    chainId: number
    type?: 'cip42' | undefined
  }

export type TransactionSerializableCIP64<
  TQuantity = bigint,
  TIndex = number,
> = TransactionSerializableBase<TQuantity, TIndex> &
  ExactPartial<FeeValuesEIP1559<TQuantity>> & {
    accessList?: AccessList | undefined
    feeCurrency?: Address | undefined
    maxFeeInFeeCurrency?: undefined
    gatewayFee?: undefined
    gatewayFeeRecipient?: undefined
    chainId: number
    type?: 'cip64' | undefined
  }

export type TransactionSerializableCIP66<
  TQuantity = bigint,
  TIndex = number,
> = TransactionSerializableBase<TQuantity, TIndex> &
  ExactPartial<FeeValuesEIP1559<TQuantity>> & {
    accessList?: AccessList | undefined
    feeCurrency?: Address | undefined
    maxFeeInFeeCurrency?: TQuantity | undefined
    gatewayFee?: undefined
    gatewayFeeRecipient?: undefined
    chainId: number
    type?: 'cip66' | undefined
  }

export type TransactionSerializedCIP42 = `0x7c${string}`
export type TransactionSerializedCIP64 = `0x7b${string}`
export type TransactionSerializedCIP66 = `0x7a${string}`
