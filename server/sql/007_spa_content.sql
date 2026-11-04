USE height_site;

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

INSERT IGNORE INTO settings (`key`, `value`) VALUES
  ('spa_title', 'Spa at The Height'),
  ('spa_tagline', 'Rejuvenate Mind. Body. Soul.'),
  ('spa_intro_heading', 'A sanctuary for you'),
  ('spa_intro', 'At Spa at The Height, your well-being comes first. This is a space for you to relax, release and truly reconnect with yourself. Our Spa menu features a wide range of treatments, from deeply relaxing oil-based therapies to revitalizing dry massages and self pampering mini reflexologies.\n\nOur luxurious sanctuary offers eight elegantly designed single spa rooms and two exclusive couple suites. Among them, one signature couple suite stands apart, featuring a private balcony with private jacuzzi, breathtaking views from the top, and in-room dining for a truly immersive escape. Our each spa room is named after the majestic mountains of Nepal, symbolizing height, strength, and serenity.\n\nWith experienced therapists and a focus on personalized care, you’ll feel the difference from the moment you step in. We invite you to unwind, restore, and experience Spa at The Height.'),
  ('spa_hero_image', '/media/spa-lobby.webp'),
  ('spa_intro_image', '/media/spa-treatment.webp');

INSERT IGNORE INTO services (title, slug, subtitle, description, image_url, sort_order) VALUES
  ('Spa', 'spa', 'Restore your balance', 'A sanctuary for mindful restoration, oil-based therapy, dry massage and beautifully considered rituals.', '/media/spa-lobby.webp', 0),
  ('Gym', 'gym', 'Move with intention', 'A purposeful fitness destination with flexible memberships and space to pursue your goals.', '/media/gym-interior.webp', 1),
  ('Restro', 'restro', 'Dine above the everyday', 'Multi-cuisine dining, vibrant hospitality and memorable moments with an elevated view.', '/media/restaurant-interior.webp', 2),
  ('Salon', 'salon', 'A little time for yourself', 'Thoughtful personal care and salon experiences designed around you.', '/media/salon-chairs.webp', 3),
  ('Steam', 'steam', 'Unwind in warmth', 'A soothing steam experience to complement your wellness routine.', '/media/steam-room.webp', 4),
  ('Sauna', 'sauna', 'Deep calm, gentle heat', 'Step into restorative warmth and allow your pace to soften.', '/media/wooden-sauna.webp', 5),
  ('Jacuzzi', 'jacuzzi', 'Pause in comfort', 'Unwind and reconnect with an indulgent hydrotherapy escape.', '/media/jacuzzi-bath.webp', 6),
  ('Swimming Pool', 'pool', 'Your elevated escape', 'An inviting poolside retreat with an incredible city outlook.', '/media/infinity-pool.webp', 7),
  ('Ice Bath', 'icebath', 'Freeze your moments', 'A refreshing cold-water ritual for an invigorating pause in your wellness routine.', '/media/Icebath.jpg', 8);

INSERT IGNORE INTO spa_categories (name, description, sort_order) VALUES
  ('Oil Based Massage', 'Oil-based massage and therapies.', 0),
  ('Dry Based Massage', 'Dry massage therapies.', 1),
  ('Mini Massage', 'Focused treatments and shorter rituals.', 2);

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Ayurvedic Massage', 'ayurvedic-massage',
  'In Ayurveda, true wellness comes from balance, specifically the balance of your body’s three doshas: Vata, Pitta, and Kapha. When these energies are in harmony, you feel calm, energized, and at ease. Rooted in the ancient science of Ayurveda, ayurvedic massage is a holistic practice that uses warm herbal oils, rhythmic strokes, and balances the body, mind, and soul.',
  'Improved blood circulation and detoxification\nEnhanced energy flow and balance of doshas\nDetoxifies and nourishes the skin',
  '[{"duration":"60 mins","price":4000},{"duration":"90 mins","price":5000},{"duration":"120 mins","price":6000}]',
  '/media/spa-treatment.webp', 0
