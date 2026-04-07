const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]


const url = `mongodb://fullstackopen:${password}@ac-bbm1fo4-shard-00-00.ddtbaco.mongodb.net:27017,ac-bbm1fo4-shard-00-01.ddtbaco.mongodb.net:27017,ac-bbm1fo4-shard-00-02.ddtbaco.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-oqopmp-shard-0&authSource=admin&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Please provide both name and number to add, or just the password to list')
  process.exit(1)
}
