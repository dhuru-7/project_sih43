import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../../core/theme/apple_theme.dart';
import '../../../core/widgets/elastic_pressable.dart';
import 'gemini_shapeshift_painter.dart';

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

/// A floating action button that implements Apple Design principles
/// for fluid rotational spring motion and seamless shape morphing:
/// 1. Home: Pure Circle with Plus (+) icon.
/// 2. Leaving Home to Explore / Messages / Profile:
///    - Stays as a pure Circle for 0.5s while Plus morphs to Star.
///    - Starts a 1-time 360° showcase through all Gemini shapes.
///    - Settle & stays on that tab's unique shape (Flower, Cylinder, or Hexagon).
/// 3. Tab switching (Explore <-> Messages <-> Profile): Smoothly morphs directly between shapes.
/// 4. Return to Home: Smoothly morphs back to Circle and reverses Star to Plus.
class SpinMorphActionButton extends StatefulWidget {
  final Animation<double> animation;
  final int navIndex;
  final VoidCallback onTap;
  final VoidCallback? onLongPress;

  const SpinMorphActionButton({
    super.key,
    required this.animation,
    required this.navIndex,
    required this.onTap,
    this.onLongPress,
  });

  @override
  State<SpinMorphActionButton> createState() => _SpinMorphActionButtonState();
}

class _SpinMorphActionButtonState extends State<SpinMorphActionButton>
    with TickerProviderStateMixin {
  late final AnimationController _showcaseController;
  late final AnimationController _tabMorphController;
  Timer? _delayTimer;

  // The base shape displayed when neither controller is running
  ShapeDefinition _currentBaseShape = ShapeDefinition.circle;
  // Starting and target shapes for tab-to-tab morphing
  ShapeDefinition _morphStartShape = ShapeDefinition.circle;
  ShapeDefinition _morphTargetShape = ShapeDefinition.circle;
  // Final destination shape for the showcase animation
  ShapeDefinition _tabDestinationShape = ShapeDefinition.circle;

  @override
  void initState() {
    super.initState();

    // 1-time showcase loop over 3.55 seconds (10% speed reduction), showing all shapes with 1 full turn
    _showcaseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3550),
    );

    // Smooth tab-to-tab morph controller over 350ms
    _tabMorphController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    );

    _tabDestinationShape = ShapeDefinition.forNavIndex(widget.navIndex);
    _currentBaseShape = widget.navIndex == 0 ? ShapeDefinition.circle : _tabDestinationShape;
    _morphStartShape = _currentBaseShape;
    _morphTargetShape = _currentBaseShape;

    _showcaseController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        setState(() {
          _currentBaseShape = _tabDestinationShape;
        });
      }
    });

    _tabMorphController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        setState(() {
          _currentBaseShape = _morphTargetShape;
        });
      }
    });
  }

  @override
  void didUpdateWidget(covariant SpinMorphActionButton oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (oldWidget.navIndex != widget.navIndex) {
      _delayTimer?.cancel();
      _delayTimer = null;

      if (widget.navIndex == 0) {
        // Going back to Home: smoothly morph from current shape back to pure circle
        final currentDisplay = _getCurrentDisplayShape();
        if (_showcaseController.isAnimating) {
          _showcaseController.stop();
        }
        _morphStartShape = currentDisplay;
        _morphTargetShape = ShapeDefinition.circle;
        _tabDestinationShape = ShapeDefinition.circle;
        _tabMorphController.forward(from: 0.0);
      } else if (oldWidget.navIndex == 0 && widget.navIndex > 0) {
        // Leaving Home to an AI tab (e.g. Explore, Messages, Profile):
        // 1. Maintain pure circle for exactly 0.2s while arriving on page
        _currentBaseShape = ShapeDefinition.circle;
        _tabDestinationShape = ShapeDefinition.forNavIndex(widget.navIndex);
        if (_showcaseController.isAnimating) {
          _showcaseController.stop();
          _showcaseController.value = 0.0;
        }
        if (_tabMorphController.isAnimating) {
          _tabMorphController.stop();
        }

        // 2. After 0.2s delay, start the 1-time showcase animation
        _delayTimer = Timer(const Duration(milliseconds: 200), () {
          if (!mounted) return;
          if (widget.navIndex > 0) {
            _tabDestinationShape = ShapeDefinition.forNavIndex(widget.navIndex);
            _showcaseController.forward(from: 0.0);
          }
        });
      } else {
        // Switching between AI tabs (Explore <-> Messages <-> Profile):
        // Directly and smoothly morph from current shape to the new tab's shape
        final currentDisplay = _getCurrentDisplayShape();
        if (_showcaseController.isAnimating) {
          _showcaseController.stop();
        }
        _morphStartShape = currentDisplay;
        _tabDestinationShape = ShapeDefinition.forNavIndex(widget.navIndex);
        _morphTargetShape = _tabDestinationShape;
        _tabMorphController.forward(from: 0.0);
      }
    }
  }

  ShapeDefinition _getCurrentDisplayShape() {
    if (_showcaseController.isAnimating) {
      return ShapeDefinition.computeShowcaseShape(
        _showcaseController.value,
        _tabDestinationShape,
      );
    } else if (_tabMorphController.isAnimating) {
      final t = Curves.easeInOutCubic.transform(_tabMorphController.value);
      return ShapeDefinition.lerp(_morphStartShape, _morphTargetShape, t);
    }
    return _currentBaseShape;
  }

  @override
  void dispose() {
    _delayTimer?.cancel();
    _showcaseController.dispose();
    _tabMorphController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ElasticPressable(
      pressedScale: 0.92,
      onTap: widget.onTap,
      onLongPress: widget.onLongPress,
      child: SizedBox(
        width: 46,
        height: 46,
        child: AnimatedBuilder(
          animation: Listenable.merge([
            widget.animation,
            _showcaseController,
            _tabMorphController,
          ]),
          builder: (context, child) {
            final t = widget.animation.value.clamp(0.0, 1.0);

            // Shape and rotation
            final currentShape = _getCurrentDisplayShape();
            double rotation = 0.0;
            if (_showcaseController.isAnimating) {
              rotation = _showcaseController.value * 2 * math.pi;
            }

            // Apple rotation motion: 180 degrees (pi radians) for Plus -> Star
            final starRotation = t * math.pi;
            // Apple fluid dynamics: slight tactile scale compression during initial rotation
            final starScale = 1.0 - (math.sin(t * math.pi) * 0.12);

            return CustomPaint(
              size: const Size(46, 46),
              painter: GeminiShapeshiftPainter(
                shape: currentShape,
                rotation: rotation,
                color: AppleTheme.primary, // Pure Setu Black
              ),
              child: Center(
                child: Transform.scale(
                  scale: starScale,
                  child: Transform.rotate(
                    angle: starRotation,
                    child: CustomPaint(
                      size: const Size(24, 24),
                      painter: MorphStarPainter(progress: t),
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
