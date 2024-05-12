CREATE TABLE user_account (
	id INTEGER NOT NULL,
	name VARCHAR(40) NOT NULL,
	fullname VARCHAR,
	password_hash VARCHAR,
	PRIMARY KEY (id)
)

CREATE TABLE todolist (
	id INTEGER NOT NULL,
	todo_text VARCHAR(1000) NOT NULL,
	todo_made_time DATETIME,
	todo_date DATETIME,
	todo_date_overdue BOOLEAN,
	todo_done BOOLEAN,
	user_id INTEGER,
	PRIMARY KEY (id)
)

CREATE TABLE address (
	id INTEGER NOT NULL,
	email_adress VARCHAR NOT NULL,
	user_id INTEGER NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(user_id) REFERENCES user_account (id)
)