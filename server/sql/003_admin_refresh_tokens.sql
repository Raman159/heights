USE height_site;

CREATE TABLE IF NOT EXISTS admin_refresh_tokens (
  token_hash CHAR(64) NOT NULL PRIMARY KEY,
  admin_id INT UNSIGNED NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX admin_refresh_tokens_admin_id_idx (admin_id),
  INDEX admin_refresh_tokens_expires_at_idx (expires_at),
  CONSTRAINT admin_refresh_tokens_admin_fk
    FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
);
