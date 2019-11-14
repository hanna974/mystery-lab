const express = require("express");
const router = express.Router();
const tagModel = require("./../models/Tag");
const sneaker = require("./../models/Sneaker");
const user = require("./../models/User");
const bcrypt = require("bcrypt");
const protectUserRoute = require("../middleware/checkLoginStatus");
const uploader = require("./../config/cloudinary");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/home", (req, res) => {
  res.redirect("/");
});

router.get("/sneakers/collection", (req, res) => {
  sneaker.find().then(dbRes => {
    console.log(dbRes);
    res.render("products", { sneakers: dbRes });
  });
});

router.get("/sneakers/:cat", (req, res) => {
  sneaker.find({ category: { $eq: req.params.cat } }).then(dbRes => {
    console.log(dbRes);
    res.render("products", { sneakers: dbRes });
  });
});

router.get("/one-product/:id", (req, res) => {
  sneaker.findById(req.params.id).then(dbRes => {
    res.render("one_product", { sneaker: dbRes });
  });
});

// WHEN USER IS LOGGED-IN = ADD, MANAGE, EDIT
// ADD SNEAKERS
router.get("/prod-add", protectUserRoute, (req, res) => {
  res.render("products_add", {
    tags: ["result de ta db tags (all)"],
    scripts: ["tag"]
  });
});

router.post("/tag-add", protectUserRoute, (req, res) => {
  console.log(req.body);
  tagModel.create(req.body).then(dbRes => {
    res.send(dbRes);
  });
});

router.post(
  "/prod-add",
  protectUserRoute,
  uploader.single("image"),
  (req, res) => {
    const newSneaker = {
      name: req.body.name,
      ref: req.body.ref,
      size: req.body.size,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
      category: req.body.category,
      tags: req.body.tags
    };
    if (req.file) {
      req.body.image = req.file.secure_url;
    }
    sneaker.create(newSneaker).then(dbRes => {
      console.log("New Sneaker created succesfully", dbRes);
      res.redirect("/prod-manage");
    });
  }
);

// MANAGE AND DELETE SNEAKERS

router.get("/prod-manage", protectUserRoute, (req, res) => {
  sneaker.find().then(dbRes => {
    res.render("products_manage", { sneakers: dbRes });
  });
});

router.get("/product-delete/:id", protectUserRoute, (req, res) => {
  sneaker.findByIdAndDelete(req.params.id).then(dbRes => {
    res.redirect("/prod-manage");
  });
});

router.get("/product-edit/:id", protectUserRoute, (req, res) => {
  sneaker.findById(req.params.id).then(dbRes => {
    res.render("product_edit", { sneaker: dbRes });
  });
});

router.post("/product-edit/:id", protectUserRoute, (req, res) => {
  sneaker
    .findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      ref: req.body.ref,
      size: req.body.size,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      tags: req.body.tags
    })
    .then(dbRes => {
      res.redirect("/prod-manage");
    })
    .catch(dbErr => console.error(dbErr));
});

//SIGN UP
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  user
    .findOne({ email: req.body.email })
    .then(dbRes => {
      if (dbRes) {
        res.redirect("/signin");
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashed = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashed;

        user.create(req.body).then(result => {
          console.log("new user", result);
          req.session.currentUser = result;
          res.redirect("/");
        });
      }
    })
    .catch(dbErr => {
      console.log(dbErr);
    });
});

// SIGN IN
router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signin", (req, res) => {
  user
    .findOne({ email: req.body.email })
    .then(dbRes => {
      if (!dbRes) {
        res.redirect("/signup");
        throw "You don't have an account yet. Please sign up";
      } else {
        if (bcrypt.compareSync(req.body.password, dbRes.password)) {
          req.session.currentUser = dbRes;
          res.redirect("/");
          throw "Welcome";
        }
        res.redirect("/signin");
        throw "Wrong password";
      }
    })
    .catch(dbErr => {
      console.log(dbErr);
    });
});

// LOG OUT
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    res.locals.isLoggedIn = undefined;
    res.redirect("/signin");
  });
});

module.exports = router;
