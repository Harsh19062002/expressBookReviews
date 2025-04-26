const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
if(req.session.authorization) { // Check if authorization object exists in session
        const token = req.session.authorization['token']; // Get the token from session
        jwt.verify(token, 'your-secret-key', (err, user) => { // Verify the token
            if (!err) {
                req.user = user; // Store the user information in the request object
                next(); // Proceed to the next middleware or route handler
            } else {
                return res.status(403).json({message: "User not authenticated."}); // Forbidden
            }
        });
    } else {
        return res.status(401).json({message: "User not logged in."}); // Unauthorized
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
