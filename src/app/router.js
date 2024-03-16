const express = require("express");
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

// Rutas protegidas
router.get("/admin", (req, res) => res.render("admin"));
router.get("/add-products", (req, res) => res.render("add-product"));
router.get("/edit-product", (req, res) => res.render("edit-product"));
router.get("/users", (req, res) => res.render("users"));
router.get("/agregarUsuario", (req, res) => res.render("agregarUsuario"));
router.get("/modificarUsuario", (req, res) => res.render("modificarUsuario"));
router.get("/repartidor", (req, res) => res.render("repartidor"));
router.get("/envio", (req, res) => res.render("envio"));
router.get("/pedido", (req, res) => res.render("pedido"));
router.get("/pedidos", (req, res) => res.render("pedidos"));
router.get("/pedidoRealizado", (req, res) => res.render("pedidoRealizado"));
router.get("/detallePedido", (req, res) => res.render("detallePedido"));

module.exports = router;