FROM spa_categories c WHERE c.name='Oil Based Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='ayurvedic-massage');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Swedish Massage', 'swedish-massage',
  'A classic in the world of wellness, Swedish massage is known for its smooth, flowing strokes and light to medium pressure through gliding movements, gentle kneading, and rhythmic tapping techniques. Each stroke helps to warm up the muscles, release built-up tightness, and encourage better oxygen flow throughout the body. The experience is deeply soothing, making it ideal if you’re looking to unwind without intense pressure.',
  'Relieves muscle tension and fatigue\nImproves blood circulation and oxygen flow\nRestores calm and mental clarity',
  '[{"duration":"60 mins","price":4000},{"duration":"90 mins","price":5000},{"duration":"120 mins","price":6000}]',
  '/media/spa-treatment.webp', 1
FROM spa_categories c WHERE c.name='Oil Based Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='swedish-massage');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Aroma Therapy', 'aroma-therapy',
  'A sensory journey to calm the mind and the body, by combining the power of therapeutic touch with selected essential oils. At Spa at The Height, your session begins with selecting an aroma that resonates with your mood and needs. As the oils are gently worked into the body through slow, flowing techniques, their natural essence begins to ease tension, quiet the mind, and create a deep sense of emotional balance. Perfect when you need to reset your body.',
  'Reduces stress, anxiety, and mental fatigue\nEnhances mood and emotional well-being\nSupports relaxation and better sleep',
  '[{"duration":"60 mins","price":4500},{"duration":"90 mins","price":5500},{"duration":"120 mins","price":6500}]',
  '/media/spa-treatment.webp', 2
FROM spa_categories c WHERE c.name='Oil Based Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='aroma-therapy');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Deep Tissue Massage', 'deep-tissue-massage',
  'Deep Tissue Massage works beyond the surface, targeting areas of chronic discomfort caused by stress, posture, or physical strain. It is performed with focused pressure to reach deeper layers of muscle and connective tissue and precise techniques that gradually release built-up knots and stiffness. The session is guided by your body’s needs, ensuring the pressure feels effective yet controlled.',
  'Releases chronic muscle tension and tightness\nImproves mobility and muscle flexibility\nReduces stiffness from stress or physical strain\nSupports faster recovery and overall muscle health',
  '[{"duration":"60 mins","price":4500},{"duration":"90 mins","price":5500},{"duration":"120 mins","price":6500}]',
  '/media/spa-treatment.webp', 3
FROM spa_categories c WHERE c.name='Oil Based Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='deep-tissue-massage');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Trekkers Healing Massage', 'trekkers-healing-massage',
  'For those who have explored the trails and felt the strain of altitude, long walks, and changing terrain, this therapy is designed to restore your body after demanding journeys. Trekkers Healing Therapy combines targeted deep pressure techniques with stretching and muscle release work, focusing on legs, back, and shoulders, allowing your body to recover faster and feel lighter.',
  'Relieves muscle soreness and post-trek fatigue\nImproves circulation and speeds up recovery\nRestores energy and physical balance',
  '[{"duration":"60 mins","price":4500},{"duration":"90 mins","price":5500},{"duration":"120 mins","price":6500}]',
  '/media/spa-treatment.webp', 4
FROM spa_categories c WHERE c.name='Oil Based Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='trekkers-healing-massage');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Balinese Massage', 'balinese-massage', NULL, NULL, NULL,
  '/media/spa-treatment.webp', 5
FROM spa_categories c WHERE c.name='Oil Based Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='balinese-massage');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Potli Massage', 'potli-massage',
  'A traditional therapy known for its warmth and therapeutic depth, Potli Massage uses warm herbal compresses to release tension and encourage deep muscular relaxation. The potli can be gently steamed for a dry heat experience or dipped in warm oil for a nourishing treatment. The warmth of the poultices, combined with flowing massage techniques, helps the body unwind while promoting a lasting sense of comfort and relaxation.',
  'Reduces stiffness and physical fatigue\nEncourages circulation and muscle recovery\nSupports relaxation and stress relief',
  '[{"duration":"90 mins","price":5500},{"duration":"120 mins","price":6500},{"duration":"150 mins","price":7500}]',
  '/media/spa-treatment.webp', 6
