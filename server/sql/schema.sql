CREATE DATABASE IF NOT EXISTS height_site CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

USE height_site;

CREATE TABLE
    IF NOT EXISTS admins (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(80) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS admin_refresh_tokens (
        token_hash CHAR(64) NOT NULL PRIMARY KEY,
        admin_id INT UNSIGNED NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX admin_refresh_tokens_admin_id_idx (admin_id),
        INDEX admin_refresh_tokens_expires_at_idx (expires_at),
        CONSTRAINT admin_refresh_tokens_admin_fk
            FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS offers (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        image_url VARCHAR(1024),
        link_url VARCHAR(1024),
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(200) NOT NULL UNIQUE,
        excerpt TEXT,
        body LONGTEXT,
        image_url VARCHAR(1024),
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS reviews (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        author VARCHAR(160) NOT NULL,
        quote TEXT NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS videos (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200),
        video_url VARCHAR(1024),
        thumbnail_url VARCHAR(1024),
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS gallery (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        image_url VARCHAR(1024) NOT NULL,
        category VARCHAR(40) NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX gallery_sort_order_idx (sort_order, id)
    );

CREATE TABLE
    IF NOT EXISTS inquiries (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(40) NOT NULL,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(190) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        number_of_people INT UNSIGNED NOT NULL DEFAULT 1,
        service VARCHAR(120),
        preferred_date DATE NULL,
        message TEXT NOT NULL,
        status ENUM ('new', 'handled') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS settings (`key` VARCHAR(100) PRIMARY KEY, `value` TEXT);

INSERT IGNORE INTO settings (`key`, `value`)
VALUES
    ('home_audio', '');