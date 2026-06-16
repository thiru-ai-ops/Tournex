import { Destination, Hotel, Booking, UserProfile, Expense } from './types';

export const ALL_DESTINATIONS: Destination[] = [
  {
    id: 'agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    category: 'Heritage',
    description: 'Home of the sublime Taj Mahal and towering Mughal imperial fortresses.',
    rating: 4.8,
    estMinBudget: 4000,
    estMaxBudget: 8000,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
    hotness: 'Trending',
    coords: { x: 48, y: 38 },
    touristSpots: [
      {
        name: 'The Taj Mahal',
        description: 'Ivory-white marble mausoleum on the south bank of the Yamuna river, a UNESCO World Heritage site and symbol of eternal love.',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Agra Fort',
        description: 'The walled city and powerful Mughal fortress that served as the main residence of the emperors of the Mughal Dynasty.',
        image: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Fatehpur Sikri',
        description: 'Uniform red sandstone architectural gem built by Emperor Akbar, showcasing Akbar’s courtly lifestyle.',
        image: 'https://images.unsplash.com/photo-1626014903708-3aa331eb765c?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Mehtab Bagh',
        description: 'The moonlit garden complex perfectly aligned with the Taj Mahal on the opposite bank of the Yamuna.',
        image: 'https://images.unsplash.com/photo-1598305016016-5bcbfb955bf1?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-agra-1',
        name: 'The Oberoi Amarvilas Luxury Retreat',
        location: 'Taj East Gate Road, Agra',
        rating: 4.9,
        price: 24500,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'h-agra-2',
        name: 'Taj Hotel & Convention Centre',
        location: 'Fatehabad Road, Agra',
        rating: 4.7,
        price: 11000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'h-agra-3',
        name: 'Radisson Hotel Agra Heritage',
        location: 'Tajganj, Agra',
        rating: 4.5,
        price: 6500,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'goa',
    name: 'Palolem Beach',
    state: 'Goa',
    category: 'Coastal',
    description: 'Golden sand shorelines, scenic sunsets, coastal cuisine, and active water sports.',
    rating: 4.9,
    estMinBudget: 6000,
    estMaxBudget: 15000,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800',
    hotness: 'Trending',
    coords: { x: 34, y: 72 },
    touristSpots: [
      {
        name: 'Palolem Shoreline',
        description: 'A beautiful crescent beach framed by a calm bay, rocking sweet coconut palms.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Dudhsagar Waterfalls',
        description: 'Majestic four-tiered waterfall located on the Mandovi River, surrounded by dense deciduous forests.',
        image: 'https://images.unsplash.com/photo-1588665048247-497d5dbfd092?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Basilica of Bom Jesus',
        description: 'UNESCO World Heritage site holding the mortal remains of St. Francis Xavier, standard Portuguese style.',
        image: 'https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-goa-1',
        name: 'The Leela Resort Goa Beachfront',
        location: 'Mobor Beach, Cavelossim, Goa',
        rating: 4.9,
        price: 21500,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'h-goa-2',
        name: 'Azure Palms Boutique Resort',
        location: 'Palolem Overlook, South Goa',
        rating: 4.6,
        price: 8900,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'ladakh',
    name: 'Leh Ladakh',
    state: 'Jammu & Kashmir',
    category: 'Adventure',
    description: 'Surreal cold mountain deserts, winding high-passes, and scenic azure high altitude lakes.',
    rating: 4.9,
    estMinBudget: 15000,
    estMaxBudget: 35000,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800',
    hotness: 'Hidden Gem',
    coords: { x: 42, y: 12 },
    touristSpots: [
      {
        name: 'Pangong Tso Lake',
        description: 'Breathtaking endorheic lake extending from India to Tibet, shifting colors from azure to cobalt daily.',
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Nubra Valley Dunes',
        description: 'Tri-armed high altitude valley featuring sweeping sand dunes and double-humped Bactrian camels.',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Magnetic Hill',
        description: 'Gravity-defying natural wonder where vehicles appear to roll uphill on their own accord.',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-lad-1',
        name: 'The Grand Dragon Ladakh',
        location: 'Old Road, Sheynam, Leh',
        rating: 4.8,
        price: 13500,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'h-lad-2',
        name: 'Stok Palace Heritage Castle',
        location: 'Stok Village, Leh',
        rating: 4.9,
        price: 18500,
        image: 'https://images.unsplash.com/photo-1543968332-b99478b1a5b2?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'varanasi',
    name: 'Varanasi Ghats',
    state: 'Uttar Pradesh',
    category: 'Spiritual',
    description: 'One of the oldest continuously inhabited cities offering divine, mystical evening Ganga Aarti services.',
    rating: 4.7,
    estMinBudget: 3000,
    estMaxBudget: 6000,
    image: 'https://images.unsplash.com/photo-1561361062-73691af8f2ec?auto=format&fit=crop&q=80&w=800',
    hotness: 'Popular',
    coords: { x: 57, y: 44 },
    touristSpots: [
      {
        name: 'Dashashwamedh Ghat',
        description: 'The spectacular primary ghat where pilgrims assemble to watch the magnificent evening Ganga Aarti fires.',
        image: 'https://images.unsplash.com/photo-1561361062-73691af8f2ec?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Kashi Vishwanath Temple',
        description: 'One of the most sacred Hindu shrines dedicated to Lord Shiva, capped with pure golden domes.',
        image: 'https://images.unsplash.com/photo-1598977123418-45f04b615137?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Sarnath Buddhist Hub',
        description: 'The sacred deer park where Gautama Buddha taught his very first sermon after attaining enlightenment.',
        image: 'https://images.unsplash.com/photo-1600100397608-f010e9714349?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-var-1',
        name: 'BrijRama Palace Heritage Hotel',
        location: 'Darbhanga Ghat, Varanasi',
        rating: 4.9,
        price: 16500,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'h-var-2',
        name: 'Taj Ganges Resort & Gardens',
        location: 'Nadesar Palace Grounds, Varanasi',
        rating: 4.8,
        price: 12500,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'jaipur',
    name: 'Jaipur Palace Loop',
    state: 'Rajasthan',
    category: 'Heritage',
    description: 'The legendary Pink City showcasing ornate Hawa Mahal, Amer Fort, and authentic Rajasthani culture.',
    rating: 4.8,
    estMinBudget: 5000,
    estMaxBudget: 12000,
    image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&q=80&w=800',
    hotness: 'Trending',
    coords: { x: 38, y: 39 },
    touristSpots: [
      {
        name: 'Hawa Mahal',
        description: 'The iconic 5-story pink honeycomb palace designed with 953 cooling screens for royal viewing.',
        image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Amer Fort & Mirror Palace',
        description: 'Magnificent fort crowning the cliffs of Aravalli hills, known for its dynamic inlaid glass artistry.',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Jal Mahal Palace',
        description: 'Floating sandstone palace sitting in the center of the peaceful Sagar Lake landscape.',
        image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-jai-1',
        name: 'The Rambagh Palace Luxury Residency',
        location: 'Bhawani Singh Road, Jaipur',
        rating: 4.9,
        price: 26000,
        image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'h-jai-2',
        name: 'ITC Rajputana Royal Habitat',
        location: 'Palace Road, Jaipur',
        rating: 4.7,
        price: 9900,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'alleppey',
    name: 'Alleppey Backwaters',
    state: 'Kerala',
    category: 'Relaxing',
    description: 'Experience tranquil networks of canals, houseboats, and fresh coastal delicacies in God’s own country.',
    rating: 4.8,
    estMinBudget: 8000,
    estMaxBudget: 18000,
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800',
    hotness: 'Best Value',
    coords: { x: 39, y: 92 },
    touristSpots: [
      {
        name: 'Lagoon Canals',
        description: 'Tranquil inter-connected waterways shaded by massive lush coconut clusters.',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Marari Beach Resort',
        description: 'Stunning quiet getaway beach covered with soft sand waves and wellness spa spots.',
        image: 'https://images.unsplash.com/photo-1581335967073-4555f9a67448?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Pathiramanal Island Hub',
        description: 'Picturesque small island floating inside Vembanad Lake, home to hundreds of rare migratory bird families.',
        image: 'https://images.unsplash.com/photo-1593693411515-c202e974eb17?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-all-1',
        name: 'The Backwater Palms & Houseboat Retreat',
        location: 'Vembanad Waterfront, Alleppey',
        rating: 4.7,
        price: 9500,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: 'h-all-2',
        name: 'Vasundhara Sarovar Premiere Luxury',
        location: 'Vayalar Shoreline, Alleppey',
        rating: 4.8,
        price: 13200,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'gulmarg',
    name: 'Gulmarg Valley',
    state: 'Kashmir',
    category: 'Adventure',
    description: 'Incredible pristine snow fields, powder ski experiences, and Asia’s highest cable car rides.',
    rating: 4.7,
    estMinBudget: 12000,
    estMaxBudget: 28000,
    image: 'https://images.unsplash.com/photo-1595841696662-5b8c4d0a4a93?auto=format&fit=crop&q=80&w=800',
    hotness: 'Trending',
    coords: { x: 38, y: 16 },
    touristSpots: [
      {
        name: 'Gulmarg Gondola Ride',
        description: 'The scenic second highest working complex ropeway in the world, skimming snowy peaks.',
        image: 'https://images.unsplash.com/photo-1595841696662-5b8c4d0a4a93?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Apharwat Skis Highland',
        description: 'Steep snowy alpine slopes offering professional grade powders for mountaineers.',
        image: 'https://images.unsplash.com/photo-1595841696662-5b8c4d0a4a93?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-gul-1',
        name: 'The Khyber Himalayan Resort & Spa',
        location: 'Hotel Road, Gulmarg Valley',
        rating: 4.9,
        price: 19500,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh Yoga Hub',
    state: 'Uttarakhand',
    category: 'Spiritual',
    description: 'Nestled by the holy Ganges and Himalayan foothills, offering white-water rafting and yoga retreats.',
    rating: 4.8,
    estMinBudget: 4000,
    estMaxBudget: 9000,
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=800',
    hotness: 'Trending',
    coords: { x: 46, y: 31 },
    touristSpots: [
      {
        name: 'Lakshman Jhula Bridge',
        description: 'Iron suspension bridge across the holy Ganges River, dotted with sacred temples on all sides.',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Triveni Evening Ghat',
        description: 'Spiritual devotional convergence point where religious morning baths and evening fire prayers transpire.',
        image: 'https://images.unsplash.com/photo-1561361062-73691af8f2ec?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-rish-1',
        name: 'The Roseate Ganges Wellness Spa',
        location: 'Rishikesh-Badrinath Road, Uttarakhand',
        rating: 4.9,
        price: 15500,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'hampi',
    name: 'Hampi Ruins',
    state: 'Karnataka',
    category: 'Heritage',
    description: 'An open-world museum of boulder-strewn landscapes and magnificent stone ruins from the Vijayanagara Empire.',
    rating: 4.9,
    estMinBudget: 4500,
    estMaxBudget: 11000,
    image: 'https://images.unsplash.com/photo-1600100397608-f010e9714349?auto=format&fit=crop&q=80&w=800',
    hotness: 'Hidden Gem',
    coords: { x: 31, y: 73 },
    touristSpots: [
      {
        name: 'Virupaksha Temple',
        description: 'Majestic ancient Hindu temple at Hampi Bazaar that has remained active continuously since the 7th century.',
        image: 'https://images.unsplash.com/photo-1600100397608-f010e9714349?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'The Stone Chariot',
        description: 'Masterfully carved stone structural masterpiece situated inside the famous Vittala Temple courtyard.',
        image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-ham-1',
        name: 'Evolve Back Kamlapura Palace Hampi',
        location: 'Hampi Heritage Zone, Karnataka',
        rating: 4.9,
        price: 18500,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'andaman',
    name: 'Andaman Islands',
    state: 'Andaman & Nicobar',
    category: 'Coastal',
    description: 'Deep maritime coral reefs, glowing bio-luminescence backwaters, and pristine Radhanagar beach.',
    rating: 4.9,
    estMinBudget: 16000,
    estMaxBudget: 38000,
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800',
    hotness: 'Hidden Gem',
    coords: { x: 86, y: 78 },
    touristSpots: [
      {
        name: 'Radhanagar Coastal Beach',
        description: 'Voted one of Asia’s finest beachscapes with transparent blue water lines and dense deep jungle lines.',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Havelock Coral Reef',
        description: 'Beautiful volcanic bay coordinates where scuba divers monitor deep marine systems.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-and-1',
        name: 'Taj Exotica Resort & Spa Andaman',
        location: 'Radhanagar Shoreline, Havelock Island',
        rating: 4.9,
        price: 26000,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'munnar',
    name: 'Munnar Tea Hills',
    state: 'Kerala',
    category: 'Relaxing',
    description: 'Rolling green tea plantations, misty slopes, and scenic mountain pathways nested in the Western Ghats.',
    rating: 4.8,
    estMinBudget: 5000,
    estMaxBudget: 13000,
    image: 'https://images.unsplash.com/photo-1593693411515-c202e974eb17?auto=format&fit=crop&q=80&w=800',
    hotness: 'Best Value',
    coords: { x: 34, y: 88 },
    touristSpots: [
      {
        name: 'Eravikulam Alpine Reserve',
        description: 'Serene mountain reserve famous for safeguarding endangered Nilgiri Tahr mountain goats.',
        image: 'https://images.unsplash.com/photo-1593693411515-c202e974eb17?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Mattupetty Lake & Dam',
        description: 'Gorgeous water reservoir framed by deep emerald hills and aromatic tea tree estates.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Anamudi Mountain Peak',
        description: 'The tallest mountain summit in the Western Ghats, covered with ethereal mist and mountain pathways.',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-munn-1',
        name: 'Panoramic Getaway Resort Munnar',
        location: 'Chithirapuram, Munnar Hills',
        rating: 4.7,
        price: 9000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'jaisalmer',
    name: 'Jaisalmer Desert Fort',
    state: 'Rajasthan',
    category: 'Heritage',
    description: 'The Golden City of Jaisalmer features a living sandstone fort and overnight camel treks across active sand dunes.',
    rating: 4.8,
    estMinBudget: 4500,
    estMaxBudget: 9500,
    image: 'https://images.unsplash.com/photo-1504620054065-9f5b04cedfd6?auto=format&fit=crop&q=80&w=800',
    hotness: 'Trending',
    coords: { x: 28, y: 36 },
    touristSpots: [
      {
        name: 'Jaisalmer Golden Fort',
        description: 'A massive UNESCO living fort where a quarter of the town’s population still lives inside sandstone towers.',
        image: 'https://images.unsplash.com/photo-1504620054065-9f5b04cedfd6?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Sam Sand Dunes',
        description: 'Vast rolling desert dunes ideal for camel safaris during spectacular desert sunsets.',
        image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Patwon Ki Haveli block',
        description: 'A cluster of five beautiful, complexly carved sandstone residences built by wealthy merchant families.',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Gadisar Lake Spot',
        description: 'A historical artificial lake built in the 14th century, surrounded by lovely artistically designed shrines.',
        image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-jais-1',
        name: 'Suryagarh Jaisalmer Luxury Castle',
        location: 'Sam Road, Jaisalmer',
        rating: 4.9,
        price: 16500,
        image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'ooty',
    name: 'Ooty Blue Mountains',
    state: 'Tamil Nadu',
    category: 'Relaxing',
    description: 'Charming mountain town surrounded by Nilgiri hills, extensive botanical gardens, and scenic pine forests.',
    rating: 4.7,
    estMinBudget: 4000,
    estMaxBudget: 11000,
    image: 'https://images.unsplash.com/photo-1595113941441-df07119ff3be?auto=format&fit=crop&q=80&w=800',
    hotness: 'Popular',
    coords: { x: 38, y: 84 },
    touristSpots: [
      {
        name: 'Ooty Botanical Gardens',
        description: 'Lush green terraces housing fossilized tree trunks alongside thousands of indigenous plants.',
        image: 'https://images.unsplash.com/photo-1595113941441-df07119ff3be?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Doddabetta Peak View',
        description: 'The highest mountain point in South India, offering clear bird-eye vistas of the Western hills.',
        image: 'https://images.unsplash.com/photo-1571210059434-edf0dc48e414?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Ooty Lake Quiet Cove',
        description: 'Lush artificial lake covered with scenic eucalyptus trees, offering beautiful speed boating and paddle rentals.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Emerald Tea Meadows',
        description: 'Serene quiet valley covered in endless green tea bushes, located in the silent outskirts of Nilgiri region.',
        image: 'https://images.unsplash.com/photo-1593693411515-c202e974eb17?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-ooty-1',
        name: 'Savoy - IHCL SeleQtions',
        location: 'Sylks Road, Ooty',
        rating: 4.8,
        price: 11500,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'coorg',
    name: 'Coorg Coffee Valleys',
    state: 'Karnataka',
    category: 'Relaxing',
    description: 'Bask in the Scotland of India, famous for coffee plantation treks, mist-capped slopes, and refreshing spice farm air.',
    rating: 4.8,
    estMinBudget: 5500,
    estMaxBudget: 14000,
    image: 'https://images.unsplash.com/photo-1593693411515-c202e974eb17?auto=format&fit=crop&q=80&w=800',
    hotness: 'Hidden Gem',
    coords: { x: 29, y: 79 },
    touristSpots: [
      {
        name: 'Abbey Falls cascade',
        description: 'Spectacular waterfall nestled between private coffee plantations and spice estates.',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Namdroling Golden Temple',
        description: 'Serene Tibetan Buddhist teaching center home to massive gold-plated Buddha structures.',
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-coorg-1',
        name: 'The Tamara Coorg Wilderness',
        location: 'Kabbinakad Estate, Napoklu, Coorg',
        rating: 4.9,
        price: 19500,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'pondicherry',
    name: 'Pondicherry French Quarter',
    state: 'Puducherry',
    category: 'Coastal',
    description: 'French colonial charm, pristine beaches, warm organic European bakeries, and the spiritual hub of Auroville.',
    rating: 4.8,
    estMinBudget: 4500,
    estMaxBudget: 11000,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    hotness: 'Trending',
    coords: { x: 46, y: 81 },
    touristSpots: [
      {
        name: 'Auroville Matrimandir Dome',
        description: 'Immersive golden globe dedicated to peaceful human unity, silent meditation, and research.',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Promenade Seaside Walk',
        description: 'A beautiful rocky beach avenue populated by heritage monuments and cooling sea breezes.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-pondy-1',
        name: 'Palais de Mahe - CGH Earth',
        location: 'Rue de la Bussy, White Town, Pondicherry',
        rating: 4.8,
        price: 13500,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'madurai',
    name: 'Madurai Temple City',
    state: 'Tamil Nadu',
    category: 'Spiritual',
    description: 'Known as the Athens of the East, famed for the sky-high towering gopurams of the sacred Meenakshi Temple.',
    rating: 4.9,
    estMinBudget: 3500,
    estMaxBudget: 7500,
    image: 'https://images.unsplash.com/photo-1598977123418-45f04b615137?auto=format&fit=crop&q=80&w=800',
    hotness: 'Popular',
    coords: { x: 42, y: 88 },
    touristSpots: [
      {
        name: 'Meenakshi Amman Temple',
        description: 'A historical active multi-gopuram structure complex decorated with thousands of brightly painted stone deities.',
        image: 'https://images.unsplash.com/photo-1598977123418-45f04b615137?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Thirumalai Nayakkar Palace',
        description: 'Stunning 17th-century palace complex showcasing iconic white pillars and light shows.',
        image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-madurai-1',
        name: 'Heritage Madurai Resort',
        location: 'Melakkal Road, Madurai',
        rating: 4.7,
        price: 9000,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'varkala',
    name: 'Varkala Beach Cliffs',
    state: 'Kerala',
    category: 'Coastal',
    description: 'Vibrant cliffside paths overlooking golden sands, fresh seafood cafes, and natural geo-thermal mineral springs.',
    rating: 4.9,
    estMinBudget: 4000,
    estMaxBudget: 9500,
    image: 'https://images.unsplash.com/photo-1581335967073-4555f9a67448?auto=format&fit=crop&q=80&w=800',
    hotness: 'Trending',
    coords: { x: 37, y: 95 },
    touristSpots: [
      {
        name: 'Papanasam Mineral Springs',
        description: 'Famous beach cliffs where pure natural volcanic springs bubble up with curative mineral powers.',
        image: 'https://images.unsplash.com/photo-1581335967073-4555f9a67448?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Janardhana Swamy shrine',
        description: 'A highly sacred 2000-year-old Vaishnavite temple overlooking the quiet waves of the ocean.',
        image: 'https://images.unsplash.com/photo-1561361062-73691af8f2ec?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-varkala-1',
        name: 'Gateway Varkala - IHCL SeleQtions',
        location: 'Janardhanapuram, Varkala Coast',
        rating: 4.8,
        price: 11500,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: 'kochi',
    name: 'Kochi Seaport Heritage',
    state: 'Kerala',
    category: 'Heritage',
    description: 'Sprawling historic harbor town showcasing massive iconic Chinese fishing nets, Jewish legacy houses, and Portuguese forts.',
    rating: 4.7,
    estMinBudget: 4000,
    estMaxBudget: 9000,
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800',
    hotness: 'Best Value',
    coords: { x: 35, y: 90 },
    touristSpots: [
      {
        name: 'Fort Kochi Chinese Nets',
        description: 'Massive graceful shore-operated mechanical fishing installations introduced by old trade links.',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'St. Francis Heritage Church',
        description: 'The ancient European architectural church built in India where the legendary explorer Vasco da Gama was buried.',
        image: 'https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?auto=format&fit=crop&q=80&w=800'
      }
    ],
    hotels: [
      {
        id: 'h-kochi-1',
        name: 'Brunton Boatyard - CGH Earth',
        location: 'Calvathy Road, Fort Kochi Harbor',
        rating: 4.9,
        price: 14000,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800'
      }
    ]
  }
];

export const POPULAR_HOTELS: Hotel[] = [
  {
    id: 'h1',
    name: 'Royal Rajputana Residency',
    location: 'Lake Pichola, Udaipur',
    rating: 4.9,
    price: 15999,
    image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'h2',
    name: 'The Backwater Palms Retreat',
    location: 'Vembanad Lake, Alleppey',
    rating: 4.7,
    price: 9500,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'h3',
    name: 'Azure Sands Boutique Resort',
    location: 'Anjuna Beach, Goa',
    rating: 4.8,
    price: 12200,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800'
  }
];

export const USER_CURRENT_PROFILE: UserProfile = {
  name: 'Arjun Mehta',
  tier: 'Elite Explorer',
  bio: 'Searching for the intersection of ancient heritage, divine Himalayan landscapes, and local culinary traditions across dynamic India.',
  location: 'Mumbai, India',
  joinDate: 'Joined Mar 2023',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
  stats: {
    statesVisited: 14,
    savedTripsCount: 42,
    reviewsCount: 128,
    savedTotal: 124500
  },
  level: 8,
  currentXp: 2450,
  maxXp: 3000
};

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'e1',
    description: 'Udaipur Palace Tickets',
    amount: 2400,
    paidBy: 'Rahul',
    splitWith: ['Arjun', 'Priya', 'Sanya', 'Rahul'],
    category: 'Activity',
    date: '2026-05-27'
  },
  {
    id: 'e2',
    description: 'Thar Desert Camel Safari & Camp',
    amount: 14800,
    paidBy: 'Arjun',
    splitWith: ['Arjun', 'Priya', 'Sanya', 'Rahul'],
    category: 'Activity',
    date: '2026-05-28'
  },
  {
    id: 'e3',
    description: 'Heritage Havel Resort Stay (3 Nights)',
    amount: 78000,
    paidBy: 'Priya',
    splitWith: ['Arjun', 'Priya', 'Sanya', 'Rahul'],
    category: 'Stay',
    date: '2026-05-26'
  },
  {
    id: 'e4',
    description: 'Private AC Coach - Jaipur to Jodhpur',
    amount: 32000,
    paidBy: 'Sanya',
    splitWith: ['Arjun', 'Priya', 'Sanya', 'Rahul'],
    category: 'Transit',
    date: '2026-05-25'
  },
  {
    id: 'e5',
    description: 'Authentic Rajasthani Dinner at Chokhi Dhani',
    amount: 18000,
    paidBy: 'Arjun',
    splitWith: ['Arjun', 'Priya', 'Sanya', 'Rahul'],
    category: 'Food',
    date: '2026-05-28'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    name: 'The Golden Triangle Heritage Loop',
    status: 'UPCOMING',
    dates: 'Oct 12 - Oct 18, 2026',
    price: 42500,
    bookingId: 'TNX-902341',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b2',
    name: 'Spiritual Varanasi & Sarnath Experience',
    status: 'COMPLETED',
    dates: 'Aug 05 - Aug 08, 2025',
    price: 18200,
    bookingId: 'TNX-120934',
    image: 'https://images.unsplash.com/photo-1598977123418-45f04b615137?auto=format&fit=crop&q=80&w=800',
    reviewed: true
  },
  {
    id: 'b3',
    name: 'Mumbai Coastal Seascape Tour',
    status: 'CANCELLED',
    dates: 'Sep 20 - Sep 22, 2025',
    price: 12000,
    bookingId: 'TNX-443901',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&q=80&w=800'
  }
];
