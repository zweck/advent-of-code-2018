const { promisify } = require('util')
const readFile  = promisify(require('fs').readFile)
const {
  empty,
  keys,
  multiply,
  equals,
  length,
  filter,
  identity,
  groupBy,
  split,
  map,
  compose
} = require('ramda')

const part1 = input => {
  const hasLength = desired => a => equals(length(a), desired)
  const isRepeated = a => length(keys(a))
  const appearX = rate => filter(hasLength(rate))
  const grouper = compose(
    groupBy(identity),
    split('')
  )
  const grouped = map(grouper, input)
  const calced = multiply(
    length(filter(isRepeated, map(appearX(2), grouped))),
    length(filter(isRepeated, map(appearX(3), grouped)))
  )
  console.log(calced)
}

const main = async () => {
  const buffer =  await readFile('./input.txt', 'utf8')
  const input = buffer.trim().split('\n')
  part1(input)
}

main()
