export default {
  dbURL:
    process.env.MONGO_URL ||
    'mongodb+srv://dorhakim100:12345@cluster0.z8szp.mongodb.net/',
  dbName: process.env.DB_NAME || 'Zenefy',
}
