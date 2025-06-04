**cohortJS**
_A minimal, modern HTTP routing framework for Node.js_

---

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)

  - [Core Library (root/index.js)](#core-library-rootindexjs)
  - [Sample Application (sampleApp/index.js)](#sample-application-sampleappindexjs)

- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Description

**cohortJS** is a lightweight Node.js routing framework—think of it as a toy‐version of Express. It lets you register HTTP handlers for **GET**, **POST**, **PUT**, and **DELETE** endpoints and start a server with a single `.listen(...)` call. This repository contains:

1. **Root index.js** – the core cohortJS library, which exports a `createApp` class to register routes and spin up an HTTP server.
2. **sampleApp** – a minimal demonstration that shows how to consume cohortJS in a real app.

The goal is to keep things simple, clear, and easy to extend. Whether you want to experiment with routing internals or demonstrate teaching material, cohortJS provides a very small footprint (just under 100 lines) to handle requests, route matching, and basic 404/500 responses.

---

## Features

- **Simple routing API** for GET, POST, PUT, DELETE
- **Exact‐match path checking** (e.g., `/users`, `/login`)
- Built-in **404** handling for unmatched routes
- Built-in **500** handling for synchronous errors
- No external dependencies (100% vanilla Node.js)
- Easy to read, easy to extend

---

## Prerequisites

- **Node.js** v14+ (or any modern LTS that supports ES modules)
- Basic familiarity with JavaScript and HTTP

---

## Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/<your-username>/cohortjs.git
   cd cohortjs
   ```

2. **Install dependencies**
   cohortJS itself has no external dependencies. However, if you want to run the sampleApp, navigate into the `sampleApp` folder and install its (empty) dependencies:

   ```bash
   cd sampleApp
   npm install
   ```

> **Note:** Both `package.json` files in the root and in `sampleApp/` should have `"type": "module"` so that the `import` syntax works correctly.

---

## Usage

### Core Library (root/index.js)

1. **Import** the `createApp` class from the root directory:

   ```js
   import createApp from "./index.js";
   ```

2. **Instantiate** your app:

   ```js
   const app = new createApp();
   ```

3. **Register** routes:

   ```js
   app.get("/hello", (req, res) => {
     res.end("Hello, world!");
   });

   app.post("/submit", (req, res) => {
     res.end("Data received!");
   });

   app.put("/update", (req, res) => {
     res.end("Updated successfully.");
   });

   app.delete("/remove", (req, res) => {
     res.end("Removed item.");
   });
   ```

4. **Start** the HTTP server:

   ```js
   app.listen(3000, () => {
     console.log("cohortJS running on port 3000");
   });
   ```

Once you invoke `listen(port)`, cohortJS will:

- Inspect `req.method` and `req.url`
- Try to match an exact path from your registered routes
- Call the corresponding callback if there’s a match
- Return a **404** if no matching route is found
- Return a **500** if your handler throws synchronously

### Sample Application (sampleApp/index.js)

A fully working example is provided under `sampleApp/`. To run it:

1. **Navigate** into the sample folder:

   ```bash
   cd sampleApp
   ```

2. **Start** the sample app:

   ```bash
   node index.js
   ```

3. **Test** the endpoints in your browser or with `curl`:

   - `GET http://localhost:8000/` → returns an HTML welcome message
   - `POST http://localhost:8000/register` → returns “User registered successfully”
   - Any other path or method → 404 “cannot found!”

The code in `sampleApp/index.js` looks like this:

```js
import createApp from "../index.js";

const app = new createApp();

app.get("/", (req, res) => {
  console.log("Inside the /");
  res.end("<h1>Welcome to the home page</h1>");
});

app.post("/register", (req, res) => {
  res.end("User registered successfully");
});

app.listen(8000);
```

---

## API Reference

#### `new createApp()`

Instantiates the routing engine. Maintains an internal `this.routes` object keyed by HTTP method (`GET`, `POST`, `PUT`, `DELETE`).

#### `.get(path: string, callback: (req, res) => void)`

Registers a handler for **GET** requests to the exact `path`.

- `path` must match `req.url` exactly.
- `callback` is invoked as `(req, res)`.

#### `.post(path: string, callback: (req, res) => void)`

Registers a handler for **POST** requests to `path`.

#### `.put(path: string, callback: (req, res) => void)`

Registers a handler for **PUT** requests to `path`.

#### `.delete(path: string, callback: (req, res) => void)`

Registers a handler for **DELETE** requests to `path`.

#### `.listen(port: number, [callback?: () => void])`

Starts an `http.Server` on the specified `port`. For each incoming request:

1. Checks `req.method` against `this.routes` keys.
2. Loops through the array of route objects for that method.
3. If a route’s `path` exactly matches `req.url`, calls its `callback(req, res)`.
4. If no match is found, sets `res.statusCode = 404` and ends with a “cannot found!” message.
5. If an invalid HTTP method (anything other than GET/POST/PUT/DELETE) is used, responds with `400 Invalid request method`.
6. If a handler throws an error, responds with `500 Internal Server Error`.

---

## Project Structure

```
cohortjs/
├── index.js            # Core library (exposes `createApp`)
├── package.json        # Defines `"type": "module"` and any root metadata
└── sampleApp/
    ├── index.js        # Sample application demonstrating usage
    └── package.json    # “type”: “module” for ESM imports
```

- **`index.js` (root):**

  - Implements a `createApp` class to collect routes in `this.routes`.
  - Provides `.get()`, `.post()`, `.put()`, `.delete()`, and `.listen()` methods.

- **`sampleApp/index.js`:**

  - Imports `createApp` from the parent directory.
  - Registers two routes (`/` for GET and `/register` for POST).
  - Calls `app.listen(8000)` to start the server.

---

## Contributing

We welcome contributions! To help make cohortJS better:

1. **Fork** this repository.
2. **Create** a new feature branch:

   ```bash
   git checkout -b feature/my-cool-feature
   ```

3. **Make** your changes, then **commit**:

   ```bash
   git commit -m "feat: add new routing helper"
   ```

4. **Push** your branch to GitHub:

   ```bash
   git push origin feature/my-cool-feature
   ```

5. **Open** a Pull Request against the `main` branch here. Describe:

   - What you changed
   - Why it’s valuable
   - Any backwards-incompatible considerations (if applicable)

### Guidelines

- Keep each pull request focused (one feature or one bug fix).
- Include tests or sample code when adding new functionality.
- Follow consistent code style:

  - Use **ES modules** (`import` / `export`).
  - Stick to **2-space indentation**.
  - Place route‐matching logic inside `listen()`; avoid side effects outside handler scope.

We’ll review your PR as soon as possible. Thank you for helping improve cohortJS!

---

## License

This project is released under the **MIT License**. See [LICENSE](LICENSE) for details.

---

> **Author / Maintainer**
> Created by \[Your Name] – feel free to open an issue or submit a PR if you spot bugs or want to propose new features.

Happy coding! 🙌
