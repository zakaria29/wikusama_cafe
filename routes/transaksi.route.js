/** load express library */
const express = require(`express`)
const app = express()

/** load authorization func */
const { authorization } = require(`../controllers/auth.controller`)

/** load controller of transaksi */
const transaksiController = require(`../controllers/transaksi.controller`)

/** allow to read json on body request */
app.use(express.json())

/** create route to get all transaksi */
app.get(`/transaksi`, authorization(["admin", "petugas"]), transaksiController.getTransaksi)

/** create route to add transaksi */
app.post(`/transaksi`, authorization(["admin", "petugas"]), transaksiController.addTransaksi)

/** create route to edit transaksi */
app.put(`/transaksi/:id_transaksi`, authorization(["admin", "petugas"]), transaksiController.updateTransaksi)

/** creae route to delete transaksi */
app.delete(`/transaksi/:id_transaksi`, authorization(["admin", "petugas"]), transaksiController.deleteTransaksi)

/** export app */
module.exports = app



