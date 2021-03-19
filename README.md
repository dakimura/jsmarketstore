# jsmarketstore
Unofficial client library for [marketstore](https://github.com/alpacahq/marketstore).

## Install
```
npm install jsmarketstore
```

## Usage

Assume that the marketstore server is running on your localhost, and listening 5993 port.

```typescript
import {Client, Column, DataType, ListSymbolsFormat, Params} from "jsmarketstore";

const cli = new Client('http://localhost:5993/rpc')
const symbol = 'TEST'
const timeframe = '1Sec'
const attributeGroup = 'Tick'
const tbk: string = symbol + '/' + timeframe + '/' + attributeGroup

// write data -> list symbols -> query data -> delete the data
cli
    .write(
        [
            ['Epoch', DataType.INT64],
            ['Bid', DataType.FLOAT32],
            ['Ask', DataType.FLOAT32],
        ],
        [
            [Date.parse('2021-03-08 00:00:00') / 1000, 10.0, 20.0],
            [Date.parse('2021-03-09 00:00:00') / 1000, 30.0, 40.0],
        ],
        tbk,
        true,
    )
    .catch((reason: any) => {
        console.log("failed to write data:" + reason)
    })
    .then(() => {
        console.log('write data to ' + tbk + '.')
        return cli.listSymbols(ListSymbolsFormat.Symbol)
    })
    .catch((reason: any) => {
        console.log("failed to list symbols:" + reason)
    })
    .then((symbols: string[]) => {
        console.log('list symbols:')
        console.log(symbols)
        const params: Params = new Params(symbols[0], timeframe, attributeGroup)
        return cli.query(params)
    })
    .catch((reason: any) => {
        console.log("failed to query data:" + reason)
    })
    .then((response: Map<number, Column>) => {
        console.log('query ' + tbk + ':')
        console.log(response)
        return cli.destroy(tbk)
    })
    .catch((reason: any) => {
        console.log("failed to destroy bucket:" + reason)
    })
    .then(() => {
        console.log('destroyed:' + tbk)
    })
```
