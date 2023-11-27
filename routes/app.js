const router = require('express').Router()
const productsRouter = require('./admin/productsRouter')
const usersRouter = require('./user/usersRouter')
const dashboardRouter = require('./user/dashboardRouter')

// router.use('/api/v1/dashboard', dashboardRouter)
router.use('/api/v1/products', productsRouter)
// router.use('/api/v1/books', booksRouter)// books router endpoint
router.use('/api/v1/users', usersRouter)// users router endpoint
// router.use('/api/v1/authors', authorsRouter)// users router endpoint

// API route for serving the image
  
  
module.exports = router