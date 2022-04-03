exports.getAllUsers = (req, res) => {
  const users = req.cachedData;
  res.status(200).json({
    status: 'success',
    data: { users },
  });
};
