import express from "express";
import mysql from "mysql";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import crypto from "node:crypto";

const app = express();
app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
}));
console.log(process.env.FRONTEND_URL);
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 *24
    }
}));
await new Promise(resolve => setTimeout(resolve, 1000));

const db = mysql.createConnection({
    host : process.env.MYSQL_HOSTNAME,
    user : process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE 
});

db.connect(err => {
    if(err){
        console.log(err);
    }else{
        console.log("baglandi");
    }
})

db.query(`
CREATE TABLE IF NOT EXISTS entry(
    idEntry int NOT NULL AUTO_INCREMENT,
    Title varchar(45) NOT NULL,
    Content text,
    userId int DEFAULT NULL,
    date datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idEntry),
    UNIQUE KEY idEntry_UNIQUE (idEntry),
    FULLTEXT KEY idx_entry_Title_Content (Title,Content)
  ) AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;
`, (err, data) => {
    if(err) console.log(err);
});

db.query(`CREATE TABLE IF NOT EXISTS notifications(
    id int NOT NULL AUTO_INCREMENT,
    userId int DEFAULT NULL,
    sourceId int DEFAULT NULL,
    date datetime DEFAULT CURRENT_TIMESTAMP,
    type int DEFAULT NULL,
    postId int DEFAULT NULL,
    replyId int DEFAULT NULL,
    isRead tinyint(1) DEFAULT '0',
    PRIMARY KEY (id)
  ) AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;`, (err, data) => {if(err) console.log(err)});
db.query(`CREATE TABLE IF NOT EXISTS post_likes(
    postId int NOT NULL,
    user_id int NOT NULL,
    PRIMARY KEY (postId,user_id)
  ) DEFAULT CHARSET=utf8mb4 ;`, (err, data) => {if(err) console.log(err)});
db.query(`CREATE TABLE IF NOT EXISTS replies(
    idReply int NOT NULL AUTO_INCREMENT,
    Content text NOT NULL,
    userId int NOT NULL,
    date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    idEntry int DEFAULT NULL,
    PRIMARY KEY (idReply)
  ) AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4;`, (err, data) => {if(err) console.log(err)});
db.query(`CREATE TABLE IF NOT EXISTS reply_likes(
    replyId int NOT NULL,
    userId int NOT NULL,
    PRIMARY KEY (replyId,userId)
  ) DEFAULT CHARSET=utf8mb4 ;`, (err, data) => {if(err) console.log(err)});
db.query(`CREATE TABLE IF NOT EXISTS user(
    username varchar(16) NOT NULL,
    email varchar(255) DEFAULT NULL,
    password TEXT NOT NULL COMMENT 'Hashed Password',
    creation_date datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'The time is in UTC format.',
    id int NOT NULL AUTO_INCREMENT,
    salt varchar(16) NOT NULL,
    photoId int DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY id_UNIQUE (id)
  )  AUTO_INCREMENT=17;`, (err, data) => {if(err) console.log(err)});


/*const verifyUser = (req,res,next) => {
    const token = res.cookies.token;
    if(!token){
        return res.json({isLoggedIn: false})
    }else{
        jwt.verify(token, "secret-key", (err, decoded) => {
            if(err){
                return res.json({isLoggedIn: false})
            }else{
                req.name = decoded.name;
                next()
            }
        })
    }
}*/

app.get("/", (req,res) => {
    if(req.session.isLoggedIn){
        return res.json({valid: true, username: req.session.username, userId: req.session.userId, creation_date: req.session.creation_date, photoId: req.session.photoId})
    }else{
        return res.json({valid: false})
    }
});

app.post("/register", (req,res) => {
    const q = "SELECT * FROM user WHERE email = ?";
    const q1 = "INSERT INTO user (`username`,`email`,`password`,`creation_date`,`id`,`photoId`,`salt`)VALUES(?,?,?,CURRENT_TIMESTAMP,0,0,?);";
    var isEligible;
    const salt = crypto.randomBytes(16).toString();
    db.query(q, [req.body.email], (err,data) => {
        if(err){
            console.log(err);
            return res.json({isRegistered: false, Message: "Bir hata oluştu."})
        }else if(data.length > 0){
            return res.json({isRegistered: false, Message: "Bu mail adresi zaten kullanımda. Farklı bir adres deneyin."})
        }else{
            db.query(q1, [req.body.username, req.body.email,crypto.scryptSync(req.body.password,salt,32).toString('hex'), salt], (err,data) => {
                if(err){
                    console.log(err);
                    return res.json({isRegistered: false, Message: "Bir hata oluştu."})
                }else{
                    console.log("geldi")
                    return res.json({isRegistered: true})
                }
            })
        }
    })
    
})

