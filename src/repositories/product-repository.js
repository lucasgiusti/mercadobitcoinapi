'use strict'

const mongoose = require('mongoose');
const Item = mongoose.model('product');

exports.get = async() => {
    const res = await Item.find({}, 'title price');
    return res;
};

exports.getById = async(id) => {
    const res = await Item.findById(id, 'title price')
    return res;
};

exports.create = async(data) => {
    var item = new Item(data);
    await item.save();
};

exports.update = async(id, data) => {
    await Item
        .findByIdAndUpdate(id, {
            $set: {
                title: data.title,
                price: data.price
            }
        })
};

exports.delete = async(id) => {
    await Item.findByIdAndRemove(id)
;}