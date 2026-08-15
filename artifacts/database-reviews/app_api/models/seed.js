// Bring in the DB connection and database schemas.
const Mongoose = require('./db');
const Trip = require('./travlr');
const Review = require('./review');
const fs = require('fs');

const trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));
const reviewSeeds = JSON.parse(fs.readFileSync('./data/reviews.json', 'utf8'));

const seedDB = async () => {
  await Review.deleteMany({});
  await Trip.deleteMany({});

  const insertedTrips = await Trip.insertMany(trips);
  const tripsByCode = new Map(insertedTrips.map((trip) => [trip.code, trip]));

  const reviews = reviewSeeds.map((review) => {
    const trip = tripsByCode.get(review.tripCode);
    if (!trip) {
      throw new Error(`Unable to seed review because trip ${review.tripCode} does not exist.`);
    }

    return {
      ...review,
      trip: trip._id
    };
  });

  await Review.insertMany(reviews);
  console.log(`Seeded ${insertedTrips.length} trips and ${reviews.length} reviews.`);
};

seedDB()
  .then(async () => {
    await Mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Database seed failed:', error);
    await Mongoose.connection.close();
    process.exit(1);
  });
