import 'package:flutter/material.dart';
import 'features/home/setu_home_screen.dart';

void main() {
  debugPrint('============================== [MAIN] APP STARTING ==============================');
  WidgetsFlutterBinding.ensureInitialized();
  FlutterError.onError = (FlutterErrorDetails details) {
    FlutterError.presentError(details);
    debugPrint('[CRITICAL_FLUTTER_ERROR] ${details.exceptionAsString()}');
    debugPrint('[CRITICAL_FLUTTER_STACK] ${details.stack}');
  };
  runApp(const SetuApp());
}

class SetuApp extends StatelessWidget {
  const SetuApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Setu',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF8F9FA),
        fontFamily: 'Inter',
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
