import express from "express"
import { inputCleaner, inputValidator } from "./middleware.js"
import path from "path"

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.redirect('/form')
})

app.get('/form', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'))
})

app.post('/submit', inputCleaner, inputValidator, (req, res) =>{
    const successMsg = `Username: ${req.body.username}, Comment: ${req.body.comment}`
    res.redirect(`/form?success=${encodeURIComponent(successMsg)}`)
})

app.listen(3000, () => {
    console.log("http://localhost:3000")
})