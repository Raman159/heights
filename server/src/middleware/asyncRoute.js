import { ZodError } from "zod";

function fail(res, error) {
  if (error?.code === "ER_DUP_ENTRY")
    return res
      .status(409)
      .json({ error: "That record already exists" });
  if (error instanceof ZodError)
    return res
      .status(400)
      .json({ error: error.issues.map((issue) => issue.message).join("; ") });
  res
    .status(error.status || 500)
    .json({ error: error.status ? error.message : "Unexpected server error" });
  if (!error.status) console.error(error);
}

export default (handler) => (req, res) =>
  Promise.resolve(handler(req, res)).catch((error) => fail(res, error));
