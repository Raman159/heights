USE height_site;

CREATE TABLE IF NOT EXISTS menus (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url VARCHAR(1024),
  file_url VARCHAR(1024) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX menus_sort_order_idx(sort_order, id)
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
