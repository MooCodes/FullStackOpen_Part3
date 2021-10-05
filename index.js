const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json()) // for post requests parsing the json from body

morgan.token('body', (req, res) => JSON.stringify(req.body)) // store 'body' as a token ':body' in our output
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Phonebook App for Part 3</h1>')
})

app.get('/info', (req, res) => {
    const html = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
    res.send(html)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(p => p.id === Number(req.params.id))

    // did we find person?
    if (person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(p => p.id !== Number(req.params.id))

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    // check if name or # is missing
    if (!body.name || !body.number) {
        return res.status(404).json({ error: 'missing name or number' })
    }

    // check if duplicate entry
    if (persons.find(p => p.name === body.name)) {
        return res.status(404).json({ error: 'name must be unique' })
    }

    // create new entry
    let newPerson = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000) + 1
    }

    persons = persons.concat(newPerson)

    res.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})