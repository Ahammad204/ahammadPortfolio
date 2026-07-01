const Contact = require('../models/Contact');
const { sendContactNotification } = require('../config/mailer');

// POST /api/contact — public (rate-limited in routes)
exports.submitContact = async (req, res) => {
  try {
    const contactData = await Contact.create(req.body);
    
    // Fire-and-forget email notification
    // We don't await this in the main flow to avoid response delay.
    // Email failures are caught and logged silently, ensuring the contact
    // submission always succeeds from the user's perspective.
    sendContactNotification(req.body).catch(err => console.error('Mail error:', err));
    
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Send failed', error: err.message });
  }
};

// GET /api/contact — protected, newest first
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// PATCH /api/contact/:id/read — protected
exports.markRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Not found', error: 'Message not found' });
    res.json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed', error: err.message });
  }
};

// DELETE /api/contact/:id — protected
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Not found', error: 'Message not found' });
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed', error: err.message });
  }
};
