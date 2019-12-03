const express = require("express");

const router = express.Router();

const Posts = require("./db");

router.use(express.json());

router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  Posts.findPostComments(req.params.id)
    .then(comments => {
      if (comments) {
        res.status(200).json(comments);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Posts.findById(id)
    .then(post => {
      if (post) {
        Posts.remove(id)
          .then(() => {
            res.status(200).json(post);
          })
          .catch(err => {
            res.status(500).json({ error: "The post could not be removed" });
          });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (title && contents) {
    Posts.insert({ title: title, contents: contents })
      .then(post => {
        res.status(201).json(post);
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

// router.post("/:id/comments", (req, res) => {
//     const id = req.params.id;
//     const { text } = req.body;
//     Posts.findById(id)
//     .then(post)
// })

router.put("/:id", (req, res) => {
  const changes = req.body;
  const { title, contents } = req.body;
  if (title && contents) {
    Posts.update(req.params.id, changes)
      .then(post => {
        if (post) {
          res.status(200).json(post);
        } else {
          res
            .status(404)
            .json({
              message: "The post with the specified ID does not exist."
            });
        }
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
  } else {
    res
      .status(400)
      .json({
        errorMessage: "Please provide title and contents for the post."
      });
  }
});

module.exports = router;
