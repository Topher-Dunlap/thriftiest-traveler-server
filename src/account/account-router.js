const express = require('express');
const AccountService = require('./account-service');
const path = require('path')
const AuthService = require('../auth/auth-service');
const jsonParser = express.json();
const accountRouter = express.Router();

accountRouter
    .route('/auth/login')
    .get((req, res, next) => {
        ///check if account exists
        AccountService.accountCheck(
            req.app.get('db'),
        )
            .then(account => {
                if (account) {
                    res.status(200);
                }
            })
            .catch(function (error) {
                res.status(404).send({ error: "Account does not exist" });
            })
    })
    .post(jsonParser, (req, res, next) => {
        const {email, password} = req.body
        const loginUser = {email, password}

        for (const [key, value] of Object.entries(loginUser))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        AuthService.getUserWithUserName(
            req.app.get('db'),
            loginUser.email
        )
            .then(dbUser => {
                if (!dbUser)
                    return res.status(400).json({
                        error: 'Incorrect email or password',
                    })

                return AuthService.comparePasswords(loginUser.password, dbUser.password)
                    .then(compareMatch => {
                        if (!compareMatch)
                            return res.status(400).json({
                                error: 'Incorrect email or password',
                            })

                        const sub = dbUser.email
                        const payload = {user_id: dbUser.id}
                        res.send({
                            authToken: AuthService.createJwt(sub, payload),
                        })
                        res.status(200).send({ success: "User logged in." });
                    })
            })
            .catch(function (error) {
                res.status(400).send({ error: "Something went wrong please try again" });
            })
    })

accountRouter
    .route('/create')
    .post(jsonParser, (req, res, next) => {
        const {password, first_name, last_name, email} = req.body
        for (const field of ['first_name', 'last_name', 'password', 'email'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
        const passwordError = AccountService.validatePassword(password)

        if (passwordError)
            return res.status(400).json({error: passwordError})
        AccountService.hasUserWithEmail(
            req.app.get('db'),
            email
        )
            .then(hasUserWithEmail => {
                if (hasUserWithEmail)
                    return res.status(400).json({error: `Email already taken`})
                return AccountService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            first_name,
                            password: hashedPassword,
                            last_name,
                            email,
                            date_created: 'now()',
                        }
                        return AccountService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201).send({ success: "User Account Created." })
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(AccountService.serializeUser(user))
                            })
                    })
            })
            .catch(function (error) {
                res.status(400).send({ error: "Something went wrong please try again" });
            })
    })


module.exports = accountRouter