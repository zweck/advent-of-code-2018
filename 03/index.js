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

const part1 = input => {

  const map = {}
  R.forEach(
    (coord) => {
      const { top, left, width, height } = parseCoord(coord)

      R.forEach((w) => {
        R.forEach((h) => {
          const coord = `${w+left}x${h+top}`
          const val = R.pathOr(0, [coord], map)
          map[coord] = val + 1
        }, R.range(0, height))
      }, R.range(0, width))

    },
    input
  )
  const overlap = R.reduce((t, v) => v > 1 ? (t+1) : t, 0, R.values(map))
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
