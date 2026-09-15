const contentDiv = document.getElementById("content");
const jokeBtn = document.getElementById("joke-btn");
const aboutBtn = document.getElementById("about-btn");

jokeBtn.addEventListener("click", async () => {
  const response = await fetch("/joke");
  const data = await response.json();
  contentDiv.textContent = data.joke;
});

aboutBtn.addEventListener("click", async () => {
  const response = await fetch("/about");
  const data = await response.json();
  contentDiv.textContent = data.message;
});