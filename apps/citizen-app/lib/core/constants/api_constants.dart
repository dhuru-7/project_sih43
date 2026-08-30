class ApiConstants {
  // Use 10.0.2.2 for Android Emulator, or localhost / LAN IP for physical device
  static const String baseUrl = "http://10.0.2.2:5000/api/v1";
  static const String loginEndpoint = "$baseUrl/auth/login";
  static const String problemsEndpoint = "$baseUrl/problems";
  static const String trackEndpoint = "$baseUrl/problems/track";
}
