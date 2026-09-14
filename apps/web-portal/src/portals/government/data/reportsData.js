// Comprehensive Civic Reports Database for Setu Government Portal
export const REPORTS_DATA = {
  'SETU-8421': {
    id: '#SETU-8421',
    cleanId: 'SETU-8421',
    title: 'Water Contamination (Fluoride & Heavy Iron Contamination in Village Tubewells)',
    category: 'Water & Drinking Sanitation',
    urgency: 'HIGH',
    status: 'Requires Triage',
    district: 'Ranchi',
    ward: 'Ward 4, Namkum, Ranchi',
    reportedAt: '2 hours ago · 13 Sep 2026, 16:30 IST',
    citizenCount: 228,
    desc: 'Groundwater extraction from three municipal handpumps in Ward 4 showing orange-tinted sediment and high chemical odor. Multiple households reporting skin irritation and turbidity. Water tanker emergency deployment delayed; BIT Mesra Water Tech lab requested for rapid chemical testing and field verification.',
    userProfile: {
      name: 'Rohan Soren',
      avatarText: 'RS',
      avatarBg: '#0f766e',
      roleTag: 'Verified Resident · Ward 4 Namkum',
      aadhaarStatus: 'Aadhaar Verified Citizen',
      aadhaarMasked: 'UIDAI **** **** 3821',
      trustScore: 98,
      karma: 'Tier-1 Civic Contributor',
      submissionsCount: 5,
      resolvedCount: 3,
      phone: '+91 98351 •••••',
      joined: 'March 2025'
    },
    media: [
      {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1000&auto=format&fit=crop&q=80',
        caption: 'Handpump output showing visible sediment discoloration and turbidity test vial'
      },
      {
        url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=1000&auto=format&fit=crop&q=80',
        caption: 'Field test strip showing severe iron and fluoride concentration levels (>2.8mg/L)'
      },
      {
        url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1000&auto=format&fit=crop&q=80',
        caption: 'Sediment residue settling in household storage containers after 30 minutes'
      }
    ],
    gps: {
      lat: 23.3441,
      lng: 85.3096,
      locationName: 'Namkum Gram Panchayat, Ranchi District',
      geofenceVerified: true
    },
    insights: {
      taraScore: 4.8,
      healthHazard: 'Severe Acute Risk — Fluoride (>2.8 mg/L) & Dissolved Iron exceeding WHO/BIS standards',
      affectedPopulation: '~1,450 residents relying on 3 clustered tubewells',
      audioDuration: '0:42 min',
      languageModel: 'Saaras V3 STT (Nagpuri/Hindi Dialect · 98.4% Confidence)',
      transcriptOriginal: 'गाँव के तीन चापाकल से लाल-पीला पानी निकल रहा है, दुर्गंध भी बहुत आ रही है। बच्चे बीमार पड़ रहे हैं, तुरंत जांच और पीने का साफ पानी का टैंकर भेजिए।',
      transcriptEnglish: 'Yellowish-red water is coming from three village handpumps with a heavy chemical odor. Children in our tola have fallen sick with stomach cramps. Please send testing kits and clean drinking water tankers immediately.',
      clusteringNote: '228 citizen submissions clustered within 1.2km radius in Namkum. Auto-merged to avoid departmental duplicate ticket backlogs.',
      costEstimate: '₹45,000 (Field sampling, titration & emergency tanker supply)'
    },
    suggestedUniLabs: [
      {
        id: 'bit-mesra-water',
        university: 'BIT Mesra (Birla Institute of Technology)',
        labName: 'Advanced Water Quality & Environmental Nanotechnology Lab',
        location: 'Mesra, Ranchi (14 km away)',
        headName: 'Dr. Arvind Swaminathan',
        headRole: 'Professor & Chair, Chemical Engineering',
        matchScore: 97,
        capabilities: ['ICP-MS Heavy Metal Spectroscopy', 'Rapid Fluoride Titration Kits', 'Mobile Water Testing Van'],
        turnaround: '24 Hours',
        recommendedAction: 'Dispatch Mobile Water Lab & Field Titration Kit',
        grantBudget: '₹45,000',
        status: 'Available'
      },
      {
        id: 'iit-ism-env',
        university: 'IIT (ISM) Dhanbad',
        labName: 'Centre for Mine Water Effluents & Groundwater Hydrology',
        location: 'Dhanbad Campus (145 km away)',
        headName: 'Prof. Sneha Banerjee',
        headRole: 'Head of Environmental Science',
        matchScore: 91,
        capabilities: ['Groundwater Aquifer Contamination Mapping', 'Deep Borewell Isotope Testing'],
        turnaround: '48 Hours',
        recommendedAction: 'Request Aquifer Hydrogeology Assessment',
        grantBudget: '₹75,000',
        status: 'Available'
      },
      {
        id: 'nit-jsr-purification',
        university: 'NIT Jamshedpur',
        labName: 'Rural Water Treatment & Clean Tech R&D Cell',
        location: 'Adityapur, Jamshedpur (110 km away)',
        headName: 'Dr. R. K. Mahato',
        headRole: 'Lead Scientist, Civil Eng Dept',
        matchScore: 86,
        capabilities: ['Low-Cost Community Graphene/Sand Filters', 'Solar Water Disinfection Units'],
        turnaround: '3 - 5 Days',
        recommendedAction: 'Design Permanent Community Filter Prototype',
        grantBudget: '₹1,20,000',
        status: 'Available'
      }
    ]
  },

  'SETU-8390': {
    id: '#SETU-8390',
    cleanId: 'SETU-8390',
    title: 'Pothole & Road Collapse on Culvert Edge (NH-32 Connector)',
    category: 'Roads, Potholes & Infrastructure',
    urgency: 'CRITICAL',
    status: 'Field Team Assigned',
    district: 'Dhanbad',
    ward: 'Govindpur Market / NH-32 Connector',
    reportedAt: '4 hours ago · 13 Sep 2026, 14:15 IST',
    citizenCount: 89,
    desc: 'Heavy monsoon drainage runoff cracked the asphalt substructure on the western culvert approach near Govindpur market intersection. Exposed gravel and severe depression causing heavy transport vehicle blockages. Road barricading and rapid patch team deployed on-site.',
    userProfile: {
      name: 'Priya Mahato',
      avatarText: 'PM',
      avatarBg: '#0369a1',
      roleTag: 'Govindpur Merchant Association Member',
      aadhaarStatus: 'Aadhaar Verified Citizen',
      aadhaarMasked: 'UIDAI **** **** 9104',
      trustScore: 96,
      karma: 'Active Reporter',
      submissionsCount: 3,
      resolvedCount: 2,
      phone: '+91 94311 •••••',
      joined: 'January 2025'
    },
    media: [
      {
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1000&auto=format&fit=crop&q=80',
        caption: 'Culvert approach road subsidence with asphalt cracks exceeding 2 feet depth'
      },
      {
        url: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=1000&auto=format&fit=crop&q=80',
        caption: 'Undermined foundation edge near Govindpur market culvert drainage'
      }
    ],
    gps: {
      lat: 23.8342,
      lng: 86.5189,
      locationName: 'Govindpur NH-32 Culvert Approach, Dhanbad',
      geofenceVerified: true
    },
    insights: {
      taraScore: 4.9,
      healthHazard: 'High Accident Danger — Heavy freight trucks skidding, risk of complete culvert collapse',
      affectedPopulation: '~8,000 daily commuters and freight carriers',
      audioDuration: '0:35 min',
      languageModel: 'Saaras V3 STT (Khortha/Hindi Dialect · 99.1% Confidence)',
      transcriptOriginal: 'गोविंदपुर बाजार के पास एनएच-32 पुलिया का किनारा पूरी तरह धंस गया है। कल रात एक ट्रक बाल-बाल पलटने से बचा है, तुरंत बैरिकेडिंग और मरम्मत करवाएं।',
      transcriptEnglish: 'The culvert edge near Govindpur market on NH-32 has completely collapsed after yesterday rains. A freight truck almost overturned last night. Please deploy barricading and emergency concrete patching.',
      clusteringNote: '89 complaints clustered along the 500m approach segment. Automatically routed to PWD Dhanbad Division.',
      costEstimate: '₹85,000 (Rapid polymer concrete patch & foundation reinforcement)'
    },
    suggestedUniLabs: [
      {
        id: 'iit-ism-civil',
        university: 'IIT (ISM) Dhanbad',
        labName: 'Geotechnical & Highway Infrastructure Testing Centre',
        location: 'Dhanbad Campus (12 km away)',
        headName: 'Prof. K. M. Singh',
        headRole: 'Head of Civil Engineering',
        matchScore: 98,
        capabilities: ['Sub-surface Ground Penetrating Radar (GPR)', 'Rapid Concrete Polymer Fillers', 'Bridge Load Testing'],
        turnaround: '12 Hours',
        recommendedAction: 'Deploy Ground Radar Scan to Detect Voids under Culvert',
        grantBudget: '₹50,000',
        status: 'Available'
      },
      {
        id: 'bit-sindri-highway',
        university: 'BIT Sindri',
        labName: 'Department of Transportation & Structural Materials',
        location: 'Sindri, Dhanbad (28 km away)',
        headName: 'Dr. Anita Tirkey',
        headRole: 'Associate Professor, Highway Lab',
        matchScore: 89,
        capabilities: ['Bitumen Subgrade Compaction Testing', 'Monsoon Drainage Runoff Modeling'],
        turnaround: '24 Hours',
        recommendedAction: 'Conduct Compaction & Asphalt Mixture Test',
        grantBudget: '₹35,000',
        status: 'Available'
      }
    ]
  },

  'SETU-8314': {
    id: '#SETU-8314',
    cleanId: 'SETU-8314',
    title: 'Solar Micro-Grid Inverter & Battery Bank Breakdown (Tribal Ashram Residential School)',
    category: 'Electricity & Tribal Solar Micro-Grids',
    urgency: 'MEDIUM',
    status: 'Under Lab R&D',
    district: 'Khunti',
    ward: 'Torpa Block, Ashram Campus',
    reportedAt: '6 hours ago · 13 Sep 2026, 12:40 IST',
    citizenCount: 65,
    desc: '5kVA hybrid solar inverter tripping continuously under baseline load. Battery water level depleted and charge controller circuit burnt due to voltage spike. IIT Dhanbad research team assigned for low-cost controller repair and local technician skill transfer.',
    userProfile: {
      name: 'Sunil Marandi',
      avatarText: 'SM',
      avatarBg: '#7c3aed',
      roleTag: 'Head Warden · Torpa Ashram Residential School',
      aadhaarStatus: 'Aadhaar Verified Citizen',
      aadhaarMasked: 'UIDAI **** **** 6221',
      trustScore: 99,
      karma: 'Community Leader',
      submissionsCount: 7,
      resolvedCount: 6,
      phone: '+91 97712 •••••',
      joined: 'November 2024'
    },
    media: [
      {
        url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1000&auto=format&fit=crop&q=80',
        caption: '5kVA rooftop solar panel arrays on residential school dormitory'
      },
      {
        url: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=1000&auto=format&fit=crop&q=80',
        caption: 'Charge controller board exhibiting burnt diode circuit from thunderstorm surge'
      },
      {
        url: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=1000&auto=format&fit=crop&q=80',
        caption: 'Depleted 48V tubular lead-acid battery bank in hostel inverter room'
      }
    ],
    gps: {
      lat: 22.9834,
      lng: 85.0841,
      locationName: 'Torpa Tribal Ashram School, Khunti District',
      geofenceVerified: true
    },
    insights: {
      taraScore: 3.9,
      healthHazard: 'Moderate — 240 hostel students studying in darkness, kitchen cold-storage failure',
      affectedPopulation: '240 resident tribal students & staff',
      audioDuration: '0:48 min',
      languageModel: 'Saaras V3 STT (Mundari/Hindi Dialect · 97.8% Confidence)',
      transcriptOriginal: 'आश्रम स्कूल में बिजली नहीं है, इनवर्टर से धुआं निकला था और सब बंद हो गया। शाम को बच्चे पढ़ाई नहीं कर पा रहे हैं। कृपया कोई मिस्त्री या सोलर टीम भेजें।',
      transcriptEnglish: 'There is no electricity at the Ashram school. Smoke came out of the solar inverter and everything tripped. The children cannot study in the evenings. Please send a technician or solar engineer.',
      clusteringNote: '65 reports from teachers and local ward committee members.',
      costEstimate: '₹32,000 (MOSFET controller replacement & battery demineralized water servicing)'
    },
    suggestedUniLabs: [
      {
        id: 'nit-jsr-solar',
        university: 'NIT Jamshedpur',
        labName: 'Clean Energy & Micro-Grid Innovation Centre',
        location: 'Jamshedpur Campus (85 km away)',
        headName: 'Dr. Alok Verma',
        headRole: 'Professor, Electrical Engineering',
        matchScore: 95,
        capabilities: ['Smart Solar Charge Controller Design', 'Battery Management Systems (BMS)', 'Micro-Grid Diagnostics'],
        turnaround: '24 Hours',
        recommendedAction: 'Dispatch Student Student Innovation Cell to Install Surge-Proof Controller',
        grantBudget: '₹32,000',
        status: 'Available'
      },
      {
        id: 'iit-ism-power',
        university: 'IIT (ISM) Dhanbad',
        labName: 'Renewable Energy & Power Electronics Laboratory',
        location: 'Dhanbad Campus',
        headName: 'Dr. R. P. Gupta',
        headRole: 'Lead Renewable Tech SPOC',
        matchScore: 89,
        capabilities: ['Industrial Inverter Repair', 'High-Voltage Lightning Protection Rigs'],
        turnaround: '48 Hours',
        recommendedAction: 'Provide Replacement Controller & Surge Suppressor',
        grantBudget: '₹40,000',
        status: 'Available'
      }
    ]
  },

  'SETU-8277': {
    id: '#SETU-8277',
    cleanId: 'SETU-8277',
    title: 'Waste Accumulation & Stormwater Drainage Clog (Sakchi Central Wholesale Lane)',
    category: 'Municipal Solid Waste & Sanitation',
    urgency: 'MEDIUM',
    status: 'Scheduled Clearance',
    district: 'East Singhbhum',
    ward: 'Sakchi Central Wholesale Lane, Ward 14',
    reportedAt: '8 hours ago · 13 Sep 2026, 10:10 IST',
    citizenCount: 112,
    desc: 'Plastic waste debris, rotten produce cartons, and silt blocking main 36-inch stormwater culvert channel. Foul odor spreading and standing sewage water flooding pedestrian walkway. JNAC municipal vacuum suction unit scheduled for night clearance.',
    userProfile: {
      name: 'Gurpreet Singh',
      avatarText: 'GS',
      avatarBg: '#d97706',
      roleTag: 'Sakchi Wholesale Market Secretary',
      aadhaarStatus: 'Aadhaar Verified Citizen',
      aadhaarMasked: 'UIDAI **** **** 4892',
      trustScore: 97,
      karma: 'Civic Organizer',
      submissionsCount: 8,
      resolvedCount: 7,
      phone: '+91 93342 •••••',
      joined: 'February 2024'
    },
    media: [
      {
        url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=1000&auto=format&fit=crop&q=80',
        caption: 'Overfilled market trash bins and vegetable produce cartons spilling into drainage culvert'
      },
      {
        url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=1000&auto=format&fit=crop&q=80',
        caption: 'Standing dark sewage backflow submerging pedestrian shopping footpath'
      },
      {
        url: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=1000&auto=format&fit=crop&q=80',
        caption: 'Silt and single-use plastic clogs choking stormwater gate'
      }
    ],
    gps: {
      lat: 22.8046,
      lng: 86.2029,
      locationName: 'Sakchi Market Ward 14, Jamshedpur',
      geofenceVerified: true
    },
    insights: {
      taraScore: 3.6,
      healthHazard: 'Moderate Hygiene Hazard — Vector-borne mosquito breeding risk and foul odors impacting shops',
      affectedPopulation: '~2,500 daily market vendors and shoppers',
      audioDuration: '0:30 min',
      languageModel: 'Saaras V3 STT (Hindi Dialect · 99.4% Confidence)',
      transcriptOriginal: 'साकची बाजार की मुख्य नाली पूरी तरह कचरे से जाम हो गई है। गंदा पानी दुकानों के सामने भर गया है, बदबू से बैठना मुश्किल हो गया है।',
      transcriptEnglish: 'The main drain of Sakchi market is choked with rotten waste. Dirty wastewater is spilling in front of the shops. Please send suction super-sucker vehicles immediately.',
      clusteringNote: '112 complaints registered by market shopkeepers and visitors within 24 hours.',
      costEstimate: '₹22,000 (JNAC Super-Sucker vehicle run & microbial deodorizer spray)'
    },
    suggestedUniLabs: [
      {
        id: 'ranchi-uni-biotech',
        university: 'Ranchi University',
        labName: 'Centre for Environmental Biotechnology & Waste Management',
        location: 'Morabadi, Ranchi',
        headName: 'Dr. Vandana Prasad',
        headRole: 'Professor, Biotechnology Dept',
        matchScore: 93,
        capabilities: ['Enzymatic Sludge Degradation', 'Bio-deodorization Microbial Consortia', 'Organic Compost Digesters'],
        turnaround: '24 Hours',
        recommendedAction: 'Apply Fast-Acting Bacterial Enzyme Spray to Clear Organic Blockage',
        grantBudget: '₹25,000',
        status: 'Available'
      },
      {
        id: 'nit-jsr-waste',
        university: 'NIT Jamshedpur',
        labName: 'Urban Sanitation & Stormwater Automation Centre',
        location: 'Jamshedpur Campus (8 km away)',
        headName: 'Prof. Anup Kumar',
        headRole: 'Urban Engineering Lead',
        matchScore: 88,
        capabilities: ['Smart Ultrasonic Silt Detection Sensors', 'Automated Trash-Rack Gate Prototypes'],
        turnaround: '48 Hours',
        recommendedAction: 'Install Solar Silt-Warning Probe in Culvert',
        grantBudget: '₹40,000',
        status: 'Available'
      }
    ]
  },

  'SETU-8192': {
    id: '#SETU-8192',
    cleanId: 'SETU-8192',
    title: 'Paddy Leaf Blight Outbreak Requiring Low-Cost Sensor Diagnostics',
    category: 'Agriculture & Agritech',
    urgency: 'HIGH',
    status: 'Agritech Team Deployed',
    district: 'Ranchi',
    ward: 'Kanke Block, Mandar Village',
    reportedAt: '12 hours ago · 13 Sep 2026, 06:20 IST',
    citizenCount: 215,
    desc: 'Bacterial leaf blight spreading rapidly after unseasonal rainfall. Farmers reporting yellow lesions and drying grains. Birsa Agricultural University Agritech lab deploying multispectral camera drones and optical soil sensors to isolate infected clusters before harvesting season.',
    userProfile: {
      name: 'Mangal Oraon',
      avatarText: 'MO',
      avatarBg: '#15803d',
      roleTag: 'Mandar Kisan Co-operative Head',
      aadhaarStatus: 'Aadhaar Verified Citizen',
      aadhaarMasked: 'UIDAI **** **** 7741',
      trustScore: 99,
      karma: 'Village Agriculture Lead',
      submissionsCount: 11,
      resolvedCount: 9,
      phone: '+91 94701 •••••',
      joined: 'August 2024'
    },
    media: [
      {
        url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1000&auto=format&fit=crop&q=80',
        caption: 'Paddy leaf showing characteristic wavy bacterial blight lesion along blade margins'
      },
      {
        url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1000&auto=format&fit=crop&q=80',
        caption: 'Field inspection of 40-acre affected cluster in Mandar village'
      },
      {
        url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1000&auto=format&fit=crop&q=80',
        caption: 'Agricultural drone surveying vegetative stress indices across paddy fields'
      }
    ],
    gps: {
      lat: 23.4578,
      lng: 85.1245,
      locationName: 'Mandar Block Paddy Cluster, Ranchi',
      geofenceVerified: true
    },
    insights: {
      taraScore: 4.4,
      healthHazard: 'Severe Livelihood Impact — Risk of 60% crop yield loss across 120 smallholder farming families',
      affectedPopulation: '120 farmer families & ~180 metric tons of standing paddy',
      audioDuration: '0:52 min',
      languageModel: 'Saaras V3 STT (Kurukh/Hindi Dialect · 98.6% Confidence)',
      transcriptOriginal: 'धान के पत्तों में पीला धब्बा पड़ गया है और पत्ते सूख रहे हैं। पिछले हफ्ते की बारिश के बाद यह पूरे खेत में फैल गया है। बिरसा कृषि विश्वविद्यालय से मदद दिलवाएं।',
      transcriptEnglish: 'Paddy leaves have developed yellow lesions and are drying up rapidly after last week unseasonal rains. It is spreading across all fields. Please send agritech assistance from Birsa Agricultural University.',
      clusteringNote: '215 farmers submitted distress images via Setu WhatsApp bot & Web Portal.',
      costEstimate: '₹60,000 (Drone multispectral scanning & bio-bactericide dispersion)'
    },
    suggestedUniLabs: [
      {
        id: 'bau-plant-path',
        university: 'Birsa Agricultural University (BAU)',
        labName: 'Division of Plant Pathology & Precision Agritech Drone Hub',
        location: 'Kanke, Ranchi (18 km away)',
        headName: 'Dr. Rameshwar Mahto',
        headRole: 'Chief Plant Pathologist & Dean of Agriculture',
        matchScore: 99,
        capabilities: ['Multispectral Drone NDVI Mapping', 'Bacterial DNA Colony PCR Testing', 'Organic Copper Bio-bactericide Formulation'],
        turnaround: '18 Hours',
        recommendedAction: 'Deploy BAU Drone Fleet for Precision Bio-Fungicide Spraying',
        grantBudget: '₹60,000',
        status: 'Available'
      },
      {
        id: 'icar-eastern',
        university: 'ICAR Research Complex for Eastern Region',
        labName: 'Centre for Resilient Farming Systems & Crop Health',
        location: 'Plandu, Ranchi (25 km away)',
        headName: 'Dr. Sujit Mondal',
        headRole: 'Principal Scientist (Crops)',
        matchScore: 92,
        capabilities: ['Blight-Resistant Seed Replacement Stock', 'Micro-Nutrient Soil Foliar Sprays'],
        turnaround: '24 Hours',
        recommendedAction: 'Supply Resistant Certified Seed Subsidy Package',
        grantBudget: '₹90,000',
        status: 'Available'
      }
    ]
  }
};

