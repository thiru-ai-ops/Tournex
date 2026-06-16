const { db } = require('../config/firebase');

/**
 * @desc    Create a new tour
 * @route   POST /api/tours
 * @access  Private/Admin
 */
const createTour = async (req, res, next) => {
  try {
    const { name, price, dates, image, description, maxGroupSize, duration, startLocation, difficulty } = req.body;

    if (!name || price === undefined || !dates) {
      return res.status(400).json({ success: false, message: 'Please provide tour name, price, and dates' });
    }

    const tourData = {
      name,
      price: Number(price),
      dates,
      image: image || '',
      description: description || '',
      maxGroupSize: maxGroupSize ? Number(maxGroupSize) : 10,
      duration: duration || '3 Days',
      startLocation: startLocation || 'India',
      difficulty: difficulty || 'Medium',
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('tours').add(tourData);

    res.status(201).json({
      success: true,
      data: {
        tour: {
          id: docRef.id,
          ...tourData
        }
      },
      message: 'Tour created successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tours
 * @route   GET /api/tours
 * @access  Public
 */
const getTours = async (req, res, next) => {
  try {
    const toursSnapshot = await db.collection('tours').orderBy('createdAt', 'desc').get();
    
    const tours = [];
    toursSnapshot.forEach((doc) => {
      tours.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: { tours },
      message: 'Tours fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single tour details
 * @route   GET /api/tours/:id
 * @access  Public
 */
const getTourById = async (req, res, next) => {
  try {
    const tourDoc = await db.collection('tours').doc(req.params.id).get();

    if (!tourDoc.exists) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    res.json({
      success: true,
      data: {
        tour: {
          id: tourDoc.id,
          ...tourDoc.data()
        }
      },
      message: 'Tour details fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update tour details
 * @route   PUT /api/tours/:id
 * @access  Private/Admin
 */
const updateTour = async (req, res, next) => {
  try {
    const tourRef = db.collection('tours').doc(req.params.id);
    const tourDoc = await tourRef.get();

    if (!tourDoc.exists) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    const fieldsToUpdate = {};
    const allowedFields = [
      'name', 'price', 'dates', 'image', 'description', 
      'maxGroupSize', 'duration', 'startLocation', 'difficulty'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = field === 'price' || field === 'maxGroupSize' 
          ? Number(req.body[field]) 
          : req.body[field];
      }
    });

    fieldsToUpdate.updatedAt = new Date().toISOString();

    await tourRef.update(fieldsToUpdate);

    const updatedDoc = await tourRef.get();

    res.json({
      success: true,
      data: {
        tour: {
          id: updatedDoc.id,
          ...updatedDoc.data()
        }
      },
      message: 'Tour updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete tour
 * @route   DELETE /api/tours/:id
 * @access  Private/Admin
 */
const deleteTour = async (req, res, next) => {
  try {
    const tourRef = db.collection('tours').doc(req.params.id);
    const tourDoc = await tourRef.get();

    if (!tourDoc.exists) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    await tourRef.delete();

    res.json({
      success: true,
      data: {},
      message: 'Tour removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTour,
  getTours,
  getTourById,
  updateTour,
  deleteTour
};
