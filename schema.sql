DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS forms;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL
);

INSERT INTO users (username, password) VALUES
    ('dadang', 'asalah'),
    ('admint', '123password');

CREATE TABLE IF NOT EXISTS forms (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	description TEXT NOT NULL,
	user_id INTEGER NOT NULL,
	is_public INTEGER NOT NULL DEFAULT 0,
	public_id TEXT NOT NULL UNIQUE,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_forms_public_id ON forms(public_id);

INSERT INTO forms (title, description, user_id, public_id) VALUES
    ('interview', 'no thanks', 1, 'uuid something something'),
    ('whatttt', 'noperinosss', 1, 'asdbf-123123-asdfasdf');

CREATE TABLE IF NOT EXISTS pages (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	description TEXT NOT NULL,
	type TEXT NOT NULL,
	form_id INTEGER NOT NULL,
    page_index INTEGER NOT NULL,
    config TEXT NOT NULL,
	FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
);

INSERT INTO pages (description, type, form_id, page_index, config) VALUES
    ('bruh', 'basic', 1, 1, '{"next":2}'),
    ('bruh', 'basic', 1, 2, '{"next":3}'),
    ('bruh', 'branch', 1, 3, '{"condition":{"name":"one","expectedValue":"none","thenPage":4,"elsePage":5}}'),
    ('bruh', 'submit', 1, 4, '{}');

CREATE TABLE IF NOT EXISTS questions (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	prompt TEXT NOT NULL,
    name TEXT NOT NULL,
	page_id INTEGER NOT NULL,
    is_required BOOLEAN NOT NULL,
	type TEXT NOT NULL,
	config TEXT NOT NULL,
	question_index INTEGER NOT NULL,
	FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);

INSERT INTO questions (prompt, name, page_id, is_required, type, config, question_index) VALUES
    ('AI pr00mpter', 'name', 1, TRUE, 'text', '{"isNumberOnly":false}', 1),
    ('AI pr00mpter', 'name', 1, TRUE, 'textarea', '{}', 2),
    ('AI pr00mpter', 'name', 1, TRUE, 'singlechoice', '{"choices":["motlu","patlu"]}', 3),
    ('AI pr00mpter', 'name', 1, TRUE, 'checkbox', '{"choices":["motlu","patlu","satlu"],"minimumOf":2}', 4);

CREATE TABLE IF NOT EXISTS submissions (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	form_id INTEGER NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answers (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	submission_id INTEGER NOT NULL,
	question_id INTEGER NOT NULL,
	value TEXT NOT NULL,
	FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
	FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);
