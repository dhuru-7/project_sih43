import 'package:flutter/material.dart';

/// Represents a single cubic bezier segment: control point 1, control point 2, and end point.
class CubicSegment {
  final Offset c1;
  final Offset c2;
  final Offset end;

  const CubicSegment(this.c1, this.c2, this.end);

  static CubicSegment lerp(CubicSegment a, CubicSegment b, double t) {
    return CubicSegment(
      Offset.lerp(a.c1, b.c1, t)!,
      Offset.lerp(a.c2, b.c2, t)!,
      Offset.lerp(a.end, b.end, t)!,
    );
  }
}

/// Exact mathematical definition of a closed shape with 12 cubic bezier segments
/// normalized with center at (0, 0) and scaled precisely so `--circle` has an exact radius
/// of 0.5 (diameter 1.0 = 46.0px in a 46x46 button, eliminating any size drop/jump).
class ShapeDefinition {
  final Offset start;
  final List<CubicSegment> curves;

  const ShapeDefinition({
    required this.start,
    required this.curves,
  });

  /// Normalization scale factor: 0.5 / 0.4671 = 1.0704346
  /// Ensures all shapes share the exact same visual weight and diameter as the baseline circle.

  /// 0: Home -> Circle
  static const ShapeDefinition circle = ShapeDefinition(
    start: Offset(-0.390901, 0.315832),
    curves: [
      CubicSegment(Offset(-0.406942, 0.295948), Offset(-0.458638, 0.206380), Offset(-0.467914, 0.182349)),
      CubicSegment(Offset(-0.512492, 0.066800), Offset(-0.512535, -0.064103), Offset(-0.466859, -0.180491)),
      CubicSegment(Offset(-0.448448, -0.227403), Offset(-0.423137, -0.271029), Offset(-0.391977, -0.310025)),
      CubicSegment(Offset(-0.313418, -0.408317), Offset(-0.194188, -0.476086), Offset(-0.069509, -0.493272)),
      CubicSegment(Offset(-0.022067, -0.499807), Offset(0.026301, -0.499540), Offset(0.074106, -0.492255)),
      CubicSegment(Offset(0.198507, -0.473309), Offset(0.310694, -0.407675), Offset(0.388429, -0.311352)),
      CubicSegment(Offset(0.420563, -0.271537), Offset(0.446799, -0.226060), Offset(0.465243, -0.178463)),
      CubicSegment(Offset(0.509859, -0.063327), Offset(0.510528, 0.067116), Offset(0.464735, 0.184334)),
      CubicSegment(Offset(0.446109, 0.232006), Offset(0.420360, 0.276306), Offset(0.388589, 0.315810)),
      CubicSegment(Offset(0.311496, 0.411657), Offset(0.195708, 0.477842), Offset(0.073839, 0.496794)),
      CubicSegment(Offset(0.023919, 0.504560), Offset(-0.027398, 0.504507), Offset(-0.078056, 0.496601)),
      CubicSegment(Offset(-0.201937, 0.477264), Offset(-0.313504, 0.411785), Offset(-0.390901, 0.315832)),
    ],
  );

  /// 1: Explore -> Flower
  static const ShapeDefinition flower = ShapeDefinition(
    start: Offset(-0.342898, 0.342898),
    curves: [
      CubicSegment(Offset(-0.484613, 0.287995), Offset(-0.535801, 0.178029), Offset(-0.475086, 0.000000)),
      CubicSegment(Offset(-0.509152, -0.099882), Offset(-0.507991, -0.178340), Offset(-0.475380, -0.237669)),
      CubicSegment(Offset(-0.449866, -0.284088), Offset(-0.405106, -0.318797), Offset(-0.342898, -0.342898)),
      CubicSegment(Offset(-0.287995, -0.484613), Offset(-0.178029, -0.535801), Offset(0.000000, -0.475086)),
      CubicSegment(Offset(0.089708, -0.505679), Offset(0.162133, -0.507862), Offset(0.218941, -0.484361)),
      CubicSegment(Offset(0.274872, -0.461229), Offset(0.315660, -0.413204), Offset(0.342898, -0.342898)),
      CubicSegment(Offset(0.484613, -0.287995), Offset(0.535801, -0.178029), Offset(0.475086, 0.000000)),
      CubicSegment(Offset(0.506990, 0.093551), Offset(0.507996, 0.168304), Offset(0.481203, 0.226156)),
      CubicSegment(Offset(0.457011, 0.278393), Offset(0.410148, 0.316843), Offset(0.342898, 0.342898)),
      CubicSegment(Offset(0.287995, 0.484613), Offset(0.178029, 0.535801), Offset(0.000000, 0.475086)),
      CubicSegment(Offset(-0.093513, 0.506979), Offset(-0.168251, 0.507996), Offset(-0.226092, 0.481235)),
      CubicSegment(Offset(-0.278361, 0.457049), Offset(-0.316833, 0.410174), Offset(-0.342898, 0.342898)),
    ],
  );

