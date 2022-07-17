const getDb = require("../utils/db").getDb;
const bcrypt = require("bcryptjs");

class User {
    constructor(username, email, telephone, password, passwordConfirm) {
        this.username = username;
        this.email = email;
        this.telephone = telephone;
        this.password = password;
        this.passwordConfirm = passwordConfirm;
        this.createDate = new Date()
    }

    save() {
        const db = getDb();
        return db.collection("users").findOne({ email: this.email }).then(user => {
            if (user) {
                console.log("User with this email already exsits!")
            } else {
                const hashedPassword = bcrypt.hashSync(this.password, 12);
                return db.collection("users").insertOne({
                    username: this.username,
                    email: this.email,
                    telephone: this.telephone,
                    password: hashedPassword,
                    passwordConfirm: this.passwordConfirm,
                    date: this.createDate,
                });
            }
        });
    }

    static findUser(email) {
        const db = getDb();
        return db.collection("users").findOne({ email: email }).then(user => user);
    }

    static allUsers() {
        const db = getDb();
        return db.collection("users").find({}).toArray().then(users => {
          return users.map(user => {
            return user
          })
        });
      };
}

module.exports = User;