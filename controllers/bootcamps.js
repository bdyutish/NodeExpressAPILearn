const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');
// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @acces PUBLIC
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @acces PUBLIC
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @acces Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @acces Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp)
    return new ErrorResponse(
      `Bootcamp not found with id of ${req.params.id}`,
      404
    );

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @acces Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    return new ErrorResponse(
      `Bootcamp not found with id of ${req.params.id}`,
      404
    );

  bootcamp.remove();

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Get Bootcamps within radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @acces Private
exports.getBoocampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get latitude and longitude from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //Calc radius using radians
  //Divide dist by radius of Earth
  //Earth radius is 3,963 mi
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc Upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @acces Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  //Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  //Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Max file size is 1MB`, 400));
  }

  //create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse('Problem with upload', 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({ success: true, data: file.name });
  });
});
