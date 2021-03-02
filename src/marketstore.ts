import * as http from "http";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import buildQuery from "./buildQuery";
import Params from "./params";
// import {MarketstoreClient,} from "./proto/marketstore_pb_service";
// import {ListSymbolsRequest,} from "./proto/marketstore_pb";
// import {encode, decode} from "msgpack-lite";
// import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport';
import {decode, encode} from 'base64-arraybuffer'
import {decodeColumnBuffer} from "./decodeResponse";
import * as log4js from 'log4js';
import {Logger} from 'log4js';

const logger = log4js.getLogger();
logger.level = "debug";


const LIST_BUCKETS_JSONRPC_METHOD = 'DataService.ListSymbols';
const QUERY_JSONRPC_METHOD = 'DataService.Query';

export class Client {

    private baseURL: string
    private httpAgent: http.Agent

    // private gRPCClient: MarketstoreClient

    constructor(baseURL: string = "http://localhost:5993/rpc") {
        this.baseURL = baseURL;
        // this.gRPCClient = new MarketstoreClient(
        //     baseURL,
        //     {
        //         NodeHttpTransport(),
        //     });

        this.httpAgent = new http.Agent({keepAlive: true})
        console.log("initialize marketstore API client. baseURL=" + baseURL);
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

    public listSymbols(): Promise<string[]> {
        const url = this.baseURL

        return new Promise(function (okCallBack, ngCallBack) {
            axios.post(url, {
                jsonrpc: '2.0',
                id: +new Date(),
                method: LIST_BUCKETS_JSONRPC_METHOD,
                params: {"format": "tbk"},
            }, {headers: {'Content-Type': 'application/json'}})
                .then((response: AxiosResponse) => {
                    let symbols = response.data.result.Results
                    okCallBack(symbols);
                }).catch((error) => {
                console.log(error);
                ngCallBack(error);
            });

        })
    }

    public query(params: Params): Promise<object[]> {
        const url: string = this.baseURL
        const config: AxiosRequestConfig = {
            headers: {'Content-Type': 'application/json'},
        }

        return new Promise<object[]>(
            (
                okCallBack: (value: object[] | PromiseLike<object[]>) => void,
                ngCallBack: (reason?: any) => void) => {
                axios.post(url, {
                    jsonrpc: '2.0',
                    id: +new Date(),
                    method: QUERY_JSONRPC_METHOD,
                    params: {requests: [buildQuery(params)]},
                }, config)
                    .then((response: AxiosResponse) => {
                        if ('error' in response.data) {
                            logger.info("An error returned from marketstore:" + params.symbol + "/" + params.timeframe + "/" + params.attributeGroup)
                            ngCallBack(response.data.error)
                            return
                        }

                        
                        const epoch: ArrayBuffer = decode(response.data.result.Responses[0].Result.ColumnData[0])
                        const bid: ArrayBuffer = decode(response.data.result.Responses[0].Result.ColumnData[1])
                        const ask: ArrayBuffer = decode(response.data.result.Responses[0].Result.ColumnData[2])

                        console.log(decodeColumnBuffer(epoch, "i8"))
                        console.log(decodeColumnBuffer(bid, 'f4'))
                        console.log(decodeColumnBuffer(ask, 'f4'))

                        okCallBack([])

                    })
                    .catch((error) => {
                        console.log(error);
                        ngCallBack(error);
                    })
            }
        )
    }
}