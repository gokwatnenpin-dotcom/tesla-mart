-- ═══════════════════════════════════════════════════════
--  TeslaMart — Seed Data
--  Run after schema.sql:
--    psql -d teslamart -f seed.sql
-- ═══════════════════════════════════════════════════════

INSERT INTO products (name, slug, category, price, original_price, rating, review_count, image, gallery, description, specs, features, stock, badge) VALUES

-- ─── Vehicles ─────────────────────────────────────────
(
  'Tesla Model 3 Long Range',
  'model-3-long-range',
  'Vehicles',
  42990.00,
  46990.00,
  4.9, 2847,
  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
    'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&q=80'
  ],
  'The most popular electric sedan in the world. Zero to 60 mph in 4.2 seconds with an EPA estimated range of 358 miles.',
  '{"range": "358 miles", "0-60": "4.2s", "top_speed": "145 mph", "drive": "Dual Motor AWD", "seating": 5, "cargo": "15 cu ft"}',
  ARRAY['Autopilot included','Over-the-air software updates','15" touchscreen display','Premium audio system','Wireless phone charging'],
  15,
  'SALE'
),
(
  'Tesla Model S Plaid',
  'model-s-plaid',
  'Vehicles',
  89990.00,
  NULL,
  4.95, 1203,
  'https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=800&q=80',
    'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=800&q=80'
  ],
  'The fastest production car ever made. With up to 1,020 hp and tri-motor all-wheel drive, Model S Plaid has the quickest acceleration of any production car.',
  '{"range": "396 miles", "0-60": "1.99s", "top_speed": "200 mph", "drive": "Tri Motor AWD", "seating": 5, "cargo": "28 cu ft"}',
  ARRAY['1,020 horsepower','17" cinematic display','22-speaker audio','Gaming computer on-board','Full Self-Driving capability'],
  8,
  'NEW'
),
(
  'Tesla Model Y Performance',
  'model-y-performance',
  'Vehicles',
  52990.00,
  55990.00,
  4.85, 3421,
  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80'
  ],
  'The most versatile electric SUV. Seats up to 7 with unmatched performance and the most cargo room in its class.',
  '{"range": "303 miles", "0-60": "3.5s", "top_speed": "155 mph", "drive": "Dual Motor AWD", "seating": 7, "cargo": "76 cu ft"}',
  ARRAY['7-seat capacity','Panoramic glass roof','Tow package available','Full Self-Driving hardware','15" touchscreen'],
  22,
  'BESTSELLER'
),

-- ─── Charging ─────────────────────────────────────────
(
  'Tesla Wall Connector Gen 3',
  'wall-connector-gen3',
  'Charging',
  475.00,
  NULL,
  4.8, 984,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
  'The fastest home charging solution for your Tesla. Delivers up to 44 miles of range per hour charged.',
  '{"power": "48A / 11.5kW", "cable_length": "24 ft", "voltage": "240V", "connector": "Tesla proprietary", "wifi": true}',
  ARRAY['Wi-Fi connectivity','Over-the-air updates','Works with all Tesla vehicles','Indoor/outdoor rated','Circuit sharing capability'],
  150,
  NULL
),
(
  'Mobile Connector Bundle',
  'mobile-connector-bundle',
  'Charging',
  230.00,
  NULL,
  4.6, 521,
  'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80'],
  'Charge anywhere with the Mobile Connector Bundle. Includes NEMA 5-15 and NEMA 14-50 adapters.',
  '{"max_current": "32A", "cable_length": "20 ft", "adapters": "NEMA 5-15, NEMA 14-50", "voltage": "120V / 240V"}',
  ARRAY['Two adapters included','Compact & portable','LED charge indicator','Temperature monitoring','Compatible with all Tesla models'],
  200,
  NULL
),

