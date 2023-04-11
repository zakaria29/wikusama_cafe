const express = require(`express`)
const app = express()

/** load authorization func */
const { authorization } = require(`../controllers/auth.controller`)

/** load controller of menu */
const menuController = require(`../controllers/menu.controller`)

/** create route for add menu */
app.post(`/menu`, authorization(["admin", "petugas"]), menuController.addMenu)

/** create route for get all menu */
app.get(`/menu`, authorization(["admin", "petugas"]), menuController.getMenu)

/** create route for search menu */
app.post(`/menu/find`, authorization(["admin", "petugas"]), menuController.findMenu)

/** create route for edit menu */
app.put(`/menu/:id_menu`, authorization(["admin", "petugas"]), menuController.updateMenu)

/** create route for delete menu */
app.delete(`/menu/:id_menu`, authorization(["admin", "petugas"]), menuController.deleteMenu)

/** export app */
module.exports = app




