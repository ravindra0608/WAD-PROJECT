const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
// const popup = require("node-popup");
// require("dotenv/config");

const app = express();
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(
  express.urlencoded({ extended: true, limit: "50mb", parameterLimit: 100000 })
);
app.set("view engine", "ejs");

app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://localhost:27017/announcementsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const announcementSchema = {
  content: String,
};

const criminalSchema = {
  name: String,
  crimename: String,
  lastseen: String,
  dangerlevel: String,
  status: String,
  img: {
    data: Buffer,
    contentType: String,
  },
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

const Announcement = mongoose.model("Announcement", announcementSchema);

const Criminal = mongoose.model("Criminal", criminalSchema);

const announcement1 = new Announcement({
  content: "Robbery near the bridge",
});

const announcement2 = new Announcement({
  content: "Blast at the Kellogs's factory",
});

const announcements = [announcement1, announcement2];

// Post announcements

app.get("/", function (req, res) {
  Announcement.find({}, function (err, existingAnnouncements) {
    // Announcement.insertMany(announcements, function (err, results) {
    //   if (!err) {
    //     console.log(results);
    //   } else {
    //     console.log(err);
    //   }
    // });
    res.render("index", { announcements: existingAnnouncements });
  });
});

app.get("/postannouncements", function (req, res) {
  Announcement.find({}, function (err, existingAnnouncements) {
    // Announcement.insertMany(announcements, function (err, results) {
    //   if (!err) {
    //     console.log(results);
    //   } else {
    //     console.log(err);
    //   }
    // });
    res.render("postannouncements", { announcements: existingAnnouncements });
  });
});

app.post("/postannouncements", function (req, res) {
  const announcement = req.body.newannouncement;

  const newAnnouncement = new Announcement({
    content: announcement,
  });

  newAnnouncement.save(function () {
    res.redirect("/postannouncements");
  });
});

app.post("/delete", function (req, res) {
  const announcementId = req.body.announcementtodelete;

  Announcement.findByIdAndRemove(announcementId, function (err) {
    if (!err) {
      console.log("Successfully deleted");
    }
  });
  res.redirect("/postannouncements");
});

//Criminals list

app.get("/postcriminalslist", function (req, res) {
  Criminal.find({}, function (err, criminalsList) {
    res.render("postcriminalslist", { criminalsList: criminalsList });
  });
});

app.post("/postcriminalslist", upload.single("image"), function (req, res) {
  const newCriminal = {
    name: req.body.name,
    crimename: req.body.crimename,
    lastseen: req.body.lastseen,
    dangerlevel: req.body.dangerlevel,
    status: req.body.status,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };

  Criminal.create(newCriminal, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/postcriminalslist");
    }
  });
});

app.post("/deletecriminal", function (req, res) {
  const criminalId = req.body.criminalid;
  console.log("Filename;" + req.body.filename);

  Criminal.findByIdAndRemove(criminalId, function (err) {
    if (!err) {
      console.log("Successfully Deleted the criminal from the list");
    } else {
      console.log(err);
    }
  });
  res.redirect("/postcriminalslist");

  // console.log(req.file);
});

app.listen(3000, function () {
  console.log("Server has started at port 3000");
});
