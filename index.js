const express = require('express');
const app = express();
const morgan = require('morgan');


let persons =[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
app.use(morgan(':method :url :status :body - :response-time ms'))
app.use(express.static('dist'));

app.get('/', (request, response) => {
    response.send('<h1>hello world!!</h1>');
})

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/info', (request, response) => {
    const requestTime = new Date()
    const info = `<p>PhoneBook has ${persons.length} people</p>`;
    response.send([info, requestTime].join('\n'))
})

app.get('/api/persons/:id', (request, response) => { 
    const id = request.params.id;
    const result = persons.find((person) => person.id === id);

    if (result) {
        response.send(result)
    } else {
        response.status(404)
        response.send('id not found!!')
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);
    response.status(304).end();
})

app.post('/api/persons', (request, response)=> {
    const id = `${Date.now() % 100000}`;
    const body = request.body;

    if (!body.name || !body.number) {
        const missing = `${(!body.name && 'name') || (!body.number && 'number')}`;
        return response.status(400).json({
            error: `missing: ${missing}`
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: "duplicate entry"
    })
    }

    const person = {
        id: id,
        name: body.name,
        number: body.number
    };



    persons = persons.concat(person);
    response.send(persons)

} )

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Running on port: ${PORT}`))
