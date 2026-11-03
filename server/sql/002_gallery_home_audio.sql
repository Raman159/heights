USE height_site;

CREATE TABLE IF NOT EXISTS gallery (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  image_url VARCHAR(1024) NOT NULL,
  category VARCHAR(40) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX gallery_sort_order_idx(sort_order, id)
);

INSERT IGNORE INTO settings(`key`, `value`)
VALUES ('home_audio', '');
