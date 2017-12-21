'use strict'

const mongoose = require('mongoose');
const Item = mongoose.model('customer');

exports.get = async() => {
    var res = await Item.find({});
    return res;
}

exports.authenticate = async(data) => {
    var res = await Item.findOne({
        email: data.email,
        password: data.password
    });
    return res;
}

exports.getById = async(id) => {
    var res = await Item.findById(id);
    return res;
}

exports.create = async(data) => {
    var item = new Item(data);
    await item.save();
};