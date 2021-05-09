const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { strict } = require("assert");
const { response } = require("express");
const encrypt = require("mongoose-encryption");
const { time } = require("console");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "public")));

// setting uploads folder as static folder
app.use("/uploads", express.static(__dirname + "/uploads"));

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
    fname: String,
  },
};
// user fir schema
const firSchema = new mongoose.Schema(
  {
    fullname: String,
    fatherorhusbandname: String,
    address: String,
    contactnumber: Number,
    emailid: String,
    date: String,
    time: String,
    stationname: String,
    district: String,
    state: String,
    subject: String,
    complaint: String,
    img: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

const eventsSchema = {
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  tile: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
};

const faqSchema = {
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
  },
};

const policeDetails = {
    area: {
        type: String,
        required: true,
    },
    station: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
};

// user data schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

//Using a large string for encryption
const secret = "ThisIsTheSecretKeyForPoliceWebsite.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const Announcement = mongoose.model("Announcement", announcementSchema);

const Criminal = mongoose.model("Criminal", criminalSchema);

const Fir = mongoose.model("Fir", firSchema);

const Fir1 = mongoose.model("Fir1", firSchema);
const Fir2 = mongoose.model("Fir2", firSchema);
const Fir3 = mongoose.model("Fir3", firSchema);

const Events = mongoose.model("events", eventsSchema);

const Faqs = mongoose.model("faqs", faqSchema);

const PoliceDetails = mongoose.model("police details", policeDetails);

const forms = new Fir({
  firs: [
    {
      firs1: Fir1,
      firs2: Fir2,
      firs3: Fir3,
    },
  ],
});
//Creating a model of this schema
const User = new mongoose.model("User", userSchema);

var isLoggedIn = false;

// routes for login and register pages
app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

//Catching the post request form register page to add data to mongoDB
app.post("/register", function (req, res) {
  if (isLoggedIn) {
    return res.redirect("/phome");
  }
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      res.redirect("/login");
    }
  });
});

//Catching the post request from Login page to check the authorisation
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (isLoggedIn) {
    return res.redirect("/phome");
  }
  //For the given email, checking if the password is correct
  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          isLoggedIn = true;
          res.redirect("/phome");
        } else {
          isLoggedIn = false;
          res.redirect("/login");
        }
      } else {
        res.redirect("/login");
      }
    }
  });
});

// logout route
app.get("/logout", function (req, res) {
  if (isLoggedIn) {
    isLoggedIn = false;
    return res.redirect("/login");
  } else {
    return res.redirect("/login");
  }
});

// faq page routes
app.get("/faq", function (req, res) {
  return res.render("faq");
});

// gallery page
app.get("/gallery", async function (req, res) {
  let events1 = await Events.find({});
  app.locals.policeEvents = events1;
  return res.render("Gallery");
});

// contact us page
app.get("/contactus", async function (req, res) {
  let policeDetails1 = await PoliceDetails.find({});
  return res.render("Contact-us", {
    policedet: policeDetails1,
  });
});

// contact-us police side
app.get("/pcontactus", async function (req, res) {
  let policeDetails1 = await PoliceDetails.find({});
  return res.render("contactus_police", {
    policedet: policeDetails1,
  });
});

// contactus adding
app.post("/contactus/add", function (req, res) {
  PoliceDetails.create(req.body);
  return res.redirect("back");
});

app.get("/contactus/delete/:stationId", async function (req, res) {
  let station = await PoliceDetails.findById(req.params.stationId);
  station.remove();
  return res.redirect("back");
});

// police side gallery page
app.get("/gallerypolice", async function (req, res) {
  let events1 = await Events.find({});
  app.locals.policeEvents = events1;
  if (!isLoggedIn) {
    return res.redirect("/login");
  }
  return res.render("gallery_police");
});
// adding an event to the database
app.post(
  "/gallerypolice/add-event",
  upload.single("tile"),
  async function (req, res) {
    // console.log(req.body);
    // console.log(__dirname);
    let date1 = (req.body.date + "").slice(0, 15);
    let event = await Events.findOne({
      name: req.body.name,
      date: req.body.date,
    });
    if (!event) {
      if (req.file) {
        Events.create({
          name: req.body.name,
          date: date1,
          tile: "\\" + "uploads" + "\\" + req.file.filename,
        });
      } else {
        Events.create({
          name: req.body.name,
          date: req.body.date,
        });
      }
    } else {
      console.log("you cannot created an event");
    }
    return res.redirect("back");
  }
);

// deleting the event
app.get("/gallery/event/delete/", async function (req, res) {
  try {
    let eventToBeDeleted = await Events.findById(req.query.imageId);
    if (eventToBeDeleted) {
      if (eventToBeDeleted.tile) {
        fs.unlinkSync(__dirname + eventToBeDeleted.tile);
      }
      eventToBeDeleted.remove();
    }
    return res.redirect("back");
  } catch (error) {
    console.log(error);
    return res.redirect("back");
  }
});

app.get("/phome", function (req, res) {
  if (!isLoggedIn) {
    return res.redirect("/login");
  }
  return res.render("home_police");
});

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

