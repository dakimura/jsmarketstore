export const DataType = {
  BYTE: {
    name: 'i1',
    size: 1,
    read: function (buffer: ArrayBuffer): number {
      return Number(new DataView(buffer).getInt8(0))
    },
    set: function (view: DataView, byteOffset: number, value: number): void {
      view.setInt8(byteOffset, value)
    },
  },
  INT16: {
    name: 'i2',
    size: 2,
    read: function (buffer: ArrayBuffer): number {
      return Number(new DataView(buffer).getInt16(0, true))
    },
    set: function (view: DataView, byteOffset: number, value: number): void {
      view.setInt16(byteOffset, value, true)
    },
  },
  INT32: {
    name: 'i4',
    size: 4,
    read: function (buffer: ArrayBuffer): number {
      return Number(new DataView(buffer).getInt32(0, true))
    },
    set: function (view: DataView, byteOffset: number, value: number): void {
      view.setInt32(byteOffset, value, true)
    },
  },
  INT64: {
    name: 'i8',
    size: 8,
    read: function (buffer: ArrayBuffer): number {
      const view: DataView = new DataView(buffer)
      const val = view.getBigInt64(0, true)
      // TODO: this cast may overflow if the value is larger than the max value of "number"
      return Number(val)
    },
    set: function (view: DataView, byteOffset: number, value: number): void {
      view.setBigInt64(byteOffset, BigInt(value), true)
    },
  },
  UINT8: {
    name: 'u1',
    size: 1,
    read: function (buffer: ArrayBuffer): number {
      return Number(new DataView(buffer).getUint8(0))
    },
    set: function (view: DataView, byteOffset: number, value: number): void {
      view.setUint8(byteOffset, value)
    },
  },
  UINT16: {
    name: 'u2',
    size: 2,
    read: function (buffer: ArrayBuffer): number {
      return Number(new DataView(buffer).getUint16(0, true))
    },
    set: function (view: DataView, byteOffset: number, value: number): void {
      view.setUint16(byteOffset, value, true)
    },
  },
  UINT32: {
    name: 'u4',
    size: 4,
    read: function (buffer: ArrayBuffer): number {
      return Number(new DataView(buffer).getUint32(0, true))
    },
    set: function (view: DataView, byteOffset: number, value: number): void {
      view.setUint32(byteOffset, value, true)
    },
  },
  UINT64: {
    name: 'u8',
    size: 8,
    read: function (buffer: ArrayBuffer): number {
      return Number(new DataView(buffer).getBigUint64(0, true))
    },
    set: function (view: DataView, byteOffset: number, value: number): void {
      view.setBigUint64(byteOffset, BigInt(value), true)
    },
  },
  FLOAT32: {
    name: 'f4',
    size: 4,
    read: function (buffer: ArrayBuffer): number {
      return Number(new DataView(buffer).getFloat32(0, true))
    },
    set: function (view: DataView, byteOffset: number, value: number): void {
      view.setFloat32(byteOffset, value, true)
    },
  },
  FLOAT64: {
    name: 'f8',
    size: 8,
    read: function (buffer: ArrayBuffer): number {
      return Number(new DataView(buffer).getInt8(0))
    },
    set: function (view: DataView, byteOffset: number, value: number): void {
      view.setFloat64(byteOffset, value, true)
    },
  },
  STRING16: {
    name: 'U16',
    size: 16,
    //read: function (buffer: ArrayBuffer): number {
    read: function (): number {
      console.log('not implemented yet')
      return 0
    },
    //set: function (view: DataView, byteOffset: number, value: number): void {
    set: function (): void {
      console.log('not implemented yet')
    },
  },
} as const
export type DataType = typeof DataType[keyof typeof DataType]

export const DataTypeFromStringMap = new Map<string, DataType>()
for (const dataType of Object.values(DataType)) {
  DataTypeFromStringMap.set(dataType.name, dataType)
}
