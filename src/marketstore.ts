import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
// import {MarketstoreClient,} from "./proto/marketstore_pb_service";
// import {ListSymbolsRequest,} from "./proto/marketstore_pb";
// import {encode, decode} from "msgpack-lite";
// import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport';
import { decode as decodeBase64 } from 'base64-arraybuffer'
import * as http from 'http'
import * as log4js from 'log4js'

import buildQuery from './buildQuery'
import { DataType } from './dataTypes'
import { decodeColumnBuffer } from './decodeBuffer'
import encodeColumnsBase64 from './encodeColumn'
import { ListSymbolsFormat } from './listSymbolsFormat'
import { Params } from './params'
import { UnknownColumnTypeError } from './errors'

const logger = log4js.getLogger()
logger.level = 'debug'

const LIST_BUCKETS_JSONRPC_METHOD = 'DataService.ListSymbols'
const QUERY_JSONRPC_METHOD = 'DataService.Query'
const WRITE_JSONRPC_METHOD = 'DataService.Write'
const DESTROY_JSONRPC_METHOD = 'DataService.Destroy'
const requestConfig: AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' } }

export class Client {
  private baseURL: string
  private httpAgent: http.Agent

  // TODO: impleent gRPC client
  // private gRPCClient: MarketstoreClient

  constructor(baseURL = 'http://localhost:5993/rpc') {
    this.baseURL = baseURL
    // this.gRPCClient = new MarketstoreClient(
    //     baseURL,
    //     {
    //         NodeHttpTransport(),
    //     });

    this.httpAgent = new http.Agent({ keepAlive: true })
    console.log('initialize marketstore API client. baseURL=' + baseURL)
  }

  // public listSymbolsGRPC(): Promise<string[]> {
  //     return new Promise<string[]>(
  //         (
  //             okCallBack: (value: string[] | PromiseLike<string[]>) => void,
  //             ngCallBack: (reason?: any) => void,
  //         ) => {
  //
  //             const req = new ListSymbolsRequest();
  //             req.setFormat(ListSymbolsRequest.Format.TIME_BUCKET_KEY);
  //             this.gRPCClient.listSymbols(req, (err, response) => {
  //                 if (err != null) {
  //                     ngCallBack(err)
  //                 }
  //
  //                 okCallBack(response.getResultsList())
  //             });
  //         }
  //     )
  // }

  public listSymbols(format: ListSymbolsFormat): Promise<string[]> {
    const url = this.baseURL

    return new Promise(function (okCallBack, ngCallBack) {
      axios
        .post(
          url,
          {
            jsonrpc: '2.0',
            id: +new Date(),
            method: LIST_BUCKETS_JSONRPC_METHOD,
            params: { format: format },
          },
          requestConfig,
        )
        .then((response: AxiosResponse) => {
          const symbols = response.data.result.Results
          okCallBack(symbols)
        })
        .catch((error) => {
          ngCallBack(error)
        })
    })
  }

  public query(params: Params): Promise<Map<number, Column>> {
    const url: string = this.baseURL

    return new Promise<Map<number, Column>>(
      (
        okCallBack: (value: Map<number, Column> | PromiseLike<Map<number, Column>>) => void,
        ngCallBack: (reason?: any) => void,
      ) => {
        axios
          .post(
            url,
            {
              jsonrpc: '2.0',
              id: +new Date(),
              method: QUERY_JSONRPC_METHOD,
              params: { requests: [buildQuery(params)] },
            },
            requestConfig,
          )
          .then((response: AxiosResponse) => {
            if ('error' in response.data) {
              logger.info(
                'An error returned from marketstore query API:' +
                  params.symbol +
                  '/' +
                  params.timeframe +
                  '/' +
                  params.attributeGroup,
              )
              ngCallBack(response.data.error)
              return
            }

            const queryResponse: Map<number, Column> = new Map()
            const columnTypes: string[] = response.data.result.Responses[0].Result.ColumnTypes
            const columnNames: string[] = response.data.result.Responses[0].Result.ColumnNames
            // note that the columnData is string[] because they are encoded by Base64
            const columnData: string[] = response.data.result.Responses[0].Result.ColumnData

            const columns: number[][] = []

            // decode columns
            for (let i = 0; i < columnNames.length; i++) {
              const column: number[] | UnknownColumnTypeError = decodeColumnBuffer(
                decodeBase64(columnData[i]),
                columnTypes[i],
              )
              if (column instanceof UnknownColumnTypeError) {
                logger.warn('unknown column type:' + column)
                continue
              }

              columns[i] = column
            }

            // convert columns to rows.
            const epochs: number[] = columns[0]
            for (let i = 0; i < epochs.length; i++) {
              const record: Column = { Epoch: epochs[i] }
              for (let k = 0; k < columnNames.length; k++) {
                record[columnNames[k]] = columns[k][i]
              }
              queryResponse.set(epochs[i], record)
            }

            okCallBack(queryResponse)
          })
          .catch((error) => {
            ngCallBack(error)
          })
      },
    )
  }

