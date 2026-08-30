import 'package:flutter/material.dart';
import '../../core/theme/apple_theme.dart';
import '../problem-report/take_photo_sheet.dart';

class SetuHomeScreen extends StatefulWidget {
  const SetuHomeScreen({super.key});

  @override
  State<SetuHomeScreen> createState() => _SetuHomeScreenState();
}

class _SetuHomeScreenState extends State<SetuHomeScreen> {
  int _currentNavIndex = 0;

  final List<Map<String, dynamic>> _nearbyIssues = [
    {
      "id": "1",
      "title": "Garbage Dumps",
      "location": "Tikri",
      "status": "PENDING",
      "imageType": "custom",
      "color": const Color(0xFF9E9E9E),
    },
    {
      "id": "2",
      "title": "Broken Streetlight",
      "location": "kalsora",
      "status": "PENDING",
      "imageType": "red",
      "color": const Color(0xFFFF0000),
    },
    {
      "id": "3",
      "title": "Broken Roads",
      "location": "kalsora",
      "status": "PENDING",
      "imageType": "red",
      "color": const Color(0xFFFF0000),
    },
  ];

  void _openReportSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => TakePhotoSheet(
        onReportSubmitted: () {
          setState(() {
            _nearbyIssues.insert(0, {
              "id": DateTime.now().millisecondsSinceEpoch.toString(),
              "title": "Road Hazard Reported",
              "location": "Current Location",
              "status": "PENDING",
              "imageType": "custom",
              "color": const Color(0xFF3B82F6),
            });
          });
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppleTheme.background,
      body: SafeArea(
        bottom: false,
        child: Stack(
          children: [
            // Scrollable Content
            SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 110),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Top Bar: Setu. + Notification Bell
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text('Setu.', style: AppleTheme.brandTitle),
                      Container(
                        width: 42,
                        height: 42,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white,
                          border: Border.all(color: const Color(0xFFE5E7EB)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.03),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: IconButton(
                          padding: EdgeInsets.zero,
                          icon: const Icon(
                            Icons.notifications_none_rounded,
                            size: 22,
                            color: AppleTheme.textPrimary,
                          ),
                          onPressed: () {},
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // 2. Hero Greeting: "Hello,\nRampal."
                  const Text(
                    'Hello,\nRampal.',
                    style: AppleTheme.heroGreeting,
                  ),

                  const SizedBox(height: 24),

                  // 3. Hero Report Card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: AppleTheme.cardDark,
                      borderRadius: BorderRadius.circular(28),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.12),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Report Issue', style: AppleTheme.cardTitle),
                                SizedBox(height: 4),
                                Text(
                                  'Make your city better.',
                                  style: AppleTheme.cardSubtitle,
                                ),
                              ],
                            ),
                            // Arrow Top Right Button
                            GestureDetector(
                              onTap: _openReportSheet,
                              child: Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Colors.white.withOpacity(0.15),
                                ),
                                child: const Icon(
                                  Icons.arrow_outward_rounded,
                                  color: Colors.white,
                                  size: 22,
                                ),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 28),

                        // Full Width "Take Photo" White Pill Button
                        SizedBox(
                          width: double.infinity,
                          height: 54,
                          child: ElevatedButton.icon(
                            onPressed: _openReportSheet,
                            icon: const Icon(
                              Icons.camera_alt_outlined,
                              color: AppleTheme.textPrimary,
                              size: 20,
                            ),
                            label: const Text(
                              'Take Photo',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: AppleTheme.textPrimary,
                                letterSpacing: -0.2,
                              ),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // 4. Section Header: Nearby Issues + Explore Reports Pill
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Row(
                        children: [
                          const Text('Nearby Issues', style: AppleTheme.sectionHeader),
                          const SizedBox(height: 0, width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFFE5E7EB),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              '${_nearbyIssues.length}',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF4B5563),
                              ),
                            ),
                          ),
                        ],
                      ),
                      // Explore Reports Pill Button
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFE5E7EB)),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'Explore Reports',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: AppleTheme.textPrimary,
                              ),
                            ),
                            SizedBox(width: 4),
                            Icon(
                              Icons.south_west_rounded,
                              size: 14,
                              color: AppleTheme.textPrimary,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // 5. Issues List
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _nearbyIssues.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final item = _nearbyIssues[index];
                      return _buildIssueItem(item);
                    },
                  ),
                ],
              ),
            ),

            // 6. Apple Floating Pill Bottom Navigation Bar
            Positioned(
              left: 20,
              right: 20,
              bottom: 24,
              child: _buildFloatingNavBar(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIssueItem(Map<String, dynamic> item) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          // Thumbnail / Color Preview
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: item["color"] as Color,
              borderRadius: BorderRadius.circular(16),
            ),
            child: item["imageType"] == "custom"
                ? const Icon(Icons.delete_outline_rounded, color: Colors.white, size: 26)
                : const SizedBox.shrink(),
          ),

          const SizedBox(width: 14),

          // Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item["title"], style: AppleTheme.itemTitle),
                const SizedBox(height: 2),
                Text(item["location"], style: AppleTheme.itemSubtitle),
                const SizedBox(height: 4),
                // Status Badge (Pending)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppleTheme.badgePendingBg,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppleTheme.badgePendingBorder),
                  ),
                  child: Text(
                    item["status"],
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      color: AppleTheme.badgePendingText,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Three dots menu button
          IconButton(
            icon: const Icon(Icons.more_horiz, color: Color(0xFF9CA3AF)),
            onPressed: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildFloatingNavBar() {
    return Container(
      height: 68,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppleTheme.navBarBg,
        borderRadius: BorderRadius.circular(36),
        border: Border.all(color: AppleTheme.navBarBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.25),
            blurRadius: 24,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          // Home
          IconButton(
            icon: Icon(
              Icons.home_outlined,
              color: _currentNavIndex == 0 ? Colors.white : const Color(0xFF6B7280),
              size: 26,
            ),
            onPressed: () => setState(() => _currentNavIndex = 0),
          ),

          // Search
          IconButton(
            icon: Icon(
              Icons.search_rounded,
              color: _currentNavIndex == 1 ? Colors.white : const Color(0xFF6B7280),
              size: 26,
            ),
            onPressed: () => setState(() => _currentNavIndex = 1),
          ),

          // Center (+) Action Button (White Circle)
          GestureDetector(
            onTap: _openReportSheet,
            child: Container(
              width: 50,
              height: 50,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black26,
                    blurRadius: 8,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: const Icon(
                Icons.add_rounded,
                color: AppleTheme.cardDark,
                size: 30,
              ),
            ),
          ),

          // Messages / Chat
          IconButton(
            icon: Icon(
              Icons.chat_bubble_outline_rounded,
              color: _currentNavIndex == 2 ? Colors.white : const Color(0xFF6B7280),
              size: 24,
            ),
            onPressed: () => setState(() => _currentNavIndex = 2),
          ),

          // Profile
          IconButton(
            icon: Icon(
              Icons.person_outline_rounded,
              color: _currentNavIndex == 3 ? Colors.white : const Color(0xFF6B7280),
              size: 26,
            ),
            onPressed: () => setState(() => _currentNavIndex = 3),
          ),
        ],
      ),
    );
  }
}