FROM spa_categories c WHERE c.name='Oil Based Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='potli-massage');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Hot Stone Therapy', 'hot-stone-therapy',
  'A deeply grounding experience, Hot Stone Therapy is designed to release tension at a level that goes beyond traditional massage. Smooth, heated stones are placed and gently worked over the body, allowing warmth to penetrate into the muscles and ease even the most stubborn tightness. The heat from the stones creates a sense of weightless relaxation and is combined with massage flow techniques. This is a comforting, immersive treatment, ideal when your body feels heavy, fatigued, or in need of deep release.',
  'Relieves deep muscle tension with gentle heat\nImproves blood circulation and muscle relaxation\nReduces stress and promotes mental calm\nEases stiffness and leaves the body feeling light and restored',
  '[{"duration":"60 mins","price":6500},{"duration":"90 mins","price":7500},{"duration":"120 mins","price":8500}]',
  '/media/spa-treatment.webp', 7
FROM spa_categories c WHERE c.name='Oil Based Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='hot-stone-therapy');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Shirodhara', 'shirodhara',
  '“Shiro” means head and “Dhara” means flow: together it represents a continuous, gentle stream of warm herbal oil poured over the forehead, specifically targeting the third eye area. It is a deeply meditative treatment, allowing you to fully let go. The rhythmic flow of oil, combined with gentle massage, slows down the nervous system and creates a deeply immersive sense of calm. Ideal for those seeking mental clarity and emotional balance.',
  'Calms the mind and reduces stress\nImproves sleep quality and mental clarity\nEases anxiety and mental fatigue\nPromotes deep emotional balance and relaxation',
  '[{"duration":"30 mins (Oil Pouring)","price":3500},{"duration":"90 mins","price":7000},{"duration":"120 mins","price":8000},{"duration":"150 mins","price":9000}]',
  '/media/spa-treatment.webp', 8
FROM spa_categories c WHERE c.name='Oil Based Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='shirodhara');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Thai Healing Therapy', 'thai-healing-therapy',
  'A restorative treatment rooted in ancient Thai healing traditions, this therapy focuses on releasing tension while improving flexibility and energy flow. Thai Healing Therapy is a dry based therapy that uses a combination of assisted stretching, acupressure, and rhythmic movements. Your therapist uses hands, knees, elbows, and feet to apply deep pressure, guiding your body through stretches, while applying targeted pressure along energy lines. The experience is both grounding and revitalizing, helping to open up the body, improve mobility, and release areas of deep-seated tightness, ideal if you’re looking to feel more flexible, aligned, and recharged.',
  'Improves flexibility and range of movement\nRelieves muscle tension without the use of oils\nStimulates energy flow and body balance\nLeaves the body feeling light, open, and re-energized',
  '[{"duration":"60 mins","price":4500},{"duration":"90 mins","price":5500},{"duration":"120 mins","price":6500}]',
  '/media/spa-treatment.webp', 0
FROM spa_categories c WHERE c.name='Dry Based Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='thai-healing-therapy');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Japanese Shiatsu', 'japanese-shiatsu',
  'Shiatsu is a Japanese therapeutic bodywork technique in which “Shi” means Finger and “Atsu” means Pressure. Our therapist uses fingers, palms, and controlled pressure to work along the body’s energy pathways. Each movement is steady and purposeful, helping to release tension, improve circulation, and bring the body back into balance. Ideal for those who prefer structured pressure and a therapy that focuses on energy alignment as much as physical relief.',
  'Relieves tension through targeted pressure points\nImproves circulation and energy flow\nRestores balance within the body\nReduces stress and promotes mental clarity',
  '[{"duration":"60 mins","price":4000},{"duration":"90 mins","price":5000},{"duration":"120 mins","price":6000}]',
  '/media/spa-treatment.webp', 1
FROM spa_categories c WHERE c.name='Dry Based Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='japanese-shiatsu');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Yogic Shiatsu', 'yogic-shiatsu', NULL, NULL, NULL,
  '/media/spa-treatment.webp', 2
