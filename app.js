const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { strict } = require("assert");
const { response } = require("express");
const { time, log } = require("console");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const { RSA_NO_PADDING } = require("constants");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const passportLocal = require("passport-local");

var isPoliceLoggedIn = false; 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "Secret for Police Website.",
    resave: false,
    saveUninitialized: false
  }));
app.use(passport.initialize());
app.use(passport.session());


// setting uploads folder as static folder
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect("mongodb://localhost:27017/announcementsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

mongoose.set("useCreateIndex", true);

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
// user fir schema
const firSchema = new mongoose.Schema({
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
    image: {
        data: Buffer,
        contentType: String,
        fname: String,
    },
}, { timestamps: true });

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
    images: [{
        type: String,
    }, ],
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
    username: String,
    password: String
});

const policeSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
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

userSchema.plugin(passportLocalMongoose);

const Announcement = mongoose.model("Announcement", announcementSchema);

const Criminal = mongoose.model("Criminal", criminalSchema);

const Fir = mongoose.model("Fir", firSchema);

const Fir1 = mongoose.model("Fir1", firSchema);
const Fir2 = mongoose.model("Fir2", firSchema);
const Fir3 = mongoose.model("Fir3", firSchema);

const Events = mongoose.model("events", eventsSchema);

const Faqs = mongoose.model("faqs", faqSchema);

const PoliceDetails = mongoose.model("police details", policeDetails);

//Creating a model of this schema
const User = new mongoose.model("User", userSchema);

const Authority = new mongoose.model("Authority", policeSchema);
 

passport.use(User.createStrategy());
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Route Declaration
//Get and Post routes for login page
app.get("/decideLogin", function(req, res) {
    if(req.isAuthenticated()){
        res.redirect("/");
    } else {
        res.render("decideLogin");
    }
});
 
app.get("/police_login", function(req, res) {
    if(!isPoliceLoggedIn){
        res.render("police_login");
    } else {
        res.redirect("/phome");
    }
    
});
 
app.get("/police_register", function(req, res) {
    if(!isPoliceLoggedIn){
        res.render("police_register");
    } else {
        res.redirect("/phome");
    }
});
 
app.get("/user_login", function(req, res) {
    if(req.isAuthenticated()){
        res.redirect("/");
    } else {
        res.render("user_login");
    }
});
 
app.get("/user_register", function(req, res) {
    if(req.isAuthenticated()){
        res.redirect("/");
    } else {
        res.render("user_register");
    }
});





// faq page routes
app.get('/faq',async function(req, res) {
    try {
        let questions = await Faqs.find({});
        return res.render('faq',{
            faqs: questions.reverse()
        });
    } catch (error) {
        console.log(error);
    }
});

app.post('/faq/add/',async function (req, res) {
    try {
        let faq = await Faqs.create({question: req.body.question});
        if(faq){
            console.log('****Posted Question Successfully****');
        }else{
            console.log('error inposting question');
        }
        return res.redirect('back');
    } catch (error) {
        console.log(error);        
        return res.redirect('back');
    }
})

// police side faq
app.get('/pfaq',async function (req, res) {
    try {
        let questions = await Faqs.find({});
        if(isPoliceLoggedIn){
            return res.render('faq_police',{
                faqs: questions.reverse()
            });
        }else{
            return res.redirect('/police_login');
        }
    } catch (error) {
        console.log(error);
    }
});

app.post('/faq/answer/:faqid', async function (req, res) {
   try {
       let faqToAns = await Faqs.findByIdAndUpdate(req.params.faqid);
       if(faqToAns){
           faqToAns.answer = req.body.answer;
           faqToAns.save();
           return res.redirect('back');
       }
   } catch (error) {
        console.log(error);
       return res.redirect('back');
   } 
});



// gallery page
// route for user side gallery page
app.get("/gallery", async function(req, res) {
    // finds all events and stores them in the res.locals
    let events1 = await Events.find({});
    app.locals.policeEvents = events1;
    return res.render("Gallery");
});

// contact us page
// route for contact us page(user-side)
app.get("/contactus", async function(req, res) {
    // finds all the details from the database and passes it to the ejs file
    let policeDetails1 = await PoliceDetails.find({});
    return res.render("Contact-us", {
        policedet: policeDetails1
    });
});

// contact-us police side
app.get("/pcontactus", async function(req, res) {
    // finds all the police details from the database and passes it to the ejs file
    let policeDetails1 = await PoliceDetails.find({});
    // checks authority login for accessing the page
    if(isPoliceLoggedIn){
        return res.render("contactus_police", {
            policedet: policeDetails1
        });
    }else{
        return res.redirect('/police_login');
    }   
});

