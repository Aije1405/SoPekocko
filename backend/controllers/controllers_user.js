const bcrypt = require("bcrypt"); //Plugin pour hasher les passwords
const jwt = require("jsonwebtoken"); //Plugin pour sécuriser la connection avec des tokens uniques
const passwordValidator = require("password-validator"); //Package qui permet de compléxifier un mot de passe

const User = require("../models/models_user"); //Importation du model User

var schema = new passwordValidator();

schema
  .is().min(8) // Minimum 8 caractères
  .is().max(12) // Maximum 12 caractères
  .has().uppercase() // Le mot de passe doit avoir des majuscules
  .has().lowercase() // Le mot de passe doit avoir des minuscules
  .has().digits() // Le mot de passe doit avoir des chiffres
  .has().not().spaces(); // Le mot de passe ne doit pas avoir d'espace

//Création d'un compte
exports.signup = (request, response, next) => {
  if (!schema.validate(request.body.password)) {
    //Test du format du mot de passe
    return response.status(400).json({ error: "Merci de bien vouloir entrer un mot de passe valide !" });
  } else if (schema.validate(request.body.password)) {
    bcrypt.hash(request.body.password, 10) //Salage du mot de passe à 10 reprises
      .then((hash) => {
        const user = new User({
          email: request.body.email,
          password: hash,
        });
        user.save()
          .then(() => response.status(201).json({ message: "Utilisateur créé!" }))
          .catch((error) => response.status(400).json({ error }));
      })
      .catch((error) => response.status(500).json({ error }));
  }
};

//Connection à un compte existant
exports.login = (request, response, next) => {
  User.findOne({ email: request.body.email })
    .then((user) => {
      if (!user) {
        return response.status(404).json({ error: "Utilisateur non trouvé" });
      }
      bcrypt.compare(request.body.password, user.password) //compare le password soumis avec le password de la base de données
        .then((valid) => {
          if (!valid) {
            return response.status(401).json({ error: "Mot de passe incorrect" });
          }
          response.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", //génération d'un token pour 24h - payload = user id
            { expiresIn: "24h" }
            )
          });
        })
        .catch((error) => response.status(500).json({ error }));
    })
    .catch((error) => response.status(500).json({ error }));
};