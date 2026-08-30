import 'package:flutter/material.dart';

class VoiceReportScreen extends StatelessWidget {
  const VoiceReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Voice Grievance Recording')),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.mic, size: 80, color: Color(0xFF3B82F6)),
            SizedBox(height: 16),
            Text('Hold to record your grievance in any Indian language'),
          ],
        ),
      ),
    );
  }
}
