DROP TABLE IF EXISTS User;
CREATE TABLE IF NOT EXISTS "User" (
	"id" INTEGER NOT NULL UNIQUE,
	"username" VARCHAR NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	PRIMARY KEY("id")
);

INSERT INTO User (username, password) VALUES
    ('admint', 'password123'),
    ('firstuser', 'padword123');

DROP TABLE IF EXISTS Form;
CREATE TABLE IF NOT EXISTS "Form" (
	"id" INTEGER NOT NULL UNIQUE,
	"title" VARCHAR NOT NULL,
	"description" TEXT NOT NULL,
	"user_id" INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("user_id") REFERENCES "User"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

INSERT INTO Form (title, description, user_id) VALUES
    ('interview', 'dont forget to fill in your credit card number thx', 1),
    ('rizztek', 'gotta testify, come up in the spot lookin extra fly', 2)
;

DROP TABLE IF EXISTS Question;
CREATE TABLE IF NOT EXISTS "Question" (
	"id" INTEGER NOT NULL UNIQUE,
	"prompt" TEXT NOT NULL,
	"page_id" INTEGER NOT NULL,
	"type" VARCHAR NOT NULL,
	"config" TEXT NOT NULL,
	"index" INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("page_id") REFERENCES "Page"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

DROP TABLE IF EXISTS Page;
CREATE TABLE IF NOT EXISTS "Page" (
	"id" INTEGER NOT NULL UNIQUE,
	"description" TEXT NOT NULL,
	"type" VARCHAR NOT NULL,
	"form_id" INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("form_id") REFERENCES "Form"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

DROP TABLE IF EXISTS Submission;
CREATE TABLE IF NOT EXISTS "Submission" (
	"id" INTEGER NOT NULL UNIQUE,
	"header" TEXT NOT NULL,
	"answer" TEXT NOT NULL,
	"form_id" INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("form_id") REFERENCES "Form"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);
