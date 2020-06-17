const express = require("express");
const session = require("express-session");

const mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
var ObjectId = require("mongodb").ObjectID;
var cors = require("cors");
let URI =
  "mongodb://heroku_jt3q7spb:t71vccfofjmn8iqfjqj1iej8ot@ds125031.mlab.com:25031/heroku_jt3q7spb" ||
  "mongodb://localhost:27017/test";
mongoose.connect(URI, {
  useNewUrlParser: true
});
const conn = mongoose.connection;
const MongoStore = require("connect-mongo")(session);
app.use(cookieParser("work hard"));
app.use(cors());
app.use(
  session({
    secret: "work hard",
    user: "",
    pass: "",
    resave: false,
    saveUninitialized: false,
    cookie: {
      //secure: false,
      maxAge: 3600000
    },
    store: new MongoStore({
      url: URI,
      collection: "sessions"
      //mongooseConnection: mongoose.connection
    })
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(
  session({
    genid: function(req) {
      return genuuid(); // use UUIDs for session IDs
    },
    secret: "work hard"
  })
);

mongoose
  .connect(URI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

app.get("/", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/logout");
  }
});

app.post("/login", async (req, res) => {
  const user = req.body.username;
  const pass = req.body.pass;

  let result = "";
  // Once i get the username check working do same for password and compare their ids to see if username
  // and password works right
  if (!req.session.user) {
    result = await conn.collection("users").findOne({ Username: user });
    if (result != "") {
      req.session.user = user;
      req.session.pass = pass;
      req.session.save(function(err) {
        // session saved
      });
    } else {
      alert("User not found");
      res.status(200).send("Not Found");
    }
  }
});

app.get("/logout", async (req, res) => {
  result = await conn.collection("sessions").deleteMany({});
});

app.get("/state", async (req, res) => {
  //console.log("worked");
  result = await conn
    .collection("sessions")
    .find({})
    .toArray()
    .then(docs => {
      //console.log(docs);
      if (docs.length === 0) {
        //alert("User not found");
        res.status(200).send("Not Found");
      } else {
        let obj = JSON.parse(
          JSON.parse(JSON.stringify(docs[0].session).replace(/'/g, '"'))
        );
        res.status(200).send(obj.user);
        //return obj.user;
      }
    });

  //console.log(req.session);
  //res.send(req.session);
});

app.get("/check", async (req, res) => {
  let results = [];
  result = await conn
    .collection("sessions")
    .find({})
    .toArray()
    .then(docs => {
      if (docs.length === 0) {
        res.status(200).send("Not Found");
      } else {
        res.status(200).send("Found");
      }
    });
});

app.get("/getCust", async (req, res) => {
  let results = conn
    .collection("customers")
    .find({})
    .toArray()
    .then(docs => {
      if (docs.length === 0) {
        return res.status(200).send("Not Found");
      } else {
        return res.status(200).send(docs);
      }
    });
  //console.log(results);
});

app.post("/deleteItem", async (req, res) => {
  let coll = "";
  let doc = "";
  const id = req.body.id;

  if (req.body.type === "Product") {
    coll = "product";
    doc = await conn.collection("product").findOne({ pid: parseInt(id) });
  } else {
    coll = "customers";
    doc = await conn.collection("customers").findOne({ uid: parseInt(id) });
  }
  if (doc === null) {
    res.send("Not Found");
  } else {
    console.log("sd");
    conn.collection(coll).remove({ uid: parseInt(id) });
    res.status(200).send("OK");
  }
});

app.get("/getProds", async (req, res) => {
  let results = conn
    .collection("product")
    .find({})
    .toArray()
    .then(docs => {
      if (docs.length === 0) {
        return res.status(200).send("Not Found");
      } else {
        return res.status(200).send(docs);
      }
    });
  //console.log(results);
});

app.post("/approve", async (req, res) => {
  let uid = req.body.val;
  var doc = await conn.collection("customers").findOne({ uid: uid });
  console.log(doc);
  conn
    .collection("customers")
    .updateOne({ uid: uid }, { $set: { approved: !doc.approved } });

  res.send(!doc.approved);
});
app.post("/priceChange", async (req, res) => {
  let pid = parseInt(req.body.id);
  let price = parseInt(req.body.price);
  console.log(pid, price);
  var doc = await conn.collection("product").findOne({ pid: parseInt(pid) });
  console.log(doc);
  if (doc === null) {
    res.send("Not Found");
  } else {
    let result = await conn
      .collection("product")
      .updateOne({ pid: parseInt(pid) }, { $set: { price: price } });
    res.status(200).send("OK");
  }
});

app.post("/createAccount", (req, res) => {
  //console.log(res);
  let id = new ObjectId();
  const user = req.body.cusername;
  const pass = req.body.cpass;
  const email = req.body.email;

  conn
    .collection("users")
    .insertOne({ Username: user, id: id, email: email }, (err, result) => {
      //console.log(result);
      if (err) return console.log(err);
      //console.log("Sucessfully saved to DB");
    });
  conn
    .collection("pass")
    .insertOne({ Password: pass, id: id }, (err, result) => {
      //console.log(result);
      if (err) return console.log(err);
      //console.log("Sucessfully saved to DB");
    });
  //console.log(res);
});

app.post("/createProd", async (req, res) => {
  //console.log(res);
  const pid = req.body.pid;
  const name = req.body.name;
  const desc = req.body.desc;
  const price = req.body.price;
  const date = req.body.date;
  var doc = await conn.collection("product").findOne({ pid: parseInt(pid) });
  if (doc === null) {
    conn.collection("product").insertOne(
      {
        pid: parseInt(pid),
        name: name,
        desc: desc,
        price: price,
        date: date
      },
      (err, result) => {
        //console.log(result);
        if (err) return console.log(err);
        //console.log("Sucessfully saved to DB");
      }
    );
  } else {
    res.send("Exists");
  }
});

app.post("/createCust", async (req, res) => {
  const uid = req.body.uid;
  const name = req.body.name;
  const email = req.body.email;
  const address = req.body.address;
  let capprove = "";

  if (req.body.approved === "true") {
    capprove = true;
  } else {
    capprove = false;
  }

  var doc = await conn.collection("customers").findOne({ uid: parseInt(uid) });
  if (doc === null) {
    conn.collection("customers").insertOne(
      {
        uid: parseInt(uid),
        name: name,
        email: email,
        address: address,
        approved: capprove
      },
      (err, result) => {
        //console.log(result);
        if (err) return console.log(err);
        //console.log("Sucessfully saved to DB");
      }
    );
  } else {
    res.send("Exists");
  }
});

const port = process.env.PORT || 3001;

app.listen(port, () => console.log("Server up and running on port " + port));

module.exports = app;
