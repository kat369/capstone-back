const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
const { json } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoClient = mongodb.MongoClient;
const app = express();
const URL =
  "mongodb+srv://kat369:Kathiravan1995@project-m-tool.xjuxrpd.mongodb.net/?retryWrites=true&w=majority";
const DB = "pro-m-tool";

let users = [];

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);


let authenticate = (req, res, next) => {

  if(req.headers.authorization){
    let decode = jwt.verify(req.headers.authorization,"qwertyuip")
    if(decode){
      next()
    }else{
      res.status(401).json({message: "unauthorized"})
    }
    
  }else{
    res.status(401).json({message: "unauthorized"})
  }


};
app.get("/liveprojects", async function (req, res) {

  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let projects = await db
      .collection("projects")
      .find({ status: "live" })
      .toArray();

    await connection.close();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "try again later" });
  }
});

app.get("/completedprojects", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let projects = await db
      .collection("projects")
      .find({ status: "completed" })
      .toArray();

    await connection.close();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "try again later" });
  }
});
app.get("/removedprojects", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let projects = await db
      .collection("projects")
      .find({ status: "removed" })
      .toArray();

    await connection.close();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "try again later" });
  }
});

app.get("/employee", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let employees = await db.collection("employees").find().toArray();

    await connection.close();

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "try again later" });
  }
});

app.get("/employees", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let employees = await db.collection("employees").find().toArray();

    await connection.close();

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "try again later" });
  }
});

app.post("/createproject", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    const data = await db.collection("projects").insertOne(req.body);
    let projects = await db
    .collection("projects")
    .find({ status: "live" })
    .toArray();

    let cprojects = await db
      .collection("projects")
      .find({ status: "completed" })
      .toArray();

    await connection.close();
   
    res.json({lpro:projects, cpro:cprojects ,id:data});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "try again later" });
  }
});

app.get("/buckets/:id", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let buckets = await db
      .collection("projects")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });

    await connection.close();

    res.json(buckets);
  } catch (errror) {
    res.status(500).json({ message: "try again later" });
  }
});

app.post("/createtask/:id", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let task = await db.collection("projects").updateOne(
      {
        _id: mongodb.ObjectId(req.params.id),
        "buckets.bucket_name": req.body.bucket_name,
      },
      { $push: { "buckets.$.tasks": req.body } }
    );

    let taskassign = await db.collection("employees").updateOne(
      {
        _id: mongodb.ObjectId(req.body.assign_to)
      },
      { $push: { working_on: req.body.task_id } }
    );

    await connection.close();

    res.json({ message: "Task Created" });
  } catch (error) {
    res.status(500).json({ message: "try again later" });
  }
});

app.post("/setcompleted/:id", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let task = await db.collection("projects").updateOne(
      {
        _id: mongodb.ObjectId(req.params.id),
      },
      { $set: { status: "completed" } }
    );

    let projects = await db
    .collection("projects")
    .find({ status: "live" })
    .toArray();

    let cprojects = await db
      .collection("projects")
      .find({ status: "completed" })
      .toArray();

    await connection.close();
   
    res.json({lpro:projects, cpro:cprojects});
  } catch (error) {
    res.status(500).json({ message: "try again later" });
  }
});

app.post("/setlive/:id", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let task = await db.collection("projects").updateOne(
      {
        _id: mongodb.ObjectId(req.params.id),
      },
      { $set: { status: "live" } }
    );

    let projects = await db
    .collection("projects")
    .find({ status: "live" })
    .toArray();

    let cprojects = await db
      .collection("projects")
      .find({ status: "completed" })
      .toArray();

    await connection.close();
   
    res.json({lpro:projects, cpro:cprojects});
  } catch (error) {
    res.status(500).json({ message: "try again later" });
  }
});

app.post("/setremove/:id", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let task = await db.collection("projects").updateOne(
      {
        _id: mongodb.ObjectId(req.params.id),
      },
      { $set: { status: "removed" } }
    );
    let projects = await db
    .collection("projects")
    .find({ status: "live" })
    .toArray();

    let cprojects = await db
      .collection("projects")
      .find({ status: "completed" })
      .toArray();

    await connection.close();
   
    res.json({lpro:projects, cpro:cprojects});
  } catch (error) {
    res.status(500).json({ message: "try again later" });
  }
});
app.post("/setdel/:id", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let task = await db.collection("projects").updateOne(
      {
        _id: mongodb.ObjectId(req.params.id),
      },
      { $set: { status: "removed_permanently" } }
    );

    await connection.close();
   
    res.json({message : "Permanently Removed"});
  } catch (error) {
    res.status(500).json({ message: "try again later" });
  }
});

app.post("/deletetask/:id", async function (req, res) {
  console.log(req.body);
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let task = await db.collection("projects").updateOne(
      {
        _id: mongodb.ObjectId(req.params.id),
        "buckets.bucket_name": req.body.bucket_name,
      },
      { $pull: { "buckets.$.tasks": req.body } }
    );

    await connection.close();

    res.json({ message: "Task Deleted" });
  } catch (error) {
    res.status(500).json({ message: "try again later" });
  }
});

app.post("/createbucket/:id",  async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let task = await db
      .collection("projects")
      .updateOne(
        { _id: mongodb.ObjectId(req.params.id) },
        { $push: { buckets: req.body } }
      );

    await connection.close();

    res.json({ message: "Bucket Created" });
  } catch (error) {
    res.status(500).json({ message: "try again later" });
  }
});

app.post("/updatetask/:id",  async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let task = await db.collection("projects").updateOne(
      {
        _id: mongodb.ObjectId(req.params.id),
        "buckets.bucket_name": req.body.bucket_name,
      },
      {
        $set: {
          "buckets.$[].tasks.$[j]": req.body,
        },
      },
      {
        arrayFilters: [
          {
            "j.task_id": req.body.task_id,
          },
        ],
      }
    );

    await connection.close();

    res.json({ message: "Task Deleted" });
  } catch (error) {
    res.status(500).json({ message: "try again later" });
  }
});

app.post("/setpass/:id", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    let salt = await bcrypt.genSalt(10);

    let hash = await bcrypt.hash(req.body.password, salt);

    let task = await db.collection("employees").updateOne(
      {
        _id: mongodb.ObjectId(req.params.id),
      },
      { $set: { password: hash } }
    );


    await connection.close();
   
    res.json({message : "success"});
  } catch (error) {
    res.status(500).json({ message: "try again later" });
  }
});

app.post("/login", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

   let user =await db.collection("employees").findOne({email: req.body.email})
     if (user) {
      let compare = await bcrypt.compare(req.body.password, user.password)
      if (compare) {
        token = await jwt.sign({_id : user._id}, "qwertyuip", {expiresIn : "1h"})
        res.json({token})        
      } else {
        res.status(401).json({message: "login failed"})
      }
     } else {
      res.status(401).json({message: "user not found"})
     }

    await connection.close();
  
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "try again later" });
  }
});

app.listen(process.env.PORT || 3000);
