export const ListSymbolsFormat = {
  // ListSymbols API will return the list of...
  // Time Bucket Keys. e.g. ["AMZN/1Sec/Tick", "AAPL/1Min/OHLCV"]
  TBK: 'tbk',
  // Symbols. e.g. ["AMZN", "AAPL"]s
  Symbol: 'symbol',
} as const

export type ListSymbolsFormat = typeof ListSymbolsFormat[keyof typeof ListSymbolsFormat]
