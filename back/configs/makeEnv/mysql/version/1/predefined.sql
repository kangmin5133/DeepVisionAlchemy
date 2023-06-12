use diva_db;

DELETE FROM membership;
DELETE FROM user_type;
DELETE FROM social_platform_type;
DELETE FROM role;
DELETE FROM project_type;
DELETE FROM data_type;

INSERT INTO membership (membership_id, membership_name) VALUES (1, 'free'), (2, 'business'), (3, 'vip');

INSERT INTO user_type (user_type_id, type_name) VALUES (1, 'personal'), (2, 'enterprise');

INSERT INTO social_platform_type (provider_id, provider_name) VALUES (1, 'google'), (2, 'naver'), (3, 'kakao');

INSERT INTO role (role_id, role_name) VALUES (1, 'admin'), (2, 'manager'), (3, 'general');

INSERT INTO project_type (project_type_id, type_name) VALUES (1, 'Classification'), (2, 'Object Detection'), (3, 'Semantic Segmentation'), (4, 'Instance Segmentation');

INSERT INTO data_type (type_id, type_name) VALUES (1, 'Amazon S3'), (2, 'Google Cloud Storage'), (3, 'Microsoft Azure Blob Storage'), (4, 'Cloudinary'), (5, 'Local upload');
