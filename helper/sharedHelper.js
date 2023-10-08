const sendResponse = (res, data, success, statusCode, message) => {
  res.json({
    data: data,
    success: success,
    status: statusCode,
    message: message,
  });
};
module.exports = sendResponse;
