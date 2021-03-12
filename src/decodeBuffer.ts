import { DATA_TYPE, DataTypeFromStringMap } from './dataTypes'

// TODO: necessary when we support 'U16'(string) datatype
// function decodeAscii(buf: ArrayBuffer): Uint8Array {
//     return String.fromCharCode.apply(null, new Uint8Array(buf));
// }

/**
 * decodeColumnBuffer converts binary values of a column by the specified dataType
 * @param buf
 * @param columnType e.g. "i8"
 */
export function decodeColumnBuffer(buf: ArrayBuffer, columnType: string): number[] {
  const ret = []

  const columnDataType: DATA_TYPE = DataTypeFromStringMap[columnType]
  const colSize: number = columnDataType.size

  // read the values of the column
  for (let i = 0; i < buf.byteLength / colSize; i++) {
    ret.push(columnDataType.read(buf.slice(i * colSize, (i + 1) * colSize)))
  }
  return ret
}
