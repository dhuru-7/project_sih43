import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/apple_theme.dart';
import '../../core/widgets/app_svg_icons.dart';
import '../../core/widgets/elastic_pressable.dart';
import '../problem-report/take_photo_sheet.dart';

class SetuHomeScreen extends StatefulWidget {
  const SetuHomeScreen({super.key});

  @override
  State<SetuHomeScreen> createState() => _SetuHomeScreenState();
}

class _SetuHomeScreenState extends State<SetuHomeScreen> {
  int _currentNavIndex = 0;
  String _selectedUpdateFilter = 'All Updates';
  String _exploreSection = 'forYou'; // 'forYou' | 'following'
  String _selectedExploreCategory = 'All';

  final Map<String, String> _cardViewModes = {}; // 'media' | 'details'
  final Map<String, int> _activeMediaIndexes = {};
  final Map<String, bool> _expandedDescriptions = {};

  final List<Map<String, dynamic>> _exploreReports = [
    {
      "id": "exp-1",
      "author": "Aryan chadda",
      "authorInitial": "A",
      "date": "8/15/2026",
      "location": "Tikri, New Delhi",
      "status": "PENDING",
      "title": "Garbage Dumps & Hazardous Landfill Overflow",
      "description": "There is lots of waste here. After multiple formal complaints there is still no action taken from the municipal department. Toxic chemical run-off is mixing with stagnant rainwater, causing hazardous mosquito breeding and severe respiratory distress for hundreds of local residents living adjacent to the dump site.",
      "assignedTo": "Solid Waste Management (SWM)",
      "media": [
        {"type": "image", "url": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80"},
        {"type": "image", "url": "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800&auto=format&fit=crop&q=80"},
        {"type": "video", "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
      ],
      "isFollowing": true,
      "category": "Sanitation",
    },
    {
      "id": "exp-2",
      "author": "Arjun Sharma",
      "authorInitial": "A",
      "date": "8/15/2026",
      "location": "Sector 14 Main Junction",
      "status": "PENDING",
      "title": "Water Main Pipe Fracture & Street Flooding",
      "description": "Major underground pressurized distribution pipeline burst early this morning. Potable drinking water is gushing out at rapid pressure, submerging both transit lanes, eroding asphalt road foundation, and wasting thousands of gallons of municipal clean water.",
      "assignedTo": "Delhi Jal Board (DJB)",
      "media": [
        {"type": "image", "url": "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80"},
        {"type": "video", "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"}
      ],
      "isFollowing": false,
      "category": "Water",
    },
    {
      "id": "exp-3",
      "author": "Pooja Rani",
      "authorInitial": "P",
      "date": "8/14/2026",
      "location": "Pattikalyana School Crossing",
      "status": "IN PROGRESS",
      "title": "Open Drain Hazard & Embankment Breach",
      "description": "Uncovered sewer line overflowing near primary school entrance. The embankment has caved in and poses extreme danger for walking students and vehicles during rainfall. Urgent concrete slab casting and heavy desilting required immediately.",
      "assignedTo": "Public Health Engineering Dept.",
      "media": [
        {"type": "image", "url": "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=800&auto=format&fit=crop&q=80"},
        {"type": "image", "url": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80"}
      ],
      "isFollowing": true,
      "category": "Sanitation",
    },
    {
      "id": "exp-4",
      "author": "Vikram Mehta",
      "authorInitial": "V",
      "date": "8/12/2026",
      "location": "Sector 7 Market Corridor",
      "status": "RESOLVED",
      "title": "Broken High-Mast Streetlight Restored",
      "description": "Faulty high-mast LED fixture replaced and verified by smart energy monitoring dashboard. Full 360-degree illumination restored along commercial lane for night-time public safety.",
      "assignedTo": "Electricity & Power Distribution Board",
      "media": [
        {"type": "image", "url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80"}
      ],
      "isFollowing": false,
      "category": "Electricity",
    },
  ];

  void _toggleFollow(String id) {
    HapticFeedback.selectionClick();
    setState(() {
      final idx = _exploreReports.indexWhere((r) => r["id"] == id);
      if (idx != -1) {
        _exploreReports[idx]["isFollowing"] = !(_exploreReports[idx]["isFollowing"] as bool);
      }
    });
  }

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
    final bottomInset = MediaQuery.of(context).padding.bottom;
    final navBottomPosition = bottomInset > 0 ? bottomInset + 12.0 : 24.0;

    return Scaffold(
      backgroundColor: AppleTheme.background,
      body: SafeArea(
        bottom: false,
        child: Stack(
          children: [
            // Scrollable / Full Screen Content depending on active tab
            Positioned.fill(
              child: _currentNavIndex == 3
                  ? _buildProfileContent(navBottomPosition + 70)
                  : _currentNavIndex == 2
                      ? _buildUpdatesContent(navBottomPosition + 70)
                      : _currentNavIndex == 1
                          ? _buildExploreContent(navBottomPosition + 70)
                          : SingleChildScrollView(
                              physics: const BouncingScrollPhysics(),
                              padding: EdgeInsets.fromLTRB(20, 16, 20, navBottomPosition + 80),
                              child: _buildHomeContent(),
                            ),
            ),

            // Apple Floating Pill Bottom Navigation Bar
            Positioned(
              left: 20,
              right: 20,
              bottom: navBottomPosition,
              child: _buildFloatingNavBar(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHomeContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 1. Top Bar: Setu. + Notification Bell
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Setu.', style: AppleTheme.brandTitle),
            ApplePressable(
              onTap: () => setState(() => _currentNavIndex = 2),
              child: Container(
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
                child: Center(
                  child: AppSvgIcons.icon(
                    svgContent: AppSvgIcons.notificationBellSvg,
                    size: 22,
                    color: AppleTheme.textPrimary,
                  ),
                ),
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
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                  ApplePressable(
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

              // Full Width "Take Photo" White Pill Button with Spring Feedback
              ApplePressable(
                onTap: _openReportSheet,
                child: Container(
                  width: double.infinity,
                  height: 54,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.06),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.camera_alt_outlined,
                        color: AppleTheme.textPrimary,
                        size: 20,
                      ),
                      SizedBox(width: 8),
                      Text(
                        'Take Photo',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppleTheme.textPrimary,
                          letterSpacing: -0.2,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 32),

        // 4. Section Header: Nearby Issues + Explore Reports Pill
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                    '${_nearbyIssues.length.clamp(0, 3)}',
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
            ApplePressable(
              onTap: () => setState(() => _currentNavIndex = 1),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.02),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'Explore Reports',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppleTheme.textPrimary,
                      ),
                    ),
                    const SizedBox(width: 6),
                    AppSvgIcons.icon(
                      svgContent: AppSvgIcons.exploreReportsSvg,
                      size: 16,
                      color: AppleTheme.textPrimary,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),

        const SizedBox(height: 16),

        // 5. Issues List (Max 3 on Homepage)
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _nearbyIssues.length.clamp(0, 3),
          separatorBuilder: (context, index) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final item = _nearbyIssues[index];
            return _buildIssueItem(item);
          },
        ),
      ],
    );
  }

  Widget _buildUpdatesContent(double bottomPadding) {
    final filters = ['All Updates', 'My Reports', 'Following'];
    return Padding(
      padding: EdgeInsets.fromLTRB(20, 16, 20, bottomPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Top Bar: "Updates" Heading + Notification Bell
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Updates',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.6,
                  color: AppleTheme.textPrimary,
                ),
              ),
              ApplePressable(
                onTap: () {},
                child: Container(
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
                  child: Center(
                    child: AppSvgIcons.icon(
                      svgContent: AppSvgIcons.notificationBellSvg,
                      size: 22,
                      color: AppleTheme.textPrimary,
                    ),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 6),

          // Subtitle lifted up directly below top header
          const Text(
            'Stay informed about your reports and followed issues.',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: Color(0xFF6B7280),
            ),
          ),

          const SizedBox(height: 18),

          // Filter Pills
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            child: Row(
              children: filters.map((filter) {
                final isSelected = _selectedUpdateFilter == filter;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ApplePressable(
                    pressedScale: 0.94,
                    onTap: () => setState(() => _selectedUpdateFilter = filter),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 180),
                      curve: Curves.easeOutCubic,
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFF121417) : Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: isSelected ? const Color(0xFF121417) : const Color(0xFFE5E7EB),
                        ),
                        boxShadow: isSelected
                            ? [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.12),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                )
                              ]
                            : [],
                      ),
                      child: Text(
                        filter,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                          color: isSelected ? Colors.white : const Color(0xFF4B5563),
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          // Perfectly Centered Empty State with optimal optical balance
          Expanded(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.only(bottom: 24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 68,
                      height: 68,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Color(0xFFF3F4F6),
                      ),
                      child: Center(
                        child: AppSvgIcons.icon(
                          svgContent: AppSvgIcons.updatesSvg,
                          size: 28,
                          color: const Color(0xFF4B5563),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'No updates yet',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        letterSpacing: -0.3,
                        color: AppleTheme.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const SizedBox(
                      width: 260,
                      child: Text(
                        'When authorities take action on your reports, you\'ll see updates here.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 14,
                          height: 1.45,
                          fontWeight: FontWeight.w400,
                          color: Color(0xFF6B7280),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIssueItem(Map<String, dynamic> item) {
    return ApplePressable(
      pressedScale: 0.98,
      child: Container(
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
      ),
    );
  }

  Widget _buildExploreContent(double bottomPadding) {
    final filteredReports = _exploreReports
        .where((item) => _exploreSection == 'forYou' || (item['isFollowing'] as bool))
        .where((item) => _selectedExploreCategory == 'All' || item['category'] == _selectedExploreCategory)
        .toList();

    final followingCount = _exploreReports.where((r) => r['isFollowing'] == true).length;

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: EdgeInsets.fromLTRB(0, 16, 0, bottomPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: Explore Title & Subtitle
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Explore',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w700,
                    letterSpacing: -0.8,
                    color: AppleTheme.textPrimary,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Discover civic reports and track authorities\' actions',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: Color(0xFF6B7280),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Apple Segmented Pill: For You vs Following with Animated Sliding Pill Indicator
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Container(
              height: 46,
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: const Color(0xFFF3F4F6),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Stack(
                children: [
                  // Fluid Spring Sliding White Indicator Pill
                  AnimatedAlign(
                    alignment: _exploreSection == 'forYou' ? Alignment.centerLeft : Alignment.centerRight,
                    duration: const Duration(milliseconds: 280),
                    curve: Curves.easeOutCubic,
                    child: FractionallySizedBox(
                      widthFactor: 0.5,
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.08),
                              blurRadius: 10,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  // Row of 2 Interactive Tabs
                  Row(
                    children: [
                      Expanded(
                        child: ElasticPressable(
                          pressedScale: 0.95,
                          onTap: () {
                            setState(() => _exploreSection = 'forYou');
                          },
                          child: Center(
                            child: AnimatedDefaultTextStyle(
                              duration: const Duration(milliseconds: 200),
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 14,
                                fontWeight: _exploreSection == 'forYou' ? FontWeight.w700 : FontWeight.w500,
                                color: _exploreSection == 'forYou' ? const Color(0xFF0F1115) : const Color(0xFF6B7280),
                              ),
                              child: const Text('For You'),
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: ElasticPressable(
                          pressedScale: 0.95,
                          onTap: () {
                            setState(() => _exploreSection = 'following');
                          },
                          child: Center(
                            child: AnimatedDefaultTextStyle(
                              duration: const Duration(milliseconds: 200),
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 14,
                                fontWeight: _exploreSection == 'following' ? FontWeight.w700 : FontWeight.w500,
                                color: _exploreSection == 'following' ? const Color(0xFF0F1115) : const Color(0xFF6B7280),
                              ),
                              child: Text(
                                followingCount > 0 ? 'Following ($followingCount)' : 'Following',
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Category Filter Chips Carousel
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: ['All', 'Sanitation', 'Roads', 'Electricity', 'Water'].map((cat) {
                final isSelected = _selectedExploreCategory == cat;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ApplePressable(
                    pressedScale: 0.94,
                    onTap: () => setState(() => _selectedExploreCategory = cat),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFF0F1115) : Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: isSelected ? const Color(0xFF0F1115) : const Color(0xFFE5E7EB),
                        ),
                      ),
                      child: Text(
                        cat,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                          color: isSelected ? Colors.white : const Color(0xFF4B5563),
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),

          // Explored Issues Feed - Smooth Animated Switcher
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 250),
            switchInCurve: Curves.easeOutCubic,
            switchOutCurve: Curves.easeOutCubic,
            child: KeyedSubtree(
              key: ValueKey('$_exploreSection-$_selectedExploreCategory'),
              child: filteredReports.isEmpty
                  ? Padding(
                      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
                      child: Center(
                        child: Column(
                          children: [
                            Container(
                              width: 64,
                              height: 64,
                              decoration: const BoxDecoration(
                                shape: BoxShape.circle,
                                color: Color(0xFFF3F4F6),
                              ),
                              child: Center(
                                child: AppSvgIcons.icon(
                                  svgContent: AppSvgIcons.bookmarkOutlineSvg,
                                  size: 28,
                                  color: const Color(0xFF6B7280),
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              _exploreSection == 'following' ? 'No followed reports yet' : 'No reports in this category',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF0F1115),
                              ),
                            ),
                            const SizedBox(height: 6),
                            SizedBox(
                              width: 280,
                              child: Text(
                                _exploreSection == 'following'
                                    ? 'Tap the bookmark icon on any report in "For You" to track real-time resolution updates.'
                                    : 'Try selecting another category or check back later.',
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  fontSize: 14,
                                  height: 1.45,
                                  color: Color(0xFF6B7280),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  : ListView.separated(
                      shrinkWrap: true,
                      padding: EdgeInsets.zero,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: filteredReports.length,
                      separatorBuilder: (context, index) => Container(
                        height: 8,
                        color: const Color(0xFFF3F4F6),
                      ),
                      itemBuilder: (context, index) => _buildExploreReportCard(filteredReports[index]),
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExploreReportCard(Map<String, dynamic> item) {
    final String reportId = item["id"] as String;
    final bool isFollowing = item["isFollowing"] == true;
    final String status = item["status"] as String;
    final mediaList = (item["media"] as List<dynamic>?) ??
        (item["imageUrl"] != null ? [{"type": "image", "url": item["imageUrl"]}] : []);
    final bool isDetailsMode = _cardViewModes[reportId] == 'details';
    final int activeIdx = _activeMediaIndexes[reportId] ?? 0;
    final bool isDescExpanded = _expandedDescriptions[reportId] ?? false;
    final String descriptionText = (item["description"] as String?) ?? '';

    Color statusBg = const Color(0xFFFEF3C7);
    Color statusTextColor = const Color(0xFF92400E);
    if (status == 'RESOLVED') {
      statusBg = const Color(0xFFD1FAE5);
      statusTextColor = const Color(0xFF065F46);
    } else if (status == 'IN PROGRESS') {
      statusBg = const Color(0xFFDBEAFE);
      statusTextColor = const Color(0xFF1E40AF);
    }

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onHorizontalDragEnd: (DragEndDetails details) {
        final velocity = details.primaryVelocity ?? 0;
        if (velocity < -120) {
          // Swiped Left -> Show Full Details Card
          HapticFeedback.selectionClick();
          setState(() => _cardViewModes[reportId] = 'details');
        } else if (velocity > 120) {
          // Swiped Right -> Show Media Post Card
          HapticFeedback.selectionClick();
          setState(() => _cardViewModes[reportId] = 'media');
        }
      },
      child: AnimatedCrossFade(
        duration: const Duration(milliseconds: 280),
        firstCurve: Curves.easeOutCubic,
        secondCurve: Curves.easeOutCubic,
        crossFadeState: isDetailsMode ? CrossFadeState.showSecond : CrossFadeState.showFirst,
        firstChild: _buildPostMediaFace(item, reportId, isFollowing, status, mediaList, activeIdx, isDescExpanded, descriptionText, statusBg, statusTextColor),
        secondChild: _buildPostDetailsFace(item, reportId, isFollowing, status, statusBg, statusTextColor),
      ),
    );
  }

  // ==================== FACE 1: POST MEDIA CARD ====================
  Widget _buildPostMediaFace(
    Map<String, dynamic> item,
    String reportId,
    bool isFollowing,
    String status,
    List<dynamic> mediaList,
    int activeIdx,
    bool isDescExpanded,
    String descriptionText,
    Color statusBg,
    Color statusTextColor,
  ) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Header: Avatar + Author + Location + Timestamp
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: Color(0xFF64748B),
                  ),
                  child: Center(
                    child: Text(
                      item["authorInitial"] as String,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item["author"] as String,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF0F1115),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 1),
                      Text(
                        '${item["date"]} • ${item["location"]}',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF9CA3AF),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                ElasticPressable(
                  pressedScale: 0.88,
                  onTap: () => _showReportDetailSheet(item),
                  child: const Padding(
                    padding: EdgeInsets.all(4.0),
                    child: Icon(Icons.more_horiz, color: Color(0xFF9CA3AF), size: 22),
                  ),
                ),
              ],
            ),
          ),

          // 2. Media Carousel Container (Rounded Corners)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: SizedBox(
                height: 280,
                width: double.infinity,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    if (mediaList.isNotEmpty)
                      PageView.builder(
                        itemCount: mediaList.length,
                        onPageChanged: (idx) {
                          setState(() => _activeMediaIndexes[reportId] = idx);
                        },
                        itemBuilder: (context, mIdx) {
                          final mediaItem = mediaList[mIdx] as Map<String, dynamic>;
                          final isVideo = mediaItem["type"] == "video";
                          final url = mediaItem["url"] as String?;

                          if (isVideo) {
                            return Container(
                              color: Colors.black,
                              child: Stack(
                                alignment: Alignment.center,
                                children: [
                                  const Icon(Icons.videocam_rounded, color: Color(0xFF374151), size: 64),
                                  Container(
                                    width: 56,
                                    height: 56,
                                    decoration: BoxDecoration(
                                      color: Colors.black.withOpacity(0.65),
                                      shape: BoxShape.circle,
                                      border: Border.all(color: Colors.white24),
                                    ),
                                    child: const Center(
                                      child: Icon(Icons.play_arrow_rounded, color: Colors.white, size: 36),
                                    ),
                                  ),
                                  // Icon-Only Mute Button
                                  Positioned(
                                    bottom: 12,
                                    left: 12,
                                    child: Container(
                                      width: 34,
                                      height: 34,
                                      decoration: BoxDecoration(
                                        color: Colors.black.withOpacity(0.65),
                                        shape: BoxShape.circle,
                                      ),
                                      child: const Center(
                                        child: Icon(Icons.volume_off, color: Colors.white, size: 16),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }

                          return url != null
                              ? Image.network(
                                  url,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) => Container(
                                    color: const Color(0xFF1F2937),
                                    child: const Center(
                                      child: Text('No Image', style: TextStyle(color: Colors.white38, fontSize: 24, fontWeight: FontWeight.bold)),
                                    ),
                                  ),
                                )
                              : Container(
                                  color: const Color(0xFF1F2937),
                                  child: const Center(
                                    child: Text('No Image', style: TextStyle(color: Colors.white38, fontSize: 24, fontWeight: FontWeight.bold)),
                                  ),
                                );
                        },
                      )
                    else
                      Container(
                        color: const Color(0xFF1F2937),
                        child: const Center(
                          child: Text('No Media', style: TextStyle(color: Colors.white38, fontSize: 24, fontWeight: FontWeight.bold)),
                        ),
                      ),

                    // Top-Left Status Badge
                    Positioned(
                      top: 12,
                      left: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: statusBg,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.15),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 6,
                              height: 6,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: statusTextColor,
                              ),
                            ),
                            const SizedBox(width: 5),
                            Text(
                              status,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: statusTextColor,
                                letterSpacing: 0.4,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Top-Right Multi-Media Counter Badge (Clean numbers only)
                    if (mediaList.length > 1)
                      Positioned(
                        top: 12,
                        right: 12,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.6),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '${activeIdx + 1}/${mediaList.length}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                      ),

                    // Bottom-Center Dot Indicators
                    if (mediaList.length > 1)
                      Positioned(
                        bottom: 12,
                        left: 0,
                        right: 0,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: List.generate(mediaList.length, (mIdx) {
                            final isActive = activeIdx == mIdx;
                            return AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              margin: const EdgeInsets.symmetric(horizontal: 2.5),
                              width: isActive ? 16 : 6,
                              height: 6,
                              decoration: BoxDecoration(
                                color: isActive ? Colors.white : Colors.white.withOpacity(0.45),
                                borderRadius: BorderRadius.circular(3),
                              ),
                            );
                          }),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),

          // 3. Title & Follow Bookmark Button
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: ElasticPressable(
                    pressedScale: 0.98,
                    onTap: () {
                      setState(() => _cardViewModes[reportId] = 'details');
                    },
                    child: Text(
                      item["title"] as String,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.3,
                        color: Color(0xFF0F1115),
                      ),
                    ),
                  ),
                ),
                // Fixed-width 60px Bookmark Follow Button
                SizedBox(
                  width: 60,
                  child: ApplePressable(
                    onTap: () => _toggleFollow(reportId),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        AppSvgIcons.icon(
                          svgContent: isFollowing
                              ? AppSvgIcons.bookmarkFilledSvg
                              : AppSvgIcons.bookmarkOutlineSvg,
                          size: 24,
                          color: isFollowing ? const Color(0xFF2563EB) : const Color(0xFF6B7280),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          isFollowing ? 'Following' : 'Follow',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: isFollowing ? const Color(0xFF2563EB) : const Color(0xFF6B7280),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // 4. Expandable Description
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 6, 20, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ElasticPressable(
                  pressedScale: 0.99,
                  onTap: () => setState(() => _expandedDescriptions[reportId] = !isDescExpanded),
                  child: Text(
                    descriptionText,
                    maxLines: isDescExpanded ? null : 2,
                    overflow: isDescExpanded ? TextOverflow.visible : TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 14,
                      color: Color(0xFF4B5563),
                      height: 1.45,
                    ),
                  ),
                ),
                if (descriptionText.length > 80)
                  ElasticPressable(
                    pressedScale: 0.96,
                    onTap: () => setState(() => _expandedDescriptions[reportId] = !isDescExpanded),
                    child: Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Text(
                        isDescExpanded ? 'Show less' : '... more',
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF2563EB),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),

          // 5. Assigned Department Badge
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
            child: ElasticPressable(
              pressedScale: 0.97,
              onTap: () {
                setState(() => _cardViewModes[reportId] = 'details');
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 34,
                      height: 34,
                      decoration: BoxDecoration(
                        color: const Color(0xFFDBEAFE),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Center(
                        child: AppSvgIcons.icon(
                          svgContent: AppSvgIcons.buildingSvg,
                          size: 18,
                          color: const Color(0xFF2563EB),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'ASSIGNED TO',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.5,
                              color: Color(0xFF6B7280),
                            ),
                          ),
                          const SizedBox(height: 1),
                          Text(
                            item["assignedTo"] as String,
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF0F1115),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // 6. Swipe / View Details Action Link
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 10, 20, 0),
            child: ApplePressable(
              onTap: () {
                HapticFeedback.selectionClick();
                setState(() => _cardViewModes[reportId] = 'details');
              },
              child: const Center(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      '👈 Swipe left or tap for full details ',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF64748B),
                      ),
                    ),
                    Text(
                      '>>',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF3B82F6),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ==================== FACE 2: FULL-CARD DETAILS CARD (APPLE LIGHT THEME) ====================
  Widget _buildPostDetailsFace(
    Map<String, dynamic> item,
    String reportId,
    bool isFollowing,
    String status,
    Color statusBg,
    Color statusTextColor,
  ) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Row: Back button + Status Badge
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              ApplePressable(
                onTap: () {
                  HapticFeedback.selectionClick();
                  setState(() => _cardViewModes[reportId] = 'media');
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF3F4F6),
                    border: Border.all(color: const Color(0xFFE5E7EB)),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.arrow_back_rounded, color: Color(0xFF0F1115), size: 14),
                      SizedBox(width: 4),
                      Text('Back to Post', style: TextStyle(color: Color(0xFF0F1115), fontSize: 12, fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: statusBg,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '• $status',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: statusTextColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Title
          const Text(
            'CIVIC GRIEVANCE REPORT',
            style: TextStyle(fontSize: 10, color: Color(0xFF6B7280), fontWeight: FontWeight.w700, letterSpacing: 0.5),
          ),
          const SizedBox(height: 3),
          Text(
            item["title"] as String,
            style: const TextStyle(fontSize: 19, fontWeight: FontWeight.w800, color: Color(0xFF0F1115), letterSpacing: -0.3),
          ),
          const SizedBox(height: 14),

          // Location Box
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF9FAFB),
              border: Border.all(color: const Color(0xFFE5E7EB)),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('VERIFIED GEOTAGGED LOCATION', style: TextStyle(fontSize: 10, color: Color(0xFF6B7280), fontWeight: FontWeight.w700)),
                const SizedBox(height: 3),
                Text('📍 ${item["location"]}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF0F1115))),
                const SizedBox(height: 2),
                const Text('GPS Coordinates: 28.6139° N, 77.2090° E (Civic Verified)', style: TextStyle(fontSize: 11, color: Color(0xFF2563EB), fontWeight: FontWeight.w600)),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Full Description Box
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF9FAFB),
              border: Border.all(color: const Color(0xFFE5E7EB)),
              borderRadius: const BorderRadius.only(topRight: Radius.circular(12), bottomRight: Radius.circular(12)),
            ),
            child: Container(
              decoration: const BoxDecoration(
                border: Border(left: BorderSide(color: Color(0xFF2563EB), width: 3)),
              ),
              padding: const EdgeInsets.only(left: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('FULL CITIZEN DESCRIPTION', style: TextStyle(fontSize: 10, color: Color(0xFF6B7280), fontWeight: FontWeight.w700)),
                  const SizedBox(height: 4),
                  Text(
                    (item["description"] as String?) ?? '',
                    style: const TextStyle(fontSize: 13, color: Color(0xFF374151), height: 1.5),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Assigned Authority
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFEFF6FF),
              border: Border.all(color: const Color(0xFFDBEAFE)),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: const Color(0xFFDBEAFE),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Center(
                    child: AppSvgIcons.icon(
                      svgContent: AppSvgIcons.buildingSvg,
                      size: 18,
                      color: const Color(0xFF2563EB),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('ASSIGNED DEPARTMENT & SLA', style: TextStyle(fontSize: 10, color: Color(0xFF6B7280), fontWeight: FontWeight.w700)),
                      Text(item["assignedTo"] as String, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF0F1115))),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Lifecycle Stepper
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF9FAFB),
              border: Border.all(color: const Color(0xFFE5E7EB)),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('LIVE RESOLUTION LIFECYCLE', style: TextStyle(fontSize: 10, color: Color(0xFF6B7280), fontWeight: FontWeight.w700)),
                const SizedBox(height: 6),
                const Text('✓ 1. Report Logged & AI Verified (Passed)', style: TextStyle(color: Color(0xFF059669), fontSize: 12, fontWeight: FontWeight.w600)),
                const SizedBox(height: 3),
                Text(
                  status != 'PENDING' ? '✓ 2. Dispatched to Ground Officer' : '• 2. Ground Officer Dispatched',
                  style: TextStyle(color: status != 'PENDING' ? const Color(0xFF059669) : const Color(0xFF2563EB), fontSize: 12, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 3),
                Text(
                  status == 'RESOLVED' ? '✓ 3. Resolved on Ground & Closed' : '○ 3. Citizen Verification & Resolution',
                  style: TextStyle(color: status == 'RESOLVED' ? const Color(0xFF059669) : const Color(0xFF9CA3AF), fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Action Buttons: Follow Updates (Full Width)
          ApplePressable(
            onTap: () => _toggleFollow(reportId),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: isFollowing ? const Color(0xFFEFF6FF) : const Color(0xFFF3F4F6),
                border: Border.all(color: isFollowing ? const Color(0xFFDBEAFE) : const Color(0xFFE5E7EB)),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    AppSvgIcons.icon(
                      svgContent: isFollowing ? AppSvgIcons.bookmarkFilledSvg : AppSvgIcons.bookmarkOutlineSvg,
                      size: 18,
                      color: isFollowing ? const Color(0xFF2563EB) : const Color(0xFF4B5563),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      isFollowing ? 'Following Issue' : 'Follow Updates',
                      style: TextStyle(
                        color: isFollowing ? const Color(0xFF2563EB) : const Color(0xFF0F1115),
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 10),

          // Swipe hint footer
          ApplePressable(
            onTap: () {
              HapticFeedback.selectionClick();
              setState(() => _cardViewModes[reportId] = 'media');
            },
            child: const Center(
              child: Text(
                '👉 Swipe right or tap to return to post',
                style: TextStyle(fontSize: 12, color: Color(0xFF9CA3AF), fontWeight: FontWeight.w600),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 7. Apple Detail Modal Sheet (Shows full description, location, timeline, etc.)
  void _showReportDetailSheet(Map<String, dynamic> item) {
    HapticFeedback.mediumImpact();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        final bool isFollowing = item["isFollowing"] == true;
        final String status = item["status"] as String;
        final String? imageUrl = item["imageUrl"] as String?;

        Color statusBg = const Color(0xFFFEF3C7);
        Color statusTextColor = const Color(0xFF92400E);
        if (status == 'RESOLVED') {
          statusBg = const Color(0xFFD1FAE5);
          statusTextColor = const Color(0xFF065F46);
        } else if (status == 'IN PROGRESS') {
          statusBg = const Color(0xFFDBEAFE);
          statusTextColor = const Color(0xFF1E40AF);
        }

        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(32),
              topRight: Radius.circular(32),
            ),
          ),
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 36),
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Pull Bar
                Center(
                  child: Container(
                    width: 40,
                    height: 5,
                    decoration: BoxDecoration(
                      color: const Color(0xFFD1D5DB),
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Top Header Row: Status badge + Close X
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: statusBg,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '• $status',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: statusTextColor,
                          letterSpacing: 0.4,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded, color: Color(0xFF4B5563)),
                      onPressed: () => Navigator.pop(context),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Photo Preview
                if (imageUrl != null)
                  ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: SizedBox(
                      height: 200,
                      width: double.infinity,
                      child: Image.network(imageUrl, fit: BoxFit.cover),
                    ),
                  ),
                if (imageUrl != null) const SizedBox(height: 16),

                // Title
                Text(
                  item["title"] as String,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.4,
                    color: Color(0xFF0F1115),
                  ),
                ),
                const SizedBox(height: 4),

                // Author & Location
                Text(
                  '${item["author"]} • ${item["date"]} • ${item["location"]}',
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF6B7280),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 18),

                // Full Untruncated Description
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF9FAFB),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'FULL DESCRIPTION',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.5,
                          color: Color(0xFF6B7280),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        item["description"] as String,
                        style: const TextStyle(
                          fontSize: 14,
                          color: Color(0xFF374151),
                          height: 1.55,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Location Details & GPS Coordinates
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF9FAFB),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'GPS LOCATION & LANDMARK',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.5,
                          color: Color(0xFF6B7280),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          const Icon(Icons.location_on, color: Color(0xFFEF4444), size: 18),
                          const SizedBox(width: 6),
                          Text(
                            item["location"] as String,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF0F1115),
                            ),
                          ),
                        ],
                      ),
                      const Padding(
                        padding: EdgeInsets.only(left: 24, top: 4),
                        child: Text(
                          'Coordinates: 28.6139° N, 77.2090° E (Geotag Verified)',
                          style: TextStyle(fontSize: 12, color: Color(0xFF9CA3AF)),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Assigned Authority Badge
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: const Color(0xFFDBEAFE),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Center(
                          child: AppSvgIcons.icon(
                            svgContent: AppSvgIcons.buildingSvg,
                            size: 20,
                            color: const Color(0xFF2563EB),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'ASSIGNED AUTHORITY',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 0.5,
                                color: Color(0xFF6B7280),
                              ),
                            ),
                            const SizedBox(height: 1),
                            Text(
                              item["assignedTo"] as String,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF0F1115),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Grievance Progress Stepper
                const Text(
                  'GRIEVANCE RESOLUTION PROGRESS',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.5,
                    color: Color(0xFF6B7280),
                  ),
                ),
                const SizedBox(height: 12),
                Column(
                  children: [
                    _buildTimelineStep(title: 'Report Submitted & Geotagged', isDone: true),
                    _buildTimelineStep(title: 'AI Visual Verification Completed', isDone: true),
                    _buildTimelineStep(title: 'Dispatched to Ground Officer', isDone: true, isCurrent: true),
                    _buildTimelineStep(title: 'Citizen Verification & Close', isDone: false),
                  ],
                ),
                const SizedBox(height: 24),

                // Action Buttons (Follow Issue / Done)
                Row(
                  children: [
                    Expanded(
                      child: ApplePressable(
                        onTap: () {
                          _toggleFollow(item["id"] as String);
                          Navigator.pop(context);
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          decoration: BoxDecoration(
                            color: isFollowing ? const Color(0xFFEFF6FF) : Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: isFollowing ? const Color(0xFF2563EB) : const Color(0xFFD1D5DB),
                            ),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              AppSvgIcons.icon(
                                svgContent: isFollowing
                                    ? AppSvgIcons.bookmarkFilledSvg
                                    : AppSvgIcons.bookmarkOutlineSvg,
                                size: 18,
                                color: isFollowing ? const Color(0xFF2563EB) : const Color(0xFF4B5563),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                isFollowing ? 'Following Issue' : 'Follow Issue',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                  color: isFollowing ? const Color(0xFF2563EB) : const Color(0xFF374151),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ApplePressable(
                        onTap: () => Navigator.pop(context),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          decoration: BoxDecoration(
                            color: const Color(0xFF0F1115),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Center(
                            child: Text(
                              'Done',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildTimelineStep({
    required String title,
    required bool isDone,
    bool isCurrent = false,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Container(
            width: 20,
            height: 20,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isCurrent
                  ? const Color(0xFF3B82F6)
                  : isDone
                      ? const Color(0xFF10B981)
                      : const Color(0xFFE5E7EB),
            ),
            child: Center(
              child: isDone
                  ? const Text('✓', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold))
                  : isCurrent
                      ? const Text('•', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold))
                      : const SizedBox.shrink(),
            ),
          ),
          const SizedBox(width: 10),
          Text(
            title,
            style: TextStyle(
              fontSize: 13,
              fontWeight: isCurrent || isDone ? FontWeight.w600 : FontWeight.w400,
              color: isCurrent
                  ? const Color(0xFF2563EB)
                  : isDone
                      ? const Color(0xFF111827)
                      : const Color(0xFF9CA3AF),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileContent(double bottomPadding) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: EdgeInsets.fromLTRB(20, 16, 20, bottomPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Row: Settings gear icon button aligned right
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              ApplePressable(
                onTap: () {},
                child: Container(
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
                  child: Center(
                    child: AppSvgIcons.icon(
                      svgContent: AppSvgIcons.settingsSvg,
                      size: 22,
                      color: AppleTheme.textPrimary,
                    ),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 8),

          // Avatar & Name
          Center(
            child: Column(
              children: [
                Stack(
                  children: [
                    Container(
                      width: 92,
                      height: 92,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 3),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 20,
                            offset: const Offset(0, 6),
                          ),
                        ],
                        image: const DecorationImage(
                          image: NetworkImage(
                            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80',
                          ),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    // Edit pencil badge button
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: ApplePressable(
                        onTap: () {},
                        child: Container(
                          width: 28,
                          height: 28,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white,
                            border: Border.all(color: const Color(0xFFE5E7EB)),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.12),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Center(
                            child: AppSvgIcons.icon(
                              svgContent: AppSvgIcons.editPencilSvg,
                              size: 14,
                              color: AppleTheme.textPrimary,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                const Text(
                  'Rampal',
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.6,
                    color: AppleTheme.textPrimary,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 28),

          // Section 1: PERSONAL DETAILS
          const Padding(
            padding: EdgeInsets.only(left: 4, bottom: 10),
            child: Text(
              'PERSONAL DETAILS',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.6,
                color: Color(0xFF6B7280),
              ),
            ),
          ),

          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFF3F4F6)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                // Phone
                _buildProfileDetailRow(
                  svg: AppSvgIcons.phoneSvg,
                  label: 'Phone',
                  value: '9829382372',
                ),
                const SizedBox(height: 18),

                // Masked Aadhaar Number
                _buildProfileDetailRow(
                  svg: AppSvgIcons.aadhaarSvg,
                  label: 'Aadhaar Number',
                  value: '•••• •••• 9842',
                  isMasked: true,
                ),
                const SizedBox(height: 18),

                // Location
                _buildProfileDetailRow(
                  svg: AppSvgIcons.locationPinSvg,
                  label: 'Location',
                  value: 'Pattikalyana',
                ),
                const SizedBox(height: 18),

                // Date of Birth
                _buildProfileDetailRow(
                  svg: AppSvgIcons.calendarSvg,
                  label: 'Date Of Birth',
                  value: '26 years old',
                ),
              ],
            ),
          ),

          const SizedBox(height: 28),

          // Section 2: MY REPORTS
          Padding(
            padding: const EdgeInsets.only(left: 4, right: 4, bottom: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'MY REPORTS',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.6,
                    color: Color(0xFF6B7280),
                  ),
                ),
                ApplePressable(
                  onTap: () => setState(() => _currentNavIndex = 1),
                  child: const Text(
                    'View All',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF4B5563),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Empty State Prompt
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 20),
            child: Center(
              child: Column(
                children: [
                  const Text(
                    'No reports yet',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF6B7280),
                    ),
                  ),
                  const SizedBox(height: 6),
                  ApplePressable(
                    onTap: _openReportSheet,
                    child: const Text(
                      'Report an issue',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFFEF4444),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileDetailRow({
    required String svg,
    required String label,
    required String value,
    bool isMasked = false,
  }) {
    return Row(
      children: [
        Container(
          width: 42,
          height: 42,
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
            color: Color(0xFFF3F4F6),
          ),
          child: Center(
            child: AppSvgIcons.icon(
              svgContent: svg,
              size: 20,
              color: AppleTheme.textPrimary,
            ),
          ),
        ),
        const SizedBox(width: 14),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: Color(0xFF6B7280),
              ),
            ),
            const SizedBox(height: 2),
            Text(
              value,
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                letterSpacing: isMasked ? 0.8 : -0.2,
                color: AppleTheme.textPrimary,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildFloatingNavBar() {
    return Container(
      height: 66,
      padding: const EdgeInsets.symmetric(horizontal: 6),
      decoration: BoxDecoration(
        color: const Color(0xF2121417),
        borderRadius: BorderRadius.circular(36),
        border: Border.all(color: Colors.white.withOpacity(0.12), width: 0.8),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.28),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Slot 1: Home
          _buildNavSlot(
            index: 0,
            svg: AppSvgIcons.homeSvg,
            onTap: () => setState(() => _currentNavIndex = 0),
          ),

          // Slot 2: Explore
          _buildNavSlot(
            index: 1,
            svg: AppSvgIcons.exploreSvg,
            onTap: () => setState(() => _currentNavIndex = 1),
          ),

          // Slot 3: Center Action (+) Button
          Expanded(
            child: Center(
              child: ElasticPressable(
                pressedScale: 0.94,
                onTap: _openReportSheet,
                child: Container(
                  width: 46,
                  height: 46,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Center(
                    child: AppSvgIcons.icon(
                      svgContent: AppSvgIcons.reportSvg,
                      size: 24,
                      color: AppleTheme.cardDark,
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Slot 4: Updates / Messages
          _buildNavSlot(
            index: 2,
            svg: AppSvgIcons.updatesSvg,
            onTap: () => setState(() => _currentNavIndex = 2),
          ),

          // Slot 5: Profile
          _buildNavSlot(
            index: 3,
            svg: AppSvgIcons.profileSvg,
            onTap: () => setState(() => _currentNavIndex = 3),
          ),
        ],
      ),
    );
  }

  Widget _buildNavSlot({
    required int index,
    required String svg,
    required VoidCallback onTap,
  }) {
    final isSelected = _currentNavIndex == index;
    return Expanded(
      child: Center(
        child: ElasticPressable(
          pressedScale: 0.94,
          onTap: onTap,
          child: Container(
            width: 44,
            height: 44,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.transparent,
            ),
            child: Center(
              child: AppSvgIcons.icon(
                svgContent: svg,
                size: 24,
                color: isSelected ? Colors.white : const Color(0xFF9CA3AF),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// ApplePressable alias mapped directly to ultra-smooth ElasticPressable
typedef ApplePressable = ElasticPressable;
