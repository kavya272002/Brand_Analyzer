// ===== Brand & Industry Analyzer — Knowledge Base + Category Explorer =====

// ─── Category Explorer Data ───
const CATEGORIES = {
  industries: [
    { name: "FMCG", icon: "🛒", query: "FMCG Industry" },
    { name: "Technology", icon: "💻", query: "Technology / IT Industry" },
    { name: "Automobile", icon: "🚗", query: "Automobile Industry" },
    { name: "E-Commerce", icon: "🛍️", query: "E-Commerce Industry" },
    { name: "Pharma", icon: "💊", query: "Pharmaceutical Industry" },
    { name: "Banking & Finance", icon: "🏦", query: "Banking & Financial Services Industry" },
    { name: "Telecom", icon: "📡", query: "Telecom Industry" },
    { name: "Real Estate", icon: "🏠", query: "Real Estate Industry India" },
    { name: "Education", icon: "🎓", query: "Education & EdTech Industry" },
    { name: "Agriculture", icon: "🌾", query: "Agriculture Industry India" },
    { name: "Logistics", icon: "🚛", query: "Logistics & Supply Chain Industry" },
    { name: "Media & Entertainment", icon: "🎬", query: "Media & Entertainment Industry" },
    { name: "Hospitality & Tourism", icon: "🏨", query: "Hospitality & Tourism Industry" },
    { name: "Energy & Oil", icon: "⛽", query: "Energy & Oil Industry" },
    { name: "Textiles & Apparel", icon: "👗", query: "Textiles & Apparel Industry" },
    { name: "Food & Beverage", icon: "🍔", query: "Food & Beverage Industry" },
    { name: "Healthcare", icon: "🏥", query: "Healthcare Industry India" },
    { name: "Aviation", icon: "✈️", query: "Aviation Industry" },
    { name: "Fintech", icon: "📲", query: "Fintech Industry" },
    { name: "Insurance", icon: "🛡️", query: "Insurance Industry India" },
    { name: "Retail", icon: "🏪", query: "Retail Industry India" },
    { name: "Renewable Energy", icon: "🔋", query: "Renewable Energy Industry" },
    { name: "Cybersecurity", icon: "🔐", query: "Cybersecurity Industry" },
    { name: "AI & Machine Learning", icon: "🤖", query: "Artificial Intelligence Industry" },
    { name: "Cloud Computing", icon: "☁️", query: "Cloud Computing Industry" },
    { name: "Gaming", icon: "🎮", query: "Gaming Industry" },
    { name: "Construction", icon: "🏗️", query: "Construction Industry India" },
    { name: "Mining", icon: "⛏️", query: "Mining Industry India" },
    { name: "Chemicals", icon: "⚗️", query: "Chemical Industry India" },
    { name: "Sports", icon: "⚽", query: "Sports Industry" }
  ],
  indianBrands: [
    { name: "Reliance", icon: "🏢", query: "Reliance Industries" },
    { name: "Tata Group", icon: "🐘", query: "Tata Group" },
    { name: "Infosys", icon: "💻", query: "Infosys" },
    { name: "HUL", icon: "🧴", query: "Hindustan Unilever" },
    { name: "ITC", icon: "🏭", query: "ITC Limited" },
    { name: "HDFC Bank", icon: "🏦", query: "HDFC Bank" },
    { name: "Adani Group", icon: "⚡", query: "Adani Group" },
    { name: "Bajaj", icon: "🏍️", query: "Bajaj Group" },
    { name: "L&T", icon: "🏗️", query: "Larsen & Toubro" },
    { name: "Maruti Suzuki", icon: "🚗", query: "Maruti Suzuki" },
    { name: "Mahindra", icon: "🚙", query: "Mahindra Group" },
    { name: "Wipro", icon: "🖥️", query: "Wipro Limited" },
    { name: "Asian Paints", icon: "🎨", query: "Asian Paints" },
    { name: "SBI", icon: "🏛️", query: "State Bank of India" },
    { name: "ICICI Bank", icon: "💳", query: "ICICI Bank" },
    { name: "Zomato", icon: "🍕", query: "Zomato" },
    { name: "Swiggy", icon: "🛵", query: "Swiggy" },
    { name: "Flipkart", icon: "📦", query: "Flipkart" },
    { name: "Paytm", icon: "📱", query: "Paytm" },
    { name: "Ola", icon: "🚕", query: "Ola Cabs" },
    { name: "Dabur", icon: "🌿", query: "Dabur India" },
    { name: "Godrej", icon: "🏠", query: "Godrej Group" },
    { name: "LIC", icon: "🛡️", query: "Life Insurance Corporation of India" },
    { name: "Marico", icon: "🧴", query: "Marico Limited" },
    { name: "Titan", icon: "⌚", query: "Titan Company" },
    { name: "Patanjali", icon: "🧘", query: "Patanjali Ayurved" },
    { name: "BYJU'S", icon: "📚", query: "BYJU'S" },
    { name: "PhonePe", icon: "💸", query: "PhonePe" },
    { name: "Razorpay", icon: "💳", query: "Razorpay" },
    { name: "Nykaa", icon: "💄", query: "Nykaa" }
  ],
  globalBrands: [
    { name: "Apple", icon: "🍎", query: "Apple Inc." },
    { name: "Google", icon: "🔍", query: "Google / Alphabet" },
    { name: "Microsoft", icon: "🪟", query: "Microsoft Corporation" },
    { name: "Amazon", icon: "📦", query: "Amazon" },
    { name: "Tesla", icon: "⚡", query: "Tesla Inc." },
    { name: "Samsung", icon: "📱", query: "Samsung Electronics" },
    { name: "Nike", icon: "👟", query: "Nike Inc." },
    { name: "Meta", icon: "👤", query: "Meta Platforms (Facebook)" },
    { name: "Netflix", icon: "🎬", query: "Netflix" },
    { name: "NVIDIA", icon: "🖥️", query: "NVIDIA Corporation" },
    { name: "Coca-Cola", icon: "🥤", query: "Coca-Cola Company" },
    { name: "PepsiCo", icon: "🥤", query: "PepsiCo" },
    { name: "McDonald's", icon: "🍟", query: "McDonald's" },
    { name: "Starbucks", icon: "☕", query: "Starbucks" },
    { name: "Disney", icon: "🏰", query: "The Walt Disney Company" },
    { name: "Uber", icon: "🚗", query: "Uber Technologies" },
    { name: "Spotify", icon: "🎵", query: "Spotify" },
    { name: "Toyota", icon: "🚙", query: "Toyota Motor Corporation" },
    { name: "P&G", icon: "🧴", query: "Procter & Gamble" },
    { name: "Nestlé", icon: "🍫", query: "Nestlé" },
    { name: "Louis Vuitton", icon: "👜", query: "Louis Vuitton / LVMH" },
    { name: "BMW", icon: "🚘", query: "BMW Group" },
    { name: "Adidas", icon: "👟", query: "Adidas" },
    { name: "Sony", icon: "🎮", query: "Sony Group" },
    { name: "OpenAI", icon: "🤖", query: "OpenAI" },
    { name: "Airbnb", icon: "🏡", query: "Airbnb" },
    { name: "Domino's", icon: "🍕", query: "Domino's Pizza" },
    { name: "Walmart", icon: "🛒", query: "Walmart" },
    { name: "Intel", icon: "💾", query: "Intel Corporation" },
    { name: "SpaceX", icon: "🚀", query: "SpaceX" }
  ]
};

