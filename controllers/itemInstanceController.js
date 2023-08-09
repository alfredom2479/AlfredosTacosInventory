const ItemInstance = require("../models/iteminstance");
const Item = require("../models/item");

const asyncHandler = require("express-async-handler");

const {body, validationResults} = require("express-validator");

exports.getItemInstanceList = asyncHandler(async (req,res,next)=>{
    const allItemInstances = await ItemInstance
        .find()
        .populate("item")
        .exec();
    
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
    })
    
})

//maybe in future (amount): 
//green - >50% full, red - < 10%, yellow - between