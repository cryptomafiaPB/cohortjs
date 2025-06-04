import http from "http";

class createApp {
  constructor() {
    this.routes = {
      GET: [],
      POST: [],
      DELETE: [],
      PUT: [],
    };
  }

  // Routing methods

  get(path, callback) {
    this.routes.GET.push({ path, callback });
  }

  post(path, callback) {
    this.routes.POST.push({ path, callback });
  }

  delete(path, callback) {
    this.routes.DELETE.push({ path, callback });
  }

  put(path, callback) {
    this.routes.PUT.push({ path, callback });
  }

  //   Internal methods

  listen(port, callback) {
    const server = http.createServer((req, res) => {
      const method = req.method;
      const path = req.url;

      const getRoutesByMethod = this.routes[method] || [];

      const handler = getRoutesByMethod.find((route) => route.path === path);

      if (handler) {
        try {
          handler.callback(req, res);
        } catch (error) {
          res.statusCode = 500;
          res.end("Internal Server Error", error);
        }
      } else if (getRoutesByMethod.length > 0) {
        // Valid method but invalid path/route
        res.statusCode = 404;
        res.end(`${path} cannot found!`);
      } else {
        res.statusCode = 400;
        res.end("Invalid request method");
      }
    });

    server.listen(port, () => {
      if (callback) {
        callback();
      } else {
        console.log(`Listening on port ${port}`);
      }
    });
  }
}

export default createApp;
