const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    const q = await Model 
        .find({}) // No filter, return all records
        .exec(); 


        console.log(q);
    
    if(!q)
    { // Database returned no data
        return res
            .status(404) 
            .json(eer);
    } else { // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }


};

module.exports = {
    tripsList
};  

// GET /trips/:tripCode = lists a single trip
const tripsFindCode = async (req, res) => {
    const q = await Model
    .find({'code' : req.params.tripCode }) // Return single record
    .exec();

    console.log(q);
    


    if(!q)
    { // Database returned no data
        return res
            .status(404) 
            .json(eer);
    } else { // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
};

const tripsAddTrip = async (req, res) => {
    try {
        const newTrip = new Trip({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });
        const q = await newTrip.save();
        if (!q) return res.status(400).json({ message: 'Failed to create trip' });
        return res.status(201).json(q);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// PUT: /trips/:tripCode - Updates an existing Trip
const tripsUpdateTrip = async (req, res) => {
    try {
        console.log(req.params);
        console.log(req.body);
        const q = await Model.findOneAndUpdate(
            { code: req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true }
        ).exec();
        if (!q) return res.status(404).json({ message: 'Trip not found or not updated' });
        return res.status(200).json(q);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    tripsList,
    tripsFindCode,
    tripsAddTrip,
    tripsUpdateTrip
};