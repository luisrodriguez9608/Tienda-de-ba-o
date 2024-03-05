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

module.exports = router;
