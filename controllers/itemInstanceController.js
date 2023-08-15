const ItemInstance = require("../models/iteminstance");
const Item = require("../models/item");

const asyncHandler = require("express-async-handler");

const {body, validationResult} = require("express-validator");

exports.getItemInstanceList = asyncHandler(async (req,res,next)=>{
    const allItemInstances = await ItemInstance
        .find()
        .populate("item")
        .exec();

    console.log(allItemInstances);
    
    res.render("iteminstance_list",{
        title: "Item Instance List",
        itemInstance_list: allItemInstances
    });
});

exports.getItemInstanceDetails = asyncHandler(async (req,res,next) =>{
    const itemInstance = await ItemInstance
        .findById(req.params.id)
        .populate("item")
        .exec();
    
    if (itemInstance == null){
        const err = new Error("Item Instance not found");
        err.status = 404;
        return next(err);
    }
    
    res.render("iteminstance_detail",{
        title: "Item Instance : ",
        iteminstance: itemInstance
    });
});

exports.getCreateItemInstance = asyncHandler(async (req,res,next)=>{
    const allItems = await Item.find({},"name").exec();

    res.render("iteminstance_form", {
        title: "Create Item Instance",
        item_list: allItems
    });
});

exports.postCreateItemInstance = [
  body("item", "Item must be specified").trim().isLength({min:1}).escape(),
  body("arrival_date", "Invalid date")
    .optional({values: "falsy"})
    .isISO8601()
    .toDate(),
  body("useby_date", "Invalid date")
    .optional({values: "falsy"})
    .isISO8601()
    .toDate(),
  body("amount")
    .isNumeric(),

  asyncHandler(async (req,res,next) =>{
    const errors = validationResult(req);

    const itemInstance = new ItemInstance({
      item: req.body.item,
      amount: req.body.amount,
      arrivalDate: req.body.arrival_date,
      useByDate: req.body.useby_date,
      notes: req.body.notes
    });

    if(!errors.isEmpty()){
      const allItems = await Item.find({}, "name").exec();

      res.render("iteminstance_form",{
        title: "Create Item Instance",
        item_list: allItems,
        slected_item: itemInstance.item._id,
        erros: errors.array(),
        iteminstance: itemInstance
      });
      return;
    }
    else{
      await itemInstance.save();
      res.redirect(itemInstance.url);
    }
  })
];

exports.getDeleteItemInstance = asyncHandler(async (req,res,next)=>{
  const itemInstance = await ItemInstance.findById(req.params.id).populate("item").exec();

  if( itemInstance === null){
    res.redirect("/inventory/iteminstances");
  }

  res.render("iteminstance_delete",{
    title: "Delete Item Instance",
    iteminstance: itemInstance
  });

});

exports.postDeleteItemInstance = asyncHandler(async (req,res,next)=>{
  await ItemInstance.findByIdAndRemove(req.body.iteminstanceid);
  res.redirect("/inventory/iteminstances");
});

exports.getUpdateItemInstance = asyncHandler(async (req,res,next)=>{
  const [itemInstance, allItems] = await Promise.all([
    ItemInstance.findById(req.params.id).populate("item").exec(),
    Item.find({}).exec()
  ]);

  if(itemInstance === null){
    const err = new Error("Item Instance not found");
    err.status = 404;
    return next(err);
  }

  res.render("iteminstance_form",{
    title: "Update Item Instance",
    iteminstance: itemInstance,
    selected_item: itemInstance.item._id,
    item_list: allItems
  });

});

exports.postUpdateItemInstance = [
  body("item", "Item must be specified").trim().isLength({min:1}).escape(),
  body("arrival_date", "Invalid date")
    .optional({values: "falsy"})
    .isISO8601()
    .toDate(),
  body("useby_date", "Invalid date")
    .optional({values: "falsy"})
    .isISO8601()
    .toDate(),
  body("amount")
    .isNumeric(),
  
  asyncHandler(async (req,res,next) =>{
    const errors = validationResult(req);

    const itemInstance = new ItemInstance({
      name: req.body.name,
      item: req.body.item,
      amount: req.body.amount,
      arrivalDate: req.body.arrival_date,
      useByDate: req.body.useby_date,
      notes: req.body.notes,
      _id: req.params.id
    });

    if(!errors.isEmpty()){
      const allItems = await Item.find({}).exec();

      res.render("iteminstance_form",{
        title: "Update Item Instance",
        item_list, allItems,
        selected_item: itemInstance.item._id,
        errors: errors.array(),
        iteminstance: itemInstance
      });
      return;
    }
    else{
      const updatedItemInstance = await ItemInstance.findByIdAndUpdate(req.params.id, itemInstance,{});
      res.redirect(updatedItemInstance.url);
    }
  })

]

//maybe in future (amount): 
//green - >50% full, red - < 10%, yellow - between