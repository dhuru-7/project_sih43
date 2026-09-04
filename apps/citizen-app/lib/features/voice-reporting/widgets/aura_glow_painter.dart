import 'dart:math' as math;
import 'package:flutter/material.dart';

/// Renders a pure atmospheric Aurora Borealis (Northern Lights) ambient aura:
/// 1. Constrained to the bottom 15% of the screen.
/// 2. Shimmering, breathing corner plumes and bezel accent arcs on all 4 corners.
/// 3. Living animations: undulating harmonic wave curtains, horizontal chromatic drift,
///    swaying vertical light rays, and breathing corner flares.
/// 4. Mathematically seamless continuous loop (all harmonic frequencies are strictly integer multiples of 2*PI,
///    guaranteeing C1 continuity with ZERO 1-frame jitter or hitch at the loop boundary).
/// 5. Completely free of discrete circular discs, concentric rings, or circular geometry.
class AuraGlowPainter extends CustomPainter {
  final double animationProgress; // 0.0 to 1.0 continuous loop
  final double soundLevel; // 0.0 to 1.0 dynamic voice responsiveness
  final double transitionProgress; // 0.0 to 1.0 enter/exit transition

  AuraGlowPainter({
    required this.animationProgress,
    this.soundLevel = 0.0,
    this.transitionProgress = 1.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final t = transitionProgress.clamp(0.0, 1.0);
    if (t <= 0.001) return;

    // Continuous fundamental phase angle (0 to 2*PI)
    final phase = animationProgress * 2 * math.pi;
    final dynamicPulse = 1.0 + (soundLevel * 0.25);

    // =========================================================================
    // 1. FOUR CORNERS OF THE ENTIRE SCREEN (Organic Atmospheric Auroras)
    // =========================================================================
    _paintAllCorners(canvas, size, phase, dynamicPulse, t);

    // =========================================================================
    // 2. BOTTOM 15% OF THE SCREEN (Harmonic Undulating Aurora Curtains & Rays)
    // =========================================================================
    _paintBottom15PercentAura(canvas, size, phase, dynamicPulse, t);
  }

  /// Paints organic, non-circular aurora plumes and glowing bezel rim accents
  /// on all 4 corners of the screen (Top-Left, Top-Right, Bottom-Left, Bottom-Right).
  /// All oscillation frequencies are strict integer harmonics of [phase] for seamless looping.
  void _paintAllCorners(
    Canvas canvas,
    Size size,
    double phase,
    double dynamicPulse,
    double t,
  ) {
    final w = size.width;
    final h = size.height;
    final baseCornerSize = math.min(w, h) * 0.24;

    // -------------------------------------------------------------
    // TOP-LEFT CORNER (TL) - Emerald & Cyan Atmospheric Aurora
    // Frequencies: 1x, 2x (strictly integer harmonics)
    // -------------------------------------------------------------
    final tlReachX = baseCornerSize *
        (0.85 + 0.15 * math.sin(phase * 1)) *
        dynamicPulse *
        t;
    final tlReachY = baseCornerSize *
        (0.85 + 0.15 * math.cos(phase * 1)) *
        dynamicPulse *
        t;

    final tlPath = Path();
    tlPath.moveTo(0, 0);
    tlPath.lineTo(0, tlReachY);
    tlPath.cubicTo(
      tlReachX * 0.25,
      tlReachY * 0.85,
      tlReachX * 0.85,
      tlReachY * 0.25,
      tlReachX,
      0,
    );
    tlPath.close();

    final tlHueShift = math.sin(phase * 1);
    final tlPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topLeft,
        end: const Alignment(0.4, 0.4),
        colors: [
          Color.lerp(
            const Color(0xFF06B6D4), // Electric Cyan
            const Color(0xFF10B981), // Aurora Emerald
            (tlHueShift + 1.0) / 2.0,
          )!.withValues(alpha: 0.48 * t),
          const Color(0xFF8B5CF6).withValues(alpha: 0.28 * t), // Soft Violet
          Colors.transparent,
        ],
        stops: const [0.0, 0.45, 1.0],
      ).createShader(Rect.fromLTWH(0, 0, tlReachX + 20, tlReachY + 20))
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 28);

