import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import educationConfig, { countries } from "../../config/education.js";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user, authFetch, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    country: user?.country || "",
    educationLevel: user?.educationLevel || "",
    subLevel: user?.subLevel || "",
    goal: user?.goal || "",
  });

  const config = educationConfig[form.country] || {};
  const subLevels = config.subLevels?.[form.educationLevel] || [];

  async function saveProfile() {
    setSaving(true);
    setError(null);
    try {
      const res = await authFetch("/user/update", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      updateUser(updated);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function copyReferralCode() {
    const code = user?.referralCode || "";
    navigator.clipboard?.writeText(
      `Join me on StudySphere! Use my referral code: ${code}\nhttps://studysphere-liard.vercel.app/signup?ref=${code}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const initial = user?.name?.charAt(0)?.toUpperCase() || "S";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate("/dashboard")}>← Dashboard</button>
        <h1 className={styles.title}>My Profile</h1>
        <button
          className={styles.editBtn}
          onClick={() => editing ? saveProfile() : setEditing(true)}
          disabled={saving}
        >
          {saving ? "Saving..." : editing ? "Save" : "Edit"}
        </button>
      </header>

      <div className={styles.content}>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.successMsg}>Profile updated!</div>}

        {/* Avatar & Name */}
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>{initial}</div>
          <div>
            <div className={styles.userName}>{user?.name}</div>
            <div className={styles.userEmail}>{user?.email}</div>
            <div className={styles.userRole}>{user?.role || "Student"}</div>
          </div>
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statVal}>🔥 {user?.streak || 0}</div>
            <div className={styles.statLbl}>Streak</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statVal}>⭐ {user?.points || 0}</div>
            <div className={styles.statLbl}>Points</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statVal}>👥 {user?.inviteCount || 0}</div>
            <div className={styles.statLbl}>Invites</div>
          </div>
        </div>

        {/* Profile Info */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Account Info</h2>

          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            {editing ? (
              <input className={styles.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            ) : (
              <div className={styles.value}>{user?.name || "—"}</div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <div className={styles.value}>{user?.email}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Country</label>
            {editing ? (
              <select className={styles.select} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value, educationLevel: "", subLevel: "" })}>
                <option value="">Select country</option>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            ) : (
              <div className={styles.value}>{user?.country || "—"}</div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Education Level</label>
            {editing ? (
              <select className={styles.select} value={form.educationLevel} onChange={(e) => setForm({ ...form, educationLevel: e.target.value, subLevel: "" })}>
                <option value="">Select level</option>
                {(config.levels || []).map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            ) : (
              <div className={styles.value}>{user?.educationLevel || "—"}</div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Sub Level</label>
            {editing ? (
              <select className={styles.select} value={form.subLevel} onChange={(e) => setForm({ ...form, subLevel: e.target.value })}>
                <option value="">Select level</option>
                {subLevels.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <div className={styles.value}>{user?.subLevel || "—"}</div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Goal</label>
            {editing ? (
              <select className={styles.select} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
                <option value="">Select goal</option>
                {["Exams", "Daily Study", "Homework Help"].map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            ) : (
              <div className={styles.value}>{user?.goal || "—"}</div>
            )}
          </div>

          {user?.subjects?.length > 0 && (
            <div className={styles.field}>
              <label className={styles.label}>Subjects</label>
              <div className={styles.chips}>
                {user.subjects.map((s) => (
                  <span key={s} className={styles.chip}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {user?.courseField && (
            <div className={styles.field}>
              <label className={styles.label}>Course Field</label>
              <div className={styles.value}>{user.courseField}</div>
            </div>
          )}

          {user?.courseName && (
            <div className={styles.field}>
              <label className={styles.label}>Course Name</label>
              <div className={styles.value}>{user.courseName}</div>
            </div>
          )}
        </div>

        {/* Referral */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Referral Code</h2>
          <p className={styles.referralDesc}>
            Share your code and earn +10 points for every friend who joins!
          </p>
          <div className={styles.referralBox}>
            <span className={styles.referralCode}>{user?.referralCode || "—"}</span>
            <button className={styles.copyBtn} onClick={copyReferralCode}>
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
          <div className={styles.inviteStats}>
            {user?.inviteCount || 0} friends invited so far
          </div>
        </div>

        {/* Logout */}
        <button
          className={styles.logoutBtn}
          onClick={() => { logout(); navigate("/"); }}
        >
          Logout
        </button>
      </div>
    </div>
  );
    }
