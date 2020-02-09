const express = require('express');
const router = express.Router();
const multer = require('multer'); //

//define storage config for uploading image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if ( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage, 
  limits: {
    fileSize: 1024 * 1024 * 5 // limit the file size 5MB
  },
  fileFilter // filter mimetype of source
})

const ProductController = require('../controllers/product.controller')

router.route('/')
  .get(ProductController.index)
  .post(upload.single('productImg'), ProductController.addNewProduct); //upload.single: only accept 1 file - get source from productImg fill in form body data

router.route('/:productID')
  .get(ProductController.detailProduct)
  .patch(ProductController.updateProduct)
  .delete(ProductController.deleteProduct)

module.exports = router