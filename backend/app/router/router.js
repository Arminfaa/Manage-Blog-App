const { verifyAccessToken } = require("../http/middlewares/auth.middleware");
const { userAuthRoutes } = require("./auth");
const { commentRoutes } = require("./comment");
const { categoryRoutes } = require("./category");
const { postRoutes } = require("./post");
const router = require("express").Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

router.use("/user", userAuthRoutes);
router.use("/post", postRoutes);
router.use("/comment", commentRoutes);
router.use("/category", categoryRoutes);

module.exports = router;