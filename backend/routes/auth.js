import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../services/supabase.js";

const router = Router();

function generateReferralCode(name) {
  const prefix = name.replace(/\s+/g, "").substring(0, 4).toUpperCase();
  const digits = Math.floor(100 + Math.random() * 900);
  return `${prefix}${digits}`;
}

// POST /auth/signup
router.post("/signup", async (req, res) => {
  try {
    const {
      name, password, country,
      educationLevel, subLevel, examType,
      subjects, courseField, courseName, goal,
      referredBy
    } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "Name and password are required" });
    }

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("name", name)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = generateReferralCode(name);

    const currencyMap = { Nigeria: "NGN", USA: "USD", UK: "GBP", India: "INR" };
    const currency = currencyMap[country] || "USD";

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        name,
        password: hashedPassword,
        country,
        currency,
        educationlevel: educationLevel,
        sublevel: subLevel,
        examtype: examType,
        subjects,
        coursefield: courseField,
        coursename: courseName,
        goal,
        referralcode: referralCode,
        referredby: referredBy || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Handle referral
    if (referredBy) {
      const { data: referrer } = await supabase
        .from("users")
        .select("id, points, invitecount")
        .eq("referralcode", referredBy)
        .single();

      if (referrer) {
        await supabase
          .from("users")
          .update({
            points: (referrer.points || 0) + 10,
            invitecount: (referrer.invitecount || 0) + 1,
          })
          .eq("id", referrer.id);
      }
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const { password: _, ...safeUser } = user;
    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error("[signup]", err.message);
    res.status(500).json({ error: err.message || "Signup failed" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .ilike("name", name)
      .maybeSingle();

    if (!user) {
      return res.status(401).json({ error: "User not found" });
      }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error("[login]", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
