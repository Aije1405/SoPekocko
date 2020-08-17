//Schéma de données strict des users
const mongoose = require ("mongoose"); //Importation de mongoose pour utilisation de la méthode schéma

const uniqueValidator = require("mongoose-unique-validator");//Plugin qui permet de s'assurer que deux utilisateurs ne peuvent avoir la même adresse email

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true },
});

userSchema.plugin(uniqueValidator); //application de unique validator au schema user

module.exports = mongoose.model("User", userSchema); //exportation du schéma 