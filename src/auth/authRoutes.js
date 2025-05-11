// src/auth/authRoutes.js
const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/google", passport.authenticate("google", { 
    scope: ["profile", "email"] 
}));


router.get( "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: true, }),
  (req, res) => {

    // Redirect to frontend with user data.
    console.log('User logged in successfully:', req.user);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

router.get("/me", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});


router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // clear session cookie
      return res.status(200).json({ message: "Logged out" });
    });
  });
});

module.exports = router;
