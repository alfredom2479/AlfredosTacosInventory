const ItemInstance = require("../models/iteminstance");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const {body, validationResults} = require("express-validator");

exports.itemInstance_list = asyncHandler(async (req,res,next)=>{
    const allItemInstances = await ItemInstance
        .find()
        .populate("item")
        .exec();
    
    res.render("iteminstance_list",{
        title: "Item Instance List",
        itemInstance_list: allItemInstances
    });
});

//maybe in future (amount): 
//green - >50% full, red - < 10%, yellow - between