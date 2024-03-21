const express = require("express");
const checkRole = require("../middleware/auth");
const router = express.Router();

// Rutas públicas
router.get("/", (req, res) => res.render("index"));
router.get("/shop", (req, res) => res.render("shop"));
router.get("/shop-cart", (req, res) => res.render("shop-cart"));
router.get("/blog", (req, res) => res.render("blog"));
router.get("/blog-details", (req, res) => res.render("blog-details"));
router.get("/login", (req, res) => res.render("login"));
router.get("/signup", (req, res) => res.render("signup"));
router.get("/contact", (req, res) => res.render("contact"));
router.get("/checkout", (req, res) => res.render("checkout"));
router.get("/details-products", (req, res) => res.render("details-product"));

// Rutas Usuario
router.get("/pedidoRealizado", checkRole(1 || 3), (req, res) => res.render("pedidoRealizado"));

// Rutas Administrador
router.get("/admin", checkRole(2), (req, res) => res.render("admin"));
router.get("/add-products", checkRole(2), (req, res) => res.render("add-product"));
router.get("/edit-product", checkRole(2), (req, res) => res.render("edit-product"));
router.get("/users", checkRole(2), (req, res) => res.render("users"));
router.get("/agregarUsuario", checkRole(2), (req, res) => res.render("agregarUsuario"));
router.get("/modificarUsuario", checkRole(2), (req, res) => res.render("modificarUsuario"));

// Rutas Repartidor
router.get("/repartidor", checkRole(3), (req, res) => res.render("repartidor"));
router.get("/envio", checkRole(3), (req, res) => res.render("envio"));
router.get("/pedido", checkRole(3), (req, res) => res.render("pedido"));
router.get("/pedidos", checkRole(3), (req, res) => res.render("pedidos"));
router.get("/detallePedido", checkRole(3,1), (req, res) => res.render("detallePedido"));

module.exports = router;
