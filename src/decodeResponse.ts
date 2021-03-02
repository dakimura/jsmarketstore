
const columnSize = {
    'i1': 1,
    'i2': 2,
    'i4': 4,
    'i8': 8,
    'u1': 1,
    'u2': 2,
    'u4': 4,
    'u8': 8,
    'f4': 4,
    'f8': 8,
    'U16': 16,
}
const columnReadFunc = {
    'i1': readInt8,
    'i2': readInt16LittleEndian,
    'i4': readInt32LittleEndian,
    'i8': readInt64LittleEndian,
    'u1': readUint8,
    'u2': readUint16LittleEndian,
    'u4': readUint32LittleEndian,
    'u8': readUint64LittleEndian,
    'f4': readFloat32LittleEndian,
    'f8': readFloat64LittleEndian,
    'U16': readString16LittleEndian,
}


class DataSet {
}

class QueryResponse {
    private columnTypes: DATA_TYPE[]
    private columnNames: string[]
    // key: column name,  value: an array of bytes for the column
    private columnData: Map<string, Uint8Array[]>
}

export default function decodeResponse() {
}

function decodeAscii(buf: ArrayBuffer): Uint8Array {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function readInt8(buffer: ArrayBuffer): number {
    return Number((new DataView(buffer)).getInt8(0))
}

function readInt16LittleEndian(buffer: ArrayBuffer): number {
    return Number((new DataView(buffer)).getInt16(0, true))
}

function readInt32LittleEndian(buffer: ArrayBuffer): number {
    return Number((new DataView(buffer)).getInt32(0, true))
}

function readInt64LittleEndian(buffer: ArrayBuffer): number {
    const view: DataView = new DataView(buffer);
    let val = view.getBigInt64(0, true)
    // TODO: this cast may overflow if the value is larger than the max value of "number"
    return Number(val)
}

function readUint8(buffer: ArrayBuffer): number {
    return Number((new DataView(buffer)).getUint8(0))
}

function readUint16LittleEndian(buffer: ArrayBuffer): number {
    return Number((new DataView(buffer)).getUint16(0, true))
}

function readUint32LittleEndian(buffer: ArrayBuffer): number {
    return Number((new DataView(buffer)).getUint32(0, true))
}

function readUint64LittleEndian(buffer: ArrayBuffer): number {
    return Number((new DataView(buffer)).getBigUint64(0, true))
}

function readFloat32LittleEndian(buffer: ArrayBuffer): number {
    return Number((new DataView(buffer)).getFloat32(0, true))
}

function readFloat64LittleEndian(buffer: ArrayBuffer): number {
    return Number((new DataView(buffer)).getFloat64(0, true))
}

function readString16LittleEndian(buffer: ArrayBuffer): string {
    // TODO: implement this method
    return ""
}

export function decodeColumnBuffer(buf: ArrayBuffer, columnType: string): number[] {
    console.log(buf.byteLength)
    let ret = [];

    const colSize: number = columnSize[columnType];
    const readColumnFunc = columnReadFunc[columnType];
    // read column values
    for (let i = 0; i < buf.byteLength / colSize; i++) {
        ret.push(readColumnFunc(buf.slice(i * colSize, (i + 1) * colSize)));
    }
    return ret;
}
