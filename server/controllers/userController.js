const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();


exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    let currentUser;

    await User.findUser(email).then(user => {
        if (!user) {
            return res.status(401).json({ message: "Foydalanuvchi topilmadi!" });
        }
        currentUser = user;
        return bcrypt.compare(password, user.password);
    })
        .then(doMatch => {
            if (!doMatch) {
                return res.status(401).json({ message: "Parol xato!" });
            }

            const token = jwt.sign({
                user: currentUser.username,
                userId: currentUser._id,
            },
                "mysecr8yGU&a=?k$&NpQzt9ev&kE=TPB7+HNAf7@kYd=EhUncxKhP&uC4aPN%GwZtM5v4?tWET4yN=Y263V3xd-uZ*EaN%et",
                { expiresIn: "1h" }
            );

            res.status(201).json({
                token: token,
                user: {
                    id: currentUser._id,
                    email: currentUser.email,
                    username: currentUser.username
                },
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.signup = async (req, res, next) => {
    const { username, email, telephone, password, passwordConfirm } = req.body;

    await User.findUser(email).then(user => {
        if (!user) {
            if (password === passwordConfirm) {
                const user = new User(username, email, telephone, password, passwordConfirm,);
                user.save();
                return res.status(200).json({ message: "Foydalanuvchi tuzildi!" });
            } else {
                return res.status(400).json({ message: "Parol mos kelmadi!" });
            }
        } else {
            return res.status(400).json({ message: "Ushbu username band!" });
        }
    }).catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getUserUpdate = (req, res) => {
    const db = getDb();
    const { username, email, telephone,  password, passwordConfirm, id } = req.body;
    if (req.file) {
        return db.collection("users").updateOne(
            { _id: ObjectId(id) },
            { $set: {
                "username": username,
                "email": email,
                "telephone": telephone,
                "password": password,
                "passwordConfirm": passwordConfirm
                } },
        ).then((obj) => {
            res.status(200).json({ message: "You are cool!" });
        }).catch((err) => {
            console.log('Errors: ' + err);
        })
    } else {
        return db.collection("users").updateOne(
            { _id: ObjectId(id) },
            { $set: {
                    "username": username,
                    "email": email,
                    "telephone": telephone,
                    "password": password,
                    "passwordConfirm": passwordConfirm
                } },
        ).then((obj) => {
            res.status(200).json({ message: "You are cool!" });
        }).catch((err) => {
            console.log('Error: ' + err);
        })
    }
}

exports.allUsers = (req, res) => {
    User.allUsers().then(user => {
        return res.json(user)
    });
}