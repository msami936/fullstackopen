const asArray = (persons) => (Array.isArray(persons) ? persons : [])

const findNameWithId = (id, persons) => (
  asArray(persons).find((person) => person.id === id)?.name
)

const findNameWithNumber = (number, persons) => (
  asArray(persons).find((person) => person.number === number)?.name
)

const findIdWithName = (name, persons) => (
  asArray(persons).find((person) => person.name.toLowerCase() === name.toLowerCase())?.id
)

const matchName = (persons, name) => (
  asArray(persons).find((person) => person.name.toLowerCase() === name.toLowerCase())
)

const matchNumber = (persons, number) => (
  asArray(persons).find((person) => person.number === number)
)
  
  
const findService = {
  findNameWithId,
  findNameWithNumber,
  findIdWithName,
  matchNumber,
  matchName
}

export default findService
  