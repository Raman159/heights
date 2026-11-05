CREATE TABLE IF NOT EXISTS events (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    setting VARCHAR(200),
    image_url VARCHAR(1024),
    detail_heading_1 VARCHAR(200),
    detail_text_1 TEXT,
    detail_heading_2 VARCHAR(200),
    detail_text_2 TEXT,
    gallery_image_1 VARCHAR(1024),
    gallery_image_2 VARCHAR(1024),
    gallery_image_3 VARCHAR(1024),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX events_sort_order_idx (sort_order, id)
);

INSERT IGNORE INTO events (
    name, slug, summary, setting, image_url,
    detail_heading_1, detail_text_1, detail_heading_2, detail_text_2,
    gallery_image_1, gallery_image_2, gallery_image_3, sort_order
) VALUES
(
    'Buffet Dinner', 'buffet-dinner',
    'Bring everyone together over a generous, shared dining experience.',
    'Restaurant dining', '/media/restaurant-dining.webp',
    'A table made for gathering',
    'Make the meal part of the occasion. A buffet dinner gives guests room to settle in, share the moment, and choose at their own pace.',
    'For celebrations and get-togethers',
    'From family celebrations to group dinners, tell our team what you have in mind and we can help you plan the details around your gathering.',
    '/media/restaurant-dining.webp', '/media/bar-counter.webp', '/media/sauna-friends.webp', 0
),
(
    'Set Menu', 'set-menu',
    'A considered dining experience for occasions best enjoyed together.',
    'Restaurant dining', '/media/restaurant-lounge.webp',
    'A meal with its own rhythm',
    'A set menu creates a shared dining experience, with each part of the meal bringing guests together around the table.',
    'Made for hosting',
    'Whether you are planning a special dinner or hosting a group, our team can discuss your occasion and help coordinate your enquiry.',
    '/media/restaurant-lounge.webp', '/media/restaurant-dining.webp', '/media/bar-counter.webp', 1
),
(
    'Conference Hall', 'conference-hall',
    'A welcoming venue for conferences, presentations, and larger gatherings.',
    'Conference and event venue', '/media/restaurant-interior.webp',
    'Bring your gathering together',
    'The conference hall offers a dedicated setting for bringing guests together for a shared programme, presentation, or special occasion.',
    'Plan the details with our team',
    'Share your event plans and requirements with us. Our team will help you explore the arrangements available for your gathering.',
    '/media/restaurant-interior.webp', '/media/terrace-lounge.webp', '/media/bar-counter.webp', 2
),
(
    'Meeting Room', 'meeting-room',
    'A focused, comfortable setting for meetings and smaller group sessions.',
    'Meeting and event venue', '/media/terrace-lounge.webp',
    'Space to meet and focus',
    'Gather your team or guests in a dedicated setting for a meeting, discussion, or working session.',
    'Make an enquiry',
    'Let us know what kind of meeting you are planning and what you need from the space. Our team can help you with the next steps.',
    '/media/terrace-lounge.webp', '/media/restaurant-interior.webp', '/media/sauna-friends.webp', 3
);
