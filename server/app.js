const express = require('express');
const app = express();
const port = 3003;

const cors = require("cors");
app.use(cors());
app.use(express.json({ limit: '10mb' }));
const mysql = require("mysql");

const md5 = require('js-md5');
const uuid = require('uuid');
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "public_sector",
});

// ///////////////DO AUTH////////////
const doAuth = function (req, res, next) {
  if (0 === req.url.indexOf('/admin')) {
    // admin
    const sql = `
      SELECT
      name, role
      FROM users
      WHERE session = ?
  `;
    con.query(
      sql, [req.headers['authorization'] || ''],
      (err, results) => {
        if (err) throw err;
        if (!results.length || results[0].role !== 'admin') {
          res.status(401).send({});
          req.connection.destroy();
        } else {
          next();
        }
      }
    );
  } else if (0 === req.url.indexOf('/login-check') || 0 === req.url.indexOf('/login')) {
    next();
  } else {
    // Front
    const sql = `
    SELECT
    name, role
    FROM users
    WHERE session = ?
`;
    con.query(
      sql, [req.headers['authorization'] || ''],
      (err, results) => {
        if (err) throw err;
        if (!results.length) {
          res.status(401).send({});
          req.connection.destroy();
        } else {
          next();
        }
      }
    );
  }
}
app.use(doAuth)

//Auth
app.get("/login-check", (req, res) => {
  let sql;
  let requests;
  if (req.query.role === 'admin') {
    sql = `
      SELECT
      name
      FROM users
      WHERE session = ? AND role = ?
      `;
    requests = [req.headers['authorization'] || '', req.query.role];
  } else {
    sql = `
      SELECT
      name
      FROM users
      WHERE session = ?
      `;
    requests = [req.headers['authorization'] || ''];
  }
  con.query(sql, requests, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.send({ msg: 'error' });
    } else {
      res.send({ msg: 'ok' });
    }
  });
});

app.post("/login", (req, res) => {
  const key = uuid.v4();
  const sql = `
  UPDATE users
  SET session = ?
  WHERE name = ? AND pass = ?
`;
  con.query(sql, [key, req.body.user, md5(req.body.pass)], (err, result) => {
    if (err) throw err;
    if (!result.affectedRows) {
      res.send({ msg: 'error', key: '' });
    } else {
      res.send({ msg: 'ok', key });
    }
  });
});

// //////////////REQUESTS TO DB//////////////
// READ & queries FRONT&BACK
app.get('/miestai', (req, res) => {
  let sql;
  let requests;
  if (!req.query['area-id'] && !req.query['s']) {
    sql = `
    SELECT
    m.id, m.title, address, email, photo,
    GROUP_CONCAT(cm.id) AS coms_id, GROUP_CONCAT(cm.com, '-^-^-') AS coms, COUNT(cm.com) AS com_count, cm.area_id AS activity
    FROM municipality AS m 
    
    LEFT JOIN comments AS cm
    ON m.id = cm.city_id
    GROUP BY m.id
    `;
    requests = [];
  } else if (req.query['area-id']) {
    sql = `
    SELECT
    m.id, m.title, address, email, photo,
    GROUP_CONCAT(cm.com, '-^-^-') AS coms, COUNT(cm.com) AS com_count 
    FROM municipality AS m 
    
    LEFT JOIN comments AS cm
    ON m.id = cm.city_id

    WHERE cm.area_id = ?
    GROUP BY m.id
  `;
    requests = [req.query['area-id']];
  } else {
    sql = `
    SELECT
    m.id, m.title, address, email, photo,
    GROUP_CONCAT(cm.com, '-^-^-') AS coms, COUNT(cm.com) AS com_count 
    FROM municipality AS m 
    
    LEFT JOIN comments AS cm
    ON m.id = cm.city_id
    GROUP BY m.id
    `;
    requests = ['%' + req.query['s'] + '%'];
  }
  con.query(sql, requests, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Simple READ AREAS
app.get('/sritys', (req, res) => {
  const sql = `
  SELECT
  a.id, a.title, photo
  FROM areas AS a
  `;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// CREATE BACK
app.post('/miestai', (req, res) => {
  const sql = `
  INSERT INTO municipality
  (title, address, email, photo)
  VALUES (?, ?, ?, ?)
  `;
  con.query(sql, [req.body.title, req.body.address, req.body.email, req.body.photo], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'Nauja savivaldybė sėkmingai įtraukta', type: 'success' } });
  })
});
// CREATE AREAS BACK
app.post('/sritys', (req, res) => {
  const sql = `
  INSERT INTO areas
  (title, photo)
  VALUES (?, ?)
  `;
  con.query(sql, [req.body.title, req.body.photo], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'Nauja Veiklos sritis sėkmingai sukurta.', type: 'success' } });
  })
});

