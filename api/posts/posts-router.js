// posts için gerekli routerları buraya yazın
const router = require("express").Router();
const postModel = require("./posts-model");

router.get("/", async (req, res) => {
  try {
    const allPosts = await postModel.find();
    res.json(allPosts);
  } catch (error) {
    res.status(500).json({ message: "Gönderiler alınamadı" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      res.json(post);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, contents } = req.body;
    if (!title || !contents) {
      res.status(400).json({
        message: "Lütfen gönderi için bir title ve contents sağlayın",
      });
    } else {
      const insertedPostId = await postModel.insert({
        title: title,
        contents: contents,
      });
      const insertedPost = await postModel.findById(insertedPostId.id);
      res.status(201).json(insertedPost);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await postModel.findById(id);
    if (!post) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      const { title, contents } = req.body;
      if (!title || !contents) {
        res.status(400).json({
          message: "Lütfen gönderi için bir title ve contents sağlayın",
        });
      } else {
        await postModel.update(id, {
          title: title,
          contents: contents,
        });
        const updatedPost = await postModel.findById(id);
        res.json(updatedPost);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      await postModel.remove(req.params.id);
      res.json(post);
      //res.json({message:`${req.params.id} I li kayıt silindi.`});
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      const postComments = await postModel.findPostComments(req.params.id);
      res.json(postComments);
    }
  } catch (error) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

module.exports = router;
