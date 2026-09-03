import 'package:flutter/material.dart';

class AppleTheme {
  // Colors - Setu Civic Identity (Stitch Design System)
  static const Color background = Color(0xFFF9F9F9);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceContainerLowest = Color(0xFFFFFFFF);
  static const Color surfaceContainerLow = Color(0xFFF3F3F3);
  static const Color surfaceContainer = Color(0xFFEEEEEE);
  static const Color surfaceContainerHigh = Color(0xFFE8E8E8);
  static const Color surfaceContainerHighest = Color(0xFFE2E2E2);
  static const Color surfaceBright = Color(0xFFF9F9F9);

  static const Color primary = Color(0xFF000000);
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF1A1C1C);
  static const Color textSecondary = Color(0xFF5E5E5E);
  static const Color textMuted = Color(0xFF7E7576);

  static const Color outline = Color(0xFF7E7576);
  static const Color outlineVariant = Color(0xFFCFC4C5);
  static const Color borderLight = Color(0xFFE5E7EB);
  static const Color secondaryContainer = Color(0xFFE3E2E2);

  // Status Badges (Stitch Design)
  static const Color badgePendingBg = Color(0xFFFEF3C7);
  static const Color badgePendingText = Color(0xFF92400E);
  static const Color badgePendingBorder = Color(0xFFFDE68A);

  static const Color badgeReviewedBg = Color(0xFFE0F2FE);
  static const Color badgeReviewedText = Color(0xFF0369A1);
  static const Color badgeReviewedBorder = Color(0xFFBAE6FD);

  static const Color badgeResolvedBg = Color(0xFFDCFCE7);
  static const Color badgeResolvedText = Color(0xFF166534);
  static const Color badgeResolvedBorder = Color(0xFFBBF7D0);

  // Card and Bottom Nav
  static const Color cardDark = Color(0xFF000000);
  static const Color navBarBg = Color(0xFFFFFFFF);
  static const Color navBarBorder = Color(0xFFE5E7EB);

  // Typography (Inter)
  static const TextStyle brandTitle = TextStyle(
    fontFamily: 'Inter',
    fontSize: 22,
    fontWeight: FontWeight.w800,
    color: primary,
    letterSpacing: -0.6,
  );

  static const TextStyle displayLg = TextStyle(
    fontFamily: 'Inter',
    fontSize: 32,
    fontWeight: FontWeight.w700,
    color: primary,
    letterSpacing: -0.64, // -0.02em
    height: 1.25,
  );

  static const TextStyle heroGreeting = TextStyle(
    fontFamily: 'Inter',
    fontSize: 30,
    fontWeight: FontWeight.w800,
    color: textPrimary,
    letterSpacing: -0.8,
    height: 1.15,
  );

  static const TextStyle cardTitle = TextStyle(
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: FontWeight.w700,
    color: onPrimary,
    letterSpacing: -0.3,
    height: 1.2,
  );

  static const TextStyle cardSubtitle = TextStyle(
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: FontWeight.w400,
    color: Color(0xFF9CA3AF),
    height: 1.3,
  );

  static const TextStyle sectionHeader = TextStyle(
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: FontWeight.w700,
    color: textPrimary,
    letterSpacing: -0.4,
  );

  static const TextStyle itemTitle = TextStyle(
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: FontWeight.w600,
    color: textPrimary,
    letterSpacing: -0.2,
  );

  static const TextStyle itemSubtitle = TextStyle(
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: FontWeight.w400,
    color: textSecondary,
  );

  static const TextStyle labelMd = TextStyle(
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: FontWeight.w700,
    color: textSecondary,
    letterSpacing: 0.6,
  );
}
