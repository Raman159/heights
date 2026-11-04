USE height_site;

CREATE TABLE IF NOT EXISTS team_members (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  department VARCHAR(160) NOT NULL,
  designation VARCHAR(200) NOT NULL,
  biography TEXT,
  image_url VARCHAR(1024),
  instagram_url VARCHAR(1024),
  linkedin_url VARCHAR(1024),
  email VARCHAR(254),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX team_members_sort_order_idx(sort_order, id)
);