  /// 2: Messages -> Cylinder (pill / capsule)
  static const ShapeDefinition cylinder = ShapeDefinition(
    start: Offset(-0.421917, 0.104159),
    curves: [
      CubicSegment(Offset(-0.423127, 0.085399), Offset(-0.423095, -0.090018), Offset(-0.421917, -0.104159)),
      CubicSegment(Offset(-0.412958, -0.211604), Offset(-0.381016, -0.310351), Offset(-0.313825, -0.384752)),
      CubicSegment(Offset(-0.236566, -0.470301), Offset(-0.124550, -0.524138), Offset(0.000000, -0.524138)),
      CubicSegment(Offset(0.076285, -0.524138), Offset(0.147864, -0.503939), Offset(0.209639, -0.468636)),
      CubicSegment(Offset(0.249315, -0.445959), Offset(0.284944, -0.417047), Offset(0.315179, -0.383242)),
      CubicSegment(Offset(0.381562, -0.309029), Offset(0.416169, -0.211095), Offset(0.421917, -0.104159)),
      CubicSegment(Offset(0.422709, -0.089344), Offset(0.422715, 0.086074), Offset(0.421917, 0.104159)),
      CubicSegment(Offset(0.416447, 0.227628), Offset(0.368171, 0.338937), Offset(0.282691, 0.415821)),
      CubicSegment(Offset(0.207857, 0.483130), Offset(0.108703, 0.524138), Offset(0.000000, 0.524138)),
      CubicSegment(Offset(-0.082354, 0.524138), Offset(-0.159232, 0.500599), Offset(-0.224203, 0.459918)),
      CubicSegment(Offset(-0.259045, 0.438097), Offset(-0.290468, 0.411352), Offset(-0.317469, 0.380663)),
      CubicSegment(Offset(-0.382488, 0.306765), Offset(-0.415098, 0.209789), Offset(-0.421917, 0.104159)),
    ],
  );

  /// 3: Profile -> Hexagon (rounded organic polygon)
  static const ShapeDefinition hexagon = ShapeDefinition(
    start: Offset(-0.465960, 0.181985),
    curves: [
      CubicSegment(Offset(-0.478522, 0.099561), Offset(-0.478522, -0.099561), Offset(-0.465960, -0.181985)),
      CubicSegment(Offset(-0.458387, -0.231663), Offset(-0.429817, -0.281144), Offset(-0.390586, -0.312540)),
      CubicSegment(Offset(-0.325487, -0.364633), Offset(-0.153035, -0.464194), Offset(-0.075375, -0.494525)),
      CubicSegment(Offset(-0.028570, -0.512808), Offset(0.028570, -0.512808), Offset(0.075375, -0.494525)),
      CubicSegment(Offset(0.153035, -0.464194), Offset(0.325487, -0.364633), Offset(0.390586, -0.312540)),
      CubicSegment(Offset(0.429817, -0.281144), Offset(0.458387, -0.231663), Offset(0.465960, -0.181985)),
      CubicSegment(Offset(0.478522, -0.099561), Offset(0.478522, 0.099561), Offset(0.465960, 0.181985)),
      CubicSegment(Offset(0.458387, 0.231663), Offset(0.429817, 0.281144), Offset(0.390586, 0.312540)),
      CubicSegment(Offset(0.325487, 0.364633), Offset(0.153035, 0.464194), Offset(0.075375, 0.494525)),
      CubicSegment(Offset(0.028570, 0.512808), Offset(-0.028570, 0.512808), Offset(-0.075375, 0.494525)),
      CubicSegment(Offset(-0.153035, 0.464194), Offset(-0.325487, 0.364633), Offset(-0.390586, 0.312540)),
      CubicSegment(Offset(-0.429817, 0.281144), Offset(-0.458387, 0.231663), Offset(-0.465960, 0.181985)),
    ],
  );

