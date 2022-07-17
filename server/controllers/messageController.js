const Messages = require("../models/messageModel");

exports.getMessage = (req, res) => {
    Messages.getMessages().then(message => {
        return res.json(message);
    });
};

exports.addMessage = (req, res) => {
    const {  from, to, message  } = req.body;

    try {
        const messages = new Messages(from, to, message)
        messages.createMessage()
        if (messages) return res.status(200).json({ message: "You are cool!" });
    } catch (err) {
        return res.status(500).json({ msg: "Failed to add message to the database" });
    }
};
