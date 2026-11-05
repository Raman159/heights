USE height_site;

ALTER TABLE offers
  ADD COLUMN original_price DECIMAL(10, 2) NULL,
  ADD COLUMN discounted_price DECIMAL(10, 2) NULL;
