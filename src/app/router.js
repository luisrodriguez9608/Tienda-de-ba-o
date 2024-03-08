const express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/shop", function (req, res, next) {
  res.render("shop");
});

router.get("/shop-cart", function (req, res, next) {
  res.render("shop-cart");
});

router.get("/blog", function (req, res, next) {
  res.render("blog");
});

router.get("/blog-details", function (req, res, next) {
  res.render("blog-details");
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/signup", function (req, res, next) {
  res.render("signup");
});

router.get("/admin", function (req, res, next) {
  res.render("admin");
});

router.get("/add-products", function (req, res, next) {
  res.render("add-product");
});

router.get("/edit-products", function (req, res, next) {
  res.render("edit-product");
});

router.get("/details-products", function (req, res, next) {
  res.render("details-product");
});
router.get("/contact", function (req, res, next) {
  res.render("contact");
});
router.get("/checkout", function (req, res, next) {
  res.render("checkout");
});
router.get("/users", function (req, res, next) {
  res.render("users");
});
router.get("/agregarUsuario", function (req, res, next) {
  res.render("agregarUsuario");
});
router.get("/modificarUsuario", function (req, res, next) {
  res.render("modificarUsuario");
});
router.get("/repartidor", function (req, res, next) {
  res.render("repartidor");
});
router.get("/envio", function (req, res, next) {
  res.render("envio");
});

module.exports = router;
