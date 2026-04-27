const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const nodemailer = require('nodemailer')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { differenceInCalendarDays } = require('date-fns')

const port = process.env.PORT || 8000

// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://with-roomly.web.app'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

// send email
const sendEmail = (emailAddress, emailData) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.TRANSPORTER_EMAIL,
      pass: process.env.TRANSPORTER_PASS,
    },
  })

  // verify transporter
  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error)
    } else {
      console.log('Server is ready to take our messages')
    }
  })
  const mailBody = {
    from: `"Roomly" <${process.env.TRANSPORTER_EMAIL}>`, // sender address
    to: emailAddress, // list of receivers
    subject: emailData.subject, // Subject line
    html: emailData.message, // html body
  }

  transporter.sendMail(mailBody, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Email Sent: ' + info.response)
    }
  })
}

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token
  // console.log(token)
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded
    next()
  })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pbd6wjw.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    const db = client.db('stayvista')
    const roomsCollection = db.collection('rooms')
    const usersCollection = db.collection('users')
    const bookingsCollection = db.collection('bookings')
    const categoriesCollection = db.collection('categories')
    const reviewsCollection = db.collection('reviews')

    await roomsCollection.createIndex({ avgRating: -1, reviewCount: -1 })
    await reviewsCollection.createIndex(
      { roomId: 1, 'reviewer.email': 1 },
      { unique: true }   // prevents duplicate reviews at DB level
    )

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    // Helper function to check date overlap
    const checkDateOverlap = (start1, end1, start2, end2) => {
      return start1 <= end2 && start2 <= end1
    }

    // Helper function to get all booked dates for a room
    const getBookedDatesForRoom = async (roomId) => {
      const bookings = await bookingsCollection
        .find({
          roomId: roomId,
          // Optional: only include confirmed/paid bookings
          // status: { $in: ['confirmed', 'paid'] }
        })
        .toArray()

      return bookings.map(booking => ({
        startDate: new Date(booking.startDate),
        endDate: new Date(booking.endDate)
      }))
    }

    // ============================================
    // MIDDLEWARE
    // ============================================

    // verify admin middleware
    const verifyAdmin = async (req, res, next) => {
      const user = req.user
      const query = { email: user?.email }
      const result = await usersCollection.findOne(query)
      // console.log(result?.role)
      if (!result || result?.role !== 'admin')
        return res.status(401).send({ message: 'unauthorized access!!' })

      next()
    }

    // verify host middleware
    const verifyHost = async (req, res, next) => {
      const user = req.user
      const query = { email: user?.email }
      const result = await usersCollection.findOne(query)
      // console.log(result?.role)
      if (!result || result?.role !== 'host') {
        return res.status(401).send({ message: 'unauthorized access!!' })
      }

      next()
    }

    // ============================================
    // AUTH RELATED API
    // ============================================

    // auth related api
    app.post('/jwt', async (req, res) => {
      const user = req.body
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d',
      })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true })
    })

    // Logout
    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true })
        console.log('Logout successful')
      } catch (err) {
        res.status(500).send(err)
      }
    })

    // ============================================
    // PAYMENT RELATED API
    // ============================================

    // create-payment-intent
    app.post('/create-payment-intent', verifyToken, async (req, res) => {
      const price = req.body.price
      const priceInCent = parseFloat(price) * 100
      if (!price || priceInCent < 1) return
      // generate clientSecret
      const { client_secret } = await stripe.paymentIntents.create({
        amount: priceInCent,
        currency: 'usd',
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
      })
      // send client secret as response
      res.send({ clientSecret: client_secret })
    })

    // ============================================
    // USER RELATED API
    // ============================================

    // save a user data in db
    app.put('/user', async (req, res) => {
      const user = req.body

      const query = { email: user?.email }
      // check if user already exists in db
      const isExist = await usersCollection.findOne(query)
      if (isExist) {
        if (user.status === 'Requested') {
          // if existing user try to change his role
          const result = await usersCollection.updateOne(query, {
            $set: { status: user?.status },
          })
          return res.send(result)
        } else {
          // if existing user login again
          return res.send(isExist)
        }
      }

      // save user for the first time
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          ...user,
          timestamp: Date.now(),
        },
      }
      const result = await usersCollection.updateOne(query, updateDoc, options)
      // welcome new user
      sendEmail(user?.email, {
        subject: 'Welcome to Roomly!',
        message: `Hope you will find your destination`,
      })
      res.send(result)
    })

    // get a user info by email from db
    app.get('/user/:email', async (req, res) => {
      const email = req.params.email
      const result = await usersCollection.findOne({ email })
      res.send(result)
    })

    // get all users data from db
    app.get('/users', verifyToken, verifyAdmin, async (req, res) => {
      const result = await usersCollection.find().toArray()
      res.send(result)
    })

    //update a user role
    app.patch('/users/update/:email', verifyToken, verifyAdmin, async (req, res) => {
      const email = req.params.email
      const user = req.body
      const query = { email }
      const updateDoc = {
        $set: { ...user, timestamp: Date.now() },
      }
      const result = await usersCollection.updateOne(query, updateDoc)
      res.send(result)
    })

    // ============================================
    // CATEGORY RELATED API
    // ============================================

    // Get all categories (public)
    app.get('/categories', async (req, res) => {
      const result = await categoriesCollection.find().toArray()
      res.send(result)
    })

    // Add a category (admin only)
    app.post('/category', verifyToken, verifyAdmin, async (req, res) => {
      const category = req.body
      // Check duplicate
      const exists = await categoriesCollection.findOne({ label: category.label })
      if (exists) {
        return res.status(400).send({ message: 'Category already exists' })
      }
      const result = await categoriesCollection.insertOne(category)
      res.send(result)
    })

    // Delete a category (admin only)
    app.delete('/category/:id', verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await categoriesCollection.deleteOne(query)
      res.send(result)
    })

    // ============================================
    // REVIEW RELATED API
    // ============================================

    // POST review + update room avgRating
    app.post('/review', verifyToken, async (req, res) => {
      const { roomId, rating, comment, reviewer } = req.body

      // one review per guest per room
      const existing = await reviewsCollection.findOne({
        roomId,
        'reviewer.email': reviewer.email,
      })
      if (existing) {
        return res.status(400).send({ message: 'Already reviewed' })
      }

      const review = { roomId, rating: Number(rating), comment, reviewer, createdAt: new Date() }
      await reviewsCollection.insertOne(review)

      // recalculate avgRating on the room
      const allReviews = await reviewsCollection.find({ roomId }).toArray()
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

      await roomsCollection.updateOne(
        { _id: new ObjectId(roomId) },
        { $set: { avgRating: parseFloat(avgRating.toFixed(2)), reviewCount: allReviews.length } }
      )

      res.send({ success: true })
    })

    // PATCH mark booking as reviewed
    app.patch('/booking/reviewed/:id', verifyToken, async (req, res) => {
      const { id } = req.params
      const result = await bookingsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { reviewed: true } }
      )
      res.send(result)
    })

    // GET popular rooms — min 3 reviews, sorted by avgRating
    app.get('/popular-rooms', async (req, res) => {
      const result = await roomsCollection
        .find({ reviewCount: { $gte: 1 } })      // lower to 1 during dev, raise to 3 in prod
        .sort({ avgRating: -1, reviewCount: -1 })
        .limit(8)
        .toArray()
      res.send(result)
    })

    // ============================================
    // ROOM RELATED API
    // ============================================

    // Get all rooms
    app.get('/rooms', async (req, res) => {
      const category = req.query.category
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 9

      let query = {}
      if (category && category !== 'null') query = { category }

      const skip = (page - 1) * limit
      const total = await roomsCollection.countDocuments(query)

      const result = await roomsCollection.find(query).skip(skip).limit(limit).toArray()

      res.send({ rooms: result, total, page, totalPages: Math.ceil(total / limit) })
    })

    // Save a room data in db
    app.post('/room', verifyToken, verifyHost, async (req, res) => {
      const roomData = req.body

      // Ensure images is an array and set default values for new fields
      const room = {
        ...roomData,
        images: roomData.images || (roomData.image ? [roomData.image] : []),
        avgRating: 0,
        reviewCount: 0,
        createdAt: new Date(),
      }

      const result = await roomsCollection.insertOne(room)
      res.send(result)
    })

    // get all rooms for host
    app.get('/my-listings/:email', verifyToken, verifyHost, async (req, res) => {
      const email = req.params.email

      let query = { 'host.email': email }
      const result = await roomsCollection.find(query).toArray()
      res.send(result)
    })

    // Get a single room data from db using _id
    app.get('/room/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await roomsCollection.findOne(query)
      res.send(result)
    })

    // Get booked dates for a specific room
    app.get('/room/:id/booked-dates', async (req, res) => {
      const id = req.params.id

      try {
        const bookedDates = await getBookedDatesForRoom(id)
        res.send(bookedDates)
      } catch (error) {
        res.status(500).send({ message: 'Error fetching booked dates' })
      }
    })

    // Get room availability status
    app.get('/room/:id/availability', async (req, res) => {
      const id = req.params.id
      const room = await roomsCollection.findOne({ _id: new ObjectId(id) })

      if (!room) {
        return res.status(404).send({ message: 'Room not found' })
      }

      const bookedDates = await getBookedDatesForRoom(id)
      const roomStart = new Date(room.from)
      const roomEnd = new Date(room.to)

      // Calculate total days in room's range
      const totalDays = differenceInCalendarDays(roomEnd, roomStart)

      // Calculate booked days
      let bookedDaysCount = 0
      bookedDates.forEach(booking => {
        bookedDaysCount += differenceInCalendarDays(
          new Date(booking.endDate),
          new Date(booking.startDate)
        )
      })

      const isFullyBooked = bookedDaysCount >= totalDays

      res.send({
        isFullyBooked,
        availableDays: totalDays - bookedDaysCount,
        totalDays,
        bookedDays: bookedDaysCount
      })
    })

    // update room data
    app.put('/room/update/:id', verifyToken, verifyHost, async (req, res) => {
      const id = req.params.id
      const roomData = req.body
      const query = { _id: new ObjectId(id) }

      // Ensure images is properly formatted
      const updateData = {
        ...roomData,
        images: roomData.images || (roomData.image ? [roomData.image] : []),
        updatedAt: new Date(),
      }

      const updateDoc = {
        $set: updateData,
      }
      const result = await roomsCollection.updateOne(query, updateDoc)
      res.send(result)
    })

    // delete a room
    app.delete('/room/:id', verifyToken, verifyHost, async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await roomsCollection.deleteOne(query)
      res.send(result)
    })

    // NOTE: Room status endpoint removed - rooms can now have partial bookings
    // Instead of marking entire room as booked, use /room/:id/availability endpoint

    // ============================================
    // BOOKING RELATED API
    // ============================================

    // Save a booking data in db
    app.post('/booking', verifyToken, async (req, res) => {
      const bookingData = req.body

      // Validate that the selected dates are within room availability
      const room = await roomsCollection.findOne({ _id: new ObjectId(bookingData.roomId) })

      if (!room) {
        return res.status(404).send({ message: 'Room not found' })
      }

      const requestedStart = new Date(bookingData.startDate)
      const requestedEnd = new Date(bookingData.endDate)
      const roomStart = new Date(room.from)
      const roomEnd = new Date(room.to)

      // Check if requested dates are within room's availability range
      if (requestedStart < roomStart || requestedEnd > roomEnd) {
        return res.status(400).send({
          message: 'Selected dates are outside the available range'
        })
      }

      // Check for overlapping bookings
      const existingBookings = await getBookedDatesForRoom(bookingData.roomId)

      const hasOverlap = existingBookings.some(booking =>
        checkDateOverlap(requestedStart, requestedEnd, booking.startDate, booking.endDate)
      )

      if (hasOverlap) {
        return res.status(400).send({
          message: 'Selected dates are already booked'
        })
      }

      // Add start and end dates to booking data
      const completeBookingData = {
        ...bookingData,
        startDate: requestedStart,
        endDate: requestedEnd,
        from: requestedStart,
        to: requestedEnd,
        roomId: bookingData.roomId,
        createdAt: new Date()
      }

      // save room booking info
      const result = await bookingsCollection.insertOne(completeBookingData)

      // send email to guest
      sendEmail(bookingData?.guest?.email, {
        subject: 'Booking Successful!',
        message: `You've successfully booked a room through Roomly from ${requestedStart.toLocaleDateString()} to ${requestedEnd.toLocaleDateString()}. Transaction Id: ${bookingData.transactionId}`,
      })

      // send email to host
      sendEmail(bookingData?.host?.email, {
        subject: 'Your room got booked!',
        message: `Get ready to welcome ${bookingData.guest.name} from ${requestedStart.toLocaleDateString()} to ${requestedEnd.toLocaleDateString()}.`,
      })

      res.send(result)
    })

    // get all booking for a guest
    app.get('/my-bookings/:email', verifyToken, async (req, res) => {
      const email = req.params.email
      const query = { 'guest.email': email }
      const result = await bookingsCollection.find(query).toArray()
      res.send(result)
    })

    // get all booking for a host
    app.get('/manage-bookings/:email', verifyToken, verifyHost, async (req, res) => {
      const email = req.params.email
      const query = { 'host.email': email }
      const result = await bookingsCollection.find(query).toArray()
      res.send(result)
    })

    // delete a booking
    app.delete('/booking/:id', verifyToken, async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await bookingsCollection.deleteOne(query)
      res.send(result)
    })

    // ============================================
    // STATISTICS RELATED API
    // ============================================

    // Admin Statistics
    app.get('/admin-stat', verifyToken, verifyAdmin, async (req, res) => {
      const bookingDetails = await bookingsCollection
        .find(
          {},
          {
            projection: {
              date: 1,
              price: 1,
            },
          }
        )
        .toArray()

      const totalUsers = await usersCollection.countDocuments()
      const totalRooms = await roomsCollection.countDocuments()
      const totalPrice = bookingDetails.reduce(
        (sum, booking) => sum + booking.price,
        0
      )

      const chartData = bookingDetails.map(booking => {
        const day = new Date(booking.date).getDate()
        const month = new Date(booking.date).getMonth() + 1
        const data = [`${day}/${month}`, booking?.price]
        return data
      })
      chartData.unshift(['Day', 'Sales'])

      res.send({
        totalUsers,
        totalRooms,
        totalBookings: bookingDetails.length,
        totalPrice,
        chartData,
      })
    })

    // Host Statistics
    app.get('/host-stat', verifyToken, verifyHost, async (req, res) => {
      const { email } = req.user
      const bookingDetails = await bookingsCollection
        .find(
          { 'host.email': email },
          {
            projection: {
              date: 1,
              price: 1,
            },
          }
        )
        .toArray()

      const totalRooms = await roomsCollection.countDocuments({
        'host.email': email,
      })
      const totalPrice = bookingDetails.reduce(
        (sum, booking) => sum + booking.price,
        0
      )
      const { timestamp } = await usersCollection.findOne(
        { email },
        { projection: { timestamp: 1 } }
      )

      const chartData = bookingDetails.map(booking => {
        const day = new Date(booking.date).getDate()
        const month = new Date(booking.date).getMonth() + 1
        const data = [`${day}/${month}`, booking?.price]
        return data
      })
      chartData.unshift(['Day', 'Sales'])

      res.send({
        totalRooms,
        totalBookings: bookingDetails.length,
        totalPrice,
        chartData,
        hostSince: timestamp,
      })
    })

    // Guest Statistics
    app.get('/guest-stat', verifyToken, async (req, res) => {
      const { email } = req.user
      const bookingDetails = await bookingsCollection
        .find(
          { 'guest.email': email },
          {
            projection: {
              date: 1,
              price: 1,
            },
          }
        )
        .toArray()

      const totalPrice = bookingDetails.reduce(
        (sum, booking) => sum + booking.price,
        0
      )
      const { timestamp } = await usersCollection.findOne(
        { email },
        { projection: { timestamp: 1 } }
      )

      const chartData = bookingDetails.map(booking => {
        const day = new Date(booking.date).getDate()
        const month = new Date(booking.date).getMonth() + 1
        const data = [`${day}/${month}`, booking?.price]
        return data
      })
      chartData.unshift(['Day', 'Sales'])

      res.send({
        totalBookings: bookingDetails.length,
        totalPrice,
        chartData,
        guestSince: timestamp,
      })
    })

    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 })
    // console.log(
    //   'Pinged your deployment. You successfully connected to MongoDB!'
    // )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello from Roomly Server..')
})

app.listen(port, () => {
  console.log(`Roomly is running on port ${port}`)
})