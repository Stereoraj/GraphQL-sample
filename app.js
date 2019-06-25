const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQLSchema = require("./graphql/schema/index");
const graphQLResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");


const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if(req.method === "OPTIONS") {
   	return res.sendStatus(200); 
    }
    next();
});

app.use(isAuth);

app.use("/graphql", graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}));

console.log("connecting to the database ...");

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clusterevents-lvnzw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
.then(() => {
    console.log("Database connectivity successful !!");
    app.listen(4000, () => {
        console.log("Listening at port 4000 ...");
    });  
})
.catch(err => {
    console.log(err);
});