// EDIT BACK
app.put('/miestai/:id', (req, res) => {
  const sql = `
  UPDATE municipality 
  SET title = ?, address = ?, email = ?, photo = ?
  WHERE id = ?
  `;
  con.query(sql, [req.body.title, req.body.address, req.body.email, req.body.photo, req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'Savivaldybes duomenys sekmingai atnaujinti', type: 'info' } });
  });
});

// DELETE BACK
app.delete('/sritys/:id', (req, res) => {
  const sql = `
  DELETE FROM areas
  WHERE id = ?
  `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'Veiklos sritis istrinta is saraso', type: 'danger' } });
  })
});

// ////////////////COMMENTS/////////////////
// CREATE Comments FRONT
app.post('/komentarai', (req, res) => {
  const sql = `
  INSERT INTO comments
  (com, city_id, area_id)
  VALUES (?, ?, ?)
  `;
  con.query(sql, [req.body.comment, req.body.cityId, req.body.areaId], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'Jusu atsiliepimas issiustas!', type: 'success' } });
  })
});

// READ Comments
app.get('/komentarai', (req, res) => {
  let sql;
  let requests;
  if (!req.query['area-id'] && !req.query['s']) {
    sql = `
    SELECT comments.id, comments.com, comments.status, areas.title AS activity,  municipality.title AS municipality, municipality.photo AS image, COUNT(comments.id) AS com_count
    FROM comments
    LEFT JOIN areas 
  ON comments.area_id = areas.id
    LEFT JOIN municipality
   ON comments.city_id = municipality.id
    GROUP BY comments.id
    ORDER BY municipality.id
    `;
    requests = [];
  } else if (req.query['area-id']) {
    sql = `
    SELECT comments.id, comments.com, comments.status, areas.title AS activity,  municipality.title AS municipality, municipality.photo AS image, COUNT(comments.id) AS com_count
    FROM comments
    LEFT JOIN areas 
  ON comments.area_id = areas.id
    LEFT JOIN municipality
   ON comments.city_id = municipality.id
   
    WHERE comments.area_id = ?
    GROUP BY comments.id
  `;
    requests = [req.query['area-id']];
  } else {
    sql = `
    SELECT comments.id, comments.com, comments.status, areas.title AS activity,  municipality.title AS municipality, municipality.photo AS image, COUNT(comments.id) AS com_count
    FROM comments
    LEFT JOIN areas 
  ON comments.area_id = areas.id
    LEFT JOIN municipality
   ON comments.city_id = municipality.id

   WHERE municipality.title LIKE ?
   GROUP BY comments.id
    `;
    requests = ['%' + req.query['s'] + '%'];
  }
  con.query(sql, requests, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
// cm.id, GROUP_CONCAT(cm.id) AS coms_id, GROUP_CONCAT(com, '-^-^-') AS coms, COUNT(com) AS com_count, a.id AS areaId, a.title AS activity, m.title AS municipality, m.photo AS image, status
// FROM comments AS cm
// LEFT JOIN areas AS a
// ON cm.area_id = a.id

// LEFT JOIN municipality AS m
// ON cm.city_id = m.id
// DELETE comments BACK
app.delete('/komentarai/:id', (req, res) => {
  const sql = `
  DELETE FROM comments
  WHERE id = ?
  `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'Komentaras istrintas is saraso', type: 'danger' } });
  })
});

// DELETE BACK
app.delete('/miestai/:id', (req, res) => {
  const sql = `
  DELETE FROM municipality
  WHERE id = ?
  `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'Savivaldybe istrinta is saraso', type: 'danger' } });
  })
});

///////DELETE/UPDATE PHOTO/STATUS/RATING////////////
// DELETE PHOTO BACK
app.delete('/nuotrauka/:id', (req, res) => {
  // const sql = `
  // UPDATE garment
  // SET photo = null
  // WHERE id = ?
  // `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'Nuotrauka sekimingai istrinta', type: 'info' } });
  })
});

// EDIT STATUS BACK
app.put('/statusas/:id', (req, res) => {
  const sql = `
  UPDATE comments 
  SET status = 1
  WHERE id = ?
  `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'Atsiliepimas patvirtintas', type: 'info' } });
  });
});

// EDIT reitings FRONT
app.put('/reitingai/:id', (req, res) => {
  // const sql = `
  // UPDATE garment 
  // SET rates = rates + 1, rate_sum = rate_sum + ?
  //     where id = ?
  //       `;
  con.query(sql, [req.body.rate, req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'Jusu balsas sekmingai iskaitytas. Aciu uz ivertinima!', type: 'info' } });
  });
});


app.listen(port, () => {
  console.log(`Peleda klauso porto ${port}`)
})