const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require('fs');
const path = require('path');
const Campground = require("../models/campground");
const cities=require("./cities");
const{places,descriptors}=require("./seedHelpers");
// Load environment variables from .env file
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading environment variables from:', envPath);

if (fs.existsSync(envPath)) {
  console.log('Found .env file');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  console.log('Content of .env file:\n', envContent);
} else {
  console.log('.env file not found');
}

dotenv.config({ path: envPath });

console.log("Environment variables loaded");

// Log all environment variables to verify the .env file is loaded
console.log("All Environment Variables:", process.env);

// Log the MONGO_URL to verify it's loaded correctly
console.log("MONGO_URL:", process.env.MONGO_URL);

const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    console.error("MongoDB connection string is not defined in environment variables");
    process.exit(1); // Exit process with failure
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connection successful");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
const sample=array =>array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
  try {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
      const random1000=Math.floor(Math.random()*1000);
     const camp= new Campground({
        location:`${cities[random1000].city},${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`
      })
      await camp.save();
    }
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Database seeding failed:", error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(seedDB).then(()=>{
  mongoose.connection.close();
});
