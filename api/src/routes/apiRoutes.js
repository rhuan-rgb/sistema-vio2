const router = require('express').Router()

const userController = require("../controllers/userController")
const organizadorController = require("../controllers/organizadorController")

router.post('/user', userController.createUser);
router.get('/user', userController.getAllUsers);
router.put('/user', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

router.post('/organizador', organizadorController.createOrganizador);
router.get('/organizador', organizadorController.getAllOrganizador);
router.put('/organizador', organizadorController.updateOrganizador);
router.delete('/organizador/:id', organizadorController.deleteOrganizador);

module.exports = router