-- ─── Accessories ──────────────────────────────────────
(
  'All-Weather Floor Mats — Model 3',
  'all-weather-mats-model3',
  'Accessories',
  175.00,
  NULL,
  4.7, 762,
  'https://images.unsplash.com/photo-1558618047-3c8c76ca5eb6?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1558618047-3c8c76ca5eb6?w=800&q=80'],
  'Laser-measured, custom-fit floor mats designed specifically for Model 3. Waterproof with raised edges to contain spills.',
  '{"material": "TPE", "fit": "Custom Model 3", "pieces": 4, "color": "Black"}',
  ARRAY['Custom fit','Waterproof TPE material','Raised edge containment','Anti-slip backing','Easy to clean'],
  300,
  NULL
),
(
  'Aero Wheel Cover Kit — 19"',
  'aero-wheel-cover-19',
  'Accessories',
  149.00,
  NULL,
  4.5, 438,
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80'],
  'Replace or upgrade your wheel covers with the iconic aero design. Set of 4 covers for 19" Gemini wheels.',
  '{"size": "19 inch", "quantity": 4, "compatibility": "Model Y Gemini", "color": "Gloss Black"}',
  ARRAY['Improves range efficiency','Easy snap-on installation','Original Tesla design','Corrosion resistant','Set of 4'],
  180,
  NULL
),
(
  'Rear Cargo Organizer — Model Y',
  'cargo-organizer-model-y',
  'Accessories',
  95.00,
  NULL,
  4.6, 319,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
  'Keep cargo secure and organized with this custom-fit rear cargo organizer for Model Y.',
  '{"material": "Recycled plastic", "fit": "Model Y", "color": "Black", "collapsible": true}',
  ARRAY['Custom fit','Collapsible design','Multiple compartments','Non-slip surface','Recycled materials'],
  220,
  NULL
),

-- ─── Apparel ──────────────────────────────────────────
(
  'Tesla Unisex Tee',
  'tesla-unisex-tee',
  'Apparel',
  35.00,
  NULL,
  4.4, 218,
  'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80'],
  'Comfortable everyday tee with the Tesla wordmark. Made from soft 100% cotton.',
  '{"material": "100% cotton", "fit": "Unisex", "sizes": "XS-3XL", "colors": "Black, White, Gray"}',
  ARRAY['Premium cotton fabric','Minimalist Tesla logo','Pre-washed for softness','Available in multiple colors','Unisex fit'],
  500,
  NULL
),
(
  'Cybertruck Cap',
  'cybertruck-cap',
  'Apparel',
  40.00,
  NULL,
  4.3, 145,
  'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80'],
  'Show your love for the Cybertruck with this structured cap. Features an embroidered Cybertruck silhouette.',
  '{"material": "100% cotton twill", "closure": "Adjustable snap", "style": "Structured 6-panel", "embroidery": "Front + side"}',
  ARRAY['Embroidered Cybertruck graphic','Adjustable snap back','One size fits most','Pre-curved brim','Officially licensed'],
  350,
  'NEW'
),

-- ─── Energy ───────────────────────────────────────────
(
  'Powerwall 3',
  'powerwall-3',
  'Energy',
  11500.00,
  NULL,
  4.9, 573,
  'https://images.unsplash.com/photo-1497435334941-8c899a9bd2eb?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1497435334941-8c899a9bd2eb?w=800&q=80'],
  'Energy storage for a sustainable home. Powerwall 3 stores energy from solar or the grid to power your home day and night.',
  '{"capacity": "13.5 kWh", "peak_power": "11.5 kW", "continuous_power": "7.6 kW", "warranty": "10 years", "efficiency": "90%"}',
  ARRAY['Solar integration','Backup power during outages','Storm watch auto-charge','Self-powered mode','Tesla app monitoring'],
  30,
  'NEW'
),
(
  'Solar Roof Tiles — 350W Kit',
  'solar-roof-tiles-350w',
  'Energy',
  8200.00,
  9500.00,
  4.7, 284,
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80'],
  'Beautiful solar energy from day one. Tesla Solar Roof tiles generate electricity from the sun and look better than traditional solar panels.',
  '{"power": "350W", "warranty": "25 years", "efficiency": "22%", "durability": "Class F hail, Class A fire"}',
  ARRAY['Integrated roof design','25-year warranty','Class F hail resistance','Seamless app monitoring','Powerwall compatible'],
  12,
  'SALE'
);
