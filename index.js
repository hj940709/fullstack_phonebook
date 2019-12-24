const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
app.use(express.static('build'))

app.use(cors())
app.use(bodyParser.json())
morgan.token('req-body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

let persons = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
    },
    { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
    },
    { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
    },
    { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info of ${persons.length} people</p><p>${new Date()}</p`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (req, res) => {
    let newPerson = req.body
    if(typeof newPerson.name === 'undefined')
        res.status(400).json({error: 'Name is missing'})
    else if(typeof newPerson.number === 'undefined')
        res.status(400).json({error: 'Number is missing'})
    else if(persons.filter(person => person.name===newPerson.name).length)
        res.status(400).json({error: 'Name must be unique'})
    else{
        newPerson.id = Math.ceil(4+ 100* Math.random())
        persons = persons.concat(newPerson)
        res.json({message: 'Done'})
    }
    
})


app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const filtered = persons.filter(person => person.id===id)
    if(filtered.length)
        res.json(filtered[0])
    else res.status(404).json({message: 'Not found'})
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id!==id)
    res.json({message:'Done'})
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)