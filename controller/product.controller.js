import Product from "../models/product.model";
import uploadFileToFirebaseStorage from "../services/fileupload.service";

const addProduct = async (req, res) => {
  const { title, description, price, city } = req.body;
  const files = req.files["photos"];

  const sellerId = req.user._id;

  const photoUrls = [];

  files.forEach(async (file) => {
    const link = await uploadFileToFirebaseStorage(file);
    photoUrls.push(link);
  });

  const product = new Product({
    title: title,
    description: description,
    price: price,
    city: city,
    sellerId: sellerId,
    photoUrls: photoUrls,
  });

  product
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

const findAll = async (req, res) => {
  Product.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

const findOne = async (req, res) => {
  const productId = req.params.id;

  Product.findOneById(productId)
    .populate("Reviews")
    .populate("SellerId")
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  Product.findOneById(productId)
    .then((result) => {
      if (result.sellerId == req.user._id) {
        Product.findByIdAndDelete(productId)
          .then((result) => {
            res.status(200).json(result);
          })
          .catch((err) => {
            res.status(400).json({ error: err.message });
          });
      } else {
        res
          .status(400)
          .json({ error: "you cannot delete other sellers products" });
      }
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

export { addProduct, findAll, findOne, deleteProduct };
