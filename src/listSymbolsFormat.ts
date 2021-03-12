export const ListSymbolsFormats = {
  // ListSymbols API will return the list of...
  // Time Bucket Keys. e.g. ["AMZN/1Sec/Tick", "AAPL/1Min/OHLCV"]
  TBK: 'tbk',
  // Symbols. e.g. ["AMZN", "AAPL"]s
  Symbol: 'symbol',
}
export type ListSymbolsFormat = typeof ListSymbolsFormats[keyof typeof ListSymbolsFormats]
