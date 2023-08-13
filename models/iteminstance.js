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

ItemInstanceSchema.virtual("url").get(function(){
    return `/inventory/iteminstance/${this._id}`;
});

ItemInstanceSchema.virtual("arrivalDate_formatted").get(function(){
    return this.arrivalDate ? 
        DateTime.fromJSDate(this.arrivalDate).toLocaleString(DateTime.DATE_MED)
        : '';
});

ItemInstanceSchema.virtual("useByDate_formatted").get(function(){
    return this.useByDate ?
        DateTime.fromJSDate(this.useByDate).toLocaleString(DateTime.DATE_MED)
        : '';
});

ItemInstanceSchema.virtual("arrivalDate_yyyy_mm_dd").get(function(){
    return this.arrivalDate ? 
        DateTime.fromJSDate(this.arrivalDate).toISODate()
        : '';
});

ItemInstanceSchema.virtual("useByDate_yyyy_mm_dd").get(function(){
    return this.useByDate ?
        DateTime.fromJSDate(this.useByDate).toISODate()
        : '';
});

module.exports = mongoose.model("ItemInstance", ItemInstanceSchema);