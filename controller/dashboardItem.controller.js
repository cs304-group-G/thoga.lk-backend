import DashboardItem from "../models/dashboardItem.model.js";

const addItem = async (req, res) => {
  const { product, govPrice } = req.body;

  const dashboardItem = new DashboardItem({
    product: product,
    govPrice: govPrice,
  });

  dashboardItem
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
};

const findAll = async (req, res) => {
  DashboardItem.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

const findOne = async (req, res) => {
  const itemId = req.params.id;

  DashboardItem.findOneById(itemId)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

const deleteItem = async (req, res) => {
  const itemId = req.params.id;
  DashboardItem.findByIdAndDelete(itemId)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

const editItem = async (req, res) => {
  const itemId = req.params.id;
  const { govPrice } = req.body;

  DashboardItem.findByIdAndUpdate(itemId, { govPrice: govPrice }, { new: true })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log("Error in editing dashboard item", err);
      res.status(500).json({ error: err.message });
    });
};

export { addItem, findAll, findOne, deleteItem, editItem };