app.post("/login", (req,res) => {
    const q = "SELECT * FROM user WHERE email = ?";
    db.query(q, [req.body.user], (err, data) => {
        const a = Buffer.from(data[0].password, "hex");
        const b = crypto.scryptSync(req.body.pwd,data[0].salt,32);
        if(err) {
            console.log(err);
            return res.json("Giriş Başarısız.");
        }
        else if(crypto.timingSafeEqual(a,b)){
            req.session.isLoggedIn = true;
            req.session.username = data[0].username;
            req.session.userId = data[0].id;
            req.session.creation_date = data[0].creation_date;
            if(data[0].photoId){
                req.session.photoId = data[0].photoId;
            }
            return res.json({isSuccess : true , username: req.session.username});
        } else {
            return res.json({isSuccess: false});
        }
        
    })
});

app.post("/post", (req,res) => {
    const q = "INSERT INTO entry VALUES(0,?,?,?,CURRENT_TIMESTAMP)";
    db.query(q, [req.body.title, req.body.content, req.body.userId], (err, data) => {
        if(err){
            console.log(err);
            return res.json({Message: err, Success: false})
        }else {
            setPostPaths();
            return res.json({Message: "Gönderi Oluşturuldu", Success: true})
        }
    })
});

app.post("/reply", (req,res) => {
    const q = "INSERT INTO replies VALUES (0,?,?,CURRENT_TIMESTAMP,?);"
    db.query(q, [req.body.Content, req.body.userId, req.body.entryId], (err, data) => {
        if(err){
            console.log(err);
            return res.json({Message: err, Success: false})
        }else{
            setPostPaths();
            return res.json({Message: "Yanıt Gönderildi", Success: true})
        }
    })
});

app.post("/profile", (req, res) => {
    const q = "SELECT Title,username,idEntry,Title,Content,date,userId FROM entry as E1 inner join user U1 ON E1.userId=U1.id where userId=?"
    db.query(q, [req.body.userId], (err,data) => {
        if(err) return res.json(err)
        else return res.json(data);
    })
})

app.post("/profile/likes", (req,res) => {
    const q = "SELECT Title,username,idEntry,Title,Content,date,userId FROM user as U1 INNER JOIN post_likes AS P1 ON U1.id=P1.user_id INNER JOIN entry AS E1 ON E1.idEntry=P1.postId where user_id=?"
    db.query(q, [req.body.userId], (err,data) => {
        if(err) return res.json(err)
        else return res.json(data);
    })
})

app.post("/deleteuser", (req,res) => {
    const q = "delete from user where id= ?"
    db.query(q, req.session.userId, (err,data) => {
        if(err) return res.json({Message: err, Success: false})
        else return res.json({Success: true})
    })
})

app.post("/logout", (req,res) => {
    req.session.destroy();
    res.redirect('/');
});

async function setPostPaths(){
    const entries = await new Promise((resolve) => {
        db.query("SELECT idEntry FROM entry", (err, res) => {
          resolve(res);
        })
      });
    
    entries.forEach(function(entry){
        app.get("/posts/" + entry.idEntry, (req,res) => {
            const q = "SELECT idEntry,Title,Content,userId,date,username,count(user_id) as Likes FROM entry AS E1 inner join user AS U1 ON E1.userId = U1.id left join post_likes AS P1 ON E1.idEntry=P1.postId WHERE E1.idEntry = ?";
            db.query(q,[entry.idEntry], (err, data) => {
                if(err) return res.json(err);
                return res.json(data);
            })
        })
      });
      entries.forEach(function(entry){
        app.get("/replies/" + entry.idEntry, (req,res) => {
            const q = "SELECT idReply,Content,R1.userId,date,idEntry,username,count(R2.userId) as Likes FROM replies as R1 inner join user as U1 ON R1.userId=U1.id left join reply_likes as R2 ON R1.idReply=R2.replyId WHERE R1.idEntry = ? GROUP BY R1.idReply";
            db.query(q, [entry.idEntry],(err, data) => {
                if(err) return res.json(err);
                return res.json(data);
            })
        })
      });
}

