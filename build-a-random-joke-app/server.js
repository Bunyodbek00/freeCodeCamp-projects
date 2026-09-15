const express = require('express')
const app = express()
const port = 3000
const path = require('path')

const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "There are only 10 kinds of people in the world: those who understand binary and those who don't",
  "I told my computer I needed a break, and it said \"No problem, I'll go to sleep.",
  "Why do Java developers wear glasses? Because they don't see sharp.",
  "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25.",
  "A SQL query walks into a bar, walks up to two tables and asks, \"Can I join you?\"",
  "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "Why did the programmer quit his job? Because he didn't get arrays.",
  "I would tell you a UDP joke, but you might not get it.",
  "Why do programmers hate nature? It has too many bugs.",
  "What's a programmer's favorite hangout place? Foo Bar.",
  "Why did the developer go broke? Because he used up all his cache.",
  "A programmer's wife tells him: \"Go to the store and get a loaf of bread. If they have eggs, get a dozen.\" He comes home with 12 loaves of bread.",
  "Why do programmers always confuse Christmas and Halloween? Because Dec 25 is Oct 31.",
]

app.use(express.static(path.join(__dirname, 'public')))


app.get('/joke', (req, res) => {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    const randomJoke = jokes[randomIndex];
    res.json({ joke: randomJoke });
})

app.get('/about', (req, res) => {
    res.json({ message: "This Random Joke Server was built with Express.js" });
})

app.listen(port, () => {
    console.log("Server is running on port 3000")
})



