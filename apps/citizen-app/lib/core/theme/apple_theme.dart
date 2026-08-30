import 'package:flutter/material.dart';

class AppleTheme {
  // Colors
  static const Color background = Color(0xFFF8F9FA);
  static const Color cardDark = Color(0xFF121417);
  static const Color cardDarkSecondary = Color(0xFF1E2126);
  static const Color textPrimary = Color(0xFF0F1115);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textMuted = Color(0xFF9CA3AF);
  
  static const Color accentOrange = Color(0xFFF59E0B);
  static const Color badgePendingBg = Color(0xFFFEF3C7);
  static const Color badgePendingText = Color(0xFFD97706);
  static const Color badgePendingBorder = Color(0xFFFDE68A);

  static const Color navBarBg = Color(0xFF0F1115);
  static const Color navBarBorder = Color(0xFF262930);

  // Typography
  static const TextStyle brandTitle = TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.w900,
    color: textPrimary,
    letterSpacing: -0.5,
  );

  static const TextStyle heroGreeting = TextStyle(
    fontSize: 34,
    fontWeight: FontWeight.w800,
    color: textPrimary,
    letterSpacing: -1.0,
    height: 1.1,
  );

  static const TextStyle cardTitle = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.w800,
    color: Colors.white,
    letterSpacing: -0.5,
  );

  static const TextStyle cardSubtitle = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    color: Color(0xFF9CA3AF),
  );

  static const TextStyle sectionHeader = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w700,
    color: textPrimary,
    letterSpacing: -0.3,
  );

  static const TextStyle itemTitle = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w700,
    color: textPrimary,
    letterSpacing: -0.2,
  );

  static const TextStyle itemSubtitle = TextStyle(
    fontSize: 13,
    fontWeight: FontWeight.w500,
    color: textSecondary,
  );
}
