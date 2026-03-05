import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Use localhost for simulator, or local IP for real device
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1'; 

  Future<Map<String, dynamic>> submitReport({
    required String title,
    required String description,
    required String type,
    required String location,
    required double lat,
    required double lng,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/incidents/submit'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'title': title,
          'description': description,
          'type': type,
          'location': location,
          'latitude': lat,
          'longitude': lng,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Server Error: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to connect to NCTIRS Backend: $e');
    }
  }
}
