const Product = require('../models/product.model')

module.exports = {
  index: (req, res, next) => {
    Product.find({})
      .select('name price _id productImg') // only show these fills for each product
      .then(products => {
        res.status(200).json(products)
      })
      .catch(err => next(err))
  },
  addNewProduct: (req, res, next) => {
  console.log("TCL: req.file", req.file)
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      productImg: req.file.path
    })
    product
      .save()
      .then(createdProduct => {
        res.status(200).json({
          message: "Created product successfully",
          createdProduct: {
            name: createdProduct.name,
            price: createdProduct.price,
            _id: createdProduct._id,
            productImg: createdProduct.productImg
          }
        })
      })
      .catch(err => next(err))
  },
  detailProduct: (req, res, next) => {
    const productID = req.params.productID
    Product.findById(productID)
      .select(' _id name price productImg')
      .exec()
      .then(doc => {
        if (doc) {
          res.status(200).json(doc)
        } else {
          res.status(404).json({ message: "No valid product found for provided ID" })
        }
      })
      .catch(err => next(err));
  },
  updateProduct: (req, res, next) => {
    Product.findById(req.params.productID)
      .exec()
      .then(product => {
        if (product) {
          Product.updateOne({ _id: req.params.productID }, { $set: req.body })
            .exec()
            .then(updatedProduct => {
              res.status(200).json({ message: "updated product successfully" });
            })
        } else {
          res.status(200).json({ message: "Invalid provided product ID" });
        }
      })
      .catch(err => next(err))
  },
  deleteProduct: (req, res, next) => {
    Product.remove({ _id: req.params.productID })
      .exec()
      .then(rs => {
        res.status(200).json({ message: "deleted product successfully" });
      })
      .catch(err => next(err))
  }
}