// app.get("/index.html", function (req, res) {
//   Announcement.find({}, function (err, existingAnnouncements) {
//     // Announcement.insertMany(announcements, function (err, results) {
//     //   if (!err) {
//     //     console.log(results);
//     //   } else {
//     //     console.log(err);
//     //   }
//     // });
//     res.render("index", { announcements: existingAnnouncements });
//   });
// });

app.get("/postannouncements", function (req, res) {
  if (!isLoggedIn) {
    return res.redirect("/login");
  }
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

app.get("/criminalslist", function (req, res) {
  Criminal.find({}, function (err, criminalsList) {
    res.render("criminalslist", { criminalsList: criminalsList });
  });
});

app.get("/postcriminalslist", function (req, res) {
  if (!isLoggedIn) {
    return res.redirect("/login");
  }
  Criminal.find({}, function (err, criminalsList) {
    res.render("postcriminalslist", { criminalsList: criminalsList });
  });
});

app.post("/postcriminalslist", upload.single("image"), function (req, res) {
  const newCriminal = new Criminal({
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
      fname: "\\" + "uploads" + "\\" + req.file.filename,
    },
  });

  newCriminal.save(function () {
    res.redirect("/postcriminalslist");
  });
});

app.post("/deletecriminal", function (req, res) {
  const criminalId = req.body.criminalid;

  Criminal.findByIdAndRemove(criminalId, function (err, foundCriminal) {
    if (!err) {
      fs.unlinkSync(__dirname + foundCriminal.img.fname);
      console.log("Successfully Deleted the criminal from the list");
    } else {
      console.log(err);
    }
  });
  res.redirect("/postcriminalslist");
});

app.get("/firpage", function (req, res) {
  res.render("firpage");
});
// fir form for Accident

app.get("/accidentform", function (req, res) {
  res.render("accidentform");
});

// fir form for Kidnap

app.get("/kidnapform", function (req, res) {
  res.render("kidnapform");
});

// fir form for Land Possession

app.get("/landpossessionform", function (req, res) {
  res.render("landpossessionform");
});

// fir form for Murder

app.get("/murderform", function (req, res) {
  res.render("murderform");
});

// fir form for Robbery

app.get("/robberyform", function (req, res) {
  res.render("robberyform");
});

// fir form for Accident

app.get("/sexualviolenceform", function (req, res) {
  res.render("sexualviolenceform");
});

// fir form for Accident

app.get("/threateningform", function (req, res) {
  res.render("threateningform");
});

// fir form for Others category
app.get("/firform", function (req, res) {
  res.render("firform");
});
app.get("/display", function (req, res) {
  res.render("display");
});
// view fir
app.get("/viewfir", function (req, res) {
  if (!isLoggedIn) {
    return res.redirect("/login");
  } else {
    Fir1.find({}, function (err, foundItems) {
      if (!err) {
        res.render("viewfir", { firs: foundItems.reverse() });
      } else {
        console.log(err);
      }
    });
  }
});

app.get("/viewfirp2", function (req, res) {
  if (!isLoggedIn) {
    return res.redirect("/login");
  } else {
    Fir2.find({}, function (err, foundItems) {
      if (!err) {
        res.render("viewfirp2", { firs: foundItems.reverse() });
      } else {
        console.log(err);
      }
    });
  }
});
app.get("/viewfirp3", function (req, res) {
  if (!isLoggedIn) {
    return res.redirect("/login");
  } else {
    Fir3.find({}, function (err, foundItems) {
      if (!err) {
        res.render("viewfirp3", { firs: foundItems.reverse() });
      } else {
        console.log(err);
      }
    });
  }
});

app.post("/viewfir/priority1", function (req, res) {
  const newFir1 = new Fir1({
    fullname: req.body.fullname,
    fatherorhusbandname: req.body.fatherorhusbandname,
    address: req.body.contactaddress,
    contactnumber: req.body.contactnumber,
    emailid: req.body.emailid,
    date: req.body.date,
    stationname: req.body.stationname,
    district: req.body.district,
    state: req.body.state,
    subject: req.body.subject,
    complaint: req.body.complaint,
  });

  newFir1.save();
  res.redirect("../display");
});
app.post("/viewfir/priority2", function (req, res) {
  const newFir2 = new Fir2({
    fullname: req.body.fullname,
    fatherorhusbandname: req.body.fatherorhusbandname,
    address: req.body.contactaddress,
    contactnumber: req.body.contactnumber,
    emailid: req.body.emailid,
    date: req.body.date,
    stationname: req.body.stationname,
    district: req.body.district,
    state: req.body.state,
    subject: req.body.subject,
    complaint: req.body.complaint,
  });

  newFir2.save();
  res.redirect("../display");
});

app.post("/viewfir/priority3", function (req, res) {
  const newFir3 = new Fir3({
    fullname: req.body.fullname,
    fatherorhusbandname: req.body.fatherorhusbandname,
    address: req.body.contactaddress,
    contactnumber: req.body.contactnumber,
    emailid: req.body.emailid,
    date: req.body.date,
    stationname: req.body.stationname,
    district: req.body.district,
    state: req.body.state,
    subject: req.body.subject,
    complaint: req.body.complaint,
  });

  newFir3.save();
  res.redirect("../display");
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
