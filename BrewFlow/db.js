const mysql = require('mysql2/promise');

// Configuración de la conexión a Cloud SQL
// Se recomienda usar variables de entorno por seguridad
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'brewflow_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificación de conexión inicial (Útil para logs de despliegue en Google Cloud)
pool.getConnection()
    .then(connection => {
        console.log('Conexión exitosa a la base de datos BrewFlow en Cloud SQL');
        connection.release();
    })
    .catch(err => {
        console.error('Error conectando a la base de datos:', err.message);
    });

module.exports = pool;