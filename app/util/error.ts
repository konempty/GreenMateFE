"use client";

export function isInstanceOfAPIError(object: unknown): object is ApiError {
  return object instanceof ApiError;
}

export class ApiError extends Error {
  redirectUrl: string = "";
  notFound: boolean = false;
  name = "ServerError";
  message = "Internal Server Error";
  statusCode = 500;
}

export class NotFoundError extends ApiError {
  name = "NotFoundError";
  message = "Not Found";
  statusCode = 404;
}

export class ForbiddenError extends ApiError {
  name = "ForbiddenError";
  message = "Forbidden";
  statusCode = 403;
}

export class AuthError extends ApiError {
  name = "AuthError";
  message = "Unauthorized";
  statusCode = 401;
}
