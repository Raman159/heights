import { before, test } from "node:test";
import assert from "node:assert/strict";

process.env.JWT_SECRET ||= "local-test-secret-with-at-least-32-characters";

let inquirySchema;
before(async () => {
  ({ inquirySchema } = await import("../src/routes/inquiries.js"));
});

const validInquiry = {
  name: "Sam O'Neil",
  email: "sam@example.com",
  phone: "9812345678",
  number_of_people: "3",
  service: "Wellness",
  preferred_date: "",
  message: "Please contact me about booking.",
  type: "contact",
};

test("validates and normalizes a valid inquiry including people count", () => {
  const result = inquirySchema.parse(validInquiry);

  assert.equal(result.number_of_people, 3);
  assert.equal(result.name, "Sam O'Neil");
});

test("requires a digits-only ten-digit phone number", () => {
  for (const phone of ["981234567a", "98 1234567", "+9812345678", "123"]) {
    assert.equal(
      inquirySchema.safeParse({ ...validInquiry, phone }).success,
      false,
    );
  }
});

test("requires a positive whole number of people", () => {
  for (const number_of_people of ["0", "-1", "1.5", "many", "4294967296"]) {
    assert.equal(
      inquirySchema.safeParse({ ...validInquiry, number_of_people }).success,
      false,
    );
  }
  assert.equal(
    inquirySchema.safeParse({ ...validInquiry, number_of_people: "1" }).success,
    true,
  );
});

test("rejects malformed contact fields and invalid or past dates", () => {
  assert.equal(
    inquirySchema.safeParse({ ...validInquiry, name: "123" }).success,
    false,
  );
  assert.equal(
    inquirySchema.safeParse({ ...validInquiry, email: "not-an-email" }).success,
    false,
  );
  assert.equal(
    inquirySchema.safeParse({ ...validInquiry, message: " short " }).success,
    false,
  );
  assert.equal(
    inquirySchema.safeParse({
      ...validInquiry,
      preferred_date: "2026-02-31",
    }).success,
    false,
  );
  assert.equal(
    inquirySchema.safeParse({
      ...validInquiry,
      preferred_date: "2000-01-01",
    }).success,
    false,
  );
});

test("defaults people count for older API clients", () => {
  const { number_of_people, ...olderPayload } = validInquiry;

  assert.equal(inquirySchema.parse(olderPayload).number_of_people, 1);
});
