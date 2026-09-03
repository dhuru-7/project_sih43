import 'package:flutter/foundation.dart';

class ApiConstants {
  // Use 10.0.2.2 for Android Emulator, or localhost for Web/Desktop/adb reverse
  static String get baseUrl {
    if (kIsWeb) {
      return "http://localhost:5000/api/v1";
    }
    if (defaultTargetPlatform == TargetPlatform.android) {
      return "http://10.0.2.2:5000/api/v1";
    }
    return "http://localhost:5000/api/v1";
  }

  static String get loginEndpoint => "$baseUrl/auth/login";
  static String get problemsEndpoint => "$baseUrl/problems";
  static String get trackEndpoint => "$baseUrl/problems/track";
}
