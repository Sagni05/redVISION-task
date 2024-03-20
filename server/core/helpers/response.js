const ErrorRes = (message, statusCode = 500, status = "ERROR") => {
  return { statusCode, status, message };
};

const SuccessRes = (message, data, statusCode = 200, status = "SUCCESS") => {
  let res = {
    statusCode,
    status,
    message,
  };
  if (data && typeof data === "string") {
    res = { ...res, token: data };
  } else if (data?.length >= 0) {
    res = { ...res, data };
  }
  return res;
};

class AppError extends Error {
  statusCode;
  name = "APP ERROR";
  message = "Internal Server Error";

  constructor(msg) {
    super(msg);
    this.statusCode = 500;
    if (msg) this.message = msg;
  }
}

class BadRequestError extends AppError {
  statusCode = 400;
  name = "BAD REQUEST ERROR";
  message = "Please Review Your Request And Try Again";
  constructor(msg) {
    super(msg);
    if (msg) this.message = msg;
  }
}

class NotAllowedError extends AppError {
  statusCode = 406;
  name = "NOT ALLOWED ERROR";
  message = "Operation Not Allowed";
  constructor(msg) {
    super(msg);
    if (msg) this.message = msg;
  }
}

class UnauthorizedError extends NotAllowedError {
  statusCode = 401;
  name = "UNAUTHORIZED ERROR";
  message = "You Are Not Authorized; Please Login Or Contact The Administrator";
  constructor(msg) {
    super(msg);
    if (msg) this.message = msg;
  }
}

class Unauthorize extends NotAllowedError {
  statusCode = 401;
  name = "UNAUTHORIZED ERROR";
  message = "You Are Not Authorized to perform this task";
  constructor(msg) {
    super(msg);
    if (msg) this.message = msg;
  }
}

class NotFoundError extends UnauthorizedError {
  statusCode = 404;
  name = "NOT FOUND";
  message = "Sorry; Your Requested Resource Could Not Be Found";
  constructor(msg) {
    super(msg);
    if (msg) this.message = msg;
  }
}

module.exports = {
  ErrorRes,
  SuccessRes,
  AppError,
  BadRequestError,
  NotAllowedError,
  NotFoundError,
  UnauthorizedError,
  Unauthorize,
};
