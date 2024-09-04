import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'

import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { reviewRoutes } from './api/review/review.routes.js'
import { stationRoutes } from './api/station/station.routes.js'
import { setupSocketAPI } from './services/socket.service.js'

import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'

import { MongoClient, ObjectId } from 'mongodb'
import crypto from 'crypto'

const app = express()
const server = http.createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('public')))
} else {
  const corsOptions = {
    origin: [
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://localhost:5173',
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}
app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/station', stationRoutes)

setupSocketAPI(server)

// Make every unhandled server-side-route match index.html
// so when requesting http://localhost:3030/unhandled-route...
// it will still serve the index.html file
// and allow vue/react-router to take it from there

app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

import { logger } from './services/logger.service.js'
const port = process.env.PORT || 3030

server.listen(port, () => {
  logger.info('Server is running on port: ' + port)
})

// async function convertIds() {
//   const uri = 'mongodb://localhost:27017' // Replace with your MongoDB connection string
//   const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })

//   try {
//     await client.connect()
//     const database = client.db('Zenefy') // Replace with your database name
//     const collection = database.collection('user') // Replace with your collection name

//     const cursor = collection.find()
//     while (await cursor.hasNext()) {
//       const doc = await cursor.next()

//       // Create a new ObjectId based on the existing _id
//       const newObjectId = new ObjectId(
//         crypto
//           .createHash('sha1')
//           .update(doc._id.toString())
//           .digest('hex')
//           .substring(0, 24)
//       )

//       // Copy the existing document, but with the new _id
//       const newDoc = { ...doc, _id: newObjectId }

//       // Insert the new document
//       await collection.insertOne(newDoc)

//       // Remove the old document
//       await collection.deleteOne({ _id: doc._id })
//     }
//   } finally {
//     await client.close()
//   }
// }

// convertIds().catch(console.error)
