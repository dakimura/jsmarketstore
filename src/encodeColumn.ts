import { encode } from 'base64-arraybuffer'

import { DataType } from './dataTypes'

// rows[x][y] = y-th column of x-th row
/**
 *
 * @param rows
 * @param dataTypes
 */
export default function encodeColumnsBase64(rows: number[][], dataTypes: DataType[]): string[] {
  const ret: string[] = []

  // for each column
  for (let x = 0; x < rows[0].length; x++) {
    const columnSize: number = dataTypes[x].size * rows.length

    const view: DataView = new DataView(new ArrayBuffer(columnSize))
    let offset = 0

    // for each row
    for (let y = 0; y < rows.length; y++) {
      // set the row value of the column to the dataview
      dataTypes[x].set(view, offset, rows[y][x])
      offset += dataTypes[x].size
    }
    ret.push(encode(view.buffer))
  }

  return ret
}
