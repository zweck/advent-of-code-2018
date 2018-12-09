const { promisify } = require('util')
const readFile  = promisify(require('fs').readFile)
const R = require('ramda')

const parseLine = event => event.match(/\[1518-(\d+)-(\d+) (\d+):(\d+)\] (.*)/)

const partOne = input => {
  const guards = {}
  let guard
  let doze

  R.forEach(event => {
    const [ , month, day, hour, minute, occurance ] = parseLine(event)

    R.cond([
      [R.equals('shift'), () => {
        [ , guard ] = occurance.match(/#(\d+)/);
        if (R.not(guards[guard])) {
          guards[guard] = { snoozing: 0, minutes: [], repeats: 0 }
        }
      }],
      [R.equals('asleep'), () => {
        doze = { month, day, hour, minute }
      }],
      [R.equals('up'), () => {
        guards[guard].snoozing += (minute - doze.minute)

        for (let zzz = +doze.minute; zzz < +minute; zzz++) {

          if (guards[guard].minutes[zzz] === undefined) guards[guard].minutes[zzz] = 0;
          guards[guard].minutes[zzz]++;

          if (guards[guard].minutes[zzz] > guards[guard].repeats)
            guards[guard].repeats = guards[guard].minutes[zzz];
        }
      }]
    ])(R.last(R.split(' ', occurance)))

  }, input.sort())

  const sleepiestGuard = Object.keys(guards).sort(
    (a, b) => guards[b].snoozing - guards[a].snoozing
  )[0]
  const snooziestMinuteA = guards[sleepiestGuard].minutes.reduce(
    (imax, minute, i, minutes) => minute > (minutes[imax] || -Infinity) ? i : imax, 0
  )

  const mostPredictableGuard = Object.keys(guards).sort(
    (a, b) => guards[b].repeats - guards[a].repeats
  )[0]
  const snooziestMinuteB = guards[mostPredictableGuard].minutes.reduce(
    (imax, minute, i, minutes) => minute > (minutes[imax] || -Infinity) ? i : imax, 0
  )

  return [
    {[`Part 1`]: sleepiestGuard * snooziestMinuteA},
    {[`Part 2`]: mostPredictableGuard * snooziestMinuteB}
  ]
}

const main = async () => {
  const buffer =  await readFile('./input.txt', 'utf8')
  const input = buffer.trim().split('\n')
  console.log(partOne(input))
}

main()
