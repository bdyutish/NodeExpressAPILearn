// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @acces PUBLIC
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Show all bootcamps' });
};

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @acces PUBLIC
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: `Get bootcamp ${req.params.id}` });
};

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @acces Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Create new bootcamp' });
};

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @acces Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: `Update bootcamp ${req.params.id}` });
};

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @acces Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: `Delete bootcamp ${req.params.id}` });
};
