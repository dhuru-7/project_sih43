import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/apple_theme.dart';
import '../../core/widgets/elastic_pressable.dart';
import '../problem-report/take_photo_sheet.dart';
import 'widgets/morph_star_painter.dart';

class SetuHomeScreen extends StatefulWidget {
  const SetuHomeScreen({super.key});

  @override
  State<SetuHomeScreen> createState() => _SetuHomeScreenState();
}

class _SetuHomeScreenState extends State<SetuHomeScreen>
    with SingleTickerProviderStateMixin {
  int _currentNavIndex = 0;
  String _exploreTab = 'forYou'; // 'forYou' | 'following'

  late AnimationController _morphController;
  late Animation<double> _morphAnimation;
  Timer? _morphTimer;

  @override
  void initState() {
    super.initState();
    // Apple fluid spring rotation controller: 350ms response
    _morphController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
      value: _currentNavIndex > 0 ? 1.0 : 0.0,
    );

    // Apple smooth cubic curve with balanced acceleration & settle in both directions
    _morphAnimation = CurvedAnimation(
      parent: _morphController,
      curve: const Cubic(0.25, 0.1, 0.25, 1.0),
      reverseCurve: const Cubic(0.25, 0.1, 0.25, 1.0),
    );
  }

  @override
  void dispose() {
    _morphTimer?.cancel();
    _morphController.dispose();
    super.dispose();
  }

  void _onNavIndexChanged(int index) {
    if (_currentNavIndex == index) return;
    HapticFeedback.selectionClick();

    _morphTimer?.cancel();

    final wasHome = _currentNavIndex == 0;
    final isGoingHome = index == 0;

    setState(() => _currentNavIndex = index);

    if (wasHome && !isGoingHome) {
      // Home -> Explore/Messages/Profile:
      // Land on the page first, then after the interval (~140ms),
      // smoothly spin & morph Plus into Star, matching the Star -> Plus timing.
      _morphTimer = Timer(const Duration(milliseconds: 140), () {
        if (mounted && _currentNavIndex > 0) {
          _morphController.forward();
        }
      });
    } else if (!wasHome && isGoingHome) {
      // Explore/Messages/Profile -> Home:
      // Land on Home, then smoothly reverse Star back into Plus.
      _morphController.reverse();
    } else if (!isGoingHome) {
      // Navigating between Explore, Messages, and Profile:
      // Keep Star steady.
      _morphController.value = 1.0;
    }
  }

  final Map<String, int> _activeMediaIndexes = {};
  final Map<String, int> _likeCounts = {
    'exp-1': 124,
    'exp-2': 45,
    'exp-3': 312,
  };
  final Map<String, bool> _isLiked = {
    'exp-1': false,
    'exp-2': false,
    'exp-3': false,
  };

  // Community Feed Posts (From Stitch explore.html)
  final List<Map<String, dynamic>> _exploreReports = [
    {
      "id": "exp-1",
      "author": "Sarah Jenkins",
      "authorInitials": "SJ",
      "date": "2h ago",
      "location": "Sector 4 Park",
      "status": "IN PROGRESS",
      "title": "Community Garden in Sector 4",
      "description":
          "The new community garden in Sector 4 is coming along nicely! Thanks to everyone who volunteered this weekend. 🌱",
      "assignedTo": "Horticulture & Parks Dept.",
      "media": [
        {
          "type": "image",
          "url":
              "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80"
        }
      ],
      "isFollowing": true,
    },
    {
      "id": "exp-2",
      "author": "Mike Kumar",
      "authorInitials": "MK",
      "date": "4h ago",
      "location": "Main St & 3rd Cross",
      "status": "PENDING",
      "title": "Pothole on Main St",
      "description":
          "Just submitted a request for the pothole on Main St. Hopefully it gets fixed soon, it's been getting worse with the rain.",
      "assignedTo": "Public Works Department (PWD)",
      "media": <Map<String, dynamic>>[],
      "isFollowing": false,
    },
    {
      "id": "exp-3",
      "author": "City Dept of Parks",
      "authorInitials": "DP",
      "date": "1d ago",
      "location": "Riverside Promenade",
      "status": "RESOLVED",
      "title": "Riverside Park Renovation Complete",
      "description":
          "Update on the Riverside Park renovation project. Phase 1 is complete! Check out the new walkways and seating areas.",
      "assignedTo": "Urban Development Board",
      "media": [
        {
          "type": "image",
          "url":
              "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&auto=format&fit=crop&q=80"
        },
        {
          "type": "image",
          "url":
              "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80"
        }
      ],
      "isFollowing": true,
    },
  ];

  // Nearby Issues List (From Stitch home.html)
  final List<Map<String, dynamic>> _nearbyIssues = [
    {
      "id": "1",
      "title": "Pothole on Main St",
      "location": "Main St (150m away)",
      "time": "Reported 2 hours ago",
      "status": "Pending",
      "imageUrl":
          "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=300&auto=format&fit=crop&q=80",
    },
    {
      "id": "2",
      "title": "Broken Streetlight",
      "location": "5th Avenue Crossing",
      "time": "Reported yesterday",
      "status": "Reviewed",
      "imageUrl":
          "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80",
    },
    {
      "id": "3",
      "title": "Trash Pileup",
      "location": "Market Complex Road",
      "time": "Reported 3 days ago",
      "status": "Resolved",
      "imageUrl":
          "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=300&auto=format&fit=crop&q=80",
    },
  ];

  // Messages & Civic Updates (From Stitch messages.html)
  final List<Map<String, dynamic>> _messages = [
    {
      "id": "msg-1",
      "sender": "City Maintenance",
      "time": "2h ago",
      "message": "We have received your report and are assessing the site.",
      "unread": true,
      "unreadCount": 1,
      "icon": Icons.build_circle_outlined,
      "avatarColor": const Color(0xFFF3F4F6),
      "iconColor": const Color(0xFF1A1C1C),
    },
    {
      "id": "msg-2",
      "sender": "Aarav (Community Lead)",
      "time": "Yesterday",
      "message": "See you at the ward coordination meeting tomorrow!",
      "unread": false,
      "unreadCount": 0,
      "icon": Icons.person_outline,
      "avatarColor": const Color(0xFFF3F4F6),
      "iconColor": const Color(0xFF5E5E5E),
    },
    {
      "id": "msg-3",
      "sender": "Setu Support",
      "time": "Oct 12",
      "message": "The streetlight on 5th Ave has been repaired and verified.",
      "unread": false,
      "unreadCount": 0,
      "icon": Icons.verified_outlined,
      "avatarColor": const Color(0xFFE0F2FE),
      "iconColor": const Color(0xFF0369A1),
    },
    {
      "id": "msg-4",
      "sender": "Priya Sharma",
      "time": "Oct 10",
      "message": "Are you still available for the clean-up drive this weekend?",
      "unread": false,
      "unreadCount": 0,
      "icon": Icons.chat_bubble_outline,
      "avatarColor": const Color(0xFFF3F4F6),
      "iconColor": const Color(0xFF5E5E5E),
    },
  ];

  void _toggleFollow(String id) {
    HapticFeedback.selectionClick();
    setState(() {
      final idx = _exploreReports.indexWhere((r) => r["id"] == id);
      if (idx != -1) {
        _exploreReports[idx]["isFollowing"] =
            !(_exploreReports[idx]["isFollowing"] as bool);
      }
    });
  }

  void _toggleLike(String id) {
    HapticFeedback.selectionClick();
    setState(() {
      final current = _isLiked[id] ?? false;
      _isLiked[id] = !current;
      final count = _likeCounts[id] ?? 0;
      _likeCounts[id] = !current ? count + 1 : count - 1;
    });
  }

  void _openReportSheet() {
    HapticFeedback.mediumImpact();
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
              "time": "Just now",
              "status": "Pending",
              "imageUrl":
                  "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=300&auto=format&fit=crop&q=80",
            });
          });
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).padding.bottom;
    final navBottomPosition = bottomInset > 0 ? bottomInset + 10.0 : 16.0;

    return Scaffold(
      backgroundColor: AppleTheme.background,
      body: Stack(
        children: [
          // Main Scrollable Page Area with IndexedStack
          Positioned.fill(
            child: IndexedStack(
              index: _currentNavIndex,
              children: [
                _buildHomeScreen(navBottomPosition + 76),
                _buildExploreScreen(navBottomPosition + 76),
                _buildMessagesScreen(navBottomPosition + 76),
                _buildProfileScreen(navBottomPosition + 76),
              ],
            ),
          ),

          // Stitch Styled Floating Bottom Navigation Bar
          Positioned(
            left: 16,
            right: 16,
            bottom: navBottomPosition,
            child: _buildStitchBottomBar(),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // 1. HOME SCREEN (Setu Home - Redesigned Card)
  // ==========================================
  Widget _buildHomeScreen(double bottomPadding) {
    return SingleChildScrollView(
      key: const ValueKey('home-screen'),
      physics: const BouncingScrollPhysics(),
      padding: EdgeInsets.fromLTRB(20, 0, 20, bottomPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(height: MediaQuery.of(context).padding.top + 12),

          // Top App Bar: "Setu." + Notifications
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              ElasticPressable(
                onTap: () {},
                child: const Text(
                  'Setu.',
                  style: AppleTheme.brandTitle,
                ),
              ),
              ElasticPressable(
                pressedScale: 0.92,
                onTap: () {
                  HapticFeedback.selectionClick();
                  setState(() => _currentNavIndex = 2); // Switch to updates
                },
                child: Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white,
                    border: Border.all(color: AppleTheme.borderLight),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.03),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.notifications_none,
                      size: 22,
                      color: AppleTheme.primary,
                    ),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Greeting Section
          const Text(
            'Namaste, Rampal',
            style: AppleTheme.displayLg,
          ),
          const SizedBox(height: 4),
          const Text(
            "Let's make our city better today.",
            style: AppleTheme.cardSubtitle,
          ),

          const SizedBox(height: 24),

          // Primary Action Card (Bento Style) - Solid Black Hero
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              color: AppleTheme.cardDark,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.14),
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
                        Text(
                          'Report Issue',
                          style: AppleTheme.cardTitle,
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Make your city better.',
                          style: AppleTheme.cardSubtitle,
                        ),
                      ],
                    ),
                    // Circular North-East Arrow Button
                    ElasticPressable(
                      pressedScale: 0.92,
                      onTap: _openReportSheet,
                      child: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white.withValues(alpha: 0.18),
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.north_east,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 26),

                // Full-width White "Take Photo" Button with Google Icon
                ElasticPressable(
                  pressedScale: 0.97,
                  onTap: _openReportSheet,
                  child: Container(
                    width: double.infinity,
                    height: 52,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.06),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.photo_camera,
                          color: AppleTheme.primary,
                          size: 20,
                        ),
                        SizedBox(width: 8),
                        Text(
                          'Take Photo',
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: AppleTheme.primary,
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

          // Nearby Issues Section Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Nearby Issues',
                style: AppleTheme.sectionHeader,
              ),
              ElasticPressable(
                pressedScale: 0.92,
                onTap: () {
                  HapticFeedback.selectionClick();
                  setState(() => _currentNavIndex = 1);
                },
                child: Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white,
                    border: Border.all(color: AppleTheme.borderLight),
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.chevron_right,
                      size: 20,
                      color: AppleTheme.textSecondary,
                    ),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          // Nearby Issues List
          ListView.separated(
            shrinkWrap: true,
            padding: EdgeInsets.zero,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _nearbyIssues.length,
            separatorBuilder: (context, index) => const SizedBox(height: 10),
            itemBuilder: (context, index) {
              final issue = _nearbyIssues[index];
              return _buildNearbyIssueItem(issue);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildNearbyIssueItem(Map<String, dynamic> issue) {
    final status = issue["status"] as String;
    Color badgeBg = AppleTheme.badgePendingBg;
    Color badgeText = AppleTheme.badgePendingText;
    Color badgeBorder = AppleTheme.badgePendingBorder;

    if (status.toLowerCase() == 'reviewed') {
      badgeBg = AppleTheme.badgeReviewedBg;
      badgeText = AppleTheme.badgeReviewedText;
      badgeBorder = AppleTheme.badgeReviewedBorder;
    } else if (status.toLowerCase() == 'resolved') {
      badgeBg = AppleTheme.badgeResolvedBg;
      badgeText = AppleTheme.badgeResolvedText;
      badgeBorder = AppleTheme.badgeResolvedBorder;
    }

    return ElasticPressable(
      pressedScale: 0.98,
      onTap: () => _showIssueDetailDialog(issue),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppleTheme.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppleTheme.borderLight),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            // Thumbnail Image
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.network(
                issue["imageUrl"] as String,
                width: 50,
                height: 50,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  width: 50,
                  height: 50,
                  color: AppleTheme.surfaceContainerLow,
                  child: const Icon(
                    Icons.image_outlined,
                    color: AppleTheme.textMuted,
                    size: 22,
                  ),
                ),
              ),
            ),

            const SizedBox(width: 14),

            // Title & Timestamp
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    issue["title"] as String,
                    style: AppleTheme.itemTitle,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 3),
                  Text(
                    issue["time"] as String,
                    style: AppleTheme.itemSubtitle,
                  ),
                ],
              ),
            ),

            const SizedBox(width: 8),

            // Pastel Status Badge (From Stitch)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: badgeBg,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: badgeBorder),
              ),
              child: Text(
                status,
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: badgeText,
                  letterSpacing: 0.2,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================
  // 2. EXPLORE SCREEN (Explore - Community Feed)
  // ==========================================
  Widget _buildExploreScreen(double bottomPadding) {
    final filteredReports = _exploreTab == 'forYou'
        ? _exploreReports
        : _exploreReports.where((r) => r["isFollowing"] == true).toList();

    return Column(
      children: [
        // Sticky Header with Blurred Backdrop
        ClipRect(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
            child: Container(
              color: Colors.white.withValues(alpha: 0.88),
              padding: EdgeInsets.only(
                top: MediaQuery.of(context).padding.top + 8,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                    child: Text(
                      'Explore',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        color: AppleTheme.primary,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ),

                  // Tab Switcher ("For you" vs "Following")
                  Container(
                    decoration: const BoxDecoration(
                      border: Border(
                        bottom: BorderSide(color: AppleTheme.borderLight),
                      ),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: ElasticPressable(
                            pressedScale: 0.96,
                            onTap: () {
                              HapticFeedback.selectionClick();
                              setState(() => _exploreTab = 'forYou');
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                border: Border(
                                  bottom: BorderSide(
                                    color: _exploreTab == 'forYou'
                                        ? AppleTheme.primary
                                        : Colors.transparent,
                                    width: 2,
                                  ),
                                ),
                              ),
                              child: Center(
                                child: Text(
                                  'For you',
                                  style: TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 14,
                                    fontWeight: _exploreTab == 'forYou'
                                        ? FontWeight.w700
                                        : FontWeight.w500,
                                    color: _exploreTab == 'forYou'
                                        ? AppleTheme.primary
                                        : AppleTheme.textSecondary,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: ElasticPressable(
                            pressedScale: 0.96,
                            onTap: () {
                              HapticFeedback.selectionClick();
                              setState(() => _exploreTab = 'following');
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                border: Border(
                                  bottom: BorderSide(
                                    color: _exploreTab == 'following'
                                        ? AppleTheme.primary
                                        : Colors.transparent,
                                    width: 2,
                                  ),
                                ),
                              ),
                              child: Center(
                                child: Text(
                                  'Following',
                                  style: TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 14,
                                    fontWeight: _exploreTab == 'following'
                                        ? FontWeight.w700
                                        : FontWeight.w500,
                                    color: _exploreTab == 'following'
                                        ? AppleTheme.primary
                                        : AppleTheme.textSecondary,
                                  ),
                                ),
                              ),
                            ),
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

        // Scrollable Feed
        Expanded(
          child: filteredReports.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 60,
                        height: 60,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: Color(0xFFF3F4F6),
                        ),
                        child: const Icon(
                          Icons.bookmark_border_rounded,
                          size: 28,
                          color: AppleTheme.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 14),
                      const Text(
                        'No followed reports yet',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppleTheme.primary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Follow reports in "For you" to track them here.',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 13,
                          color: AppleTheme.textSecondary,
                        ),
                      ),
                    ],
                  ),
                )
              : ListView.separated(
                  physics: const BouncingScrollPhysics(),
                  padding: EdgeInsets.fromLTRB(0, 8, 0, bottomPadding),
                  itemCount: filteredReports.length,
                  separatorBuilder: (context, index) => Container(
                    height: 1,
                    color: AppleTheme.borderLight,
                  ),
                  itemBuilder: (context, index) {
                    final report = filteredReports[index];
                    return _buildExploreFeedCard(report);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildExploreFeedCard(Map<String, dynamic> item) {
    final reportId = item["id"] as String;
    final isLiked = _isLiked[reportId] ?? false;
    final likeCount = _likeCounts[reportId] ?? 0;
    final mediaList = (item["media"] as List<dynamic>?) ?? [];
    final activeIdx = _activeMediaIndexes[reportId] ?? 0;
    final isFollowing = item["isFollowing"] == true;

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Author Header
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppleTheme.surfaceContainerLow,
                  border: Border.all(color: AppleTheme.borderLight),
                ),
                child: Center(
                  child: Text(
                    item["authorInitials"] as String,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppleTheme.primary,
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
                        fontFamily: 'Inter',
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppleTheme.primary,
                      ),
                    ),
                    Text(
                      item["date"] as String,
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 12,
                        color: AppleTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              // Follow bookmark button
              ElasticPressable(
                pressedScale: 0.9,
                onTap: () => _toggleFollow(reportId),
                child: Icon(
                  isFollowing
                      ? Icons.bookmark_rounded
                      : Icons.bookmark_border_rounded,
                  color: isFollowing
                      ? AppleTheme.primary
                      : AppleTheme.textSecondary,
                  size: 22,
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Post Description
          Text(
            item["description"] as String,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 14,
              fontWeight: FontWeight.w400,
              height: 1.45,
              color: AppleTheme.textPrimary,
            ),
          ),

          // Media (Single or Carousel)
          if (mediaList.isNotEmpty) ...[
            const SizedBox(height: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: mediaList.length == 1
                  ? AspectRatio(
                      aspectRatio: 16 / 9,
                      child: Image.network(
                        mediaList[0]["url"] as String,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          color: AppleTheme.surfaceContainerLow,
                          child: const Icon(Icons.image,
                              color: AppleTheme.textMuted),
                        ),
                      ),
                    )
                  : SizedBox(
                      height: 220,
                      child: Stack(
                        children: [
                          PageView.builder(
                            itemCount: mediaList.length,
                            onPageChanged: (idx) {
                              setState(
                                  () => _activeMediaIndexes[reportId] = idx);
                            },
                            itemBuilder: (context, mIdx) {
                              return Image.network(
                                mediaList[mIdx]["url"] as String,
                                fit: BoxFit.cover,
                              );
                            },
                          ),
                          // Multi-photo indicator
                          Positioned(
                            bottom: 8,
                            right: 8,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: 0.65),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Text(
                                '${activeIdx + 1}/${mediaList.length}',
                                style: const TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 11,
                                  color: Colors.white,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
            ),
          ],

          const SizedBox(height: 12),

          // Action Bar (Thumbs Up / Share) with Google Icons
          Container(
            padding: const EdgeInsets.only(top: 8),
            decoration: const BoxDecoration(
              border: Border(
                top: BorderSide(color: Color(0xFFF3F4F6)),
              ),
            ),
            child: Row(
              children: [
                ElasticPressable(
                  pressedScale: 0.92,
                  onTap: () => _toggleLike(reportId),
                  child: Row(
                    children: [
                      Icon(
                        isLiked ? Icons.thumb_up : Icons.thumb_up_outlined,
                        size: 18,
                        color: isLiked
                            ? AppleTheme.primary
                            : AppleTheme.textSecondary,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '$likeCount',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 13,
                          fontWeight:
                              isLiked ? FontWeight.w700 : FontWeight.w500,
                          color: isLiked
                              ? AppleTheme.primary
                              : AppleTheme.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                const Spacer(),
                ElasticPressable(
                  pressedScale: 0.92,
                  onTap: () {
                    HapticFeedback.selectionClick();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Report link copied to clipboard!'),
                        duration: Duration(seconds: 1),
                      ),
                    );
                  },
                  child: const Row(
                    children: [
                      Icon(
                        Icons.share_outlined,
                        size: 18,
                        color: AppleTheme.textSecondary,
                      ),
                      SizedBox(width: 4),
                      Text(
                        'Share',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: AppleTheme.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // 3. MESSAGES SCREEN (Messages & Updates)
  // ==========================================
  Widget _buildMessagesScreen(double bottomPadding) {
    return Column(
      children: [
        // Sticky Header
        ClipRect(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
            child: Container(
              padding: EdgeInsets.only(
                top: MediaQuery.of(context).padding.top + 12,
                bottom: 12,
                left: 20,
                right: 20,
              ),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.88),
                border: const Border(
                  bottom: BorderSide(color: AppleTheme.borderLight),
                ),
              ),
              child: const Row(
                children: [
                  Text(
                    'Messages',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: AppleTheme.primary,
                      letterSpacing: -0.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),

        // Messages List
        Expanded(
          child: ListView.separated(
            physics: const BouncingScrollPhysics(),
            padding: EdgeInsets.fromLTRB(0, 8, 0, bottomPadding),
            itemCount: _messages.length,
            separatorBuilder: (context, index) => Container(
              height: 1,
              color: AppleTheme.borderLight,
            ),
            itemBuilder: (context, index) {
              final msg = _messages[index];
              return _buildMessageItem(msg);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildMessageItem(Map<String, dynamic> msg) {
    final bool isUnread = msg["unread"] == true;

    return ElasticPressable(
      pressedScale: 0.98,
      onTap: () {
        HapticFeedback.selectionClick();
        _showMessageDetailSheet(msg);
      },
      child: Container(
        color: isUnread ? const Color(0xFFFAFAFA) : Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Avatar with Google Icon
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: msg["avatarColor"] as Color,
                border: Border.all(color: AppleTheme.borderLight),
              ),
              child: Center(
                child: Icon(
                  msg["icon"] as IconData,
                  color: msg["iconColor"] as Color,
                  size: 22,
                ),
              ),
            ),

            const SizedBox(width: 14),

            // Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        msg["sender"] as String,
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 15,
                          fontWeight:
                              isUnread ? FontWeight.w800 : FontWeight.w600,
                          color: AppleTheme.primary,
                        ),
                      ),
                      Text(
                        msg["time"] as String,
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 12,
                          fontWeight:
                              isUnread ? FontWeight.w700 : FontWeight.w400,
                          color: isUnread
                              ? AppleTheme.primary
                              : AppleTheme.textSecondary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 3),
                  Text(
                    msg["message"] as String,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 13,
                      fontWeight:
                          isUnread ? FontWeight.w600 : FontWeight.w400,
                      color: isUnread
                          ? AppleTheme.textPrimary
                          : AppleTheme.textSecondary,
                      height: 1.35,
                    ),
                  ),
                ],
              ),
            ),

            if (isUnread) ...[
              const SizedBox(width: 10),
              Container(
                width: 20,
                height: 20,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppleTheme.primary,
                ),
                child: const Center(
                  child: Text(
                    '1',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  void _showMessageDetailSheet(Map<String, dynamic> msg) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 5,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE5E7EB),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: msg["avatarColor"] as Color,
                    ),
                    child: Center(
                      child: Icon(
                        msg["icon"] as IconData,
                        color: msg["iconColor"] as Color,
                        size: 22,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        msg["sender"] as String,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppleTheme.primary,
                        ),
                      ),
                      Text(
                        msg["time"] as String,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 12,
                          color: AppleTheme.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF9FAFB),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppleTheme.borderLight),
                ),
                child: Text(
                  msg["message"] as String,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 14,
                    height: 1.5,
                    color: AppleTheme.textPrimary,
                  ),
                ),
              ),
              const SizedBox(height: 20),
              ElasticPressable(
                pressedScale: 0.96,
                onTap: () => Navigator.pop(context),
                child: Container(
                  width: double.infinity,
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppleTheme.primary,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Center(
                    child: Text(
                      'Dismiss',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // ==========================================
  // 4. PROFILE SCREEN (User Profile)
  // ==========================================
  Widget _buildProfileScreen(double bottomPadding) {
    return SingleChildScrollView(
      key: const ValueKey('profile-screen'),
      physics: const BouncingScrollPhysics(),
      padding: EdgeInsets.fromLTRB(20, 0, 20, bottomPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(height: MediaQuery.of(context).padding.top + 12),

          // Top Header
          const Text(
            'Profile',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: AppleTheme.primary,
              letterSpacing: -0.5,
            ),
          ),

          const SizedBox(height: 24),

          // Profile Summary: Avatar & Name
          Center(
            child: Column(
              children: [
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: AppleTheme.borderLight, width: 2),
                    image: const DecorationImage(
                      image: NetworkImage(
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
                      ),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Alex Chen',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                    color: AppleTheme.primary,
                    letterSpacing: -0.4,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Bento Card: PERSONAL DETAILS
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppleTheme.surface,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppleTheme.borderLight),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.02),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'PERSONAL DETAILS',
                  style: AppleTheme.labelMd,
                ),
                const SizedBox(height: 16),
                _buildProfileRow(
                  icon: Icons.call_outlined,
                  label: 'Phone',
                  value: '+91 98765 43210',
                ),
                const Divider(height: 24, color: Color(0xFFF3F4F6)),
                _buildProfileRow(
                  icon: Icons.badge_outlined,
                  label: 'Aadhaar Number',
                  value: 'XXXX XXXX 1234',
                ),
                const Divider(height: 24, color: Color(0xFFF3F4F6)),
                _buildProfileRow(
                  icon: Icons.location_on_outlined,
                  label: 'Location',
                  value: 'Pattikalyana',
                ),
                const Divider(height: 24, color: Color(0xFFF3F4F6)),
                _buildProfileRow(
                  icon: Icons.calendar_today_outlined,
                  label: 'Date of Birth',
                  value: '26 years old',
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Settings List Container (Matching profile.html)
          Container(
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppleTheme.surface,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppleTheme.borderLight),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.02),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: double.infinity,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: const BoxDecoration(
                    color: Color(0xFFFAFAFA),
                    borderRadius:
                        BorderRadius.vertical(top: Radius.circular(18)),
                    border: Border(
                      bottom: BorderSide(color: AppleTheme.borderLight),
                    ),
                  ),
                  child: const Text(
                    'Account Settings',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppleTheme.primary,
                    ),
                  ),
                ),
                _buildSettingsRow(
                  icon: Icons.assignment_outlined,
                  title: 'My Reports',
                  onTap: () {
                    HapticFeedback.selectionClick();
                    setState(() => _currentNavIndex = 1);
                  },
                ),
                const Divider(height: 1, color: AppleTheme.borderLight),
                _buildSettingsRow(
                  icon: Icons.person_outline,
                  title: 'Personal Information',
                  onTap: () {},
                ),
                const Divider(height: 1, color: AppleTheme.borderLight),
                _buildSettingsRow(
                  icon: Icons.notifications_none,
                  title: 'Notification Preferences',
                  onTap: () {},
                ),
                const Divider(height: 1, color: AppleTheme.borderLight),
                _buildSettingsRow(
                  icon: Icons.lock_outline,
                  title: 'Privacy & Security',
                  onTap: () {},
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileRow({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Row(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
            color: Color(0xFFF3F4F6),
          ),
          child: Center(
            child: Icon(
              icon,
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
                fontFamily: 'Inter',
                fontSize: 12,
                color: AppleTheme.textSecondary,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 1),
            Text(
              value,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: AppleTheme.textPrimary,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSettingsRow({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return ElasticPressable(
      pressedScale: 0.98,
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Icon(
              icon,
              size: 20,
              color: AppleTheme.textSecondary,
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: AppleTheme.textPrimary,
                ),
              ),
            ),
            const Icon(
              Icons.chevron_right,
              size: 18,
              color: AppleTheme.textSecondary,
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================
  // 5. STITCH BOTTOM NAVIGATION BAR
  // ==========================================
  Widget _buildStitchBottomBar() {
    return Container(
      height: 64,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: AppleTheme.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 20,
            offset: const Offset(0, 6),
          ),
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          // 1. Home
          _buildNavItem(
            index: 0,
            activeIcon: Icons.home,
            inactiveIcon: Icons.home_outlined,
            label: 'Home',
          ),

          // 2. Explore
          _buildNavItem(
            index: 1,
            activeIcon: Icons.explore,
            inactiveIcon: Icons.explore_outlined,
            label: 'Explore',
          ),

          // 3. Center (+) / (★) Morphing Action Button
          SpinMorphActionButton(
            animation: _morphAnimation,
            onTap: () {
              HapticFeedback.mediumImpact();
              if (_currentNavIndex == 0) {
                _openReportSheet();
              } else {
                _showCivicSpotlightSheet();
              }
            },
          ),

          // 4. Messages / Updates
          _buildNavItem(
            index: 2,
            activeIcon: Icons.chat_bubble,
            inactiveIcon: Icons.chat_bubble_outline,
            label: 'Messages',
          ),

          // 5. Profile
          _buildNavItem(
            index: 3,
            activeIcon: Icons.person,
            inactiveIcon: Icons.person_outline,
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem({
    required int index,
    required IconData activeIcon,
    required IconData inactiveIcon,
    required String label,
  }) {
    final bool isSelected = _currentNavIndex == index;

    return ElasticPressable(
      pressedScale: 0.9,
      onTap: () => _onNavIndexChanged(index),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppleTheme.secondaryContainer : Colors.transparent,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Icon(
          isSelected ? activeIcon : inactiveIcon,
          size: 22,
          color: isSelected ? AppleTheme.primary : AppleTheme.textSecondary,
        ),
      ),
    );
  }

  /// Apple-styled modal sheet for Civic Star Actions & AI Spotlight
  void _showCivicSpotlightSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: EdgeInsets.fromLTRB(
            24,
            12,
            24,
            MediaQuery.of(context).padding.bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Pull Bar
              Center(
                child: Container(
                  width: 38,
                  height: 4.5,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE5E7EB),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Title Header with Star Badge
              Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.black,
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.auto_awesome,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Setu Civic Spotlight',
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 19,
                            fontWeight: FontWeight.w800,
                            color: AppleTheme.primary,
                            letterSpacing: -0.4,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'AI insights & quick ward actions',
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 13,
                            fontWeight: FontWeight.w400,
                            color: AppleTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  ElasticPressable(
                    pressedScale: 0.9,
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      width: 32,
                      height: 32,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Color(0xFFF3F4F6),
                      ),
                      child: const Icon(
                        Icons.close,
                        size: 18,
                        color: AppleTheme.textSecondary,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 22),

              // Spotlight Action 1: Ask Setu AI Assistant
              _buildSpotlightActionTile(
                icon: Icons.auto_awesome_outlined,
                iconBg: const Color(0xFFEFF6FF),
                iconColor: const Color(0xFF2563EB),
                title: 'Ask Setu AI Assistant',
                description: 'Get instant answers on ward issues, schemes & status',
                onTap: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Setu AI Assistant ready! ✨'),
                      duration: Duration(seconds: 2),
                    ),
                  );
                },
              ),
              const SizedBox(height: 12),

              // Spotlight Action 2: Quick Photo Report
              _buildSpotlightActionTile(
                icon: Icons.photo_camera_outlined,
                iconBg: const Color(0xFFFEF3C7),
                iconColor: const Color(0xFFD97706),
                title: 'Quick Photo Report',
                description: 'Capture or upload problem evidence directly',
                onTap: () {
                  Navigator.pop(context);
                  _openReportSheet();
                },
              ),
              const SizedBox(height: 12),

              // Spotlight Action 3: Community Leaderboard
              _buildSpotlightActionTile(
                icon: Icons.emoji_events_outlined,
                iconBg: const Color(0xFFDCFCE7),
                iconColor: const Color(0xFF16A34A),
                title: 'Civic Leaderboard & Badges',
                description: 'Check top citizen contributors in Pattikalyana',
                onTap: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('You are in Top 5% contributors this month! 🏆'),
                      duration: Duration(seconds: 2),
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSpotlightActionTile({
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String title,
    required String description,
    required VoidCallback onTap,
  }) {
    return ElasticPressable(
      pressedScale: 0.97,
      onTap: () {
        HapticFeedback.selectionClick();
        onTap();
      },
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: const Color(0xFFF9FAFB),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppleTheme.borderLight),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: iconBg,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: iconColor, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: AppleTheme.primary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    description,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: AppleTheme.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.chevron_right,
              size: 20,
              color: AppleTheme.textSecondary,
            ),
          ],
        ),
      ),
    );
  }

  void _showIssueDetailDialog(Map<String, dynamic> issue) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 5,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE5E7EB),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.network(
                      issue["imageUrl"] as String,
                      width: 64,
                      height: 64,
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          issue["title"] as String,
                          style: const TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: AppleTheme.primary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          issue["location"] as String,
                          style: const TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 13,
                            color: AppleTheme.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          issue["time"] as String,
                          style: const TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 12,
                            color: AppleTheme.textMuted,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              ElasticPressable(
                pressedScale: 0.96,
                onTap: () => Navigator.pop(context),
                child: Container(
                  width: double.infinity,
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppleTheme.primary,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Center(
                    child: Text(
                      'Close',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
