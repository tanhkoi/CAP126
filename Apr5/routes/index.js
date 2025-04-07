var express = require("express");
var router = express.Router();
const Category = require("../schemas/category");
const Product = require("../schemas/product");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/api/:categoryslug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.categoryslug });
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/:categoryslug/:productslug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.categoryslug });
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const product = await Product.findOne({
      slug: req.params.productslug,
      category: category._id,
    });

    if (!product)
      return res.status(404).json({ message: "Product not found in category" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
