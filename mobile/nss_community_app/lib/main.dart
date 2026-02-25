import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:geolocator/geolocator.dart';

void main() {
  runApp(const CommunityIncidentApp());
}

class CommunityIncidentApp extends StatelessWidget {
  const CommunityIncidentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CIA - Community Incident App',
      theme: ThemeData.dark().copyWith(
        primaryColor: Colors.greenAccent,
        hintColor: Colors.orangeAccent,
        scaffoldBackgroundColor: Colors.black,
      ),
      home: const ReportScreen(),
    );
  }
}

class ReportScreen extends StatefulWidget {
  const ReportScreen({super.key});

  @override
  State<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  String _category = 'Suspicious Activity';
  bool _isSubmitting = false;

  Future<void> _submitReport() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      // 1. Get Location
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high
      );

      // 2. Submit to API
      // Note: Use your actual server URL
      final response = await http.post(
        Uri.parse('https://nsspip-v2.vercel.app/api/incidents'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'title': _titleController.text,
          'description': _descController.text,
          'type': _category,
          'latitude': position.latitude,
          'longitude': position.longitude,
          'reportedBy': 'CITIZEN_001', // Mock user id
          'priority': 'MEDIUM',
        }),
      );

      if (response.statusCode == 201) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('🚨 Incident reported and AI risk scoring triggered!'))
        );
        _titleController.clear();
        _descController.clear();
      } else {
        throw Exception('Failed to report incident');
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${e.toString()}'))
      );
    } finally {
      setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('NSSPIP: REPORT INCIDENT'),
        backgroundColor: Colors.black,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: 'TITLE',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.security),
                ),
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descController,
                maxLines: 4,
                decoration: const InputDecoration(
                  labelText: 'DESCRIPTION',
                  border: OutlineInputBorder(),
                ),
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _category,
                items: ['Suspicious Activity', 'Unrest', 'Weapon Detected', 'Abandoned Object']
                    .map((s) => DropdownMenuItem(value: s, child: Text(s.toUpperCase())))
                    .toList(),
                onChanged: (v) => setState(() => _category = v!),
                decoration: const InputDecoration(labelText: 'CATEGORY'),
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: _isSubmitting ? null : _submitReport,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orangeAccent,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(vertical: 20),
                ),
                child: _isSubmitting 
                  ? const CircularProgressIndicator(color: Colors.black)
                  : const Text('SUBMIT SECURE REPORT', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