  /// Map each navigation tab to its specific shape
  static ShapeDefinition forNavIndex(int index) {
    switch (index) {
      case 1:
        return flower; // Explore
      case 2:
        return cylinder; // Messages
      case 3:
        return hexagon; // Profile
      case 0:
      default:
        return circle; // Home
    }
  }

  /// Linearly interpolates between any two shapes
  static ShapeDefinition lerp(ShapeDefinition a, ShapeDefinition b, double t) {
    final clampedT = t.clamp(0.0, 1.0);
    final startPt = Offset.lerp(a.start, b.start, clampedT)!;
    final curvesList = List<CubicSegment>.generate(12, (i) {
      return CubicSegment.lerp(a.curves[i], b.curves[i], clampedT);
    });
    return ShapeDefinition(start: startPt, curves: curvesList);
  }

  /// Computes the 1-time showcase animation shape at progress [t] (0.0 to 1.0)
  /// cycling through: Circle -> Flower -> Cylinder -> Hexagon -> destination shape!
  static ShapeDefinition computeShowcaseShape(double t, ShapeDefinition destination) {
    final clampedT = t.clamp(0.0, 1.0);
    ShapeDefinition shapeA;
    ShapeDefinition shapeB;
    double localT;

    if (clampedT < 0.25) {
      shapeA = circle;
      shapeB = flower;
      localT = clampedT / 0.25;
    } else if (clampedT < 0.50) {
      shapeA = flower;
      shapeB = cylinder;
      localT = (clampedT - 0.25) / 0.25;
    } else if (clampedT < 0.75) {
      shapeA = cylinder;
      shapeB = hexagon;
      localT = (clampedT - 0.50) / 0.25;
    } else {
      shapeA = hexagon;
      shapeB = destination;
      localT = (clampedT - 0.75) / 0.25;
    }

    final curvedLocal = Curves.easeInOut.transform(localT);
    return ShapeDefinition.lerp(shapeA, shapeB, curvedLocal);
  }

  /// Converts this shape into a scaled and centered [Path]
  Path toPath(Size size, {double rotation = 0.0}) {
    final scale = size.width;
    final cx = size.width / 2;
    final cy = size.height / 2;

    final path = Path();
    path.moveTo(start.dx * scale, start.dy * scale);
    for (final seg in curves) {
      path.cubicTo(
        seg.c1.dx * scale,
        seg.c1.dy * scale,
        seg.c2.dx * scale,
        seg.c2.dy * scale,
        seg.end.dx * scale,
        seg.end.dy * scale,
      );
    }
    path.close();

    final matrix = Matrix4.translationValues(cx, cy, 0.0);
    if (rotation != 0.0) {
      matrix.rotateZ(rotation);
    }
    return path.transform(matrix.storage);
  }
}

/// CustomPainter that renders the solid black button with dynamic elevation shadow
/// at the current interpolated [ShapeDefinition].
class GeminiShapeshiftPainter extends CustomPainter {
  final ShapeDefinition shape;
  final double rotation;
  final Color color;

  const GeminiShapeshiftPainter({
    required this.shape,
    this.rotation = 0.0,
    this.color = const Color(0xFF121417), // Pure Setu Black
  });

  @override
  void paint(Canvas canvas, Size size) {
    final path = shape.toPath(size, rotation: rotation);

    // Realistic elevation shadow precisely tracing the active shape contour
    canvas.drawShadow(path, Colors.black.withValues(alpha: 0.35), 5.0, true);

    // Solid Black body
    final fillPaint = Paint()
      ..color = color
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;
    canvas.drawPath(path, fillPaint);
  }

  @override
  bool shouldRepaint(covariant GeminiShapeshiftPainter oldDelegate) {
    return oldDelegate.shape != shape ||
        oldDelegate.rotation != rotation ||
        oldDelegate.color != color;
  }
}
