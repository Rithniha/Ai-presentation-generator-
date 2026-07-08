const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-presentation-generator');
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Local MongoDB connection failed: ${error.message}`);
    console.log('🔄 Attempting to start in-memory MongoDB server...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`📡 In-Memory MongoDB Connected: ${conn.connection.host}`);
    } catch (innerError) {
      console.error(`❌ Failed to start in-memory MongoDB: ${innerError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
