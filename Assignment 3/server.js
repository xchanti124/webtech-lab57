import sqlite from "sqlite3";
import express from "express";

sqlite.verbose();

const app = express();
const db = my_database("./media.db");

const resp500 = { error: "Internal server error" };
const resp404 = { error: "Not found" };
const respSuccess = { message: "Operation successful" };

app.use(express.json());

// This disables the CORS verification (source for the fix: https://gist.github.com/chernysh2909/6bb5b089c2cb6f8dcb7185f383c30107)
// Source for the method fix https://stackoverflow.com/questions/44914330/method-put-is-not-allowed-by-access-control-allow-methods-in-preflight-response
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use((err, _, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        console.error(err);

        res.set("Content-Type", "application/json");
        res.status(400);
        res.send({ error: err.message });
        return;
    }

    next();
});

app.get("/hello", (_, res) => {
    const responseBody = { Hello: "World" };
    res.json(responseBody);
});

app.get("/media", (_, res) => {
    db.all(`SELECT * FROM media`, (err, rows) => {
        res.set("Content-Type", "application/json");

        if (err) {
            res.status(500);
            res.json(resp500);
            return;
        }

        res.status(200);
        res.json(rows);
    });
});

// CREATE
app.post("/media", (req, res) => {
    res.set("Content-Type", "application/json");

    const allowedFields = ["name", "year", "genre", "poster", "description"];

    for (const field of allowedFields) {
        if (
            req.body[field] === undefined ||
            typeof req.body[field] !== "string"
        ) {
            res.status(400);
            res.json({
                error: `Field "${field}" should be present with a type of string`,
            });
            return;
        }
    }

    db.run(
        `INSERT INTO media (name, year, genre, poster, description) VALUES (?, ?, ?, ?, ?)`,
        [
            req.body.name,
            req.body.year,
            req.body.genre,
            req.body.poster,
            req.body.description,
        ],
        function (err) {
            if (err) {
                res.status(500);
                res.json(resp500);
                return;
            }

            res.status(200);
            res.json({ id: this.lastID });
        }
    );
});

// READ
app.get("/media/:id", (req, res) => {
    db.get(
        "SELECT * FROM media WHERE id = ?",
        [Number(req.params.id)],
        (err, row) => {
            res.set("Content-Type", "application/json");

            if (err) {
                res.status(500);
                res.json(resp500);
                return;
            }

            if (!row) {
                res.status(404);
                res.json(resp404);
                return;
            }

            res.status(200);
            res.json(row);
        }
    );
});

// UPDATE
app.put("/media/:id", (req, res) => {
    res.set("Content-Type", "application/json");

    // we should only considered known fields
    // all fields are optional, if a field is undefined, then that media field will not get changed in the db
    // all fields that are provided and are in allow list should be strings
    // all fields that are not in the allowlist will get ignored

    const allowedFields = ["name", "year", "genre", "poster", "description"];
    const changes = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            if (typeof req.body[field] !== "string") {
                res.status(400);
                res.json({ error: `Field "${field}" should be a string` });
                return;
            }

            changes[field] = req.body[field];
        }
    }

    db.get(
        `SELECT * FROM media WHERE id = ?`,
        [Number(req.params.id)],
        (err, row) => {
            if (err) {
                res.status(500);
                res.json(resp500);
                return;
            }

            if (!row) {
                res.status(404);
                res.json(resp404);
                return;
            }

            const finalChanges = { ...row, ...changes };

            db.run(
                "UPDATE media SET name = ?, year = ?, genre = ?, poster = ?, description = ? WHERE id = ?",
                [
                    finalChanges.name,
                    finalChanges.year,
                    finalChanges.genre,
                    finalChanges.poster,
                    finalChanges.description,
                    finalChanges.id,
                ],
                (err) => {
                    if (err) {
                        res.status(500);
                        res.json(resp500);
                        return;
                    }

                    res.status(200);
                    res.json(respSuccess);
                }
            );
        }
    );
});

// DELETE
app.delete("/media/:id", (req, res) => {
    db.get(
        "SELECT * FROM media WHERE id = ?",
        [Number(req.params.id)],
        (err, row) => {
            res.set("Content-Type", "application/json");

            if (err) {
                res.status(500);
                res.json(resp500);
                return;
            }

            if (!row) {
                res.status(404);
                res.json(resp404);
                return;
            }

            db.run(
                "DELETE FROM media WHERE id = ?",
                [Number(req.params.id)],
                (err) => {
                    if (err) {
                        res.status(500);
                        res.json(resp500);
                        return;
                    }

                    res.status(200);
                    res.json(respSuccess);
                }
            );
        }
    );
});

app.listen(3000, () => {
    console.log("Listening on port 3000...");
});

function my_database(filename) {
    // Conncect to db by opening filename, create filename if it does not exist:
    const db = new sqlite.Database(filename, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log("Connected to the media database.");
    });

    // Create our media table if it does not exist already:
    db.serialize(() => {
        db.run(`
              CREATE TABLE IF NOT EXISTS media
               (
                      id INTEGER PRIMARY KEY,
                      name CHAR(100) NOT NULL,
                      year CHAR(100) NOT NULL,
                      genre CHAR(256) NOT NULL,
                      poster char(2048) NOT NULL,
                      description CHAR(1024) NOT NULL
           )
          `);
        db.all(`select count(*) as count from media`, (_, result) => {
            if (result[0].count == 0) {
                db.run(
                    `INSERT INTO media (name, year, genre, poster, description) VALUES (?, ?, ?, ?, ?)`,
                    [
                        "Arcane",
                        "2021",
                        "animation, action, adventure, tv-show",
                        "https://www.nerdpool.it/wp-content/uploads/2021/11/poster-arcane.jpg",
                        "Set in Utopian Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League Of Legends champions and the power that will tear them apart.",
                    ]
                );
                db.run(
                    `INSERT INTO media (name, year, genre, poster, description) VALUES (?, ?, ?, ?, ?)`,
                    [
                        "Celeste",
                        "2018",
                        "platformer, video-game",
                        "https://upload.wikimedia.org/wikipedia/commons/0/0f/Celeste_box_art_full.png",
                        "Celeste is a critically acclaimed two-dimensional platform game developed by Maddy Makes Games. The player controls Madeline, a young woman who sets out to climb Celeste Mountain. The game features tight controls, challenging levels, and a touching story about overcoming personal demons.",
                    ]
                );
                console.log("Inserted dummy photo entry into empty database");
            } else {
                console.log(
                    "Database already contains",
                    result[0].count,
                    " item(s) at startup."
                );
            }
        });
    });
    return db;
}
