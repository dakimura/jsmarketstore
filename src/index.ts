import { DATA_TYPES } from './dataTypes'
import { ListSymbolsFormats } from './listSymbolsFormat'
import { Client, Column } from './marketstore'
import Params from './params'

const cli = new Client('http://localhost:5993/rpc')
const symbol = 'TEST'
const timeframe = '1Sec'
const attributeGroup = 'Tick'
const tbk: string = symbol + '/' + timeframe + '/' + attributeGroup

// write data -> list symbols -> query data -> delete the data
cli
  .write(
    [
      ['Epoch', DATA_TYPES.INT64],
      ['Bid', DATA_TYPES.FLOAT32],
      ['Ask', DATA_TYPES.FLOAT32],
    ],
    [
      [Date.parse('2021-03-08 00:00:00') / 1000, 10.0, 20.0],
      [Date.parse('2021-03-09 00:00:00') / 1000, 30.0, 40.0],
    ],
    tbk,
    true,
  )
  .then(() => {
    console.log('write data to ' + tbk + '.')
    return cli.listSymbols(ListSymbolsFormats.Symbol)
  })
  .then((symbols: string[]) => {
    console.log('list symbols:')
    console.log(symbols)
    const params: Params = new Params(symbols[0], timeframe, attributeGroup)
    return cli.query(params)
  })
  .then((response: Map<number, Column>) => {
    console.log('query ' + tbk + ':')
    console.log(response)
    return cli.destroy(tbk)
  })
  .then(() => {
    console.log('destroyed:' + tbk)
  })