// Fallback generator for ticket IDs like #SETU-9842, #SETU-9839, etc.
export const getReportById = (id) => {
  if (!id) return null;
  const clean = id.replace('#', '').trim();
  if (REPORTS_DATA[clean]) return REPORTS_DATA[clean];

  // If ID not found directly, map to the closest archetype
  if (clean.includes('9842')) {
    return {
      ...REPORTS_DATA['SETU-8421'],
      id: '#SETU-9842',
      cleanId: 'SETU-9842',
      title: 'Water Contamination - Fluoride Spike in Village Handpump',
      district: 'Ranchi',
      ward: 'Bero Block, Ward 4'
    };
  }
  if (clean.includes('9841')) {
    return {
      ...REPORTS_DATA['SETU-8390'],
      id: '#SETU-9841',
      cleanId: 'SETU-9841',
      title: 'Pothole & Road Collapse on Culvert Edge (NH-32 Connector)',
      district: 'Dhanbad',
      ward: 'Govindpur Market / NH-32'
    };
  }
  if (clean.includes('9839')) {
    return {
      ...REPORTS_DATA['SETU-8314'],
      id: '#SETU-9839',
      cleanId: 'SETU-9839',
      title: 'Solar Micro-Grid Inverter Shutdown (Tribal Ashram School)',
      district: 'Khunti',
      ward: 'Torpa Rural School'
    };
  }
  if (clean.includes('9836')) {
    return {
      ...REPORTS_DATA['SETU-8277'],
      id: '#SETU-9836',
      cleanId: 'SETU-9836',
      title: 'Solid Waste Accumulation & Drainage Clog (Sakchi Central)',
      district: 'Jamshedpur',
      ward: 'Sakchi Market, W-14'
    };
  }

  // Default fallback
  return REPORTS_DATA['SETU-8421'];
};
