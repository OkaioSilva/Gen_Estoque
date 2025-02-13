/* const express = require("express")
const cors = require('cors')
const mongoose = require('mongoose')
const Product = require('./models/Product')

// conecta ao Mongo
const connectDB = require('./db/db')
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

//Rotas
app.get('/test', (req, res) => {
    res.send('Servidor está funcionando!');
});
//listas produtos
app.get('/products', async(req, res)=>{
    try{
        const products = await Product.find();
        res.json(products);
    }catch(e){
        console.error(e);
        res.status(500).send('Erro ao buscar produtos')
    }
});

//adicionar produtos
app.post('/products', async (req, res) => {
    const { name, quantity } = req.body;
    console.log("Dados recebidos:", { name, quantity })
    const status = getStatus(quantity); // Determina o status com base na quantidade

    try {
        const product = new Product({ name, quantity, status });
        await product.save(); // Salva o produto no MongoDB
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao adicionar produto');
    }
});
// atualizar status do produto
app.put('/products/:id/status', async(req, res)=>{
    const {id} = req.params;
    const {status} = req.body;

    try{
        const product = await Product.findByIdAndUpdate(
            id, {status},
            {new: true} // produto atualizado
        )
        res.json(product)
    }catch(e){
        console.error(e);
        res.status(500).send("Erro ao atualizar produto")
    }
})

// deletar produto
app.delete('/products/:id', async(req, res)=>{
    const {id} = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).send('Produto não encontrado');
        }
        res.status(204).send();
    }catch(e){
        console.error(e);
        res.status(500).send("Erro ao deletar produto")
    }
})

// func para determinar o stts com base na quantidade
function getStatus(quantity){
    if(quantity === 0) return 'Fora de Estoque'
    if(quantity <= 5) return 'Baixo Estoque'
    return 'Em Estoque'
}


// servidor
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta: ${PORT}`)
})
 */

require('dotenv').config();
const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const Product = require('./models/Product');

// Conexão com MongoDB
const connectDB = require('./db/db');
connectDB();

const app = express();

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 'https://seu-dominio.com' : '*',
};
// Middleware de segurança
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// Validação para produtos
const validateProduct = [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantidade deve ser um número positivo')
];

// Rotas
app.get('/test', (req, res) => {
    res.send('Servidor está funcionando!');
});

app.get('/api/products', async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .skip(skip)
            .limit(limit)
            .sort({ lastUpdated: -1 });
        
        const total = await Product.countDocuments();

        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });
    } catch(e) {
        console.error(e);
        res.status(500).json({
            error: 'Erro ao buscar produtos',
            details: process.env.NODE_ENV === 'development' ? e.message : undefined
        });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.json(product);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: 'Erro ao buscar produto',
            details: process.env.NODE_ENV === 'development' ? e.message : undefined
        });
    }
});
// Adicionar produtos com validação
app.post('/api/products', validateProduct, async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, quantity } = req.body;
        const status = getStatus(quantity);

        const product = new Product({ 
            name, 
            quantity, 
            status,
            lastUpdated: new Date()
        });
        
        await product.save();
        res.status(201).json(product);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            error: 'Erro ao adicionar produto',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Atualizar status do produto
app.put('/api/products/:id/status', async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const product = await Product.findByIdAndUpdate(
            id, 
            { 
                status,
                lastUpdated: new Date()
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.json(product);
    } catch(e) {
        console.error(e);
        res.status(500).json({
            error: 'Erro ao atualizar produto',
            details: process.env.NODE_ENV === 'development' ? e.message : undefined
        });
    }
});

// Deletar produto
app.delete('/api/products/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        
        res.status(204).send();
    } catch(e) {
        console.error(e);
        res.status(500).json({
            error: 'Erro ao deletar produto',
            details: process.env.NODE_ENV === 'development' ? e.message : undefined
        });
    }
});

// Atualizar produto
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity } = req.body;

        const product = await Product.findByIdAndUpdate(
            id,
            { name, quantity, status: getStatus(quantity) },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.json(product);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: 'Erro ao atualizar produto',
            details: process.env.NODE_ENV === 'development' ? e.message : undefined
        });
    }
});

function getStatus(quantity) {
    if(quantity === 0) return 'Fora de Estoque';
    if(quantity <= 5) return 'Baixo Estoque';
    return 'Em Estoque';
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});