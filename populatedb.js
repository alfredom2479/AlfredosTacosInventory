#! /usr/bin/env node

console.log(
    `This script populates some test categories, items, and item instances to the database.`
);

const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");
const ItemInstance = require("./models/iteminstance");

const categories = [];
const items = [];
const itemInstances = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery",false);

const mongoDB = userArgs[0]

main().catch((err)=> console.log(err));

async function main(){
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
    await createItemInstances();
    console.log("Debug: Closing Mongoose");
    mongoose.connection.close();
}

async function categoryCreate(index,name,description){
    const category = new Category({
        name:name, 
        description:description
    });
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
}

async function itemCreate(index,name, description, category,unit){
    const item = new Item({
        name:name,
        description:description,
        category:category,
        unit:unit
    });
    await item.save();
    items[index] = item;
    console.log(`Added item ${name}`);
}

async function itemInstanceCreate(index, item, amount, arrivalDate, useByDate, notes){
    const itemInstance = new ItemInstance({
        item: item,
        amount: amount,
        arrivalDate: arrivalDate,
        useByDate: useByDate,
        notes:notes
    })

    if (arrivalDate != false) itemInstance.arrivalDate = arrivalDate;
    if (useByDate != false) itemInstance.useByDate = useByDate;
    if (notes != false) itemInstance.notes =notes;


}