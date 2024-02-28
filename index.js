import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000;
const allPosts = [];
var id = 0;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// --------------------------- Main page ---------------------------
// Show the first post
app.get("/", (req, res) => {
    var selectedPost = allPosts[0];
    res.render("index.ejs", { currentPage:"home", posts: allPosts, post: selectedPost });
});

// Show selceted post
app.get('/post', (req, res) => {
    var currentId = req.query.id;
    var index = getIndex(currentId);
    var selectedPost = allPosts[index];
    res.render("index.ejs", { currentPage:"home", posts: allPosts, post: selectedPost });
});

// --------------------------- Create ---------------------------
app.get("/create", (req, res) => {
    res.render("create.ejs", { currentPage:"home", posts: allPosts});
});

app.post("/createBackend", (req, res) => {
    var d = new Date();

    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0, so add 1.
    var dd = String(d.getDate()).padStart(2, '0'); // add 0 until the length become 2
    var today =  yyyy + '/' + mm + '/' + dd;

    var hour = String(d.getHours()).padStart(2, '0');
    var minute = String(d.getMinutes()).padStart(2, '0');
    var time = hour + ':' + minute;

    var newPost = {
        id : ++id,
        title: req.body["title"],
        date: today,
        time: time,
        content: req.body["content"],
    };
    allPosts.push(newPost);

    res.redirect("/post?id=" + id);
});

// --------------------------- Edit ---------------------------
app.post("/edit", (req, res) => {
    var id = parseInt(req.body["id"]);
    var index = getIndex(id);
    var selectedPost = allPosts[index];

    res.render("edit.ejs", { currentPage:"home", posts: allPosts, post: selectedPost });
});

app.post("/editBackend", (req, res) => {
    var id = parseInt(req.body["id"]);
    var index = getIndex(id);

    // Update existing post
    allPosts[index].title = req.body["title"];
    allPosts[index].content = req.body["content"];

    res.redirect("/post?id=" + id);
});

// --------------------------- Delete ---------------------------
app.post("/deleteBackend", (req, res) => {
    var id = parseInt(req.body["id"]);
    var index = getIndex(id);
    allPosts.splice(index, 1);

    res.redirect("/");
});

// --------------------------- About ---------------------------
app.get("/about", (req, res) => {
    res.render("about.ejs", { currentPage:"about" });
});

// --------------------------- Album ---------------------------
app.get("/album", (req, res) => {
    res.render("album.ejs", { currentPage:"album" });
});

// --------------------------- Others ---------------------------
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

function getIndex(id) {
    for (var i = 0; i < allPosts.length; i++) {
        if (allPosts[i].id == id) {
            var index = allPosts.indexOf(allPosts[i]);
            return index;
        }
    }
}