FROM spa_categories c WHERE c.name='Dry Based Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='yogic-shiatsu');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Head and Shoulder Massage', 'head-and-shoulder-massage',
  'A focused therapy designed to release the areas where stress builds most, the head, neck, and shoulders. Ideal for those experiencing mental fatigue, screen strain, or stiffness from long hours, this treatment brings immediate lightness and ease. At Spa at The Height, this massage is performed with a balance of gentle pressure and precise techniques, working through the scalp, neck, and shoulder muscles. The rhythmic movements help improve circulation, ease tightness, and calm the mind, making it both relaxing and restorative in a short time.',
  'Relieves tension in head, neck, and shoulders\nReduces stress and mental fatigue\nImproves blood circulation to the scalp\nPromotes relaxation and mental clarity',
  '[{"duration":"30 mins","price":2000},{"duration":"45 mins","price":2500},{"duration":"60 mins","price":3500}]',
  '/media/spa-treatment.webp', 0
FROM spa_categories c WHERE c.name='Mini Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='head-and-shoulder-massage');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Foot and Palm Reflexology', 'foot-and-palm-reflexology',
  'A precise and deeply relaxing therapy that works through specific pressure points in the feet and palms, reflexology is designed to support the body’s natural balance from within. Each point corresponds to different organs and systems, allowing the treatment to gently stimulate and restore overall well-being. As tension is released through these key points, you’ll feel a subtle yet noticeable shift throughout the body, leaving you lighter and more at ease. Ideal when you want restoration without a full-body massage.',
  'Stimulates natural healing through pressure points\nRelieves stress and promotes deep relaxation\nImproves circulation and energy flow\nSupports overall balance and internal harmony',
  '[{"duration":"30 mins","price":2000},{"duration":"45 mins","price":2500},{"duration":"60 mins","price":3500}]',
  '/media/spa-treatment.webp', 1
FROM spa_categories c WHERE c.name='Mini Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='foot-and-palm-reflexology');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Back Massage', 'back-massage',
  'A focused treatment designed to relieve tension where it builds up the most, this therapy works deeply into the back, neck, and shoulder areas. Ideal for long hours of sitting, travel fatigue, or daily strain, it brings targeted relief while allowing the rest of the body to fully relax. At Spa at The Height, this therapy combines controlled pressure with slow, deliberate strokes to release tight muscles and ease stiffness. Your therapist focuses on key tension points, allowing the back to gradually relax and reset.',
  'Relieves tension in the back, neck, and shoulders\nReduces stiffness from daily stress and posture strain\nImproves circulation and muscle relaxation',
  '[{"duration":"30 mins","price":2500},{"duration":"45 mins","price":3000},{"duration":"60 mins","price":4000}]',
  '/media/spa-treatment.webp', 2
FROM spa_categories c WHERE c.name='Mini Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='back-massage');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Facial Therapy', 'facial-therapy',
  'An indulgent facial experience designed to nourish, hydrate, and revive your skin. At Spa at The Height, our facial therapies are tailored to your skin type and concerns. The treatment combines deep cleansing, gentle exfoliation, hydration, and facial massage to promote healthier-looking skin while restoring natural skin balance.',
  'Deeply cleanses and purifies the skin\nRemoves impurities and promotes a healthy glow\nImproves skin hydration and texture',
  '[{"duration":"Cleansing — 30 mins","price":2000},{"duration":"Facial — 60 mins","price":3500}]',
  '/media/spa-treatment.webp', 3
FROM spa_categories c WHERE c.name='Mini Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='facial-therapy');

INSERT INTO spa_treatments (category_id, title, slug, description, benefits, pricing, image_url, sort_order)
SELECT c.id, 'Body Scrub', 'body-scrub',
  'A refining treatment to renew your skin and restore its natural glow, a body scrub gently removes dull, dry layers to reveal a smoother, more radiant surface beneath. It’s the perfect way to refresh your body and prepare your skin to better absorb moisture and nourishment. It’s a simple indulgence with visible results, leaving your skin soft, fresh, and beautifully revived.',
  'Removes dead skin cells and improves skin texture\nEnhances circulation and natural skin renewal\nPrepares the skin for better hydration\nLeaves skin smooth, soft, and radiant',
  '[{"duration":"30 mins","price":2000},{"duration":"45 mins","price":2500},{"duration":"60 mins","price":3500}]',
  '/media/spa-treatment.webp', 4
FROM spa_categories c WHERE c.name='Mini Massage'
  AND NOT EXISTS (SELECT 1 FROM spa_treatments WHERE slug='body-scrub');
