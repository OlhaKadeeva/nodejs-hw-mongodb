export default (err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).json({ status, message, data: message });
};
