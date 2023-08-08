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
    
    //await db.dropDatabase();

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
        useByDate:useByDate
    });

    if (arrivalDate != false) itemInstance.arrivalDate = arrivalDate;
    //if (useByDate != false) itemInstance.useByDate = useByDate;
    if (notes != false) itemInstance.notes =notes;

    await itemInstance.save();
    itemInstances[index] = itemInstance;
    console.log(`Added Item Instance ${item} (${amount})`);

}

async function createCategories(){
    console.log("Adding Categories");
    await Promise.all([
        categoryCreate(0,"Tortillas", "Main ingredient"),
        categoryCreate(1, "Beans", "Optional ingredient"),
        categoryCreate(2, "Meats", "Proteins for our tacos" ),
        categoryCreate(3, "Toppings", "Other things we could add to our tacos")
    ]);
}

async function createItems(){
    console.log("Adding Items");
    await Promise.all([
        itemCreate(
            0,
            "Corn Tortillas",
            "Tortilla Inc. is our provider ",
            categories[0],
            "NUMBER"
        ),
        itemCreate(
            1,
            "Flour Tortillas",
            "Making these by hand",
            categories[0],
            "NUMBER"
        ),
        itemCreate(
            2,
            "Hard Shell",
            "Most popular",
            categories[0],
            "NUMBER"
        ),
        itemCreate(
            3,
            "Black Beans",
            "Makes up about 25% of bean sales",
            categories[1],
            "LBS"
        ),
        itemCreate(
            4,
            "Pinto Beans",
            "Makes up 75% of bean orders",
            categories[1],
            "LBS"
        ),
        itemCreate(
            5,
            "Chicken",
            "Best selling",
            categories[2],
            "LBS"
        ),
        itemCreate(
            6,
            "Beef",
            "why do we measure this in KGs",
            categories[2],
            "KG"
        ),
        itemCreate(
            7,
            "Pork",
            "From Pork Guys Store",
            categories[2],
            "LBS"
        ),
        itemCreate(
            8,
            "Cheese",
            "Classic Mexican cheese",
            categories[3],
            "LBS"
        ),
        itemCreate(
            9,
            "Onions",
            "We are using white ones right now",
            categories[3],
            "LBS"
        ),
        itemCreate(
            10,
            "Tomatos",
            "Growing this in Juan's Backyard",
            categories[3],
            "LBS"
        )
    ]);
}

//index, item, amount, arrivalDate, useByDate, notes
    async function createItemInstances(){
        console.log("Adding Item Instances...");
        await Promise.all([
            itemInstanceCreate(
                0,
                items[0],
                98,
                "2023=01-03",
                "2023-01-09",
                false
            ),
            itemInstanceCreate(
                1,
                items[2],
                41,
                "2023=01-04",
                "2023-01-10",
                "These taste a little weird"
            ),
            itemInstanceCreate(
                2,
                items[4],
                8.2,
                false,
                "2023-01-11",
                false
            ),
            itemInstanceCreate(
                3,
                items[5],
                20.9,
                "2023-01-01",
                "2023-01-09",
                false
            ),
            itemInstanceCreate(
                4,
                items[6],
                15.6,
                "2023-01-01",
                "2023-01-10",
                false
            ),
            itemInstanceCreate(
                5,
                items[7],
                12.6,
                "2023-01-01",
                "2023-01-15",
                false
            ),
            itemInstanceCreate(
                6,
                items[10],
                20.1,
                false,
                "2023-01-20",
                false
            ),
        ]);
    }