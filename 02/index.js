const { promisify } = require('util')
const readFile  = promisify(require('fs').readFile)
const {
  reduceWhile,
  split,
  identity,
  compose,
  map,
  keys,
  groupBy,
  multiply,
  length,
  filter,
  equals
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

const part2 = input => {
  const found = reduceWhile(
    a => !length(a),
    (acc, i) => {
    const matched = reduceWhile(
      a => !length(a),
      (acc, j) => {
        const charsI = [...i]
        const charsJ = [...j]

        const diff = charsI.reduce((a, c, i) => a + (c === charsJ[i] ? 0 : 1), 0)

        if (diff === 1) {
          return [i, j]
        }
        return acc
      },
      [],
      input
    )
    return matched
  }, [], input)
  console.log(found)
}

const main = async () => {
  const buffer =  await readFile('./input.txt', 'utf8')
  const input = buffer.trim().split('\n')
  part1(input)
  part2(input)
}

main()
