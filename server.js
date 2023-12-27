import express from 'express'
import { randomUUID } from 'node:crypto'

const app = express()

app.use(express.json())

const db = {
    Users: []
}

app.post('/users', (req, res) => {
    const { name, email } = req.body || {}

    if (!name) {
        return res.status(400).send({
            erro: "Campo 'name' é obrigatório"
        })
    }

    if (!email) {
        return res.status(400).send({
            erro: "Campo 'email' é obrigatório"
        })
    }

    const emailAlreadyExists = db.Users.some(user => user.email === email)

    if (emailAlreadyExists) {
        return res.status(409).send({
            error: 'Já existe um usuário cadastrado com o email informado'
        })
    }

    const user = {
        id: randomUUID(),
        name,
        email,
        createdAt: new Date().toISOString()
    }

    db.Users.push(user)

    return res.status(201).send(user)
})

app.get('/users', (req, res) => {
    return res.status(200).send(db.Users)
})

app.get('/users/:id', (req, res) => {
    const { id } = req.params

    const user = db.Users.find(user => user.id === id)

    if (!user) {
        return res.status(400).send({
            erro: "Usuário não encontrado com o id informado"
        })
    }

    return res.status(200).send(user)
})

app.put('/users/:id', (req, res) => {
    const { id } = req.params
    const { name, email } = req.body || {}

    const user = db.Users.find(user => user.id === id)

    if (!user) {
        return res.status(400).send({
            erro: "Usuário não encontrado com o id informado"
        })
    }

    if (!name) {
        return res.status(400).send({
            erro: "Campo 'name' é obrigatório"
        })
    }

    if (!email) {
        return res.status(400).send({
            erro: "Campo 'email' é obrigatório"
        })
    }

    const emailAlreadyExists = db.Users.some(user => user.email === email && user.id !== id)

    if (emailAlreadyExists) {
        return res.status(409).send({
            error: 'Já existe um usuário cadastrado com o email informado'
        })
    }

    const userIndex = db.Users.findIndex(user => user.id === id)

    const newUser = {
        id: user.id,
        name,
        email,
        createdAt: user.createdAt,
        updatedAt: new Date().toISOString()
    }

    db.Users.splice(userIndex, 1, newUser)

    return res.status(200).send(newUser)
})

app.delete('/users/:id', (req, res) => {
    const { id } = req.params

    const user = db.Users.find(user => user.id === id)

    if (!user) {
        return res.status(400).send({
            erro: "Usuário não encontrado com o id informado"
        })
    }

    const userIndex = db.Users.findIndex(user => user.id === id)

    db.Users.splice(userIndex, 1)

    return res.status(204).send()
})

app.listen(3000, () => console.log('Servidor rodando na porta 3000'))