    canvas.drawPath(tlPath, tlPaint);

    // TL Bezel Accent Arc (frequency: 2x)
    _drawCornerBezelArc(
      canvas: canvas,
      centerCorner: Offset.zero,
      startPoint: Offset(0, tlReachY * 0.75),
      endPoint: Offset(tlReachX * 0.75, 0),
      controlPoint: const Offset(4, 4),
      color1: const Color(0xFF06B6D4),
      color2: const Color(0xFF10B981),
      alpha: (0.45 + 0.25 * math.sin(phase * 2)) * t,
    );

    // -------------------------------------------------------------
    // TOP-RIGHT CORNER (TR) - Violet & Rose Atmospheric Aurora
    // Frequencies: 1x, 2x (strictly integer harmonics)
    // -------------------------------------------------------------
    final trReachX = baseCornerSize *
        (0.85 + 0.15 * math.cos(phase * 1)) *
        dynamicPulse *
        t;
    final trReachY = baseCornerSize *
        (0.85 + 0.15 * math.sin(phase * 1)) *
        dynamicPulse *
        t;

    final trPath = Path();
    trPath.moveTo(w, 0);
    trPath.lineTo(w, trReachY);
    trPath.cubicTo(
      w - trReachX * 0.25,
      trReachY * 0.85,
      w - trReachX * 0.85,
      trReachY * 0.25,
      w - trReachX,
      0,
    );
    trPath.close();

