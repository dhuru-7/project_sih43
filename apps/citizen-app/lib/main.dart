import 'package:flutter/material.dart';
import 'features/home/setu_home_screen.dart';

void main() {
  runApp(const SetuApp());
}

class SetuApp extends StatelessWidget {
  const SetuApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Setu - Citizen Grievance Portal',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF8F9FA),
        fontFamily: 'SF Pro Display',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF121417),
          primary: const Color(0xFF121417),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      home: const SetuHomeScreen(),
    );
  }
}
