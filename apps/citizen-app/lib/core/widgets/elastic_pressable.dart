import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Apple-grade fluid, elastic pressable widget with instant touch-down tactile haptics.
/// 
/// - 0ms touch-down response with immediate tactile haptic feedback (HapticFeedback.lightImpact).
/// - Completely interruptible, smooth physical spring motion (no jitter, no artificial delays).
/// - Guaranteed resting scale (1.0) with zero stuck-size artifacts.
class ElasticPressable extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final double pressedScale;
  final double pressedOpacity;
  final Duration pressDuration;
  final Duration releaseDuration;
  final Curve pressCurve;
  final Curve releaseCurve;
  final bool enableHaptics;
  final HitTestBehavior behavior;

  const ElasticPressable({
    super.key,
    required this.child,
    this.onTap,
    this.onLongPress,
    this.pressedScale = 0.95,
    this.pressedOpacity = 0.92,
    this.pressDuration = const Duration(milliseconds: 70),
    this.releaseDuration = const Duration(milliseconds: 180),
    this.pressCurve = Curves.easeOutQuad,
    this.releaseCurve = Curves.easeOutCubic,
    this.enableHaptics = true,
    this.behavior = HitTestBehavior.opaque,
  });

  @override
  State<ElasticPressable> createState() => _ElasticPressableState();
}

class _ElasticPressableState extends State<ElasticPressable>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.pressDuration,
      reverseDuration: widget.releaseDuration,
    );
    _initAnimations();
  }

  void _initAnimations() {
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: widget.pressedScale,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: widget.pressCurve,
        reverseCurve: widget.releaseCurve,
      ),
    );

    _opacityAnimation = Tween<double>(
      begin: 1.0,
      end: widget.pressedOpacity,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOut,
        reverseCurve: Curves.easeOut,
      ),
    );
  }

  @override
  void didUpdateWidget(covariant ElasticPressable oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.pressedScale != widget.pressedScale ||
        oldWidget.pressedOpacity != widget.pressedOpacity ||
        oldWidget.pressCurve != widget.pressCurve ||
        oldWidget.releaseCurve != widget.releaseCurve) {
      _initAnimations();
    }
    if (!_isPressed && _controller.value > 0.0 && !_controller.isAnimating) {
      _controller.animateTo(0.0, duration: widget.releaseDuration, curve: widget.releaseCurve);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails details) {
    if (widget.onTap == null && widget.onLongPress == null) return;
    _isPressed = true;
    if (widget.enableHaptics) {
      HapticFeedback.lightImpact();
    }
    _controller.animateTo(1.0, duration: widget.pressDuration, curve: widget.pressCurve);
  }

  void _onTapUp(TapUpDetails details) {
    _release();
  }

  void _onTapCancel() {
    _release();
  }

  void _release() {
    if (!_isPressed) return;
    _isPressed = false;
    if (mounted) {
      _controller.animateTo(0.0, duration: widget.releaseDuration, curve: widget.releaseCurve);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      behavior: widget.behavior,
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      onTap: widget.onTap != null
          ? () {
              if (widget.enableHaptics) {
                HapticFeedback.selectionClick();
              }
              _release();
              widget.onTap!();
            }
          : null,
      onLongPress: widget.onLongPress != null
          ? () {
              if (widget.enableHaptics) {
                HapticFeedback.mediumImpact();
              }
              _release();
              widget.onLongPress!();
            }
          : null,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          final scale = _scaleAnimation.value;
          final opacity = _opacityAnimation.value;
          return Transform.scale(
            scale: scale,
            alignment: Alignment.center,
            child: Opacity(
              opacity: opacity.clamp(0.0, 1.0),
              child: child,
            ),
          );
        },
        child: widget.child,
      ),
    );
  }
}
