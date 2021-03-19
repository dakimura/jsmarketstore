import { Params } from './params'

interface Query {
  destination: string
  key_category: string | undefined
  epoch_start: number | undefined
  epoch_start_nanos: number | undefined
  epoch_end: number | undefined
  epoch_end_nanos: number | undefined
  limit_record_count: number | undefined
  limit_from_start: boolean | undefined
}

export default function buildQuery(params: Params): Query {
  const tbk: string = params.symbol + '/' + params.timeframe + '/' + params.attributeGroup

  let query: Query = {
    destination: tbk,
    key_category: undefined,
    epoch_start: undefined,
    epoch_start_nanos: undefined,
    epoch_end: undefined,
    epoch_end_nanos: undefined,
    limit_record_count: params.limit,
    limit_from_start: params.limitFromStart,
  }

  if (params.start != null) {
    const start: number[] = divmod(params.start, 1000000000)
    query.epoch_start = start[0]
    query.epoch_start_nanos = start[1]
  }

  if (params.end != null) {
    const end: number[] = divmod(params.end, 1000000000)
    query.epoch_end = end[0]
    query.epoch_end_nanos = end[1]
  }

  return query
}

function divmod(n: number, m: number): number[] {
  const n2 = n * m
  return [n2 / m, n2 % m]
}
