ALTER TABLE events
    ADD COLUMN details LONGTEXT NULL AFTER image_url;

UPDATE events
SET details = CONCAT(
    CASE
        WHEN NULLIF(TRIM(detail_heading_1), '') IS NULL THEN ''
        ELSE CONCAT(
            '<h2>',
            REPLACE(REPLACE(REPLACE(detail_heading_1, '&', '&amp;'), '<', '&lt;'), '>', '&gt;'),
            '</h2>'
        )
    END,
    CASE
        WHEN NULLIF(TRIM(detail_text_1), '') IS NULL THEN ''
        ELSE CONCAT(
            '<p>',
            REPLACE(REPLACE(REPLACE(detail_text_1, '&', '&amp;'), '<', '&lt;'), '>', '&gt;'),
            '</p>'
        )
    END,
    CASE
        WHEN NULLIF(TRIM(detail_heading_2), '') IS NULL THEN ''
        ELSE CONCAT(
            '<h2>',
            REPLACE(REPLACE(REPLACE(detail_heading_2, '&', '&amp;'), '<', '&lt;'), '>', '&gt;'),
            '</h2>'
        )
    END,
    CASE
        WHEN NULLIF(TRIM(detail_text_2), '') IS NULL THEN ''
        ELSE CONCAT(
            '<p>',
            REPLACE(REPLACE(REPLACE(detail_text_2, '&', '&amp;'), '<', '&lt;'), '>', '&gt;'),
            '</p>'
        )
    END
);

ALTER TABLE events
    MODIFY details LONGTEXT NULL,
    DROP COLUMN detail_heading_1,
    DROP COLUMN detail_text_1,
    DROP COLUMN detail_heading_2,
    DROP COLUMN detail_text_2;
