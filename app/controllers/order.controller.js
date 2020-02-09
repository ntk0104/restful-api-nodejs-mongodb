const Order = require('../models/order.model')
const Product = require('../models/product.model')

module.exports = {
  index: (req, res, next) => {
    Order.find({})
      .select('product quantity _id')
      .populate('product', 'name') // with fill "product" of order, get reference info of its from Model Product with only "name" property
      .then(orders => {
        res.status(200).json(orders)
      })
      .catch(err => next(err))
  },
  addNewOrder: (req, res, next) => {
    Product.findById(req.body.productID)
      .then(product => {
        if (!product) {
          res.status(200).json({
            message: "Product not found"
          })
        }
        const order = new Order({
          quantity: req.body.quantity,
          product: req.body.productID
        })
        order.save()
          .then(createdOrder => {
            res.status(200).json({
              message: "Created order successfully",
              createdOrder: {
                product: createdOrder.product,
                quantity: createdOrder.quantity,
                _id: createdOrder._id
              }
            })
          })
      })
      .catch(err => next(err))
  },
  detailOrder: (req, res, next) => {
    const orderID = req.params.orderID
    Order.findById(orderID)
      .select(' _id product quantity')
      .exec()
      .then(doc => {
        if (doc) {
          res.status(200).json(doc)
        } else {
          res.status(404).json({ message: "No valid order found for provided ID" })
        }
      })
      .catch(err => next(err));
  }
}