import mysql from 'mysql2/promise'

const db = {
    host: "localhost",
    user: "admin",
    password: "admin",
    database: "students",

}
const pool = mysql.createPool(db)

// Function to check database connection
const checkDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    connection.release(); // Release connection back to the pool
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔍 Error Details:', error.stack);
    process.exit(1); // Exit process on failure
  }
};

// Immediately check database connection on startup
checkDbConnection();
  
export   {pool}