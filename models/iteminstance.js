const mongoose = require("mongoose");
const {DateTime} = require("luxon");

const Schema = mongoose.Schema;

const ItemInstanceSchema = new Schema({
    item: {
        type: Schema.Types.ObjectId, 
        ref: "Item",
        required: true
    },
    amount: {type: Number, required: true},
    arrivalDate: {type: Date},
    useByDate: {type: Date},
    notes: {type: String}
});

module.exports = mongoose.model("ItemInstance", ItemInstanceSchema);