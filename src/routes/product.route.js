const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/product.controller');


router.get("/", productCtrl.getAll);

router.post("/create", productCtrl.createProduct);

router.put("/edit", productCtrl.updateProduct);

router.delete("/delete", productCtrl.deleteProduct);


module.exports = router;