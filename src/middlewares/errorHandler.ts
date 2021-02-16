import { Request, Response, NextFunction } from "express";
import { getLogger } from "@utils";

const log = getLogger(__dirname, __filename);

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) {
    return next();
  }

  const { id } = req as any;

  try {
    const {
      message,
      messageUI,
      stack,
      stacktrace,
      status,
      statusCode: statusCde,
    } = err;
    const statusCode = status || statusCde || 500;
    const body = {
      message: messageUI || message || "Error unknown",
      error: true,
    };

    if (process.env.NODE_ENV !== "production") {
      (body as any).stacktrace = stack || stacktrace || "No stacktrace";
    }

    log.debug({ id, message: stack || stacktrace });
    log.error({ id, message: message || messageUI || "Error unknown" });

    res.status(statusCode).json(body);
  } catch (error) {
    const { message } = error;
    log.error({ id, message: message || "Error unknown." });
    res.status(500).json({ message: `Error unknown. Error: ${message}` });
  }
};

export default errorHandler;
