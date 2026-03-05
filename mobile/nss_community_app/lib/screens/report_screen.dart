import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ReportScreen extends StatefulWidget {
  const ReportScreen({super.key});

  @override
  State<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  final _formKey = GlobalKey<FormState>();
  final _apiService = ApiService();
  
  String _title = '';
  String _description = '';
  String _type = 'GENERAL';
  String _location = 'Nairobi Central';
  bool _isSubmitting = false;

  final List<String> _incidentTypes = [
    'GENERAL',
    'SUSPICIOUS_ACTIVITY',
    'CRIME',
    'CYBER_THREAT',
    'PUBLIC_SAFETY',
    'BORDER_INCIDENT'
  ];

  Future<void> _submitReport() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    setState(() => _isSubmitting = true);

    try {
      final result = await _apiService.submitReport(
        title: _title,
        description: _description,
        type: _type,
        location: _location,
        lat: -1.286389, // Mock lat for Nairobi
        lng: 36.817223, // Mock lng for Nairobi
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: const Color(0xFF003B00),
            content: Text(
              'THREAT INGESTED: ${result['id']} | RISK: ${result['risk_score']}%',
              style: const TextStyle(color: Color(0xFF00FF41), fontWeight: FontWeight.bold),
            ),
          ),
        );
        _formKey.currentState!.reset();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('COMMUNICATION ERROR: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('NCTIRS CIA : SUBMIT REPORT', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2)),
        centerTitle: true,
        backgroundColor: Colors.black,
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(color: const Color(0xFF003B00), height: 1),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('OPERATIONAL INTELLIGENCE INTAKE', style: TextStyle(color: Color(0xFF00FF41), fontSize: 10, fontWeight: FontWeight.bold)),
              const SizedBox(height: 24),
              
              TextFormField(
                decoration: _inputDecoration('INCIDENT_TITLE'),
                style: const TextStyle(color: Colors.white),
                validator: (val) => val!.isEmpty ? 'FIELD REQUIRED' : null,
                onSaved: (val) => _title = val!,
              ),
              const SizedBox(height: 20),
              
              DropdownButtonFormField<String>(
                value: _type,
                decoration: _inputDecoration('CLASSIFICATION'),
                dropdownColor: Colors.black,
                items: _incidentTypes.map((t) => DropdownMenuItem(value: t, child: Text(t, style: const TextStyle(fontSize: 12)))).toList(),
                onChanged: (val) => setState(() => _type = val!),
              ),
              const SizedBox(height: 20),
              
              TextFormField(
                decoration: _inputDecoration('SITUATIONAL_DESCRIPTION'),
                maxLines: 4,
                style: const TextStyle(color: Colors.white),
                onSaved: (val) => _description = val!,
              ),
              const SizedBox(height: 20),
              
              TextFormField(
                initialValue: _location,
                decoration: _inputDecoration('GEOSPATIAL_TAG'),
                style: const TextStyle(color: Colors.white),
                onSaved: (val) => _location = val!,
              ),
              const SizedBox(height: 40),
              
              ElevatedButton(
                onPressed: _isSubmitting ? null : _submitReport,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF00FF41),
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                ),
                child: _isSubmitting 
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black))
                  : const Text('INGEST TO SOVEREIGN AI', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.5)),
              ),
              
              const SizedBox(height: 20),
              const Center(child: Text('ENCRYPTED END-TO-END | KSN-SECURED', style: TextStyle(color: Color(0xFF003B00), fontSize: 8))),
            ],
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Color(0xFF008F11), fontSize: 10),
      enabledBorder: const OutlineInputBorder(borderSide: BorderSide(color: Color(0xFF003B00))),
      focusedBorder: const OutlineInputBorder(borderSide: BorderSide(color: Color(0xFF00FF41))),
      filled: true,
      fillColor: const Color(0xFF050505),
    );
  }
}
