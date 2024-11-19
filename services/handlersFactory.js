const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeature = require("../utils/ApiFeature");

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) filter = req.filterObj;

    // Get number of total documents
    const totalDocuments = await Model.countDocuments();

    // Build query
    const apiFeature = new ApiFeature(Model.find(filter), req.query)
      .paginate(totalDocuments)
      .filter()
      .limitFields()
      .search(modelName)
      .sort();

    const { paginationResult, mongooseQuery } = apiFeature;

    // Execute query
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ result: documents.length, paginationResult, data: documents });
  });

exports.getOne = (Model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // 1) Build query
    let query = Model.findById(id);

    if (populateOpt) query = query.populate(populateOpt);

    // Execute query
    const document = await query;

    // Check if document exists
    if (!document) {
      return next(new ApiError(`No document with this id: ${id} !`, 404));
    }

    res.status(200).json({ data: document });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Check if document exists
    if (!document) {
      return next(
        new ApiError(`No document with this id: ${req.params.id} !`, 404)
      );
    }

    // Triggers the save middleware
    await document.save();

    res.status(200).json({ data: document });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete({ _id: id });

    // Check if document exists
    if (!document) {
      return next(new ApiError(`No document with this id: ${id} !`, 404));
    }

    // Triggers the remove middleware
    await document.deleteOne();

    res.status(204).send();
  });
