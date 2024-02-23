import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000;

// Get data from ejs: use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// Set the path to public for static files
app.use(express.static("public"));

const allPosts = [];
var id = 0;  // keeps track of id of each post. Adding 1 when creating a new post


// --------------------------- Main page ---------------------------
app.get("/", (req, res) => {
    if (allPosts.length > 0) {
        // Render main page if there's posts
        res.render("index.ejs", { posts: allPosts });
    } else {
        // Otherwise render create page
        res.redirect("/create");
    }
});


// --------------------------- Create page ---------------------------
app.get("/create", (req, res) => {
    if (allPosts.length == 0) {
        // when thers are no posts, show the message as well
        res.render("create.ejs", { message: "There are no posts yet." });
    } else {
        res.render("create.ejs");
    };
});


// Create backend
app.post("/createBackend", (req, res) => {
    var newPost = {
        id : ++id,
        title: req.body["title"],
        content: req.body["content"],
    };
    allPosts.push(newPost);

    res.redirect("/");
});


// --------------------------- Edit page ---------------------------
// Render edit page
app.post("/edit", (req, res) => {
    //  Get id from the index.ejs
    var id = parseInt(req.body["id"]);
    var selectedPost;

    // Get the selectedPost using the id
    for (var i = 0; i < allPosts.length; i++) {
        if (allPosts[i].id == id) {
            // Get the index of the post
            var index = allPosts.indexOf(allPosts[i]);
            selectedPost = allPosts[index];
            break;
        };
    };

    // Render edit page
    res.render("edit.ejs", { post: selectedPost });
});


// Edit the post in the back. Redirect to the main page.
app.post("/editBackend", (req, res) => {
    //  Get id from the index.ejs
    var id = parseInt(req.body["id"]);

    // Get the selectedPost using the id
    for (var i = 0; i < allPosts.length; i++) {
        if (allPosts[i].id == id) {
            // Get the index of the post
            var index = allPosts.indexOf(allPosts[i]);

            // Update existing post
            allPosts[index].title = req.body["title"];
            allPosts[index].content = req.body["content"];
        };
    };

    res.redirect("/");
});

// --------------------------- Delete post ---------------------------
// Delete post in the back-end. Rediect to the main page
app.post("/deleteBackend", (req, res) => {
    // Get id from the index.ejs
    var id = parseInt(req.body["id"]);
    
    // Find the post with the id above
    for (var i = 0; i < allPosts.length; i++) {
        if (allPosts[i].id == id) {
            // Get the index of the post
            var index = allPosts.indexOf(allPosts[i]);
            
            // Delete the post using the index
            allPosts.splice(index, 1);
            break;
        };
    };

    // Redirect to the main page
    res.redirect("/");
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});