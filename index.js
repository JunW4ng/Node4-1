const http = require("http");
const fs = require("fs");
const url = require("url");

http
  .createServer((req, res) => {
    //? LEVANTA HTML
    if (req.url == "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      fs.readFile("index.html", "utf8", (err, registro) => {
        res.end(registro);
      });
    }

    //? MOSTRAR DATA
    if (req.url.startsWith("/deportes")) {
      const data = fs.readFileSync("Deportes.json", "utf8");
      res.end(data);
    }

    //? AGREGAR DATA
    if (req.url.startsWith("/agregar")) {
      const { nombre, precio } = url.parse(req.url, true).query;
      const data = JSON.parse(fs.readFileSync("Deportes.json", "utf8"));
      const deportes = data.deportes;
      const deporte = {
        nombre,
        precio,
      };
      deportes.push(deporte);

      fs.writeFileSync("Deportes.json", JSON.stringify(data));
      res.end("Guardado con exito!");
    }

    //? EDITAR DATA
    if (req.url.startsWith("/editar")) {
      const { nombre, precio } = url.parse(req.url, true).query;
      const data = JSON.parse(fs.readFileSync("Deportes.json", "utf8"));
      const deportes = data.deportes;

      const deporteEditado = deportes.map((sport) => {
        if (sport.nombre == nombre) {
          return { nombre, precio };
        }
        return sport;
      });

      data.deportes = deporteEditado;

      fs.writeFileSync("Deportes.json", JSON.stringify(data));
      res.end("Editado con exito");
    }

    //? ELIMINAR DATA
    if (req.url.startsWith("/eliminar")) {
      const { nombre } = url.parse(req.url, true).query;
      const data = JSON.parse(fs.readFileSync("Deportes.json", "utf8"));
      const deportes = data.deportes;

      const deporteFilter = deportes.filter((sport) => sport.nombre !== nombre);

      data.deportes = deporteFilter;

      fs.writeFileSync("Deportes.json", JSON.stringify(data));
      res.end("Deporte eliminado exitosamente");
    }
  })
  .listen(3000, () => console.log("SERVER ON :)"));
