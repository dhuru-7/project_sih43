/**
 * Comprehensive civic and community reporter types for SETU.
 * Covers individual citizens, grassroots community collectives, civil society,
 * frontline workers, and public representatives.
 */
export const REPORTER_CATEGORIES = [
  {
    name: 'Citizens & Residents',
    hindi: 'नागरिक एवं निवासी',
    items: [
      {
        id: 'Individual Citizen',
        label: 'Individual Citizen',
        hindi: 'व्यक्तिगत नागरिक',
        icon: 'person',
        desc: 'Resident, daily commuter, or local citizen reporting directly',
        requiresGroupName: false
      },
      {
        id: 'Resident Welfare Association (RWA)',
        label: 'Resident Welfare Association (RWA)',
        hindi: 'रेजिडेंट वेलफेयर एसोसिएशन',
        icon: 'apartment',
        desc: 'Housing society, apartment association, mohalla sudhar samiti',
        requiresGroupName: true,
        placeholder: 'e.g. Greenwood Enclave RWA, Ward 12'
      },
      {
        id: 'Student / Youth Collective',
        label: 'Student / Youth Collective',
        hindi: 'विद्यार्थी / युवा समूह',
        icon: 'school',
        desc: 'College students, youth volunteers, civic campus club',
        requiresGroupName: true,
        placeholder: 'e.g. Ranchi University Civic Forum'
      },
      {
        id: 'Senior Citizens Council',
        label: 'Senior Citizens Council',
        hindi: 'वरिष्ठ नागरिक मंच',
        icon: 'elderly',
        desc: 'Elderly residents collective or pension forum',
        requiresGroupName: true,
        placeholder: 'e.g. Morabadi Senior Citizens Forum'
      },
      {
        id: 'Farmer / Cultivator',
        label: 'Farmer / Cultivator',
        hindi: 'किसान / कृषक',
        icon: 'agriculture',
        desc: 'Individual agriculturist, farming family, or tenant farmer',
        requiresGroupName: false
      }
    ]
  },
  {
    name: 'Grassroots & Community Collectives',
    hindi: 'सामुदायिक एवं जमीनी समूह',
    items: [
      {
        id: 'Self-Help Group (SHG / Sakhi Mandal)',
        label: 'Self-Help Group (SHG / Sakhi Mandal)',
        hindi: 'स्वयं सहायता समूह / सखी मंडल',
        icon: 'groups',
        desc: 'Women mahila mandal, NRLM Aajeevika, or Sakhi group',
        requiresGroupName: true,
        placeholder: 'e.g. Ujala Sakhi Mandal, Ward 4'
      },
      {
        id: 'Gram Sabha / Village Committee',
        label: 'Gram Sabha / Village Committee',
        hindi: 'ग्राम सभा / ग्राम विकास समिति',
        icon: 'diversity_3',
        desc: 'Village assembly, Gram Sansad, or development committee',
        requiresGroupName: true,
        placeholder: 'e.g. Pandra Gram Vikas Samiti'
      },
      {
        id: 'Tribal / Indigenous Collective',
        label: 'Tribal / Indigenous Collective',
        hindi: 'आदिवासी समाज एवं कल्याण समिति',
        icon: 'forest',
        desc: 'Traditional tribal council, Parha samiti, or Forest Rights group',
        requiresGroupName: true,
        placeholder: 'e.g. Sarna Samiti, Doranda'
      },
      {
        id: 'Youth Club / Nehru Yuva Kendra (NYKS)',
        label: 'Youth Club / Nehru Yuva Kendra',
        hindi: 'युवा मंडल / नेहरू युवा केंद्र',
        icon: 'sports_kabaddi',
        desc: 'NYKS affiliated youth club, sports or cultural club',
        requiresGroupName: true,
        placeholder: 'e.g. Veer Birsa Yuva Club'
      },
      {
        id: 'Water & Sanitation Committee (Pani Samiti)',
        label: 'Water & Sanitation Committee (Pani Samiti)',
        hindi: 'पानी समिति / स्वच्छता समिति',
        icon: 'water_drop',
        desc: 'Village water user committee or Swachhata task force',
        requiresGroupName: true,
        placeholder: 'e.g. Jal Prabhat Samiti, Namkum'
      }
    ]
  },
  {
    name: 'Civil Society & Industry',
    hindi: 'नागरिक समाज एवं संगठन',
    items: [
      {
        id: 'Non-Governmental Organization (NGO / CSO)',
        label: 'Non-Governmental Organization (NGO / CSO)',
        hindi: 'गैर-सरकारी संगठन / CSO',
        icon: 'volunteer_activism',
        desc: 'Registered non-profit, voluntary organization, or trust',
        requiresGroupName: true,
        placeholder: 'e.g. Seva Bharat Foundation'
      },
      {
        id: 'Farmers Producer Organization (FPO)',
        label: 'Farmers Producer Organization (FPO)',
        hindi: 'किसान उत्पादक संगठन (FPO)',
        icon: 'compost',
        desc: 'Registered agricultural producer company or krishak sangh',
        requiresGroupName: true,
        placeholder: 'e.g. Chotanagpur Organic Farmers FPO'
      },
      {
        id: 'Traders / Market Association (Vyapar Mandal)',
        label: 'Traders / Market Association (Vyapar Mandal)',
        hindi: 'व्यापार मंडल / बाजार समिति',
        icon: 'storefront',
        desc: 'Local merchant association, weekly haat committee',
        requiresGroupName: true,
        placeholder: 'e.g. Main Road Traders Association'
      },
      {
        id: 'Cooperative Society',
        label: 'Cooperative Society',
        hindi: 'सहकारी समिति',
        icon: 'handshake',
        desc: 'Dairy, agricultural, or consumer cooperative society',
        requiresGroupName: true,
        placeholder: 'e.g. Kisan Dugdh Utpadak Sahakari Samiti'
      }
    ]
  },
  {
    name: 'Public Representatives & Frontline Workers',
    hindi: 'जनप्रतिनिधि एवं फ्रंटलाइन कार्यकर्ता',
    items: [
      {
        id: 'Gram Panchayat / Ward Representative',
        label: 'Gram Panchayat / Ward Representative',
        hindi: 'सरपंच / मुखिया / वार्ड पार्षद',
        icon: 'account_balance',
        desc: 'Mukhiya, Sarpanch, Ward Member, or Panchayat Samiti member',
        requiresGroupName: true,
        placeholder: 'e.g. Ward 14 Council, Ranchi'
      },
      {
        id: 'ASHA / Anganwadi Frontline Worker',
        label: 'ASHA / Anganwadi Frontline Worker',
        hindi: 'आशा / आंगनवाड़ी कार्यकर्ता',
        icon: 'medical_services',
        desc: 'Grassroots community health or child development worker',
        requiresGroupName: true,
        placeholder: 'e.g. Anganwadi Centre 104'
      },
      {
        id: 'Civil Defence / Aapda Mitra Volunteer',
        label: 'Civil Defence / Aapda Mitra Volunteer',
        hindi: 'नागरिक सुरक्षा / आपदा मित्र',
        icon: 'shield_with_heart',
        desc: 'Disaster response volunteer or community safety volunteer',
        requiresGroupName: true,
        placeholder: 'e.g. Ranchi Aapda Mitra Team 2'
      },
      {
        id: 'School Management Committee (SMC)',
        label: 'School Management Committee (SMC)',
        hindi: 'विद्यालय प्रबंधन समिति / शिक्षक',
        icon: 'menu_book',
        desc: 'PTA members, headmaster, or government school committee',
        requiresGroupName: true,
        placeholder: 'e.g. SMC Utkramit Madhya Vidyalaya'
      },
      {
        id: 'Other Community Group',
        label: 'Other Community Group',
        hindi: 'अन्य सामुदायिक समूह',
        icon: 'category',
        desc: 'Any other collective, religious, or neighborhood group',
        requiresGroupName: true,
        placeholder: 'e.g. Basti Seva Dal'
      }
    ]
  }
];

export function getReporterMeta(reporterId) {
  for (const cat of REPORTER_CATEGORIES) {
    const found = cat.items.find((i) => i.id === reporterId);
    if (found) return found;
  }
  return {
    id: reporterId || 'Individual Citizen',
    label: reporterId || 'Individual Citizen',
    hindi: 'व्यक्तिगत नागरिक',
    icon: 'person',
    desc: 'Resident reporting directly',
    requiresGroupName: false
  };
}
