const express = require("express");
const { response } = require("express");
const { request } = require("http");
const { randomUUID } = require("crypto");
const fs = require("fs");
const { use } = require("express/lib/application");
const cors = require("cors");

const app = express(); // chama o app para rodar

let users = [];

fs.readFile("users.json", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    users = JSON.parse(data);
  }
});
app.use(express.json());
app.use(cors());
//home =================================================================================================!
app.get("/", (request, response) => {
  return response.json(users);
});

// adicionar um usuario =================================================================================================!
app.post("/adduser", (request, response) => {
  const { name, password, email } = request.body;

  const user = {
    name,
    email,
    password,
    id: randomUUID(),
    links: [],
  };
  users.push(user);
  userFile();
  return response.json(users);
});

// login =================================================================================================!
app.post("/login", (request, response) => {
  const { email, password } = request.body;
  users.forEach((user) => {
    if (email == user.email) {
      console.log("usuario achado");

      if (password == user.password) {
        return response.json({ id: user.id });
      } else {
        return response.json({ message: "senha errada" });
      }
    }
  });

  return response.json({ message: "email não cadastrado" });
});

// editar um usuario =================================================================================================!
app.put("/edituser/:id", (request, response) => {
  const { id } = request.params;
  const { name, email } = request.body;
  const usersIndex = retPosition(id);

  users[usersIndex] = {
    ...users[usersIndex],
    name,
    email,
  };

  userFile();

  return response.json({ message: "usuario alterado" });
});

//adicionar um link =================================================================================================!
app.post("/addlink/:id", (request, response) => {
  const { longLink, shortLink } = request.body;
  const { id } = request.params;

  const position = users.findIndex((user) => user.id === id);

  let link = {
    id: Math.random(1000).toFixed(4),
    longLink,
    shortLink,
  };
  users[position].links.push(link);

  userFile();
  return response.json(link);
});

//obter um link =================================================================================================!
app.get("/getlink/:id/:idLink", (request, response) => {
  const { id, idLInk } = request.params;
  const position = users.findIndex((user) => user.id === id);

  return response.json(link);
});

//obter todos os links do usuario =================================================================================================!
app.get("/getlinks/:id", (request, response) => {
  const { id } = request.params;
  const position = users.findIndex((user) => user.id === id);
  const links = users[position].links;

  return response.json(links);
});

//deletar um link =================================================================================================!
app.delete("/deletelink/:id/:idLink", (request, response) => {
  const { id, idLink } = request.params;
  const position = users.findIndex((user) => user.id === id);
  const link = users[position].links.findIndex((link) => link.id == idLink);
  const links = users[position].links;
  links.splice(link, 1);
  return response.json({ message: "link deletado" });
});
//deletar um user =================================================================================================!
app.delete("/deleteuser/:id", (request, response) => {
  const { id } = request.params;

  const usersIndex = users.findIndex((user) => user.id === id);
  users.splice(usersIndex, 1);
  userFile();

  return response.json({ message: "usuario deletado" });
});

// mostrar um user pelo id =================================================================================================!
app.get("/user/:id", (request, response) => {
  const { id } = request.params;
  const user = users.find((user) => user.id === id);
  return response.json(user);
});

/* função que escreve no arquivo =================================================================================================!*/
function userFile() {
  fs.writeFile("users.json", JSON.stringify(users), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("gravado");
    }
  });
}

function retPosition(getId) {
  const position = users.findIndex((user) => user.id === getId);

  return position;
}

app.listen(4000, () => console.log("rodando na porta 4000")); //faz o app rodar na porta 4000
//localhost:4000

//rode com "npm run dev"
