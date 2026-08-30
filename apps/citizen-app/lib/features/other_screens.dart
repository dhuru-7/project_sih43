import 'package:flutter/material.dart';

class EvidenceScreen extends StatelessWidget {
  const EvidenceScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Attach Photo / Video Evidence')),
      body: const Center(child: Text('Camera & Media Upload Module')),
    );
  }
}

class LocationScreen extends StatelessWidget {
  const LocationScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Geo-Tag Location')),
      body: const Center(child: Text('GPS & Map Pin Module')),
    );
  }
}

class TrackingScreen extends StatelessWidget {
  const TrackingScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Live Grievance Tracking')),
      body: const Center(child: Text('Milestone & Resolution Progress Timeline')),
    );
  }
}

class CitizenLoginScreen extends StatelessWidget {
  const CitizenLoginScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Citizen OTP Sign In')),
      body: const Center(child: Text('Mobile Number & OTP Authentication')),
    );
  }
}
