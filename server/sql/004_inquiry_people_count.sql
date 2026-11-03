USE height_site;

ALTER TABLE inquiries
  ADD COLUMN number_of_people INT UNSIGNED NOT NULL DEFAULT 1
  AFTER phone;