  private static getColumnTypeStr(dtypes: [string, DataType][]): string[] {
    const typeStrs: string[] = []
    for (let i = 0; i < dtypes.length; i++) {
      typeStrs.push(dtypes[i][1].name)
    }
    return typeStrs
  }

  private static getColumnTypes(dtypes: [string, DataType][]): DataType[] {
    const typeStrs: DataType[] = []
    for (let i = 0; i < dtypes.length; i++) {
      typeStrs.push(dtypes[i][1])
    }
    return typeStrs
  }

  private static getColumnNames(dtypes: [string, DataType][]): string[] {
    const columnNames: string[] = []
    for (let i = 0; i < dtypes.length; i++) {
      columnNames.push(dtypes[i][0])
    }
    return columnNames
  }

  public write(
    dtypes: [string, DataType][],
    rows: number[][],
    tbk: string,
    isVariableLength = false,
  ): Promise<void> {
    const url: string = this.baseURL

    const lengths: Lengths = {}
    lengths[tbk] = rows.length
    const startIndex: StartIndex = {}
    startIndex[tbk] = 0

    const request = {
      Data: {
        ColumnTypes: Client.getColumnTypeStr(dtypes),
        ColumnNames: Client.getColumnNames(dtypes),
        ColumnData: encodeColumnsBase64(rows, Client.getColumnTypes(dtypes)),
        Length: rows.length,
        Lengths: lengths,
        StartIndex: startIndex,
      },
      IsVariableLength: isVariableLength,
    }

    return new Promise<void>(
      (
        okCallBack: (value: void | PromiseLike<void>) => void,
        ngCallBack: (reason?: any) => void,
      ) => {
        axios
          .post(
            url,
            {
              jsonrpc: '2.0',
              id: +new Date(),
              method: WRITE_JSONRPC_METHOD,
              params: { requests: [request] },
            },
            requestConfig,
          )
          .then((response: AxiosResponse) => {
            if ('error' in response.data) {
              logger.info('An error returned from marketstore write API:' + tbk)
              ngCallBack(response.data.error)
              return
            }

            okCallBack()
          })
          .catch((error) => {
            console.log(error)
            ngCallBack(error)
          })
      },
    )
  }

  public destroy(tbk: string): Promise<void> {
    const url: string = this.baseURL

    return new Promise<void>(
      (
        okCallBack: (value: void | PromiseLike<void>) => void,
        ngCallBack: (reason?: any) => void,
      ) => {
        axios
          .post(
            url,
            {
              jsonrpc: '2.0',
              id: +new Date(),
              method: DESTROY_JSONRPC_METHOD,
              params: { requests: [{ Key: tbk }] },
            },
            requestConfig,
          )
          .then((response: AxiosResponse) => {
            if ('error' in response.data) {
              logger.info('An error returned from marketstore destroy API:' + tbk)
              ngCallBack(response.data.error)
              return
            }

            okCallBack()
          })
          .catch((error) => {
            ngCallBack(error)
          })
      },
    )
  }
}

export interface Column {
  Epoch: number

  [columnName: string]: number
}

interface StartIndex {
  [tbk: string]: number
}

interface Lengths {
  [tbk: string]: number
}