    final trPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topRight,
        end: const Alignment(-0.4, 0.4),
        colors: [
          const Color(0xFF8B5CF6).withValues(alpha: 0.46 * t), // Celestial Violet
          const Color(0xFFEC4899).withValues(alpha: 0.32 * t), // Soft Magenta
          Colors.transparent,
        ],
        stops: const [0.0, 0.50, 1.0],
      ).createShader(Rect.fromLTWH(w - trReachX - 20, 0, trReachX + 20, trReachY + 20))
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 28);

    canvas.drawPath(trPath, trPaint);

    // TR Bezel Accent Arc (frequency: 2x)
    _drawCornerBezelArc(
      canvas: canvas,
      centerCorner: Offset(w, 0),
      startPoint: Offset(w, trReachY * 0.75),
      endPoint: Offset(w - trReachX * 0.75, 0),
      controlPoint: Offset(w - 4, 4),
      color1: const Color(0xFF8B5CF6),
      color2: const Color(0xFFEC4899),
      alpha: (0.45 + 0.25 * math.cos(phase * 2)) * t,
    );

    // -------------------------------------------------------------
    // BOTTOM-LEFT CORNER (BL) - Turquoise & Mint Corner Flare
    // Frequencies: 1x, 2x (strictly integer harmonics with constant phase shift)
    // -------------------------------------------------------------
    final blReachX = baseCornerSize *
        (0.80 + 0.15 * math.sin(phase * 1 + (math.pi / 2))) *
        dynamicPulse *
        t;
    final blReachY = baseCornerSize *
        (0.80 + 0.15 * math.cos(phase * 1 + (math.pi / 3))) *
        dynamicPulse *
        t;

    final blPath = Path();
    blPath.moveTo(0, h);
    blPath.lineTo(0, h - blReachY);
    blPath.cubicTo(
      blReachX * 0.25,
      h - blReachY * 0.85,
      blReachX * 0.85,
      h - blReachY * 0.25,
      blReachX,
      h,
    );
    blPath.close();

    final blPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.bottomLeft,
        end: const Alignment(0.4, -0.4),
        colors: [
          const Color(0xFF06B6D4).withValues(alpha: 0.44 * t), // Cyan
          const Color(0xFF10B981).withValues(alpha: 0.30 * t), // Emerald
          Colors.transparent,
        ],
        stops: const [0.0, 0.48, 1.0],
      ).createShader(Rect.fromLTWH(0, h - blReachY - 20, blReachX + 20, blReachY + 20))
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 26);

    canvas.drawPath(blPath, blPaint);

    // BL Bezel Accent Arc (frequency: 2x)
    _drawCornerBezelArc(
      canvas: canvas,
      centerCorner: Offset(0, h),
      startPoint: Offset(0, h - blReachY * 0.75),
      endPoint: Offset(blReachX * 0.75, h),
      controlPoint: Offset(4, h - 4),
      color1: const Color(0xFF10B981),
      color2: const Color(0xFF06B6D4),
      alpha: (0.42 + 0.22 * math.sin(phase * 2 + 1.0)) * t,
    );

    // -------------------------------------------------------------
    // BOTTOM-RIGHT CORNER (BR) - Indigo & Rose Corner Flare
    // Frequencies: 1x, 2x (strictly integer harmonics with constant phase shift)
    // -------------------------------------------------------------
    final brReachX = baseCornerSize *
        (0.80 + 0.15 * math.cos(phase * 1 + 1.2)) *
        dynamicPulse *
        t;
    final brReachY = baseCornerSize *
        (0.80 + 0.15 * math.sin(phase * 1 + 0.8)) *
        dynamicPulse *
        t;

    final brPath = Path();
    brPath.moveTo(w, h);
    brPath.lineTo(w, h - brReachY);
    brPath.cubicTo(
      w - brReachX * 0.25,
      h - brReachY * 0.85,
      w - brReachX * 0.85,
      h - brReachY * 0.25,
      w - brReachX,
      h,
    );
    brPath.close();

    final brPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.bottomRight,
        end: const Alignment(-0.4, -0.4),
        colors: [
          const Color(0xFFEC4899).withValues(alpha: 0.42 * t), // Magenta
          const Color(0xFF6366F1).withValues(alpha: 0.28 * t), // Indigo
          Colors.transparent,
        ],
        stops: const [0.0, 0.48, 1.0],
      ).createShader(Rect.fromLTWH(w - brReachX - 20, h - brReachY - 20, brReachX + 20, brReachY + 20))
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 26);

    canvas.drawPath(brPath, brPaint);

    // BR Bezel Accent Arc (frequency: 2x)
    _drawCornerBezelArc(
      canvas: canvas,
      centerCorner: Offset(w, h),
      startPoint: Offset(w, h - brReachY * 0.75),
      endPoint: Offset(w - brReachX * 0.75, h),
      controlPoint: Offset(w - 4, h - 4),
      color1: const Color(0xFFEC4899),
      color2: const Color(0xFF6366F1),
      alpha: (0.42 + 0.22 * math.cos(phase * 2 + 1.0)) * t,
    );
  }

  /// Draws a fine illuminated accent curve following the corner bezel.
  void _drawCornerBezelArc({
    required Canvas canvas,
    required Offset centerCorner,
    required Offset startPoint,
    required Offset endPoint,
    required Offset controlPoint,
    required Color color1,
    required Color color2,
    required double alpha,
  }) {
    if (alpha <= 0.01) return;

    final path = Path();
    path.moveTo(startPoint.dx, startPoint.dy);
    path.quadraticBezierTo(controlPoint.dx, controlPoint.dy, endPoint.dx, endPoint.dy);

    final rect = Rect.fromPoints(startPoint, endPoint).inflate(10);
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.4
      ..strokeCap = StrokeCap.round
      ..shader = LinearGradient(
        colors: [
          color1.withValues(alpha: alpha.clamp(0.0, 1.0)),
          color2.withValues(alpha: (alpha * 0.8).clamp(0.0, 1.0)),
          Colors.transparent,
        ],
        stops: const [0.0, 0.65, 1.0],
      ).createShader(rect)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4.0);

    canvas.drawPath(path, paint);
  }

  /// Renders undulating Aurora Borealis light curtains and swaying vertical rays
  /// strictly within the bottom 15% of the screen.
  /// All harmonics are strict integer multiples of [phase] for seamless looping.
  void _paintBottom15PercentAura(
    Canvas canvas,
    Size size,
    double phase,
    double dynamicPulse,
    double t,
  ) {
    final w = size.width;
    final h = size.height;

    // Strict 15% bottom ceiling
    final bottom15Height = h * 0.15;
    // Rises from bottom (h) up to (h - bottom15Height) as transition progress t rises
    final currentHeight = bottom15Height * t;
    final yBase = h - currentHeight;

    // -------------------------------------------------------------
    // A. SWAYING VERTICAL AURORA RAYS (Standing Curtains - Zero Pop/Jitter)
    // Anchored with harmonic continuous oscillation (frequencies 1x, 2x)
    // -------------------------------------------------------------
    const rayAnchors = [0.20, 0.40, 0.60, 0.80];
    for (int i = 0; i < rayAnchors.length; i++) {
      // Harmonic gentle sway around anchor position (frequency: 1x, seamless loop)
      final swayOffset = (i % 2 == 0)
          ? math.sin(phase * 1 + (i * math.pi / 2)) * (w * 0.04)
          : math.cos(phase * 1 + (i * math.pi / 2)) * (w * 0.04);
      final rayX = (w * rayAnchors[i]) + swayOffset;

      // Harmonic breathing width & alpha (frequencies: 1x, 2x)
      final rayWidth = 30.0 + 12.0 * math.sin(phase * 1 + (i * 1.5));
      final rayAlpha = (0.22 + 0.12 * math.sin(phase * 2 + (i * 1.2))) * t;

      if (rayAlpha > 0.01) {
        final rayRect = Rect.fromLTWH(rayX - rayWidth / 2, yBase, rayWidth, currentHeight);
        final rayColor = (i % 2 == 0) ? const Color(0xFF06B6D4) : const Color(0xFF10B981);
        final raySecondary = (i % 2 == 0) ? const Color(0xFF8B5CF6) : const Color(0xFFEC4899);

        final rayPaint = Paint()
          ..shader = LinearGradient(
            begin: Alignment.bottomCenter,
            end: Alignment.topCenter,
            colors: [
              rayColor.withValues(alpha: (rayAlpha * 0.65).clamp(0.0, 1.0)),
              raySecondary.withValues(alpha: (rayAlpha * 0.40).clamp(0.0, 1.0)),
              Colors.transparent,
            ],
            stops: const [0.0, 0.60, 1.0],
          ).createShader(rayRect)
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 18);

        canvas.drawRect(rayRect, rayPaint);
      }
    }

    // -------------------------------------------------------------
    // B. LAYER 1: DEEP INDIGO & COSMIC VIOLET BASE WAVE
    // Frequencies: 1x, 2x (strictly integer harmonics)
    // -------------------------------------------------------------
    final wave1Height = currentHeight * 0.95 * dynamicPulse;
    final yWave1 = h - wave1Height;
    final p1 = Path();
    p1.moveTo(0, yWave1 + math.sin(phase * 1) * 6);
    p1.cubicTo(
      w * 0.28,
      yWave1 - 10 + math.cos(phase * 1) * 7,
      w * 0.72,
      yWave1 + 8 - math.sin(phase * 1) * 7,
      w,
      yWave1 - 4 + math.cos(phase * 1) * 5,
    );
    p1.lineTo(w, h);
    p1.lineTo(0, h);
    p1.close();

    final horizontalShift1 = math.sin(phase * 1) * 0.25;
    final paint1 = Paint()
      ..shader = LinearGradient(
        begin: Alignment(-0.2 + horizontalShift1, 1.0),
        end: Alignment(0.2 - horizontalShift1, -1.0),
        colors: [
          const Color(0xFF4F46E5).withValues(alpha: 0.52 * t), // Deep Indigo
          const Color(0xFF8B5CF6).withValues(alpha: 0.38 * t), // Cosmic Violet
          const Color(0xFF06B6D4).withValues(alpha: 0.16 * t), // Cyan Edge
          Colors.transparent,
        ],
        stops: const [0.0, 0.42, 0.80, 1.0],
      ).createShader(Rect.fromLTWH(0, yWave1 - 15, w, currentHeight + 15))
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 32);

    canvas.drawPath(p1, paint1);

    // -------------------------------------------------------------
    // C. LAYER 2: NORTHERN EMERALD & TURQUOISE FLOWING VEIL
    // Frequencies: 1x, 2x (strictly integer harmonics)
    // -------------------------------------------------------------
    final wave2Height = currentHeight * 0.78 * dynamicPulse;
    final yWave2 = h - wave2Height;
    final p2 = Path();
    p2.moveTo(0, yWave2 + math.cos(phase * 1) * 7);
    p2.cubicTo(
      w * 0.35,
      yWave2 + 9 - math.sin(phase * 2) * 8,
      w * 0.65,
      yWave2 - 11 + math.cos(phase * 1) * 7,
      w,
      yWave2 + 5 + math.sin(phase * 1) * 6,
    );
    p2.lineTo(w, h);
    p2.lineTo(0, h);
    p2.close();

    final horizontalShift2 = math.cos(phase * 1) * 0.30;
    final paint2 = Paint()
      ..shader = LinearGradient(
        begin: Alignment(0.3 + horizontalShift2, 1.0),
        end: Alignment(-0.3 - horizontalShift2, -1.0),
        colors: [
          const Color(0xFF06B6D4).withValues(alpha: 0.48 * t), // Electric Cyan
          const Color(0xFF10B981).withValues(alpha: 0.38 * t), // Aurora Emerald
          const Color(0xFF34D399).withValues(alpha: 0.18 * t), // Mint crest
          Colors.transparent,
        ],
        stops: const [0.0, 0.38, 0.75, 1.0],
      ).createShader(Rect.fromLTWH(0, yWave2 - 12, w, currentHeight + 12))
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 24);

    canvas.drawPath(p2, paint2);

    // -------------------------------------------------------------
    // D. LAYER 3: VIBRANT MAGENTA & ROSE SHIMMER CREST
    // Frequencies: 2x, 3x (strictly integer harmonics)
    // -------------------------------------------------------------
    final wave3Height = currentHeight * 0.58 * dynamicPulse;
    final yWave3 = h - wave3Height;
    final p3 = Path();
    p3.moveTo(0, yWave3 + math.sin(phase * 2 + 1.2) * 5);
    p3.cubicTo(
      w * 0.42,
      yWave3 - 8 + math.cos(phase * 2) * 6,
      w * 0.58,
      yWave3 + 7 - math.sin(phase * 3) * 5,
      w,
      yWave3 - 3 + math.cos(phase * 2) * 4,
    );
    p3.lineTo(w, h);
    p3.lineTo(0, h);
    p3.close();

    final paint3 = Paint()
      ..shader = LinearGradient(
        begin: Alignment.bottomCenter,
        end: Alignment.topCenter,
        colors: [
          const Color(0xFFEC4899).withValues(alpha: 0.44 * t), // Vibrant Magenta
          const Color(0xFFF43F5E).withValues(alpha: 0.28 * t), // Soft Rose
          Colors.transparent,
        ],
        stops: const [0.0, 0.45, 1.0],
      ).createShader(Rect.fromLTWH(0, yWave3 - 10, w, currentHeight + 10))
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 18);

    canvas.drawPath(p3, paint3);
  }

  @override
  bool shouldRepaint(covariant AuraGlowPainter oldDelegate) {
    return oldDelegate.animationProgress != animationProgress ||
        oldDelegate.soundLevel != soundLevel ||
        oldDelegate.transitionProgress != transitionProgress;
  }
}

