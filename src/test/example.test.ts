function add(a: number, b: number): number {
  return a + b
}

test('add', () => {
  expect(add(1, 1)).toBe(2)
})
