const express = require("express"); //importation d' Express
const router = express.Router(); //Importation du router Express

const sauceCtrl = require("../controllers/controllers_sauce"); //Importation du controleur de sauce
const auth = require("../middleware/authorization"); //Importation du middleware d'authentification
const multer = require("../middleware/multer-configuration"); //Importation de multer

router.post("/", auth, multer, sauceCtrl.createSauce);
router.post("/:id/like", auth, multer, sauceCtrl.likeSauce);
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.get("/", auth, sauceCtrl.getAllSauces);

module.exports = router;