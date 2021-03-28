export class Params {
  // symbol name to query (e.g. "AAPL")
  // TODO: support multiple symbols (e.g. ["AAPL", "AMZN"])
  private readonly _symbol: string

  // timeframe to query (e.g. "1Sec" / "1D")
  private readonly _timeframe: string

  // attributeGroup to query (e.g. "OHLCV" / "TICK")
  private readonly _attributeGroup: string

  // data with a timestamp that equals to or after this epoch second is returned
  private readonly _start?: number

  // data with a timestamp that equals to or before
  private readonly _end?: number

  // the maximum number of records returned from the query
  private readonly _limit?: number

  // when true, the number of records is counted from the 'start' date.
  private readonly _limitFromStart?: boolean

  // column names to query. (e.g. ["Open", "Close"]). When empty, all columns are queried.
  private readonly _columns?: string[]

  constructor(
    symbol: string,
    timeframe: string,
    attributeGroup: string,
    start = 0,
    end?: number,
    limit?: number,
    limitFromStart?: boolean,
    columns?: Array<string>,
  ) {
    this._symbol = symbol
    this._timeframe = timeframe
    this._attributeGroup = attributeGroup
    this._start = start
    this._end = end
    this._limit = limit
    this._limitFromStart = limitFromStart
    this._columns = columns
  }

  get symbol(): string {
    return this._symbol
  }

  get timeframe(): string {
    return this._timeframe
  }

  get attributeGroup(): string {
    return this._attributeGroup
  }

  get start(): number | undefined {
    return this._start
  }

  get end(): number | undefined {
    return this._end
  }

  get limit(): number | undefined {
    return this._limit
  }

  get limitFromStart(): boolean | undefined {
    return this._limitFromStart
  }

  get columns(): string[] | undefined {
    return this._columns
  }
}
