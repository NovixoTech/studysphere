import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../services/supabase.js";

const router = Router();

// Generate referral code
function generateReferralCode(name) {
  const prefix = name.replace(/\s+/g, "").substring(0, 4).toUpperCase();
  const digits = Math.floor(100 + Math.random() * 900);
  return `${prefix}${digits}`;
}

// POST /auth/signup
router.post("/signup", async (req, res) => {
  try {
    const {
      name, email, password, country,
      educationLevel, subLevel, examType,
      subjects, courseField, courseName, goal,
      referredBy
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    // Check if email exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate referral code
    const referralCode = generateReferralCode(name);

    // Set currency based on country
    const currencyMap = {
      Nigeria: "NGN",
      USA: "USD",
      UK: "GBP",
      India: "INR",
    };
    const currency = currencyMap[country] || "USD";

    // Save user
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        name,
        email,
        password: hashedPassword,
        country,
        currency,
        educationLevel,
        subLevel,
        examType,
        subjects,
        courseField,
        courseName,
        goal,
        referralCode,
        referredBy: referredBy || null,
      })
      .select()
      .single();

    if (error) throw error;

    // If referred, give referrer +10 points
    if (referredBy) {
      const { data: referrer } = await supabase
        .from("users")
        .select("id, points, inviteCount")
        .eq("referralCode", referredBy)
        .single();

      if (referrer) {
        await supabase
          .from("users")
          .update({
            points: (referrer.points || 0) + 10,
            inviteCount: (referrer.inviteCount || 0) + 1,
          })
          .eq("id", referrer.id);
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Remove password from response
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
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
