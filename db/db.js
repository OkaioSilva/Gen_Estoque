/* const mongoose = require('mongoose');

const connectDB = async() =>{
    try{
        await mongoose.connect('mongodb+srv://silv4kaio:mYT9bJ3FTmPTszIF@kaio.hde7w.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('conectado ao mongo')
    }catch(e){
        console.log("Erro ao conectar ao Mongo", e);
        process.exit(1);
    }
}

module.exports = connectDB */

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conectado ao MongoDB');
    } catch(e) {
        console.error("Erro ao conectar ao MongoDB:", e);
        process.exit(1);
    }
};

// Tratamento de erros na conexão
mongoose.connection.on('error', err => {
    console.error('Erro na conexão MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB desconectado');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = connectDB;