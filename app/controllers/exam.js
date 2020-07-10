const createRequest = async (req, res) => {
  return res.send('Creating!');
};

const updateRequest = async (req, res) => {
  return res.send('Updating!');
};

const deleteRequest = async (req, res) => {
  return res.send('Deleting!');
};

const readRequest = async (req, res) => {
  return res.send('Reading!');
};

module.exports = {
  createRequest,
  updateRequest,
  deleteRequest,
  readRequest
};