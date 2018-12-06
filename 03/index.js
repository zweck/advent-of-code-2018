const { promisify } = require('util')
const readFile  = promisify(require('fs').readFile)
const R = require('ramda')

const parseCoord = coord => {
  const coordMatcher = new RegExp(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/)
  const parts = coordMatcher.exec(coord)
  return {
    id: +parts[1],
    top: +parts[3],
    left: +parts[2],
    width: +parts[4],
    height: +parts[5],
  }
}

const coordKey = ({ w, left, h, top }) => `${w+left}x${h+top}`

const mapFabric = (map, coord) => {
  const { top, left, width, height } = parseCoord(coord)
  R.forEach((w) => {
    R.forEach((h) => {
      const key = coordKey({ w, left, h, top })
      map[key] = R.pathOr(0, [key], map) + 1
    }, R.range(0, height))
  }, R.range(0, width))
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

const part2 = input => {
}

const main = async () => {
  const buffer =  await readFile('./input.txt', 'utf8')
  const input = buffer.trim().split('\n')
  part1(input)
  part2(input)
}

main()
