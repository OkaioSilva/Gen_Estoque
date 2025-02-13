const config = {
    development: {
        apiUrl: 'http://localhost:3000/api'
    },
    production: {
        apiUrl: 'https://seu-dominio.com/api'
    }
};

const currentEnv = window.location.hostname === 'localhost' ? 'development' : 'production';

export const apiUrl = config[currentEnv].apiUrl;