// contactus adding
app.post('/contactus/add', function(req, res) {
    // creating a database document for the contact us page from the details obtained from the form 
    PoliceDetails.create(req.body);
    return res.redirect('back');
});

app.get('/contactus/delete/:stationId', async function(req, res) {
    // finds if the authority want to dlete a station details, finds them using the  and deletes them 
    let station = await PoliceDetails.findById(req.params.stationId);
    station.remove();
    return res.redirect('back');
})

// police side gallery page
app.get("/gallerypolice", async function (req, res) {
  try {
    // finds all the event details from the database and passes it to the ejs file
    let events1 = await Events.find({});
    app.locals.policeEvents = events1;
    if (!isPoliceLoggedIn) {
    // checks authority login and redirects if not logged in
      return res.redirect("/police_login");
    }
    return res.render("gallery_police");
  } catch (error) {
    console.log(error);
  }
});
// adding an event to the database
app.post("/gallerypolice/add-event",upload.single("tile"),async function (req, res) {
    try {
        // checking if the event is alredy present in the databse 
      let event = await Events.findOne({
        name: req.body.name,
        date: req.body.date,
      });
    //   if the event isnt present in the database then creating an event
      if (!event) {
        //   checking if the authority had set any tile for the event if yes store the image in the databse if not using default image
        if (req.file) {
          Events.create({
            name: req.body.name,
            date: req.body.date,
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
    } catch (error) {
      console.log("Error:",error);
    }
});

// event specefic images
app.get('/gallery/event/images/:eventid', async function (req, res) {
  try {
    //   find the event of which the images has to be displayed and passing it to the ejs
    let event1 = await Events.findById(req.params.eventid);
    return res.render('event',{
        event : event1
    }); 
} catch (error) {
    console.log("error:",error);
} 
});

// police side to event specefic images 
app.get('/gallery/pevent/images/:eventid', async function (req, res) {
    try {
    //   find the event of which the images has to be displayed and passing it to the ejs
    let event1 = await Events.findById(req.params.eventid);
    return res.render('events_police',{
      event : event1
    }); 
  } catch (error) {
    console.log("error:",error);
  } 
});
// add images to a specefic event
app.post('/gallery/pevent/images/add/:eventid', upload.single('image'),async function (req, res) {
  try {
    // finds all the details from the database and passes it to the ejs file
    let event1 = await Events.findByIdAndUpdate(req.params.eventid);
    // setting the path of the images which are to be uploaded
    let imagepath = '\\' + 'uploads' + '\\' + req.file.filename;
    if (event1) {
    //   storing the image path in the event.images array
      event1.images.push(imagepath);
      event1.save();
    }
    return res.redirect('back'); 
  } catch (error) {
    console.log("error:",error);
  } 
});


// deleting images of specefic events
app.get('/images/delete/' , async function(req, res){
  try {
    // finds all the details of the event from the database 
    let imageEvent = await Events.findByIdAndUpdate(req.query.eventid);
    if(imageEvent){
    // if the event is found then delete the image from the event.image array
      imageEvent.images.remove(req.query.imagepath);
    // deletes the uploaded file from the project folder
      fs.unlinkSync(__dirname + req.query.imagepath);
      imageEvent.save();
      res.redirect('back');
    }
    else{
      console.log('couldnot find event');
      res.redirect('back');
    }

  } catch (error) {
    console.log('error:', error);
  }
});

// deleting the event
app.get("/gallery/event/delete/", async function(req, res) {
    try {
    // finds all the details of the event from the database 
        let eventToBeDeleted = await Events.findById(req.query.imageId);
        if (eventToBeDeleted) {
            // deleting the tile from uploads folder(if present)
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

app.get("/phome",async function(req, res) {
    // finds all the firs documents created in last 24 hours and passes it to the ejs file
    let firs1FiledToday = await Fir1.find({"createdAt":{$gt:new Date(Date.now() - 24*60*60 * 1000)}});
    let firs2FiledToday = await Fir2.find({"createdAt":{$gt:new Date(Date.now() - 24*60*60 * 1000)}});
    let firs3FiledToday = await Fir.find({"createdAt":{$gt:new Date(Date.now() - 24*60*60 * 1000)}});
    let totalFirs = firs1FiledToday.length + firs2FiledToday.length + firs3FiledToday.length ;
    // console.log('firs:',totalFirs);
    if (isPoliceLoggedIn){
        return res.render("home_police",{
            numberOfFirs : totalFirs
        });
    } else {
        return res.redirect("/police_login");
    }
    
});

// Post announcements
app.get("/", function(req, res) {
    Announcement.find({}, function(err, existingAnnouncements) {
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

app.get("/postannouncements", function(req, res) {
    if (!isPoliceLoggedIn) {
        return res.redirect("/police_login");
    }
    Announcement.find({}, function(err, existingAnnouncements) {
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

app.post("/postannouncements", function(req, res) {
    const announcement = req.body.newannouncement;

    const newAnnouncement = new Announcement({
        content: announcement,
    });

    newAnnouncement.save(function() {
        res.redirect("/postannouncements");
    });
});

app.post("/delete", function(req, res) {
    const announcementId = req.body.announcementtodelete;

    Announcement.findByIdAndRemove(announcementId, function(err) {
        if (!err) {
            console.log("Successfully deleted");
        }
    });
    res.redirect("/postannouncements");
});

//Criminals list
app.get("/criminalslist", function(req, res) {
    Criminal.find({}, function(err, criminalsList) {
        res.render("criminalslist", { criminalsList: criminalsList });
    });
});

app.get("/postcriminalslist", function(req, res) {
    if (!isPoliceLoggedIn) {
        return res.redirect("/police_login");
    }
    Criminal.find({}, function(err, criminalsList) {
        res.render("postcriminalslist", { criminalsList: criminalsList });
    });
});

app.post("/postcriminalslist", upload.single("image"), function(req, res) {
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

app.post("/deletecriminal", function(req, res) {
    const criminalId = req.body.criminalid;

    Criminal.findByIdAndRemove(criminalId, function(err) {
        if (!err) {
            console.log("Successfully Deleted the criminal from the list");
        } else {
            console.log(err);
        }
    });
    res.redirect("/postcriminalslist");
});

app.get("/firpage", function(req, res) {
    if(req.isAuthenticated()){
        res.render("firpage");
    }else{
        return res.redirect('/user_login');
    }
    
});
// fir form for Accident

app.get("/accidentform", function(req, res) {
    res.render("accidentform");
});

// fir form for Kidnap

app.get("/kidnapform", function(req, res) {
    res.render("kidnapform");
});

// fir form for Land Possession

app.get("/landpossessionform", function(req, res) {
    res.render("landpossessionform");
});

// fir form for Murder

app.get("/murderform", function(req, res) {
    res.render("murderform");
});

// fir form for Robbery

app.get("/robberyform", function(req, res) {
    res.render("robberyform");
});


// fir form for Accident

app.get("/sexualviolenceform", function(req, res) {
    res.render("sexualviolenceform");
});

// fir form for Accident

app.get("/threateningform", function(req, res) {
    res.render("threateningform");
});

// fir form for Others category
app.get("/firform", function(req, res) {
    res.render("firform");
});
// get route for viewing the fir
app.get("/viewfir", function(req, res) {
    if (!isPoliceLoggedIn) {
        return res.redirect("/police_login");
    } else {
        Fir1.find({}, function(err, foundItems) {
            if (!err) {
                res.render("viewfir", { firs: foundItems.reverse() });
            } else {
                console.log(err);
            }
        });
    }
});
// add firs of priyority 3
app.get("/viewfirp2", function(req, res) {
    if (!isPoliceLoggedIn) {
        return res.redirect("/police_login");
    } else {
        Fir2.find({}, function(err, foundItems) {
            if (!err) {
                res.render("viewfirp2", { firs: foundItems.reverse() });
            } else {
                console.log(err);
            }
        });
    }
});
// displays firs of pripority3
app.get("/viewfirp3", function(req, res) {
    if (!isPoliceLoggedIn) {
        return res.redirect("/police_login");
    } else {
        Fir3.find({}, function(err, foundItems) {
            if (!err) {
                res.render("viewfirp3", { firs: foundItems.reverse() });
            } else {
                console.log(err);
            }
        });
    }
});
// add firs of priyority 3
app.post("/viewfir/priority1", upload.single("image"), async function(req, res) {
    let newFir1;
    if (!req.file) {
        newFir1 = await Fir1.create({
            fullname: req.body.fullname,
            fatherorhusbandname: req.body.fatherorhusbandname,
            address: req.body.contactaddress,
            contactnumber: req.body.contactnumber,
            emailid: req.body.emailid,
            date: req.body.date,
            time: req.body.time,
            stationname: req.body.stationname,
            district: req.body.district,
            state: req.body.state,
            subject: req.body.subject,
            complaint: req.body.complaint,

        });
    } else {
        newFir1 = await Fir1.create({
            fullname: req.body.fullname,
            fatherorhusbandname: req.body.fatherorhusbandname,
            address: req.body.contactaddress,
            contactnumber: req.body.contactnumber,
            emailid: req.body.emailid,
            date: req.body.date,
            time: req.body.time,
            stationname: req.body.stationname,
            district: req.body.district,
            state: req.body.state,
            subject: req.body.subject,
            complaint: req.body.complaint,
            image: {
                data: fs.readFileSync(
                    path.join(__dirname + "/uploads/" + req.file.filename)
                ),
                contentType: "image/png",
                fname: "\\" + "uploads" + "\\" + req.file.filename,
            },
        });
    }
    return res.render('display', { firs: newFir1 });
});
// add firs of priyority 3
app.post("/viewfir/priority2", upload.single("image"), async function(req, res) {
    let newFir2;
    if (!req.file) {
        newFir2 = await Fir2.create({
            fullname: req.body.fullname,
            fatherorhusbandname: req.body.fatherorhusbandname,
            address: req.body.contactaddress,
            contactnumber: req.body.contactnumber,
            emailid: req.body.emailid,
            date: req.body.date,
            time: req.body.time,
            stationname: req.body.stationname,
            district: req.body.district,
            state: req.body.state,
            subject: req.body.subject,
            complaint: req.body.complaint,

        });
    } else {
        newFir2 = await Fir2.create({
            fullname: req.body.fullname,
            fatherorhusbandname: req.body.fatherorhusbandname,
            address: req.body.contactaddress,
            contactnumber: req.body.contactnumber,
            emailid: req.body.emailid,
            date: req.body.date,
            time: req.body.time,
            stationname: req.body.stationname,
            district: req.body.district,
            state: req.body.state,
            subject: req.body.subject,
            complaint: req.body.complaint,
            image: {
                data: fs.readFileSync(
                    path.join(__dirname + "/uploads/" + req.file.filename)
                ),
                contentType: "image/png",
                fname: "\\" + "uploads" + "\\" + req.file.filename,
            },
        });
    }
    return res.render('display', { firs: newFir2 });
});
// add firs of priyority 3
app.post("/viewfir/priority3", upload.single("image"), async function(req, res) {
    let newFir3;
    if (!req.file) {
        newFir3 = await Fir3.create({
            fullname: req.body.fullname,
            fatherorhusbandname: req.body.fatherorhusbandname,
            address: req.body.contactaddress,
            contactnumber: req.body.contactnumber,
            emailid: req.body.emailid,
            date: req.body.date,
            time: req.body.time,
            stationname: req.body.stationname,
            district: req.body.district,
            state: req.body.state,
            subject: req.body.subject,
            complaint: req.body.complaint,

        });
    } else {
        newFir3 = await Fir3.create({
            fullname: req.body.fullname,
            fatherorhusbandname: req.body.fatherorhusbandname,
            address: req.body.contactaddress,
            contactnumber: req.body.contactnumber,
            emailid: req.body.emailid,
            date: req.body.date,
            time: req.body.time,
            stationname: req.body.stationname,
            district: req.body.district,
            state: req.body.state,
            subject: req.body.subject,
            complaint: req.body.complaint,
            image: {
                data: fs.readFileSync(
                    path.join(__dirname + "/uploads/" + req.file.filename)
                ),
                contentType: "image/png",
                fname: "\\" + "uploads" + "\\" + req.file.filename,
            },
        });
    }
    return res.render('display', { firs: newFir3 });
});



app.get("/logout", function(req, res){
    req.logout();
    isPoliceLoggedIn = false;
    res.redirect("/");
  });
 
 
 
app.post("/police_register", function (req, res) {
    if (isPoliceLoggedIn) {
      return res.redirect("/phome");
    }
    const newUser = new Authority({
      username: req.body.pusername,
      password: req.body.ppassword,
    });
  
    newUser.save(function (err) {
      if (err) {
        console.log(err);
        isPoliceLoggedIn = false;
        res.redirect("/police_register");
      } else {
          isPoliceLoggedIn = true;
        res.redirect("/phome");
      }
    });
  });
 
 
app.post("/user_register", function(req, res) {
        User.register({username: req.body.username}, req.body.password, function(err, user){
            if (err) {
              console.log('*******',err);
              res.redirect("/user_register");
            } else {
              passport.authenticate("local")(req, res, function(){
                res.redirect("/firpage");
              });
            }
          });     
});
 
app.post("/user_login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user_login"
}), function (req, res) {
    return;
});
 
 
app.post("/police_login", function (req, res) {
    const username = req.body.pusername;
    const password = req.body.ppassword;
    if (isPoliceLoggedIn) {
      return res.redirect("/phome");
    }
 
    //console.log(username + " " + password);
    Authority.find({},function(err,authorities){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        
        else{
                //console.log(authorities[0].username);
            authorities.forEach(function(user) {
                //console.log(user.username);
                if(user.username === username){
                    if(user.password === password){
                        res.redirect("/phome");
                        isPoliceLoggedIn = true;
                    }
                }
            });
        }
    });
  });






app.listen(3000, function(req, res) {
    console.log("Listening at port http://localhost:3000");
});