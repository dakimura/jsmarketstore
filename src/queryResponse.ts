const DATA_TYPE: object = {
    BYTE: 'i1',
    INT16: 'i2',
    INT32: 'i4',
    INT64: 'i8',
    UINT8: 'u1',
    UINT16: 'u2',
    UINT32: 'u4',
    UINT64: 'u8',
    FLOAT32: 'f4',
    FLOAT64: 'f8',
    STRING16: 'U16',
} as const;
type DATA_TYPE = typeof DATA_TYPE[keyof typeof DATA_TYPE];

