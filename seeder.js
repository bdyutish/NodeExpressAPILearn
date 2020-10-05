const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//Load env variables
dotenv.config({ path: './config/config.env' });

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//Load Models
const Bootcamp = require('./models/Bootcamp');

//Read Json Files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

//IMport data into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('Data imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//Delete Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany(); //Delete everything
    console.log('Data destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] == '-d') {
  deleteData();
}
