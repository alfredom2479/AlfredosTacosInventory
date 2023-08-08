const express = require('express');
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");
const itemInstanceController = require("../controllers/itemInstanceController");

/// ITEM ROUTES ///

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Inventory page' });
});

// GET request for creating an Item.
router.get("/item/create", itemController.getCreateItem);

// POST request for cresating Item
router.post("/item/cresate", itemController.postCreateItem);

// GET request to delete Item
router.get("/item/:id/delete", itemController.getDeleteItem);

// POST request to delete Item
router.post("/item/:id/delete", itemController.postDeleteItem);

// GET request to update Item 
router.get("/item/:id/update", itemController.getUpdateItem);

// POST request to update Item
router.post("/item/:id/update", itemController.postUpdateItem);

// GET request for single item details
router.get("/item/:id", itemController.getItemDetails);

// GET request for list of all Items
router.get("/items", itemController.getItemList);

/// CATEGORY ROUTES ///

// GET request for creating a category
router.get("/category/create", categoryController.getCreateCategory);

// POST reqest for creating a category
router.post("/category/create", categoryController.postCreateCategory);

// GET request for deleting a category
router.get("/category/:id/delete", categoryController.getDeleteCategory);

// POST request for deleing a category
router.post("/category/:id/delete", categoryController.postDeleteCategory);

// GET request for updating a category


module.exports = router;