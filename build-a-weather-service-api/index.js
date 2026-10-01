import express from "express"
import weatherRouter from "./weather.js"
import path from "path"
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json())

app.use('/api/weather', weatherRouter)

app.get("/api/info", (req, res) => {
  res.json({
    name: "Weather Service API",
    version: "1.0.0",
    endpoints: ["/api/weather/:city", "/api/greet/:name", "/api/data"],
  });
});

app.get('/', (req, res) => {
    res.send("Welcome to Weather service")
    res.sendFile("public/index.html")
})

app.get('/api/status', (req, res) => {
    res.status(200).json({ status: "Working successfully" })
})

app.get('/docs', (req, res) => {
    res.redirect('/api/info')
})

app.get('/api/greet/:name', (req, res) => {
    res.json({ greeting: `Hello, ${req.params.name}!` })
})


app.route('/api/data')
    .get((req, res) => {
        res.json({ message: "Here is some data" })
    })
    .post((req, res) => {
        res.status(201).json({ message: "Here is some data" })
    })

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

export default app