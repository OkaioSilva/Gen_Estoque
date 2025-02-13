/* const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    lastUpdate:{
        type: Date,
        default: Date.now,
    },
    status:{
        type: String,
        enum: ['Em estoque', 'Baixo Estoque', 'Fora de Estoque'],
        default: 'Em Estoque',
    }
})

module.exports = mongoose.model('Product', productSchema); */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Em Estoque', 'Baixo Estoque', 'Fora de Estoque'],
        default: 'Em Estoque',
    },
});

module.exports = mongoose.model('Product', productSchema);