setPostPaths();

app.post("/search",(req,res) => {
    const q = "SELECT idEntry,Title,Content,userId,date,username,count(user_id) as Likes FROM entry AS E1 inner join user AS U1 ON E1.userId = U1.id left join post_likes AS P1 ON E1.idEntry=P1.postId WHERE MATCH(E1.Title, E1.Content) against (?) group by E1.idEntry";
    db.query(q, [req.body.term], (err,data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.post("/likepost", (req, res) => {
    const q = "insert into post_likes values(?,?)";
    db.query(q, [req.body.postId, req.body.user_id], (err,data) => {
        if(err) return res.json({Message: err, Success: false})
        else return res.json({Message: "Başarılı", Success: true})
    })
});

app.post("/unlikepost", (req, res) => {
    const q = "delete from post_likes where postId= ? and user_id=?";
    db.query(q, [req.body.postId, req.body.user_id], (err,data) => {
        if(err) return res.json({Message: err, Success: false})
        else return res.json({Message: "Başarılı", Success: true})
    })
});

app.post("/delete", (req, res) => {
    const q = "delete from entry where idEntry = ?";
    db.query(q, [req.body.id], (err,data) => {
        if(err) return res.json({Message: err, Success: false})
        else{
            const q1 = "delete from post_likes where postId = ?"
            db.query(q1, [req.body.id], (err,data) => {
                if(err) return res.json({Message: err, Success: false})
                else return res.json({Message: "Başarılı", Success: true})
            })
        } 
    })
})

app.post("/likereply", (req, res) => {
    const q = "insert into reply_likes values(?,?)";
    db.query(q, [req.body.replyId, req.body.userId], (err,data) => {
        if(err) return res.json({Message: err, Success: false})
        else return res.json({Message: "Başarılı", Success: true})
    })
});

app.post("/unlikereply", (req, res) => {
    const q = "delete from reply_likes where replyId= ? and userId=?";
    db.query(q, [req.body.replyId, req.body.userId], (err,data) => {
        if(err) return res.json({Message: err, Success: false})
        else {
            console.log(data)
            return res.json({Message: "Başarılı", Success: true})
        }
    })
});

app.post("/isPostLiked", (req, res) => {
    const q = "select count(*) as isLiked from post_likes where postId = ? and user_id = ?"
    db.query(q, [req.body.postId, req.body.user_id], (err, data) => {
        if(err) return res.json(err)
        else return res.json(data);
    })
});

// NOTIFICATION TYPES:
// 1 - Post Like
// 2 - Reply Like
// 3 - New Reply On User's Post

app.post("/notify", (req,res) => {
    const q = "insert into notifications values(0,?,?,CURRENT_TIMESTAMP,?,?,?,0)"
    db.query(q, [req.body.userId, req.body.sourceId, req.body.type, req.body.postId, req.body.replyId], (err, data) => {
        if(err) return res.json({Message: err, Success: false});
        else return res.json({Success: true})
    })
});

app.post("/notifications", (req,res) => {
    const q = "select N1.id, N1.isRead,N1.type, N1.postId, N1.replyId,N1.date, U1.username from notifications as N1 inner join user as U1 on N1.userId=U1.id where N1.sourceId = ?"
    db.query(q, [req.body.userId], (err, data) => {
        if(err) return res.json(err)
        else return res.json(data)
    })
})

app.post("/isReplyLiked", (req, res) => {
    const q = "select count(*) as isLiked from reply_likes where replyId = ? and userId = ?"
    db.query(q, [req.body.replyId, req.body.userId], (err,data) => {
        if(err) return res.json(err)
        else return res.json(data);
    })
})

app.get("/users", (req,res) => {
    const q = "SELECT * FROM user";
    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})



app.get("/posts", (req,res) => {
    const q = "SELECT Title,username,idEntry,Title,Content,date,userId FROM entry as E1 inner join user U1 ON E1.userId=U1.id;";
    db.query(q, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})


app.listen(3300, () =>{
    console.log("dinleniyor...");
} )