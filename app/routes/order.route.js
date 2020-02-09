const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/order.controller')

router.route('/')
  .get(OrderController.index)
  .post(OrderController.addNewOrder);

router.route('/:orderID')
  .get(OrderController.detailOrder)
//   .patch(ProductController.updateProduct)
//   .delete(ProductController.deleteProduct)

module.exports = router