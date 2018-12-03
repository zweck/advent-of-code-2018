const { last, head, defaultTo, map, length } = require('ramda')
const { readFileSync } = require('fs')

let adjustments = readFileSync('./input.txt', 'utf8')
  .trim()
  .split('\n')
  .map(i => parseInt(i))

const loggedFreq = {}
let frequency = 0
const result = () => {
  return adjustments.find((adjust) => {
    frequency = frequency + adjust
    if (loggedFreq[frequency]) return frequency
    loggedFreq[frequency] = true
  }) || result()
}
result()
console.log(frequency)
