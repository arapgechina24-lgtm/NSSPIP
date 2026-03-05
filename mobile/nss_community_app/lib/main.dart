import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/report_screen.dart';

void main() {
  runApp(const NCTIRSApp());
}

class NCTIRSApp extends StatelessWidget {
  const NCTIRSApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NCTIRS Citizen Intelligence',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF00FF41),
        scaffoldBackgroundColor: Colors.black,
        textTheme: GoogleFonts.interTextTheme(Theme.of(context).textTheme).apply(
          bodyColor: Colors.white,
          displayColor: Colors.white,
        ),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF00FF41),
          secondary: Color(0xFF003B00),
          surface: Color(0xFF111111),
        ),
      ),
      home: const ReportScreen(),
    );
  }
}
