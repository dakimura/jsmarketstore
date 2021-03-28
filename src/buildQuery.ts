import { Params } from './params'

interface Query {
  Destination: string
  KeyCategory: string | undefined
  EpochStart: number | undefined
  EpochStartNanos: number | undefined
  EpochEnd: number | undefined
  EpochEndNanos: number | undefined
  LimitRecordCount: number | undefined
  LimitFromStart: boolean | undefined
}

export default function buildQuery(params: Params): Query {
  const tbk: string = params.symbol + '/' + params.timeframe + '/' + params.attributeGroup

  let query: Query = {
    Destination: tbk,
    KeyCategory: undefined,
    EpochStart: undefined,
    EpochStartNanos: undefined,
    EpochEnd: undefined,
    EpochEndNanos: undefined,
    LimitRecordCount: params.limit,
    LimitFromStart: params.limitFromStart,
  }

  if (params.start != null) {
    const start: number[] = divmod(params.start, 1000000000)
    query.EpochStart = start[0]
    query.EpochStartNanos = start[1]
  }

  if (params.end != null) {
    const end: number[] = divmod(params.end, 1000000000)
    query.EpochEnd = end[0]
    query.EpochEndNanos = end[1]
  }

  return query
}

function divmod(n: number, m: number): number[] {
  const n2: number = n * m
  return [Math.floor(n2 / m), n2 % m]
}
