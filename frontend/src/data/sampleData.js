/* ──────────────────────────────────────────────────────
   Sample / mock data for demonstration.
   Keep this file as the single source of demo data so
   it can later be replaced by API responses.
   ────────────────────────────────────────────────────── */

export const sampleCouple = {
  id: '1',
  partner1: 'Arjun Mehta',
  partner2: 'Priya Sharma',
  slug: 'arjun-and-priya',
  weddingDate: '2027-02-14',
  location: 'Udaipur, Rajasthan',
  description:
    'We met during our college days at IIT Delhi — a chance encounter at the library that turned into late-night chai conversations, endless laughter, and a love story we never saw coming. Three years later, we\'re ready to begin our forever. We can\'t wait to celebrate with the people who mean the most to us.',
  photo: null,
};

export const sampleWishlistItems = [
  {
    id: 'w1',
    coupleId: '1',
    title: 'Dream Honeymoon to Bali',
    description:
      'Two weeks in Bali — exploring temples, surfing, and watching sunsets together from a private villa.',
    targetAmount: 150000,
    currentAmount: 45000,
    category: 'Honeymoon',
    image: null,
  },
  {
    id: 'w2',
    coupleId: '1',
    title: 'Living Room Furniture',
    description:
      'A cozy sofa set, coffee table, and bookshelf to make our first home feel like us.',
    targetAmount: 75000,
    currentAmount: 32000,
    category: 'Furniture',
    image: null,
  },
  {
    id: 'w3',
    coupleId: '1',
    title: 'Kitchen Setup',
    description:
      'Everything we need to cook together — a mixer-grinder, microwave, dinner set, and cookware.',
    targetAmount: 45000,
    currentAmount: 18500,
    category: 'Kitchen',
    image: null,
  },
  {
    id: 'w4',
    coupleId: '1',
    title: 'Smart Home Entertainment',
    description:
      'A 55" 4K TV and soundbar for movie nights and cricket match watching parties.',
    targetAmount: 60000,
    currentAmount: 15000,
    category: 'Electronics',
    image: null,
  },
  {
    id: 'w5',
    coupleId: '1',
    title: 'Europe Trip Fund',
    description:
      'Our dream trip through Paris, Rome, and Santorini — planned for our first anniversary.',
    targetAmount: 200000,
    currentAmount: 52000,
    category: 'Travel',
    image: null,
  },
  {
    id: 'w6',
    coupleId: '1',
    title: 'Bedroom Makeover',
    description:
      'A queen-size bed, wardrobe, and bedside tables to create our perfect retreat.',
    targetAmount: 35000,
    currentAmount: 35000,
    category: 'Home',
    image: null,
  },
];

export const sampleContributions = [
  {
    id: 'c1',
    wishlistItemId: 'w1',
    guestName: 'Rahul Verma',
    amount: 10000,
    message: 'Have an amazing honeymoon! So happy for you both! 🌴',
    createdAt: '2027-01-20T10:30:00Z',
  },
  {
    id: 'c2',
    wishlistItemId: 'w2',
    guestName: 'Sneha Kapoor',
    amount: 5000,
    message: 'Can\'t wait to visit your beautiful new home!',
    createdAt: '2027-01-19T14:15:00Z',
  },
  {
    id: 'c3',
    wishlistItemId: 'w1',
    guestName: 'Amit & Neha',
    amount: 15000,
    message: 'Bali is going to be magical. Enjoy every moment! ✨',
    createdAt: '2027-01-18T09:00:00Z',
  },
  {
    id: 'c4',
    wishlistItemId: 'w3',
    guestName: 'Pooja Desai',
    amount: 3500,
    message: 'Here\'s to many delicious meals together! 🍳',
    createdAt: '2027-01-17T16:45:00Z',
  },
  {
    id: 'c5',
    wishlistItemId: 'w5',
    guestName: 'Vikram Singh',
    amount: 25000,
    message: 'Europe is calling! Make unforgettable memories.',
    createdAt: '2027-01-15T11:20:00Z',
  },
];

export const sampleGuestWishes = [
  {
    id: 'gw1',
    guestName: 'Ananya Iyer',
    message:
      'Wishing you both a lifetime of love, laughter, and late-night chai. You two are perfect together! 💕',
    createdAt: '2027-01-21T08:00:00Z',
  },
  {
    id: 'gw2',
    guestName: 'Karthik Reddy',
    message:
      'From college friends to soulmates — what a beautiful journey. Congratulations, Arjun & Priya!',
    createdAt: '2027-01-20T12:30:00Z',
  },
  {
    id: 'gw3',
    guestName: 'Meera Joshi',
    message:
      'May your marriage be as strong as your WiFi connection 😄 Lots of love to both of you!',
    createdAt: '2027-01-19T15:00:00Z',
  },
  {
    id: 'gw4',
    guestName: 'Rajesh Uncle & Sunita Aunty',
    message:
      'Bahut bahut mubarak ho! May God bless you both with happiness and prosperity. 🙏',
    createdAt: '2027-01-18T09:30:00Z',
  },
];

export const sampleActivities = [
  {
    id: 'a1',
    type: 'contribution',
    description: 'Rahul Verma contributed ₹10,000 toward Dream Honeymoon to Bali',
    timestamp: '2027-01-20T10:30:00Z',
    amount: 10000,
  },
  {
    id: 'a2',
    type: 'wish',
    description: 'Ananya Iyer left a wedding wish',
    timestamp: '2027-01-21T08:00:00Z',
  },
  {
    id: 'a3',
    type: 'contribution',
    description: 'Sneha Kapoor contributed ₹5,000 toward Living Room Furniture',
    timestamp: '2027-01-19T14:15:00Z',
    amount: 5000,
  },
  {
    id: 'a4',
    type: 'item_added',
    description: 'You added "Europe Trip Fund" to your wishlist',
    timestamp: '2027-01-16T10:00:00Z',
  },
  {
    id: 'a5',
    type: 'contribution',
    description: 'Vikram Singh contributed ₹25,000 toward Europe Trip Fund',
    timestamp: '2027-01-15T11:20:00Z',
    amount: 25000,
  },
  {
    id: 'a6',
    type: 'profile_update',
    description: 'Wedding profile updated with new photos',
    timestamp: '2027-01-14T08:00:00Z',
  },
];
