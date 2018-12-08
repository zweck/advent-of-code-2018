const { promisify } = require('util')
const readFile  = promisify(require('fs').readFile)
const R = require('ramda')

const parseCoord = coord => {
  const coordMatcher = new RegExp(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/)
  const parts = coordMatcher.exec(coord)
  return {
    id: +parts[1],
    y: +parts[3],
    x: +parts[2],
    w: +parts[4],
    h: +parts[5],
  }
}

const coordKey = ({ w, x, h, y }) => `${w+x}x${h+y}`

const mapFabric = (map, coord) => {
  const { y, x, w, h } = parseCoord(coord)
  R.forEach((w) => {
    R.forEach((h) => {
      const key = coordKey({ w, x, h, y })
      map[key] = R.pathOr(0, [key], map) + 1
    }, R.range(0, h))
  }, R.range(0, w))
  return map
}

const sumOverlaps = R.reduce((t, v) => v > 1 ? (t+1) : t, 0)

const part1 = input => {
  const map = R.reduce(
    mapFabric,
    {},
    input
  )
  const overlap = sumOverlaps(R.values(map))
  console.log(overlap)
}

const isOverlapped = (a, b) => (
  R.not(R.equals(a.id, b.id)) &&
  R.lt(a.x, R.add(b.x, b.w)) &&
  R.lt(a.y, R.add(b.y, b.h)) &&
  R.lt(b.x, R.add(a.x, a.w)) &&
  R.lt(b.y, R.add(a.y, a.h))
)

const part2 = input => {
  const parsedInput = R.map(parseCoord, input)
  const result = R.find(a => (
    R.none(b => (
      isOverlapped(a,b)
    ), parsedInput)
  ), parsedInput)
  console.log(result)
}

const main = async () => {
  const buffer =  await readFile('./input.txt', 'utf8')
  const input = buffer.trim().split('\n')
  part1(input)
  part2(input)
}

main()
