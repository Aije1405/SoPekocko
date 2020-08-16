const http = require("http"); //Importation du package http 
const app = require("./app"); //Importation de app pour utilisation de l'application sur le serveur

const normalizePort = (val) => { //la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000"); //Utilisation par défaut du port 3000
app.set("port", port);

const errorHandler = (error) => { // Recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur ;
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); // création du serveur qui utilise app

server.on("error", errorHandler);
server.on("listening", () => { //un écouteur d'évènements consignant le port nommé sur lequel le serveur s'exécute dans la console.
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port); //Le serveur écoute le prt définit plus hautconst http = require("http"); //Importation du package http 



