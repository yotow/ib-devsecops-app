CREATE TABLE users
(
    id       TEXT PRIMARY KEY,
    login    TEXT      NOT NULL UNIQUE,
    password TEXT      NOT NULL,
    name     TEXT      NOT NULL,
    avatar   TEXT      NOT NULL,
    created  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tokens (
    id      TEXT PRIMARY KEY,
    userid  TEXT NOT NULL REFERENCES users,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id          TEXT PRIMARY KEY,
    userid      TEXT NOT NULL REFERENCES users,
    amount      INT NOT NULL,
    description TEXT NOT NULL,
    created     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
