const { db } = require('../config/firebase');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User profile not found in database' 
      });
    }

    const data = userSnap.data();

    res.json({
      success: true,
      data: {
        user: {
          uid: req.user.uid,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          bio: data.bio,
          location: data.location,
          tier: data.tier || data.role || 'Explorer',
          joinDate: data.joinDate,
          stats: {
            statesVisited: Number(data.statesVisited ?? 0),
            savedTripsCount: Number(data.savedTripsCount ?? 0),
            reviewsCount: Number(data.reviewsCount ?? 0),
            savedTotal: Number(data.savedTotal ?? 0)
          },
          level: Number(data.level ?? 1),
          currentXp: Number(data.currentXp ?? 0),
          maxXp: Number(data.maxXp ?? 1000)
        }
      },
      message: 'User profile fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User profile not found in database' 
      });
    }

    const fieldsToUpdate = {};
    const { name, avatar, bio, location, tier, stats, level, currentXp, maxXp } = req.body;

    if (name !== undefined) fieldsToUpdate.name = name;
    if (avatar !== undefined) fieldsToUpdate.avatar = avatar;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (location !== undefined) fieldsToUpdate.location = location;
    if (tier !== undefined) fieldsToUpdate.tier = tier;

    // Handle nested or flat stats
    if (stats !== undefined && typeof stats === 'object') {
      if (stats.statesVisited !== undefined) fieldsToUpdate.statesVisited = Number(stats.statesVisited);
      if (stats.savedTripsCount !== undefined) fieldsToUpdate.savedTripsCount = Number(stats.savedTripsCount);
      if (stats.reviewsCount !== undefined) fieldsToUpdate.reviewsCount = Number(stats.reviewsCount);
      if (stats.savedTotal !== undefined) fieldsToUpdate.savedTotal = Number(stats.savedTotal);
    } else {
      if (req.body.statesVisited !== undefined) fieldsToUpdate.statesVisited = Number(req.body.statesVisited);
      if (req.body.savedTripsCount !== undefined) fieldsToUpdate.savedTripsCount = Number(req.body.savedTripsCount);
      if (req.body.reviewsCount !== undefined) fieldsToUpdate.reviewsCount = Number(req.body.reviewsCount);
      if (req.body.savedTotal !== undefined) fieldsToUpdate.savedTotal = Number(req.body.savedTotal);
    }

    if (level !== undefined) fieldsToUpdate.level = Number(level);
    if (currentXp !== undefined) fieldsToUpdate.currentXp = Number(currentXp);
    if (maxXp !== undefined) fieldsToUpdate.maxXp = Number(maxXp);

    fieldsToUpdate.updatedAt = new Date().toISOString();

    await userRef.update(fieldsToUpdate);
    const updatedSnap = await userRef.get();
    const updatedData = updatedSnap.data();

    res.json({
      success: true,
      data: {
        user: {
          uid: req.user.uid,
          name: updatedData.name,
          email: updatedData.email,
          avatar: updatedData.avatar,
          bio: updatedData.bio,
          location: updatedData.location,
          tier: updatedData.tier || updatedData.role || 'Explorer',
          joinDate: updatedData.joinDate,
          stats: {
            statesVisited: Number(updatedData.statesVisited ?? 0),
            savedTripsCount: Number(updatedData.savedTripsCount ?? 0),
            reviewsCount: Number(updatedData.reviewsCount ?? 0),
            savedTotal: Number(updatedData.savedTotal ?? 0)
          },
          level: Number(updatedData.level ?? 1),
          currentXp: Number(updatedData.currentXp ?? 0),
          maxXp: Number(updatedData.maxXp ?? 1000)
        }
      },
      message: 'User profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
