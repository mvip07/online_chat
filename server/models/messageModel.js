const getDb = require("../utils/db").getDb;
// const { ObjectId } = require("mongodb");

class Message {
  constructor( from, to, message) {
    this.message = message,
    this.from = from,
    this.to = to,
    this.sender = from,
    this.createdAt = new Date();
  }
  static getMessages() {
    const db = getDb();
    return db.collection("messages").find({}).toArray().then(messages => {
      return messages.map(message => {
        return message
      })
    });
  };
  
  createMessage() {
      const db = getDb();
      return db.collection("messages").insertOne(this);
  }
};

module.exports = Message;