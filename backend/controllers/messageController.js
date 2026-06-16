const { db } = require('../config/firebase');

/**
 * @desc    Get user messages
 * @route   GET /api/messages
 * @access  Private
 */
const getMessages = async (req, res, next) => {
  try {
    const messagesSnap = await db.collection('users')
      .doc(req.user.uid)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .get();

    const messages = [];
    messagesSnap.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        sender: data.sender,
        text: data.text,
        image: data.image,
        time: data.time,
        actions: data.actions
      });
    });

    res.json({
      success: true,
      data: { messages },
      message: 'Messages fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new message
 * @route   POST /api/messages
 * @access  Private
 */
const createMessage = async (req, res, next) => {
  try {
    const { sender, text, image, time, actions } = req.body;

    if (!sender || !text || !time) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required message fields' 
      });
    }

    const messageData = {
      sender,
      text,
      image: image || '',
      time,
      actions: actions || [],
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('users')
      .doc(req.user.uid)
      .collection('messages')
      .add(messageData);

    res.status(201).json({
      success: true,
      data: {
        message: {
          id: docRef.id,
          ...messageData
        }
      },
      message: 'Message created successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all user messages
 * @route   DELETE /api/messages/all/clear
 * @access  Private
 */
const clearMessages = async (req, res, next) => {
  try {
    const messagesRef = db.collection('users')
      .doc(req.user.uid)
      .collection('messages');
      
    const messagesSnap = await messagesRef.get();

    const batch = db.batch();
    messagesSnap.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    res.json({ 
      success: true, 
      data: {}, 
      message: 'All user messages cleared successfully' 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  createMessage,
  clearMessages
};
