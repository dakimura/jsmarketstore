import {Client} from "./marketstore";
import Params from "./params"

// const cli = new Client("localhost:5998")
const cli = new Client("http://localhost:5993/rpc")
const params: Params = new Params("TEST", "1Sec", "Tick")

cli.listSymbols().then(
    (response: string[]) => {
        console.log(response)
    }
).catch(error => {
    console.log(error)
})

cli.query(params).then(
    (response: object[]) => {
        console.log(response)
    }
).catch(error => {
    console.log(error)
})