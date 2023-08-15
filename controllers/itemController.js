const Item = require("../models/item");
const ItemInstance = require('../models/iteminstance');
const Category = require('../models/category');

const asyncHandler = require("express-async-handler");
const {body, validateResult, validationResult} = require("express-validator");

exports.getItemList = asyncHandler(async (req,res,next)=>{
  const allItems = await Item.find().populate('category').exec();

  res.render("item_list", {
    title: "Item List",
    item_list: allItems
  });

});

exports.getItemDetails = asyncHandler(async (req,res,next)=>{
  const [item, itemInstances] = await Promise.all([
    Item.findById(req.params.id).populate('category').exec(),
    ItemInstance.find({item:req.params.id}).exec()
  ]);
  

  if(item === null){
    const err = new Err("item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_detail",{
    title: "Item Details : ",
    item: item,
    item_instances: itemInstances
  });
});

exports.getCreateItem = asyncHandler(async (req,res,next)=>{
  const allCategories = await Category.find().exec();

  if(allCategories === null){
    const err = new Error("no Categories found");
    err.status = 404;
    return next(err);
  }

  res.render("item_form",{
    title: "Create New Item",
    categories: allCategories,
    allUnits: ["LBS","NUMBER","KG"]
  });
});

exports.postCreateItem = [
  body('category',"Category must be specified").trim().isLength({min:2}).escape(),
  body('name',"name must be specified").trim().isLength({min:2,max:50}).escape(),
  body('description','Invalid description').trim().optional({values: "falsy"}).escape(),
  body('units', "invalid units").escape(),

  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      unit: req.body.units
    });

    if(!errors.isEmpty()){
      const allCategories = await Category.find().exec();

      res.render("item_form",{
        title: "Create New Item",
        categories: allCategories,
        allUnits: ["LBS","NUMBER","KG"]
      });
    }
    else{
      await item.save();
      res.redirect(item.url);
    }
  })
];

exports.getDeleteItem = asyncHandler(async (req,res,next)=>{
  const [item, itemInstances] = await Promise.all([
    Item.findById(req.params.id).populate("category").exec(),
    ItemInstance.find({item: req.params.id}, "_id amount arrivalDate useByDate").exec()
  ]) ;

  if(item ===null){
    res.redirect("/inventory/items");
  }
  res.render("item_delete",{
    title: "Delete Item",
    item: item,
    item_instances: itemInstances
  });
});

exports.postDeleteItem = asyncHandler(async (req,res,next)=>{
  await Item.findByIdAndRemove(req.body.itemid);
  res.redirect("/inventory/items");
});

exports.getUpdateItem = asyncHandler(async (req,res,next)=>{
  const [item, allCategories] = await Promise.all([
    Item.findById(req.params.id).populate("category").exec(),
    Category.find().exec()
  ]);

  if(item === null){
    const err = new Error("Item not found");
    err.status(404);
    return next(next);
  }

  console.log(item._id.toString());
  
  res.render("item_form",{
    title: "Update Item",
    item: item,
    selected_category: item.category._id,
    categories: allCategories,
    allUnits: ["LBS","NUMBER","KG"],
    selected_unit: item.unit
  });
});

exports.postUpdateItem = [
  body('category',"Category must be specified").trim().isLength({min:2}).escape(),
  body('name',"name must be specified").trim().isLength({min:2,max:50}).escape(),
  body('description','Invalid description').trim().optional({values: "falsy"}).escape(),
  body('units', "invalid units").escape(),

  asyncHandler(async (req,res,next) =>{
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      unit: req.body.units,
      description: req.body.description,
      _id: req.params.id
    });

    if(!errors.isEmpty()){
      const allCategories = await Category.find().exec();

      res.render("item_form",{
        title: "Update Item",
        item:item,
        selected_category: item.category._id,
        categories: allCategories,
        allUnits: ["LBS","NUMBER","KG"],
        selected_unit: item.unit
      });
      return;
    }
    else{
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item,{});
      res.redirect(updatedItem.url);;
    }
  })
];