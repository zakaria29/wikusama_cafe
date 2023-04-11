/** load express library */
const express = require(`express`)
/** create object of express */
const app = express()

/** allow to read a request from body
 * with json format
 */
app.use(express.json())

/** load authorization func */
const { authorization } = require(`../controllers/auth.controller`)

/** load controller of user */
const userController = require(`../controllers/user.controller`)

/** create route for get all user */
app.get(`/user`, authorization(["admin", "petugas"]), userController.getUser)

/** create route for search user */
app.post(`/user/find`, authorization(["admin", "petugas"]), userController.findUser)

/** create route for add user */
app.post(`/user`, authorization(["admin", "petugas"]), userController.addUser)

/** create route for edit user */
app.put(`/user/:id_user`, authorization(["admin", "petugas"]), userController.updateUser)

/** create route for delete user */
app.delete(`/user/:id_user`, authorization(["admin", "petugas"]), userController.deleteUser)

/** export app object */
module.exports = app

