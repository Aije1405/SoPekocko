const express = require("express"); //importation d'express 
const bodyParser = require("body-parser"); //Permet d'extraire l'objet JSON des requêtes POST
const mongoose = require("mongoose"); // Plugin Mongoose pour se connecter à la data base MongoDb
const path = require("path"); // Plugin upload des images 
const helmet = require("helmet"); // Plugin protection en-têtes HTTP: protection contre les attaques de type cross-site scripting les, injections intersites, le reniflage, le clickjacking...

const sauceRoutes = require("./routes/routes_sauce"); //Déclaration de la route sauce
const userRoutes = require("./routes/routes_user"); //Déclaration de la route user

//Connection à la base de données 
mongoose.connect("mongodb+srv://Julie-1405:Maman-2020@cluster0.hxzko.mongodb.net/Cluster0?retryWrites=true&w=majority", 
    { useNewUrlParser: true, useUnifiedTopology: true }) 
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express(); //L'application utilise le framework express

//headers
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*"); // accéder à l'API depuis toutes origines (pb CORS)
  response.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"); //Tous les headers de requêtes autorisés vers l'API
  response.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, PATCH, OPTIONS"); //Toutes les méthodes de requêtes autorisées
  next();
});

app.use (helmet()); // L'application utilise toutes les protections helmet
app.use(bodyParser.json()); // L'application utilise bodyparser

app.use("/images", express.static(path.join(__dirname, "images"))); //L'application utilise des images

app.use("/api/auth", userRoutes); //L'application utilise la route des users
app.use("/api/sauces", sauceRoutes); //L'application utilise la route des sauces

module.exports = app; //Export de app pour déclaration dans server.js