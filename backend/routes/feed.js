import { Router } from "express";
import supabase from "../services/supabase.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// POST /feed/post
router.post("/post", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Post cannot be empty" });
    }

    if (content.length > 500) {
      return res.status(400).json({ error: "Post cannot exceed 500 characters" });
    }

    const { data: user } = await supabase
      .from("users")
      .select("name, points")
      .eq("id", req.user.id)
      .single();

    const { data, error } = await supabase
      .from("study_feed")
      .insert({ userId: req.user.id, userName: user.name, content })
      .select()
      .single();

    if (error) throw error;

    // Award +5 points
    await supabase
      .from("users")
      .update({ points: (user?.points || 0) + 5 })
      .eq("id", req.user.id);

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to post" });
  }
});

// GET /feed
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("study_feed")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feed" });
  }
});

// POST /feed/like/:postId
router.post("/like/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if already liked
    const { data: existing } = await supabase
      .from("feed_likes")
      .select("id")
      .eq("userId", req.user.id)
      .eq("postId", postId)
      .single();

    if (existing) {
      // Unlike
      await supabase.from("feed_likes").delete().eq("id", existing.id);
      const { data: post } = await supabase
        .from("study_feed").select("likes").eq("id", postId).single();
      await supabase
        .from("study_feed")
        .update({ likes: Math.max(0, (post?.likes || 1) - 1) })
        .eq("id", postId);
      return res.json({ liked: false });
    }

    // Like
    await supabase.from("feed_likes").insert({ userId: req.user.id, postId });
    const { data: post } = await supabase
      .from("study_feed").select("likes").eq("id", postId).single();
    await supabase
      .from("study_feed")
      .update({ likes: (post?.likes || 0) + 1 })
      .eq("id", postId);

    res.json({ liked: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

export default router;
