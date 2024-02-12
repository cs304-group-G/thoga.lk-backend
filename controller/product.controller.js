import Product from "../models/product.model.js";
import uploadFileToFirebaseStorage from "../services/fileupload.service.js";

const addProduct = async (req, res) => {
  const { title, description, price, city } = req.body;
  const files = req.files;
  const sellerId = req.user._id;

  console.log(files);

  const photoUrls = [];

  // Use map to create an array of promises for each file upload
  const uploadPromises = files.map(async (file) => {
    const link = await uploadFileToFirebaseStorage(title, file);
    return link;
  });

  try {
    // Wait for all file uploads to complete
    const uploadedLinks = await Promise.all(uploadPromises);

    // Add the links to the photoUrls array
    photoUrls.push(...uploadedLinks);
    
    const product = new Product({
      title: title,
      description: description,
      price: price,
      city: city,
      sellerId: sellerId,
      photoUrls: photoUrls,
    });

    // Save the product
    const result = await product.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
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
