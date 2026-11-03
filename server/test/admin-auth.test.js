import { before, test } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET ||= "local-test-secret-with-at-least-32-characters";

let admin;
before(async () => {
  ({ default: admin } = await import("../src/middleware/admin.js"));
});

function callMiddleware(authorization) {
  const req = { headers: { authorization } };
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  let nextCalled = false;
  admin(req, res, () => {
    nextCalled = true;
  });
  return { req, res, nextCalled };
}

test("admin middleware accepts a valid admin Bearer token", () => {
  const token = jwt.sign(
    { id: 1, role: "admin", token_use: "access" },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "1m" },
  );
  const { req, res, nextCalled } = callMiddleware("Bearer " + token);

  assert.equal(nextCalled, true);
  assert.equal(req.admin.id, 1);
  assert.equal(res.statusCode, 200);
});

test("admin middleware identifies expired access tokens for refresh", () => {
  const token = jwt.sign(
    { id: 1, role: "admin" },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: -1 },
  );
  const { res, nextCalled } = callMiddleware("Bearer " + token);

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 401);
  assert.equal(res.body.code, "ACCESS_TOKEN_EXPIRED");
});

test("admin middleware rejects missing and non-admin tokens", () => {
  const missing = callMiddleware(undefined);
  const userToken = jwt.sign(
    { id: 2, role: "user" },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "1m" },
  );
  const nonAdmin = callMiddleware("Bearer " + userToken);

  assert.equal(missing.res.statusCode, 401);
  assert.equal(missing.res.body.code, "AUTH_REQUIRED");
  assert.equal(nonAdmin.res.statusCode, 403);
  assert.equal(nonAdmin.res.body.code, "ADMIN_REQUIRED");
});
