BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) VALUES ('luis', 'luis@luis.com', 1, '2019-01-01');
INSERT into login (hash, email) VALUES ('$2b$10$nbktQFjeqqEW1m4uDUB6We1jA4XglTMVjH0TG9iFc8HY/NpOoyW9O', 'luis@luis.com');

COMMIT;