import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

const sendMessage = async (req, res) => {
  const to = req.params.id;
  const { message } = req.body;
  const me = req.user._id;

  Chat.findOne({ user1: { $in: [me, to] }, user2: { $in: [me, to] } })
    .then(async (result) => {
      if (!result) {
        const chat = new Chat({
          user1: me,
          user2: to,
        });

        result = await chat.save();
      }

      const messages = result.messages;
      console.log(messages);

      const messageObj = new Message({
        message: message,
        senderId: me,
      });

      const savedmessage = await messageObj.save();
      console.log(savedmessage);

      messages.push(savedmessage._id);

      Chat.updateMany(
        { user1: { $in: [me, to] }, user2: { $in: [me, to] } },
        { messages: messages },
        { new: true }
      )
        .then((result) => {
          res.status(200).json(result.acknowledged);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

const getChats = async (req, res) => {
  const id = req.user._id;

  Chat.find({ $or: [{ user1: id }, { user2: id }] })
    .populate("messages")
    .populate("user1")
    .populate("user2")
    .then((chats) => {
      res.status(200).json(chats);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const getChatByUser = async (req, res) => {
  const id = req.user._id;
  const sender = req.params.id;

  Chat.find({ user1: { $in: [id, sender] }, user2: { $in: [id, sender] } })
    .populate("messages")
    .populate("user1")
    .populate("user2")
    .then((chats) => {
      res.status(200).json(chats);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

export { sendMessage, getChats, getChatByUser };
