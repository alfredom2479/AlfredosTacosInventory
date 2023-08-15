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
router.post("/item/create", itemController.postCreateItem);

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

/*
// GET request for creating a category
router.get("/category/create", categoryController.getCreateCategory);

// POST reqest for creating a category
router.post("/category/create", categoryController.postCreateCategory);

// GET request for deleting a category
router.get("/category/:id/delete", categoryController.getDeleteCategory);

// POST request for deleing a category
router.post("/category/:id/delete", categoryController.postDeleteCategory);

// GET request for updating a category
router.get("/category/:id/update", categoryController.getUpdateCategory);

// POST request for updating a category
router.post("/category/:id/update",categoryController.postUpdateCategory);

// GET request for single Category details
router.get("/category/:id", categoryController.getCategoryDetails);

// GET request for list of all categories
router.get("/categories", categoryController.getCategoryList);

*/
/// ITEM INSTANCE ROUTES ///

// GET request for creating an ItemInstance
router.get("/iteminstance/create", itemInstanceController.getCreateItemInstance);

// POST request for creating an ItemInstance
router.post("/iteminstance/create", itemInstanceController.postCreateItemInstance);
//router.post("/iteminstance/create",()=>console.log('test'));

// GET request for deleting an ItemInstance
router.get("/iteminstance/:id/delete", itemInstanceController.getDeleteItemInstance);

// POST request for deleting an ItemInstance
router.post("/iteminstance/:id/delete", itemInstanceController.postDeleteItemInstance);

// GET request for updating an ItemInstance
router.get("/iteminstance/:id/update", itemInstanceController.getUpdateItemInstance);

// POST request for updatin an ItemInstance
router.post("/iteminstance/:id/update", itemInstanceController.postUpdateItemInstance);

// GET request for details for a single ItemInstnace
router.get("/iteminstance/:id", itemInstanceController.getItemInstanceDetails);
// GET request for list of all ItemInstances
router.get("/iteminstances", itemInstanceController.getItemInstanceList);

module.exports = router;