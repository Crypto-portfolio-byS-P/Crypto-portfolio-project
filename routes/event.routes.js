const express = require("express");
const router = express.Router();
const Event = require("../models/Event.model");
const fileUploader = require("../config/cloudinary.config");


router.get("/events/create", (req, res) =>
  res.render("events/events-create")
);

router.post(
  "/events/create",
  fileUploader.single("event-cover-image"),
  (req, res) => {
    const { name, location, date, details } = req.body;

    Event.create({ name, location, date, details, imageUrl: req.file.path })
      .then((newlyCreatedEventFromDB) => {
        res.redirect('/events');
      })
      .catch((error) =>
        console.log(`Error while creating a new event: ${error}`)
      );
  }
);

router.get("/events", (req, res) => {
  Event.find()
    .then((eventsFromDB) => {
      // console.log(moviesFromDB);
      res.render("events/events-list.hbs", { events: eventsFromDB });
    })
    .catch((err) =>
      console.log(`Error while getting the events from the DB: ${err}`)
    );
});

router.get("/events/:id/edit", (req, res) => {
  const { id } = req.params;

  Event.findById(id)
    .then((eventToEdit) => res.render("events/event-edit", eventToEdit))
    .catch((error) =>
      console.log(`Error while getting a single event for edit: ${error}`)
    );
});
 
router.post(
  "/events/:id/edit",
  fileUploader.single("event-cover-image"),
  (req, res) => {
    const { id } = req.params;
    const { name, location, date, details, existingImage } = req.body;

    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    } else {
      imageUrl = existingImage;
    }

    Event.findByIdAndUpdate(id, { name, location, date, details, imageUrl }, { new: true })
      .then(() => res.redirect(`/events`))
      .catch((error) =>
        console.log(`Error while updating a single movie: ${error}`)
      );
  }
);
 

module.exports = router;
