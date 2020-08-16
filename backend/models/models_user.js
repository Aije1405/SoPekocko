//Schéma de données strict des users
const mongoose = require ("mongoose"); //Importation de mongoose pour utilisation de la méthode schéma

const uniqueValidator = require("mongoose-unique-validator");//Plugin qui permet de s'assurer que deux utilisateurs ne peuvent partager la même adresse email

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true },
});

userSchema.plugin(uniqueValidator); 

module.exports = mongoose.model("User", userSchema); //exportation du schéma en tant que modèle pour le rendre disponible sur l'application