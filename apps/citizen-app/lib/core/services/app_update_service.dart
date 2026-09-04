import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../theme/apple_theme.dart';

class AppUpdateInfo {
  final String latestVersion;
  final int buildNumber;
  final String minSupportedVersion;
  final String apkDownloadUrl;
  final String releaseNotes;
  final bool forceUpdate;
  final double fileSizeMb;

  AppUpdateInfo({
    required this.latestVersion,
    required this.buildNumber,
    required this.minSupportedVersion,
    required this.apkDownloadUrl,
    required this.releaseNotes,
    required this.forceUpdate,
    required this.fileSizeMb,
  });

  factory AppUpdateInfo.fromJson(Map<String, dynamic> json) {
    return AppUpdateInfo(
      latestVersion: json['latest_version'] ?? '1.0.0',
      buildNumber: json['build_number'] ?? 1,
      minSupportedVersion: json['min_supported_version'] ?? '1.0.0',
      apkDownloadUrl: json['apk_download_url'] ?? '/downloads/setu-citizen.apk',
      releaseNotes: json['release_notes'] ?? 'General performance improvements and bug fixes.',
      forceUpdate: json['force_update'] ?? false,
      fileSizeMb: (json['file_size_mb'] ?? 28.5).toDouble(),
    );
  }
}

class AppUpdateService {
  static const String currentVersion = '1.0.0';
  static const int currentBuildNumber = 1;

  static const List<String> _candidateEndpoints = [
    'http://127.0.0.1:5000/api/v1/app/version',
    'http://192.168.1.101:5000/api/v1/app/version',
  ];

  /// Checks if a newer version of the app is available
  static Future<AppUpdateInfo?> checkForUpdate({String? customBaseUrl}) async {
    final urls = [
      if (customBaseUrl != null && customBaseUrl.isNotEmpty) '$customBaseUrl/api/v1/app/version',
      ..._candidateEndpoints,
    ];

    for (final url in urls) {
      try {
        final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 4));
        if (res.statusCode == 200) {
          final data = jsonDecode(res.body);
          if (data['status'] == 'success' && data['data'] != null) {
            final info = AppUpdateInfo.fromJson(data['data']);
            if (_isNewer(info.latestVersion, currentVersion) || info.buildNumber > currentBuildNumber) {
              return info;
            }
          }
        }
      } catch (_) {
        // Fallback silently to next candidate endpoint
      }
    }
    return null;
  }

  static bool _isNewer(String remote, String current) {
    try {
      final rParts = remote.split('.').map((e) => int.tryParse(e) ?? 0).toList();
      final cParts = current.split('.').map((e) => int.tryParse(e) ?? 0).toList();
      for (int i = 0; i < rParts.length && i < cParts.length; i++) {
        if (rParts[i] > cParts[i]) return true;
        if (rParts[i] < cParts[i]) return false;
      }
      return rParts.length > cParts.length;
    } catch (_) {
      return false;
    }
  }

  /// Displays the Apple-styled in-app update sheet
  static void showUpdateSheet(BuildContext context, AppUpdateInfo info, {VoidCallback? onDownloadTap}) {
    showModalBottomSheet(
      context: context,
      isDismissible: !info.forceUpdate,
      enableDrag: !info.forceUpdate,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _UpdateSheetWidget(info: info, onDownloadTap: onDownloadTap),
    );
  }
}

class _UpdateSheetWidget extends StatelessWidget {
  final AppUpdateInfo info;
  final VoidCallback? onDownloadTap;

  const _UpdateSheetWidget({required this.info, this.onDownloadTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      padding: EdgeInsets.fromLTRB(24, 16, 24, MediaQuery.of(context).padding.bottom + 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFE5E7EB),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Header
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(
                  Icons.system_update_alt_rounded,
                  color: Color(0xFF10B981),
                  size: 26,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Update Available (v${info.latestVersion})',
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: AppleTheme.textPrimary,
                        letterSpacing: -0.4,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Size: ~${info.fileSizeMb.toStringAsFixed(1)} MB • Build ${info.buildNumber}',
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 13,
                        color: AppleTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // Release notes container
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppleTheme.surfaceContainerLow,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppleTheme.borderLight),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "What's New:",
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppleTheme.textPrimary,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  info.releaseNotes,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13,
                    height: 1.45,
                    color: AppleTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 22),

          // Action buttons
          Row(
            children: [
              if (!info.forceUpdate) ...[
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      side: const BorderSide(color: AppleTheme.borderLight),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    child: const Text(
                      'Later',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontWeight: FontWeight.w600,
                        color: AppleTheme.textSecondary,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
              ],
              Expanded(
                flex: 2,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                    if (onDownloadTap != null) {
                      onDownloadTap!();
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.download_rounded, size: 18),
                      SizedBox(width: 6),
                      Text(
                        'Update Now',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontWeight: FontWeight.w700,
                          fontSize: 15,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
