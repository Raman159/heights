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
        original_price DECIMAL(10, 2) NULL,
        discounted_price DECIMAL(10, 2) NULL,
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
    IF NOT EXISTS menus (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        image_url VARCHAR(1024),
        file_url VARCHAR(1024) NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX menus_sort_order_idx (sort_order, id)
    );

CREATE TABLE
    IF NOT EXISTS team_members (
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
        INDEX team_members_sort_order_idx (sort_order, id)
    );

CREATE TABLE IF NOT EXISTS services (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    subtitle VARCHAR(200),
    description TEXT,
    image_url VARCHAR(1024),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX services_sort_order_idx(sort_order, id)
);

CREATE TABLE IF NOT EXISTS spa_categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX spa_categories_sort_order_idx(sort_order, id)
);

CREATE TABLE IF NOT EXISTS spa_treatments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED NOT NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    benefits TEXT,
    pricing LONGTEXT,
    image_url VARCHAR(1024),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX spa_treatments_category_sort_idx(category_id, sort_order, id),
    CONSTRAINT spa_treatments_category_fk
        FOREIGN KEY (category_id) REFERENCES spa_categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    setting VARCHAR(200),
    image_url VARCHAR(1024),
    details LONGTEXT,
    gallery_image_1 VARCHAR(1024),
    gallery_image_2 VARCHAR(1024),
    gallery_image_3 VARCHAR(1024),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX events_sort_order_idx (sort_order, id)
);

INSERT IGNORE INTO events (
    name, slug, summary, setting, image_url, details,
    gallery_image_1, gallery_image_2, gallery_image_3, sort_order
) VALUES
(
    'Buffet Dinner', 'buffet-dinner',
    'Bring everyone together over a generous, shared dining experience.',
    'Restaurant dining', '/media/restaurant-dining.webp',
    '<h2>A table made for gathering</h2><p>Make the meal part of the occasion. A buffet dinner gives guests room to settle in, share the moment, and choose at their own pace.</p><h2>For celebrations and get-togethers</h2><p>From family celebrations to group dinners, tell our team what you have in mind and we can help you plan the details around your gathering.</p>',
    '/media/restaurant-dining.webp', '/media/bar-counter.webp', '/media/sauna-friends.webp', 0
),
(
    'Set Menu', 'set-menu',
    'A considered dining experience for occasions best enjoyed together.',
    'Restaurant dining', '/media/restaurant-lounge.webp',
    '<h2>A meal with its own rhythm</h2><p>A set menu creates a shared dining experience, with each part of the meal bringing guests together around the table.</p><h2>Made for hosting</h2><p>Whether you are planning a special dinner or hosting a group, our team can discuss your occasion and help coordinate your enquiry.</p>',
    '/media/restaurant-lounge.webp', '/media/restaurant-dining.webp', '/media/bar-counter.webp', 1
),
(
    'Conference Hall', 'conference-hall',
    'A welcoming venue for conferences, presentations, and larger gatherings.',
    'Conference and event venue', '/media/restaurant-interior.webp',
    '<h2>Bring your gathering together</h2><p>The conference hall offers a dedicated setting for bringing guests together for a shared programme, presentation, or special occasion.</p><h2>Plan the details with our team</h2><p>Share your event plans and requirements with us. Our team will help you explore the arrangements available for your gathering.</p>',
    '/media/restaurant-interior.webp', '/media/terrace-lounge.webp', '/media/bar-counter.webp', 2
),
(
    'Meeting Room', 'meeting-room',
    'A focused, comfortable setting for meetings and smaller group sessions.',
    'Meeting and event venue', '/media/terrace-lounge.webp',
    '<h2>Space to meet and focus</h2><p>Gather your team or guests in a dedicated setting for a meeting, discussion, or working session.</p><h2>Make an enquiry</h2><p>Let us know what kind of meeting you are planning and what you need from the space. Our team can help you with the next steps.</p>',
    '/media/terrace-lounge.webp', '/media/restaurant-interior.webp', '/media/sauna-friends.webp', 3
);

INSERT INTO menus (title, description, image_url, file_url)
SELECT 'Breakfast Menu', 'Start your day with breakfast at HEIGHT.', '/media/breakfast-plate.webp', '/Menu/Breakfast%20Menu.pdf'
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE file_url = '/Menu/Breakfast%20Menu.pdf');

INSERT INTO menus (title, description, image_url, file_url)
SELECT 'Menu by Height', 'Explore our food menu for lunch and dinner.', '/media/nepali-thali.webp', '/Menu/Menu%20by%20Height.pdf'
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE file_url = '/Menu/Menu%20by%20Height.pdf');

INSERT INTO menus (title, description, image_url, file_url)
SELECT 'Drinks Menu', 'Non-alcoholic and alcoholic beverages.', '/media/orange-mocktail.webp', '/Menu/Drinks%20Menu.pdf'
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE file_url = '/Menu/Drinks%20Menu.pdf');

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