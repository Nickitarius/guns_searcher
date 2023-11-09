CREATE DATABASE voicesender;
CREATE USER vos_user WITH PASSWORD 'VoS_user';
ALTER ROLE vos_user SET client_encoding TO 'utf8';
ALTER ROLE vos_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE vos_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE voicesender TO vos_user;
