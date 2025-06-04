import createApp from "../index.js";

const app = new createApp();

app.get("/", (req, res) => {
  console.log("Inside the /");
  res.end("<h1>Welcome to the home page</h1>");
});

app.get("/about", (req, res) => {
  res.end("<h1>this is the about page</h1>");
});

app.post("/register", (req, res) => {
  res.end("User registered successfully");
});

app.listen(8000);
