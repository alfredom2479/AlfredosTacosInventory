const Category = require("../models/category");
const Item = require("../models/item");

const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");

exports.getCategoryList = asyncHandler(async (req,res,next)=>{
  const allCategories = await Category.find().exec();

  res.render("category_list",{
    title: "Category List",
    category_list: allCategories
  });
});

exports.getCategoryDetails = asyncHandler(async (req,res,next)=>{
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({category: req.params.id}).exec()
  ]);

  if(category === null){
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail",{
    title: "Category Details : ",
    category: category,
    items: items
  });
});

exports.getCreateCategory = asyncHandler(async (req,res,next)=>{
  res.render("category_form",{
    title: "Create Category"
  });
});

exports.postCreateCategory = [
  body("name","name must be specified").trim().isLength({min:2, max:50}).escape(),
  body("description","description must be specified").escape(),

  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description
    });

    if(!errors.isEmpty()){
      res.render("category_form",{
        title: "Create Category",
        errors: errors.array()
      });
      return;
    }
    else{
      await category.save();
      res.redirect(category.url);
    }
  })
];

exports.getDeleteCategory = asyncHandler(async (req,res,next)=>{
  const [category, items] = await Promise.all([
     Category.findById(req.params.id).exec(),
     Item.find({category: req.params.id}, "name").exec()
  ])

  if(category === null){
    res.redirect("/inventory/categories");
  }
  res.render("category_delete",{
    title: "Delete Item",
    category: category,
    items: items
  });
});

exports.postDeleteCategory = asyncHandler(async (req,res,next)=>{
  await Category.findByIdAndRemove(req.body.categoryid);
  res.redirect("/inventory/categories")
});

exports.getUpdateCategory = asyncHandler(async (req,res,next)=>{
  const category = await Category.findById(req.params.id).exec();

  res.render("category_form",{
    title: "Update Category",
    category: category
  });
});

exports.postUpdateCategory = [
  body("name","name must be specified").trim().isLength({min:2, max:50}).escape(),
  body("description","description must be specified").escape(),

  asyncHandler(async (req,res,next)=>{
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id
    });

    if(!errors.isEmpty()){
      res.render("category_form",{
        title: "Update Category",
        category: category,
        errors: errors.array()
      })
      return;
    }
    else{
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
      res.redirect(updatedCategory.url);
    }
  })
];