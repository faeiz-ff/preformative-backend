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
    ('admin', 'innacessible');

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

INSERT INTO forms (title, description, user_id, public_id, is_public) VALUES
    ('Test Form', 'This is a test form!', 1, 'test-form', 1);

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
    ('This page 1 will go to page 2', 'basic', 1, 1, '{"next":2}'),
    ('This branch page will go to page 4 if the specified condition is met, else page 3', 'branch', 1, 2, '{"condition":{"name":"pivot","expectedValue":"yes","thenPage":4,"elsePage":3}}'),
    ('This page will appear if you choose no!', 'basic', 1, 3, '{"next":4}'),
    ('This page will submit all filled questions from pages that are visited within 1 branch', 'submit', 1, 4, '{}');

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
    ('This is a text input, input your name', 'Name', 1, TRUE, 'text', '{"isNumberOnly":false}', 1),
    ('This is a number only text input, input your favorite number', 'Favorite number', 1, TRUE, 'text', '{"isNumberOnly":true}', 2),
    ('This is a textarea input, tell me a story', 'Story', 1, TRUE, 'textarea', '{}', 3),
    ('This is a checkbox question, pick minimum 2 of these choices', 'preferences', 2, TRUE, 'checkbox', '{"choices":["I like cheez","I like vanilla","I like chocolate"],"minimumOf":2}', 1),
    ('This is a single choice question, pick yes if you want to branch into page 4', 'pivot', 2, TRUE, 'singlechoice', '{"choices":["yes","no"]}', 2);

CREATE TABLE IF NOT EXISTS submissions (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	form_id INTEGER NOT NULL,
    answers TEXT NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
);