// ─── Built-in Knowledge Base (for instant preview / offline) ───
const BRAND_DATA = {

// ────────────────── INDUSTRIES ──────────────────

"fmcg": {
  name: "FMCG Industry",
  type: "industry",
  keywords: ["fmcg","fast moving consumer goods","consumer goods","cpg","packaged goods"],
  overview: "The Fast-Moving Consumer Goods (FMCG) sector is one of the largest industries globally, encompassing everyday products like food, beverages, personal care, and household items. In India, it is the 4th largest sector in the economy, driven by rising rural demand, urbanization, and digital commerce.",
  metrics: [
    { label: "Market Size (India)", value: "$110B+", color: "blue" },
    { label: "Growth Rate", value: "8-10%", color: "green" },
    { label: "Top Player", value: "HUL", color: "purple" },
    { label: "Employment", value: "3M+ Direct", color: "cyan" }
  ],
  pestel: {
    political: ["Government's Make in India and Atmanirbhar Bharat initiatives support domestic manufacturing","GST implementation has streamlined taxation across states","FDI policy allows 100% investment in food processing and single-brand retail"],
    economic: ["Rising disposable incomes in Tier 2/3 cities driving premium product demand","Inflation impacts raw material costs (palm oil, packaging)","Rural consumption accounts for ~36% of total FMCG revenue"],
    social: ["Growing health & wellness consciousness shifting demand to organic and natural products","Nuclear families and working women driving demand for convenience products","D2C brands disrupting traditional FMCG with niche, purpose-driven products"],
    technological: ["AI-driven demand forecasting optimizing supply chains","Direct-to-consumer (D2C) channels reducing dependence on distributors","Smart packaging (QR codes, NFC) enabling consumer engagement"],
    environmental: ["Plastic waste regulations forcing shift to sustainable packaging","Carbon footprint reduction targets set by major players (HUL, Nestlé)","Water scarcity impacting manufacturing in drought-prone regions"],
    legal: ["FSSAI regulations tightening food safety and labeling standards","Advertising Standards Council of India (ASCI) guidelines on claims","BIS certification mandatory for several product categories"]
  },
  portersFiveForces: [
    { name: "Threat of New Entrants", rating: "Medium", desc: "Low capital barriers for niche/D2C brands, but distribution networks of incumbents are hard to replicate." },
    { name: "Bargaining Power of Suppliers", rating: "Low", desc: "Large FMCG companies have significant buying power and can switch suppliers." },
    { name: "Bargaining Power of Buyers", rating: "High", desc: "Low switching costs for consumers. Price sensitivity high in mass-market segments." },
    { name: "Threat of Substitutes", rating: "Medium", desc: "Unbranded/local alternatives exist in rural markets. D2C brands emerging as substitutes." },
    { name: "Competitive Rivalry", rating: "High", desc: "Intense competition among HUL, ITC, P&G, Nestlé, Dabur." }
  ],
  swot: {
    strengths: ["Massive distribution networks reaching 10M+ retail outlets in India","Strong brand equity built over decades","Economies of scale enabling competitive pricing","High repeat purchase rates create predictable revenue"],
    weaknesses: ["Thin margins in mass-market segments (5-15% net margin)","Heavy dependence on traditional retail channels in rural India","Difficulty in quickly adapting to rapidly changing consumer preferences","Counterfeit products eroding brand value in rural markets"],
    opportunities: ["Premiumization — consumers willing to pay more for quality/organic","Rising internet penetration enabling D2C and e-commerce growth","Health & wellness segment growing at 2x the overall FMCG rate","Untapped rural markets with improving infrastructure"],
    threats: ["Input cost volatility (crude oil, edible oil, packaging)","D2C disruptors capturing market share","Private labels undercutting prices","Regulatory changes around sustainability"]
  },
  gaps: [
    { title: "Sustainable Packaging Gap", desc: "Most FMCG companies still rely on single-use plastics. Massive opportunity for biodegradable packaging." },
    { title: "Rural Digital Commerce", desc: "Despite rising smartphone penetration, e-commerce in rural India is underleveraged." },
    { title: "Personalization at Scale", desc: "Large FMCG companies lack personalized product recommendations compared to D2C brands." },
    { title: "Men's Grooming Segment", desc: "The men's personal care segment remains underserved with significant growth potential." }
  ],
  recommendations: [
    { title: "Invest in D2C Channels", desc: "Build owned e-commerce platforms and subscription models." },
    { title: "Accelerate Premiumization", desc: "Launch premium sub-brands targeting urban millennials." },
    { title: "Strengthen Rural Distribution", desc: "Partner with kirana-tech platforms and self-help groups." },
    { title: "Adopt Circular Economy", desc: "Implement refill stations and recyclable packaging." },
    { title: "Leverage AI for Supply Chain", desc: "Use predictive analytics for demand planning and waste reduction." }
  ],
  valueChain: [
    { icon: "🌾", title: "Sourcing", desc: "Raw material procurement" },
    { icon: "🏭", title: "Manufacturing", desc: "Large-scale production" },
    { icon: "📦", title: "Packaging", desc: "Branding and labeling" },
    { icon: "🚛", title: "Distribution", desc: "Multi-tier distribution" },
    { icon: "🏪", title: "Retail", desc: "Modern trade and e-commerce" },
    { icon: "📣", title: "Marketing", desc: "ATL/BTL campaigns" }
  ]
},

"apple": {
  name: "Apple Inc.",
  type: "brand",
  keywords: ["apple","iphone","ipad","mac","macbook","apple watch","ios","tim cook"],
  overview: "Apple is the world's most valuable company ($3T+ market cap). Known for premium hardware-software integration across iPhone, Mac, iPad, Apple Watch, and services ecosystem. Apple's walled garden approach creates unmatched customer loyalty and ecosystem lock-in.",
  metrics: [
    { label: "Revenue", value: "$383B", color: "blue" },
    { label: "Market Cap", value: "$3.4T", color: "green" },
    { label: "Active Devices", value: "2.2B+", color: "purple" },
    { label: "Services Revenue", value: "$96B", color: "cyan" }
  ],
  pestel: {
    political: ["US-China tensions impacting supply chain","EU Digital Markets Act forcing sideloading","India as strategic manufacturing hub — 14% of iPhones now made there"],
    economic: ["Premium pricing limits addressable market in price-sensitive economies","Services revenue growing 15%+ annually — higher margin than hardware","Foreign exchange fluctuations impacting international pricing"],
    social: ["iPhone as a status symbol driving aspirational purchases globally","Privacy as a brand differentiator","Growing backlash against tech monopolies"],
    technological: ["Apple Silicon giving unprecedented power-efficiency advantage","Vision Pro entering spatial computing","AI integration (Apple Intelligence) keeping pace"],
    environmental: ["Carbon neutral across entire supply chain by 2030 target","Recycling robot (Daisy) disassembling 200 iPhones/hour","First carbon-neutral Apple Watch launched"],
    legal: ["Epic Games lawsuit forcing App Store payment changes","EU antitrust fines over market dominance","Right-to-repair legislation impacting service model"]
  },
  portersFiveForces: [
    { name: "Threat of New Entrants", rating: "Low", desc: "Massive barriers — ecosystem lock-in, brand loyalty, $30B/year R&D." },
    { name: "Bargaining Power of Suppliers", rating: "Low", desc: "Apple's scale gives enormous negotiating power. Custom silicon reduces dependence." },
    { name: "Bargaining Power of Buyers", rating: "Low", desc: "Ecosystem lock-in creates high switching costs. Brand loyalty among highest globally." },
    { name: "Threat of Substitutes", rating: "Medium", desc: "Android offers functional substitute but lacks ecosystem integration." },
    { name: "Competitive Rivalry", rating: "Medium", desc: "Limited direct rivals at premium tier. Samsung competes in hardware; Google in services." }
  ],
  swot: {
    strengths: ["Strongest brand in the world","Vertically integrated ecosystem","$160B+ cash reserves","92% iPhone retention rate"],
    weaknesses: ["Over-dependence on iPhone (52% of revenue)","Premium pricing limits emerging market share","Supply chain concentration in China and Taiwan","Innovation pace perceived as slowing"],
    opportunities: ["India — fastest-growing premium smartphone market","Services as high-margin growth engine","Vision Pro spatial computing","Healthcare via Apple Watch"],
    threats: ["AI gap vs Google and Microsoft","Regulatory pressure opening closed ecosystem","Chinese brands improving quality at lower prices","Global recession slowing premium spending"]
  },
  gaps: [
    { title: "AI/GenAI Capabilities", desc: "Apple's AI features lag behind Google Gemini and Microsoft Copilot." },
    { title: "Emerging Market Penetration", desc: "iPhone has <5% market share in India/Africa." },
    { title: "Enterprise/B2B Market", desc: "Apple's enterprise strategy is limited compared to Microsoft." },
    { title: "Foldable Device Category", desc: "Samsung leads in foldables. Apple has no foldable iPhone yet." }
  ],
  recommendations: [
    { title: "Win the AI Race", desc: "Invest in on-device AI, Siri 2.0, and developer AI tools." },
    { title: "India Strategy", desc: "Expand Apple Stores, increase manufacturing, launch affordable SE models." },
    { title: "Services Bundling", desc: "Create comprehensive Apple One subscription." },
    { title: "Healthcare Platform", desc: "Get Apple Watch FDA-cleared for more health monitoring." },
    { title: "Spatial Computing", desc: "Build Vision Pro developer ecosystem and reduce price." }
  ],
  valueChain: [
    { icon: "🎨", title: "Design", desc: "Industrial design, UX, innovation" },
    { icon: "🔬", title: "R&D", desc: "$30B/year — chip design, OS, AI" },
    { icon: "🏭", title: "Manufacturing", desc: "Foxconn, TSMC partnerships" },
    { icon: "🏪", title: "Retail", desc: "Apple Stores, authorized resellers" },
    { icon: "☁️", title: "Services", desc: "App Store, iCloud, Apple TV+" },
    { icon: "🔧", title: "Support", desc: "AppleCare, Genius Bar" }
  ]
},

"reliance": {
  name: "Reliance Industries Limited",
  type: "brand",
  keywords: ["reliance","ril","jio","mukesh ambani","reliance retail","jiomart"],
  overview: "Reliance is India's largest conglomerate ($240B+ revenue) spanning petrochemicals, telecom (Jio), retail (Reliance Retail), digital services, and new energy. Under Mukesh Ambani, it is transitioning from oil to digital and green energy.",
  metrics: [
    { label: "Revenue", value: "$240B+", color: "blue" },
    { label: "Market Cap", value: "$230B+", color: "green" },
    { label: "Jio Subscribers", value: "480M+", color: "purple" },
    { label: "Employees", value: "380K+", color: "cyan" }
  ],
  pestel: {
    political: ["Strong government relationships enabling mega-project approvals","Beneficiary of telecom, retail, and green energy policy support","Scrutiny around market dominance"],
    economic: ["Diversification reducing dependence on volatile O2C business","Jio's data revolution contributed ~1.5% to India's GDP","₹75,000 Cr new energy investment"],
    social: ["Jio democratized internet access for 480M+ Indians","Reliance Retail serving 300M+ customers across 18,000+ stores","Foundation's social initiatives in healthcare and education"],
    technological: ["In-house 5G network stack — unique globally","JioAI Cloud partnership with NVIDIA","Jio Brain AI platform for enterprise solutions"],
    environmental: ["₹75,000 Cr commitment to green hydrogen and solar","Jamnagar green energy hub targeting 100 GW renewable capacity","ESG transformation from fossil fuel to green energy leader"],
    legal: ["CCI investigations into Jio's pricing practices","Retail regulations on FDI — operating through franchise model","Petroleum sector compliance"]
  },
  portersFiveForces: [
    { name: "Threat of New Entrants", rating: "Low", desc: "Massive scale across telecom, retail, and petrochemicals creates insurmountable barriers." },
    { name: "Bargaining Power of Suppliers", rating: "Low", desc: "Reliance's scale and backward integration give immense bargaining power." },
    { name: "Bargaining Power of Buyers", rating: "Medium", desc: "Low switching costs in telecom. Compete on price in retail." },
    { name: "Threat of Substitutes", rating: "Low", desc: "Integrated ecosystem creates lock-in. Few can match breadth of services." },
    { name: "Competitive Rivalry", rating: "High", desc: "Competes with Airtel in telecom, Amazon/Flipkart in retail, ONGC in energy." }
  ],
  swot: {
    strengths: ["India's largest private sector company with unmatched scale","Jio platform with 480M+ subscribers — massive data moat","Integrated O2C-to-retail-to-digital ecosystem","Strategic investments from Google, Meta"],
    weaknesses: ["O2C business still contributes 50%+ EBITDA — commodity exposure","Retail profitability per store lower than global benchmarks","Organizational complexity of managing diverse conglomerate","Succession planning uncertainty"],
    opportunities: ["New energy — India's energy transition leader","JioAI and data monetization","Reliance Retail expanding into quick-commerce","Jio Financial Services — MSME lending"],
    threats: ["Regulatory backlash against market power","Green energy ROI uncertain for 5-7 years","Amazon/Flipkart intensifying competition","Global energy transition could strand O2C assets"]
  },
  gaps: [
    { title: "Quick-Commerce Gap", desc: "Reliance Retail lacks a strong quick-commerce play compared to Blinkit/Zepto." },
    { title: "Global Brand Recognition", desc: "Despite being India's largest, Reliance lacks global brand recognition." },
    { title: "Tech Talent", desc: "Competing with global tech giants for AI/ML talent." },
    { title: "Premium Consumer Experience", desc: "JioMart UX trails Amazon/Flipkart in sophistication." }
  ],
  recommendations: [
    { title: "Accelerate JioAI Platform", desc: "Build India's largest AI cloud for enterprises and government." },
    { title: "Quick-Commerce via JioMart", desc: "Deploy dark stores and 10-minute delivery in top 30 cities." },
    { title: "Green Hydrogen at Scale", desc: "Fast-track Jamnagar gigafactory." },
    { title: "Jio Financial Expansion", desc: "Leverage 480M users for lending, insurance, wealth management." },
    { title: "Global Brand Building", desc: "Take Jio and Retail brands international — Middle East and SE Asia." }
  ],
  valueChain: [
    { icon: "⛽", title: "O2C", desc: "Refining, petrochemicals" },
    { icon: "📡", title: "Telecom", desc: "Jio 4G/5G, broadband" },
    { icon: "🏪", title: "Retail", desc: "18,000+ stores, JioMart" },
    { icon: "💻", title: "Digital", desc: "JioSaavn, JioTV, JioAI" },
    { icon: "🔋", title: "New Energy", desc: "Solar, green hydrogen" },
    { icon: "💰", title: "Financial", desc: "Jio Financial Services" }
  ]
}

};
