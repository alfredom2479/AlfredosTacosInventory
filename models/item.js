const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {
        type: String, 
        required: true, 
        minLength: 2,
        maxLength:50,
        unique: true
    },
    description: {type: String, required: true},
    category: {
        type: Schema.Types.ObjectId, 
        ref: "Category",
        required: true
    },
    unit:{
        type: String,
        required: true,
        enum: ["LBS","NUMBER","KG"],
        default: "NUMBER"
    }
});

ItemSchema.virtual("url").get(function(){
    return `/inventory/item/${this._id}`
});

module.exports = mongoose.model("Item", ItemSchema);