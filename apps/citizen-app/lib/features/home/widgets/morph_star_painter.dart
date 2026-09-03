import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../../core/theme/apple_theme.dart';
import '../../../core/widgets/elastic_pressable.dart';

/// A high-performance [CustomPainter] that smoothly morphs
/// between the classic slim Plus (+) icon (2.0px stroke, 14px span)
/// and the user's exact Setu 4-point Sparkle Star (★) SVG:
/// <svg viewBox="0 0 24 24"><path d="M 12 2 L 14.5 9.5 L 22 12 L 14.5 14.5 L 12 22 L 9.5 14.5 L 2 12 L 9.5 9.5 Z"/></svg>
class MorphStarPainter extends CustomPainter {
  final double progress; // 0.0 = Plus (+), 1.0 = Star (★)
  final Color color;

  const MorphStarPainter({
    required this.progress,
    this.color = Colors.white,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;

    // --- Plus coordinates: Slim, refined classic Icons.add ---
    // Span = 14px (radius 7.0), Arm thickness = 2.0px (half-width 1.0)
    const rPlus = 7.0;
    const wPlus = 1.0;

    // --- Star coordinates: Exact User SVG ---
    // <path d="M 12 2 L 14.5 9.5 L 22 12 L 14.5 14.5 L 12 22 L 9.5 14.5 L 2 12 L 9.5 9.5 Z"/>
    // Relative to center (12, 12):
    // Tips reach 10.0, Inner valleys reach 2.5
    const rStar = 10.0;
    const wStarTip = 0.04;
    const rStarInner = 2.5;

    // 12 Vertices for Plus (clockwise from top arm):
    final plusPoints = <Offset>[
      const Offset(-wPlus, -rPlus), // 0: Top arm left
      const Offset(wPlus, -rPlus), // 1: Top arm right
      const Offset(wPlus, -wPlus), // 2: Top-right inner corner
      const Offset(rPlus, -wPlus), // 3: Right arm top
      const Offset(rPlus, wPlus), // 4: Right arm bottom
      const Offset(wPlus, wPlus), // 5: Bottom-right inner corner
      const Offset(wPlus, rPlus), // 6: Bottom arm right
      const Offset(-wPlus, rPlus), // 7: Bottom arm left
      const Offset(-wPlus, wPlus), // 8: Bottom-left inner corner
      const Offset(-rPlus, wPlus), // 9: Left arm bottom
      const Offset(-rPlus, -wPlus), // 10: Left arm top
      const Offset(-wPlus, -wPlus), // 11: Top-left inner corner
    ];

    // 12 Vertices for Star (clockwise from top tip):
    final starPoints = <Offset>[
      const Offset(-wStarTip, -rStar), // 0: Top tip left (12, 2)
      const Offset(wStarTip, -rStar), // 1: Top tip right (12, 2)
      const Offset(rStarInner, -rStarInner), // 2: Top-right valley (14.5, 9.5)
      const Offset(rStar, -wStarTip), // 3: Right tip top (22, 12)
      const Offset(rStar, wStarTip), // 4: Right tip bottom (22, 12)
      const Offset(rStarInner, rStarInner), // 5: Bottom-right valley (14.5, 14.5)
      const Offset(wStarTip, rStar), // 6: Bottom tip right (12, 22)
      const Offset(-wStarTip, rStar), // 7: Bottom tip left (12, 22)
      const Offset(-rStarInner, rStarInner), // 8: Bottom-left valley (9.5, 14.5)
      const Offset(-rStar, wStarTip), // 9: Left tip bottom (2, 12)
      const Offset(-rStar, -wStarTip), // 10: Left tip top (2, 12)
      const Offset(-rStarInner, -rStarInner), // 11: Top-left valley (9.5, 9.5)
    ];

    final t = progress.clamp(0.0, 1.0);
    final path = Path();

    final first = Offset.lerp(plusPoints[0], starPoints[0], t)!;
    path.moveTo(cx + first.dx, cy + first.dy);

    for (int i = 1; i < 12; i++) {
      final pt = Offset.lerp(plusPoints[i], starPoints[i], t)!;
      path.lineTo(cx + pt.dx, cy + pt.dy);
    }
    path.close();

    // Fill paint
    final fillPaint = Paint()
      ..color = color
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;

    canvas.drawPath(path, fillPaint);

    // Stroke paint matching user's SVG: stroke="#ffffff" stroke-width="0.4" stroke-linejoin="miter"
    if (t > 0.05) {
      final strokePaint = Paint()
        ..color = color.withValues(alpha: t)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 0.4 * t
        ..strokeJoin = StrokeJoin.miter
        ..strokeMiterLimit = 4.0
        ..isAntiAlias = true;

      canvas.drawPath(path, strokePaint);
    }
  }

  @override
  bool shouldRepaint(covariant MorphStarPainter oldDelegate) {
    return oldDelegate.progress != progress || oldDelegate.color != color;
  }
}

/// A floating action button that implements the Apple Design principles
/// for fluid rotational spring motion and seamless shape morphing
/// between the classic slim Plus (+) on Home and Sparkle Star (★) on other screens.
class SpinMorphActionButton extends StatelessWidget {
  final Animation<double> animation;
  final VoidCallback onTap;

  const SpinMorphActionButton({
    super.key,
    required this.animation,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ElasticPressable(
      pressedScale: 0.92,
      onTap: onTap,
      child: Container(
        width: 46,
        height: 46,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: AppleTheme.primary,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.2),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Center(
          child: AnimatedBuilder(
            animation: animation,
            builder: (context, child) {
              final t = animation.value.clamp(0.0, 1.0);
              // Apple rotation motion: 180 degrees (pi radians)
              final rotation = t * math.pi;
              // Apple fluid dynamics: slight tactile scale compression during rotation
              final scale = 1.0 - (math.sin(t * math.pi) * 0.12);

              return Transform.scale(
                scale: scale,
                child: Transform.rotate(
                  angle: rotation,
                  child: CustomPaint(
                    size: const Size(24, 24),
                    painter: MorphStarPainter(progress: t),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
