import 'dart:convert';
import 'package:http/http.dart' as http;
import '../core/constants/api_constants.dart';

class ApiService {
  static Future<Map<String, dynamic>> submitProblem({
    required String title,
    required String description,
    required double latitude,
    required double longitude,
    String? voiceNoteUrl,
    List<String>? evidenceUrls,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConstants.problemsEndpoint),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "title": title,
          "description": description,
          "latitude": latitude,
          "longitude": longitude,
          "voiceNoteUrl": voiceNoteUrl,
          "evidenceUrls": evidenceUrls ?? [],
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception("Failed to submit problem: ${response.statusCode}");
      }
    } catch (e) {
      throw Exception("Network error: $e");
    }
  }
}
