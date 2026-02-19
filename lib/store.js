/**
 * lib/store.js — Definitive F1 Historical & Professional Store (2020-2026)
 * Strategy:
 * - Full Archive Recovery (131 Races, 150+ Standings)
 * - Personnel Continuity (Principals, Engineers, Reserves by Era)
 * - 2026 Technical Revolution Forward-Porting
 */

const proxy = (url) => `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=800&fit=cover`;

// ─── Teams (Definitive Grid 2026 with Historical Metadata) ─────────────────
let teams = [
  {
    id: 1, name: "Red Bull Racing", fullName: "Oracle Red Bull Racing", teamPrincipal: "Christian Horner", budgetCap: 135, nationality: "Austrian",
    logoUrl: proxy("https://media.designrush.com/inspiration_images/732056/conversions/Red-Bull-Logo-SVG-desktop.jpg"),
    carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/red-bull-racing.png",
    history: "Founded in 2005 from the remnants of Jaguar Racing, Red Bull transformed from a 'party team' into a technical powerhouse. Under Adrian Newey's design genius, they dominated the V8 era and redefined records with Max Verstappen in the 2020s.",
    achievements: ["6 Constructor World Titles", "7 Driver World Titles", "100+ GP Victories", "Record 19 wins in 2023"],
    improvements: ["Next-Gen Red Bull Ford PU Integration", "Refined 2026 Floor Aerodynamics", "High-Efficiency ERS Recovery"],
    driverComments: "The car feels incredibly stable on the limit. The technical shift for 2026 is ambitious, but our data correlation is perfect.",
    powerunit: "Red Bull Ford",
    personnel: {
      2026: { principal: "Christian Horner", engineers: ["G. Lambiase", "R. Wood"], reserves: ["TBC"] }
    }
  },
  {
    id: 2, name: "Ferrari", fullName: "Scuderia Ferrari", teamPrincipal: "Frédéric Vasseur", budgetCap: 135, nationality: "Italian",
    logoUrl: proxy("https://fabrikbrands.com/wp-content/uploads/Ferrari-F1-Logo-1-1155x770.png"),
    carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/ferrari.png",
    history: "The only team to compete in every season since 1950. Ferrari is more than a racing team; it is an institution. From Schumacher's dominance to the 2025 arrival of Hamilton, the Prancing Horse remains the heart of Formula 1.",
    achievements: ["16 Constructor World Titles", "15 Driver World Titles", "240+ GP Victories", "Most successful team in history"],
    improvements: ["Hyper-Efficient Maranello ICE", "Ultra-Lightweight Suspension Geometry", "AI-Driven Elastic Aero Mapping"],
    driverComments: "Driving for Ferrari is incomparable. The 2026 power unit has immense soul, and the low-speed mechanical grip is revolutionary.",
    powerunit: "Ferrari",
    personnel: {
      2026: { principal: "Frédéric Vasseur", engineers: ["P. Bonnington", "B. Bozzi"], reserves: ["A. Giovinazzi"] }
    }
  },
  {
    id: 3, name: "Mercedes", fullName: "Mercedes-AMG PETRONAS", teamPrincipal: "Toto Wolff", budgetCap: 135, nationality: "German",
    logoUrl: proxy("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mercedes-AMG_Petronas_Formula_One_Team_Logo_%282026%29.webp/500px-Mercedes-AMG_Petronas_Formula_One_Team_Logo_%282026%29.webp.png"),
    carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/mercedes.png",
    history: "Definers of the hybrid era, Mercedes secured eight consecutive constructor titles. Post-Hamilton, the team is pivoting towards a youth-led revolution with Antonelli and Russell, focusing on 2026 technical supremacy.",
    achievements: ["8 Constructor World Titles", "7 Driver World Titles", "125+ GP Victories", "Hybrid Era dominance"],
    improvements: ["Fourth-Gen Brixworth PU", "Active Aero Drag Reduction System", "Next-Gen Carbon Fiber Integration"],
    driverComments: "We are building for the future. The data from the simulator regarding the 2026 power levels is staggering.",
    powerunit: "Mercedes",
    personnel: {
      2026: { principal: "Toto Wolff", engineers: ["R. Musconi", "M. Dudley"], reserves: ["K. Antonelli"] }
    }
  },
  {
    id: 4, name: "McLaren", fullName: "McLaren Formula 1 Team", teamPrincipal: "Andrea Stella", budgetCap: 135, nationality: "British",
    logoUrl: proxy("https://fabrikbrands.com/wp-content/uploads/F1-Team-logos-3-1536x960.png"),
    carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/mclaren.png",
    history: "The legendary Woking squad, founded by Bruce McLaren. After a difficult decade, the team emerged as a title challenger in 2024, winning the Drivers' Championship with Lando Norris and establishing a new 'Papaya Era'.",
    achievements: ["8 Constructor World Titles", "12 Driver World Titles", "180+ GP Victories", "2024 Championship Breakthrough"],
    improvements: ["Woking Wind Tunnel Optimization", "Advanced Brake Cooling Solutions", "Optimized Front-Wing Elasticity"],
    driverComments: "The papaya car is the best project on the grid right now. We have the momentum and the technical tools to stay at the front.",
    powerunit: "Mercedes",
    personnel: {
      2026: { principal: "Andrea Stella", engineers: ["W. Joseph", "T. Stallard"], reserves: ["Pato O'Ward"] }
    }
  },
  {
    id: 5, name: "Aston Martin", fullName: "Aston Martin Aramco", teamPrincipal: "Mike Krack", budgetCap: 135, nationality: "British",
    logoUrl: proxy("https://fabrikbrands.com/wp-content/uploads/F1-Team-logos-8-1536x960.png"),
    carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/aston-martin.png",
    history: "The green marque's return to F1, backed by Lawrence Stroll. With a state-of-the-art campus and the signing of Adrian Newey for the 2025 era, Aston Martin is building toward a championship-contending future.",
    achievements: ["Aggressive Podium Growth", "Elite Technical Campus Expansion", "Signing of Adrian Newey (2025)"],
    improvements: ["Silverstone AMR Wind Tunnel", "Honda Power Unit Integration (2026)", "Advanced Thermal Management"],
    driverComments: "This team is growing at an incredible rate. Every technical update brings genuine performance gains.",
    powerunit: "Honda"
  },
  {
    id: 6, name: "Alpine", fullName: "BWT Alpine F1 Team", teamPrincipal: "Oliver Oakes", budgetCap: 135, nationality: "French",
    logoUrl: proxy("https://fabrikbrands.com/wp-content/uploads/F1-Team-logos-6-1536x960.png"),
    carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/alpine.png",
    history: "The works team for the Renault Group. Born from the Enstone legacy that secured titles with Alonso, Alpine is now restructuring for the 2026 era, focusing on the latest technical and leadership changes.",
    achievements: ["2 Constructor World Titles (Renault)", "Enstone Engineering Legacy", "Maiden Win in Hungary (2021)"],
    improvements: ["Viry-Châtillon Technical Pivot", "New Leadership Structure (2025)", "Optimized Aero Efficiency"],
    driverComments: "We are in the middle of a massive transformation. The 2026 regulations will provide the reset we need.",
    powerunit: "Renault"
  },
  {
    id: 7, name: "Williams", fullName: "Williams Racing", teamPrincipal: "James Vowles", budgetCap: 135, nationality: "British",
    logoUrl: proxy("https://fabrikbrands.com/wp-content/uploads/F1-Team-logos-11-1536x960.png"),
    carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/williams.png",
    history: "One of the sport's greatest names, founded by Sir Frank Williams. After a period of decline, Williams is enjoying a technical renaissance under James Vowles and the starring performances of Alex Albon.",
    achievements: ["9 Constructor World Titles", "7 Driver World Titles", "114 GP Victories", "Modern Era Resurgence"],
    improvements: ["Grove Infrastructure Overhaul", "Advanced Simulation Technology", "Enhanced Rear-End Aero Stability"],
    driverComments: "We are no longer just surviving; we are competing. The technical upgrades are finally hitting the track as expected.",
    powerunit: "Mercedes"
  },
  {
    id: 8, name: "Sauber", fullName: "Stake F1 Team", teamPrincipal: "A. Alunni Bravi", budgetCap: 135, nationality: "Swiss",
    logoUrl: proxy("https://i.namu.wiki/i/WwY-6r8G-rXddW5pr79iJMcnZwycOaxVgPBqdhWEyhKL3Qa9xZ_lTM5n9PdzYWieTzFEXJDWHr2JJe4_aW34d_tWLCkiHLfPNcYxdmtl8TvONp64eBOX548tGEvB6YPKu6FXmJjSGYOqA_WxX1zgHg.webp"),
    carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/kick-sauber.png",
    history: "The Swiss engineering stalwarts based in Hinwil. Known for technical efficiency and nurturing world-class talent like Räikkönen and Leclerc, Sauber is currently transitioning into the Audi factory era.",
    achievements: ["Winner of the 2008 Canadian GP", "Nurtured multiple F1 World Champions", "Renowned Hinwil Wind Tunnel Facility"],
    improvements: ["Integration of Audi technical consultants", "New sidepod cooling architecture", "Optimized kinetic energy recovery mapping"],
    driverComments: "We are in a holding pattern for the 2026 Audi takeover. Data gathering for the next era is the priority.",
    powerunit: "Ferrari"
  },
  {
    id: 9, name: "Haas", fullName: "MoneyGram Haas F1", teamPrincipal: "Ayao Komatsu", budgetCap: 135, nationality: "American",
    logoUrl: proxy("https://fabrikbrands.com/wp-content/uploads/F1-Team-logos-9-1536x960.png"),
    carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/haas-f1-team.png",
    history: "The only American team on the grid. Haas entered F1 in 2016 with a unique partnership model with Ferrari. Under Ayao Komatsu, the team is focusing on eliminating historical tire degradation issues.",
    achievements: ["P5 Finish in 2018 Constructor Standings", "Multiple points-scoring debuts", "Fastest pit stop awards in 2023"],
    improvements: ["Revised rear suspension for tire survival", "New technical partnership with TGR", "Integrated aero-sensing instrumentation"],
    driverComments: "The car finally treats its tires with respect. We can actually maintain our qualifying pace on Sunday.",
    powerunit: "Ferrari"
  },
  {
    id: 10, name: "RB", fullName: "Visa Cash App RB", teamPrincipal: "Laurent Mekies", budgetCap: 135, nationality: "Italian",
    logoUrl: proxy("https://cdn.mos.cms.futurecdn.net/HgUd57xGGiDepPKKZ7ocZM-970-80.jpg.webp"),
    carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/rb.png",
    history: "Formerly Toro Rosso and AlphaTauri, the Faenza squad rebranded to RB in 2024. The team is forging an independent technical identity while remaining the primary testing ground for Red Bull technology.",
    achievements: ["Winners of 2008 & 2020 Italian GPs", "Pivotal Red Bull Junior Team graduates", "Record points haul in 2021"],
    improvements: ["Increased technical synergy with Red Bull Technologies", "Faenza campus facility modernization", "Front-end aerodynamic stability focus"],
    driverComments: "This isn't just a 'junior' team anymore. The VCARB project has its own technical soul and genuine pace.",
    powerunit: "Red Bull Ford"
  },
  {
    id: 11, name: "Audi", fullName: "Audi F1 Team", teamPrincipal: "Mattia Binotto", budgetCap: 135, nationality: "German",
    logoUrl: proxy("https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Audif1.com_logo17.svg/512px-Audif1.com_logo17.svg.png"),
    carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/kick-sauber.png",
    history: "Audi's entry into the pinnacle of motorsport. Following success in Le Mans and Formula E, the Four Rings have acquired Sauber for the 2026 era, bringing German engineering precision to F1.",
    achievements: ["Successful acquisition of Hinwil infrastructure", "First fire-up of 2026 Audi Power Unit", "Signing of marquee technical staff"],
    improvements: ["All-new Neuburg-built Power Unit", "Advanced sustainable fuel integration", "Proprietary Audi aero-simulation software"],
    driverComments: "The focus is 100% on 2026. Every lap we do now is a data-gathering exercise for the Audi era.",
    powerunit: "Audi"
  },
  {
    id: 12, name: "Cadillac", fullName: "Cadillac F1 Team", teamPrincipal: "Michael Andretti", budgetCap: 135, nationality: "American",
    logoUrl: proxy("https://news.gm.com/content/Pages/news/us/en/2025/may/0503-f1/_jcr_content/boilerplate/image.img.jpg/Cadillac-Formula-1-Team-Logo.jpg"),
    carImageUrl: "https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/haas-f1-team.png",
    history: "The arrival of an American manufacturing giant. Cadillac joins the grid for the 2026 era, bringing the legendary GM performance heritage to compete at the highest level of motorsport.",
    achievements: ["Successful entry approval for 2026 era", "Inaugural factory infrastructure setup", "Strategic technical partnerships secured"],
    improvements: ["GM-designed ERS-K energy recovery", "Advanced composite material research", "Optimized CFD cooling for 2026 regs"],
    driverComments: "We are the new kids on the block, but with the weight of Cadillac behind us, the technical potential is limitless.",
    powerunit: "Ferrari (Customer)"
  }
];

// ─── Drivers (Definitive 2020-2026 Archive with Intelligence Metadata) ───
let drivers = [
  {
    id: 1, name: "Max Verstappen", number: 1, teamId: 1, nationality: "DUTCH", careerWins: 78, championships: 4,
    podiums: 112, poles: 42, fastestLaps: 34,
    imageUrl: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png",
    coverImageUrl: "/images/drivers/verstappen-cover.jpg",
    bio: "The defining force of the ground-effect era. Verstappen's clinical precision and relentless race pace have rewritten the record books, notably in 2023 with 19 victories.",
    specs: { height: "1.81m", weight: "72kg", blood: "O+", entry: "2015", favTrack: "Spa-Francorchamps" },
    tacticalStyle: "AGGRESSIVE_PRECISION // ELITE_TIRE_SURVIVAL",
    careerPoints: [
      { year: 2021, note: "Maiden World Title in Abu Dhabi Finale" },
      { year: 2023, note: "Record 10 consecutive Grand Prix wins" },
      { year: 2026, note: "Leading Red Bull-Ford technical evolution" }
    ],
    socials: {
      instagram: "https://instagram.com/maxverstappen1",
      twitter: "https://twitter.com/Max33Verstappen",
      web: "https://verstappen.com"
    }
  },
  {
    id: 4, name: "Lewis Hamilton", number: 44, teamId: 2, nationality: "BRITISH", careerWins: 106, championships: 7,
    podiums: 201, poles: 104, fastestLaps: 67,
    imageUrl: "/images/drivers/hamilton-profile.webp",
    coverImageUrl: "/images/drivers/hamilton-cover.jpg",
    bio: "Statistically the most successful driver in F1 history. Hamilton's 2025 transition to Ferrari marked the most significant driver transfer in the sport's history.",
    specs: { height: "1.74m", weight: "73kg", blood: "A-", entry: "2007", favTrack: "Silverstone" },
    tacticalStyle: "DYNAMIC_ADAPTATION // WET_WEATHER_SPECIALIST",
    careerPoints: [
      { year: 2020, note: "Equalised Michael Schumacher's 7 titles" },
      { year: 2024, note: "Emotional final Silverstone win with Mercedes" },
      { year: 2025, note: "Inaugural season with Scuderia Ferrari" }
    ],
    socials: {
      instagram: "https://instagram.com/lewishamilton",
      twitter: "https://twitter.com/LewisHamilton",
      web: "https://lewishamilton.com"
    }
  },
  {
    id: 5, name: "Charles Leclerc", number: 16, teamId: 2, nationality: "MONEGASQUE", careerWins: 8, championships: 0,
    podiums: 38, poles: 26, fastestLaps: 10,
    imageUrl: "/images/drivers/leclerc-profile.webp",
    coverImageUrl: "/images/drivers/leclerc-cover.jpg",
    bio: "The Prince of Monaco and Ferrari's qualifying specialist. Known for breathtaking one-lap pace and a deep emotional connection to the Tifosi.",
    specs: { height: "1.80m", weight: "69kg", blood: "O-", entry: "2018", favTrack: "Monaco" },
    tacticalStyle: "ONE_LAP_WIZARDRY // STREET_CIRCUIT_MASTERY",
    careerPoints: [
      { year: 2019, note: "Back-to-back wins at Spa and Monza" },
      { year: 2024, note: "Historic home victory in Monaco" },
      { year: 2026, note: "Championship contender with technical reset" }
    ],
    socials: {
      instagram: "https://instagram.com/charles_leclerc",
      twitter: "https://twitter.com/Charles_Leclerc",
      web: "https://charlesleclerc.com"
    }
  },
  {
    id: 10, name: "Lando Norris", number: 4, teamId: 4, nationality: "BRITISH", careerWins: 4, championships: 1,
    podiums: 28, poles: 8, fastestLaps: 9,
    imageUrl: "/images/drivers/norris-profile.webp",
    coverImageUrl: "/images/drivers/norris-cover.jpg",
    bio: "McLaren's homegrown champion. Norris's 2024 title charge signaled the end of Red Bull's absolute dominance and established him as a premier tier pilot.",
    specs: { height: "1.70m", weight: "68kg", blood: "AB+", entry: "2019", favTrack: "Red Bull Ring" },
    tacticalStyle: "CLINICAL_CONSISTENCY // HIGH_STAKES_COMPOSURE",
    careerPoints: [
      { year: 2021, note: "Heartbreak and heroics in Sochi" },
      { year: 2024, note: "Maiden win in Miami; World Champion" },
      { year: 2025, note: "Defending the title against converging field" }
    ]
  },
  { id: 41, name: "Valtteri Bottas", number: 77, teamId: 12, nationality: "FINNISH", careerWins: 10, championships: 0, imageUrl: "/images/drivers/bottas-profile.webp", bio: "Ten-time race winner and pivotal engine of Mercedes' constructor dominance. Now leading Cadillac's technical entry.", specs: { height: "1.73m", weight: "69kg", blood: "B+", entry: "2013" } },
  { id: 34, name: "Sergio Perez", number: 11, teamId: 12, nationality: "MEXICAN", careerWins: 6, championships: 0, imageUrl: "/images/drivers/perez-profile.webp", bio: "The 'Minister of Defence'. Famous for legendary tire management and crucial supporting roles in championship battles.", specs: { height: "1.73m", weight: "71kg", entry: "2011" }, socials: { instagram: "https://instagram.com/schecoperez", twitter: "https://twitter.com/SChecoPerez", web: "https://sergioperez.mx" } },
  { id: 53, name: "Daniel Ricciardo", number: 3, teamId: 8, nationality: "AUSTRALIAN", careerWins: 8, championships: 0, imageUrl: "/images/drivers/ricciardo-profile.webp", bio: "The Honey Badger. Renowned for late-braking overtakes and infectious charisma. Led McLaren to their first win in a decade at Monza 2021.", specs: { height: "1.79m", weight: "68kg", entry: "2011" }, socials: { instagram: "https://instagram.com/danielricciardo", twitter: "https://twitter.com/danielricciardo", web: "https://danielricciardo.com" } },
  { id: 35, name: "Carlos Sainz", number: 55, teamId: 7, nationality: "SPANISH", careerWins: 4, championships: 0, imageUrl: "/images/drivers/sainz-profile.webp", coverImageUrl: "/images/drivers/sainz-cover.jpg", bio: "The 'Smooth Operator'. Strategically brilliant and technically astute. The only non-Red Bull winner of the 2023 season.", specs: { height: "1.78m", weight: "66kg", entry: "2015" }, socials: { instagram: "https://instagram.com/carlossainz55", twitter: "https://twitter.com/Carlossainz55", web: "https://carlossainz.es" } },
  { id: 66, name: "Alex Albon", number: 23, teamId: 7, nationality: "THAI", careerWins: 0, championships: 0, imageUrl: "/images/drivers/albon-profile.webp", coverImageUrl: "/images/drivers/albon-cover.jpg", bio: "Resilient and technically gifted. Albon rebuilt his career with Williams, becoming the cornerstone of the team's return to the midfield.", specs: { height: "1.86m", weight: "74kg", entry: "2019" } },
  { id: 44, name: "Pierre Gasly", number: 10, teamId: 6, nationality: "FRENCH", careerWins: 1, championships: 0, imageUrl: "/images/drivers/gasly-profile.webp", coverImageUrl: "/images/drivers/gasly-cover.jpg", bio: "A winner against the odds. Gasly's Monza 2020 victory remains one of the modern era's most emotional triumphs.", specs: { height: "1.77m", weight: "70kg", entry: "2017" } },
  { id: 45, name: "Lance Stroll", number: 18, teamId: 5, nationality: "CANADIAN", careerWins: 0, championships: 0, imageUrl: "/images/drivers/stroll-profile.webp" },
  { id: 46, name: "Esteban Ocon", number: 31, teamId: 10, nationality: "FRENCH", careerWins: 1, championships: 0, imageUrl: "/images/drivers/ocon-profile.webp", bio: "Hungary 2021 winner. Known for tough defensive driving and technical consistency." },
  { id: 50, name: "Sebastian Vettel", number: 5, teamId: 5, nationality: "GERMAN", careerWins: 53, championships: 4, status: "Retired", imageUrl: "/images/drivers/vettel-profile.webp", bio: "Four-time World Champion and advocate for sustainability. His move to Aston Martin in 2021 signaled a new chapter for the legendary marque." },
  { id: 58, name: "Daniil Kvyat", number: 26, teamId: 8, nationality: "RUSSIAN", careerWins: 0, championships: 0, status: "Former", imageUrl: "/images/drivers/kvyat-profile.webp" },
  { id: 15, name: "Nico Hülkenberg", number: 27, teamId: 11, nationality: "GERMAN", careerWins: 0, championships: 0, imageUrl: "/images/drivers/hulkenberg-profile.webp", bio: "The master of recovery. Renowned for qualifying excellence and stepping in as the ultimate reserve for multiple teams." },
  { id: 51, name: "Kimi Räikkönen", number: 7, teamId: 9, nationality: "FINNISH", careerWins: 21, championships: 1, status: "Retired", imageUrl: "/images/drivers/raikkonen-profile.webp", bio: "The Iceman. 2007 World Champion and a fan favorite for his deadpan delivery and immense natural speed." },
  { id: 54, name: "Antonio Giovinazzi", number: 99, teamId: 9, nationality: "ITALIAN", status: "Former", imageUrl: "/images/drivers/giovinazzi-profile.webp" },
  {
    id: 68, name: "George Russell", number: 63, teamId: 3, nationality: "BRITISH", careerWins: 3, championships: 0,
    imageUrl: "/images/drivers/russell-profile.webp",
    coverImageUrl: "/images/drivers/russell-cover.jpg",
    bio: "Mr. Consistency. Promoted to Mercedes in 2022, Russell immediately proved his worth with a win in Brazil and consistent podium finishes.", specs: { height: "1.85m", weight: "70kg", entry: "2019" },
    socials: { instagram: "https://instagram.com/georgerussell63", twitter: "https://twitter.com/GeorgeRussell63", web: "https://georgerussell63.com" }
  },
  { id: 56, name: "Romain Grosjean", number: 8, teamId: 10, nationality: "FRENCH", status: "Retired", imageUrl: "/images/drivers/grosjean-profile.webp" },
  { id: 57, name: "Kevin Magnussen", number: 20, teamId: 10, nationality: "DANISH", status: "Retired", imageUrl: "/images/drivers/magnussen-profile.webp" },
  { id: 61, name: "Nicholas Latifi", number: 6, teamId: 7, nationality: "CANADIAN", status: "Former", imageUrl: "/images/drivers/latifi-profile.webp" },
  { id: 62, name: "Jack Aitken", number: 89, teamId: 7, nationality: "BRITISH", status: "Former", imageUrl: "/images/drivers/aitken-profile.webp" },
  { id: 63, name: "Pietro Fittipaldi", number: 51, teamId: 10, nationality: "BRAZILIAN", status: "Former", imageUrl: "/images/drivers/fittipaldi-profile.webp" },
  { id: 64, name: "Nyck de Vries", number: 21, teamId: 8, nationality: "DUTCH", status: "Former", imageUrl: "/images/drivers/devries-profile.webp" },
  { id: 13, name: "Fernando Alonso", number: 14, teamId: 5, nationality: "SPANISH", careerWins: 32, championships: 2, imageUrl: "/images/drivers/alonso-profile.webp", coverImageUrl: "/images/drivers/alonso-cover.jpg", bio: "The ultimate gladiator. A two-time champion who returned in 2021 to prove that age is just a number, continuing to secure podiums into the 2025 season.", specs: { height: "1.71m", weight: "68kg", entry: "2001" }, socials: { instagram: "https://instagram.com/fernandoalo_oficial", twitter: "https://twitter.com/alo_oficial", web: "https://fernandoalonso.com" } },
  { id: 22, name: "Yuki Tsunoda", number: 22, teamId: 8, nationality: "JAPANESE", careerWins: 0, championships: 0, imageUrl: "/images/drivers/tsunoda-profile.webp", coverImageUrl: "/images/drivers/tsunoda-cover.jpg", bio: "High-energy and technically sharp. Tsunoda has evolved from a fiery rookie into a seasoned lead driver for the RB project.", specs: { height: "1.59m", weight: "54kg", entry: "2021" } },
  { id: 59, name: "Mick Schumacher", number: 47, teamId: 10, nationality: "GERMAN", status: "Former", imageUrl: "/images/drivers/mickschumacher-profile.webp" },
  {
    id: 70, name: "Oscar Piastri", number: 81, teamId: 4, nationality: "AUSTRALIAN", careerWins: 13, championships: 0,
    imageUrl: "/images/drivers/piastri-profile.webp",
    coverImageUrl: "/images/drivers/piastri-cover.jpg",
    bio: "The Ice-Cool Aussie. Piastri’s calm demeanor Belies a ruthless efficiency that has seen him challenge the very best since his 2023 debut.", specs: { height: "1.78m", weight: "68kg", entry: "2023" },
    socials: { instagram: "https://instagram.com/oscarpiastri", twitter: "https://twitter.com/OscarPiastri", web: "https://oscarpiastri.com" }
  },
  { id: 71, name: "Zhou Guanyu", number: 24, teamId: 9, nationality: "CHINESE", status: "Former", imageUrl: "/images/drivers/zhou-profile.webp" },
  { id: 72, name: "Liam Lawson", number: 40, teamId: 8, nationality: "NEW ZEALANDER", careerWins: 0, championships: 0, imageUrl: "/images/drivers/lawson-profile.webp", coverImageUrl: "/images/drivers/lawson-cover.jpg", bio: "New Zealand's rising star. Lawson impressed with immediate points in 2023 and has secured his place as a mainstay on the grid.", specs: { height: "1.74m", weight: "65kg", entry: "2023" } },
  { id: 73, name: "Logan Sargeant", number: 2, teamId: 7, nationality: "AMERICAN", status: "Former", imageUrl: "/images/drivers/sargeant-profile.webp" },
  { id: 81, name: "Franco Colapinto", number: 43, teamId: 6, nationality: "ARGENTINE", careerWins: 0, championships: 0, imageUrl: "https://blob.postadeportes.com/images/2025/06/04/franco-colapinto-divide-opiniones-tras-su-participacion-con-alpine-en-f1-5bd6c551-focus-0-0-1292-860.webp", bio: "Argentina's F1 revival. Colapinto’s rapid ascent through the ranks has brought a whole new continent's worth of passion back to the sport.", specs: { height: "1.76m", weight: "67kg", entry: "2024" } },
  { id: 82, name: "Oliver Bearman", number: 38, teamId: 10, nationality: "BRITISH", careerWins: 0, championships: 0, imageUrl: "/images/drivers/bearman-profile.webp", coverImageUrl: "/images/drivers/bearman-cover.jpg", bio: "The youngest British driver in F1 history. His shock Ferrari debut in Jeddah 2024 marked him as a future superstar.", specs: { height: "1.84m", weight: "68kg", entry: "2024" } },
  { id: 83, name: "Kimi Antonelli", number: 12, teamId: 3, nationality: "ITALIAN", careerWins: 2, championships: 0, imageUrl: "https://i0.wp.com/lagazzettadelticino.com/wp-content/uploads/2025/05/Kimi_Antonelli.webp?resize=768%2C640&ssl=1", bio: "The chosen successor. Handpicked by Toto Wolff to fill the massive seat left by Hamilton, Antonelli represents the future of Mercedes.", specs: { height: "1.76m", weight: "66kg", entry: "2025" } },
  { id: 84, name: "Isack Hadjar", number: 33, teamId: 1, nationality: "FRENCH", careerWins: 0, championships: 0, imageUrl: "/images/drivers/hadjar-profile.webp", bio: "Red Bull's next aggressive pilot. Hadjar brings a fearless attacking style honed in the high-pressure Red Bull Junior Team environment.", specs: { height: "1.70m", weight: "66kg", entry: "2025" } },
  { id: 85, name: "Gabriel Bortoleto", number: 5, teamId: 11, nationality: "BRAZILIAN", careerWins: 0, championships: 0, imageUrl: "https://cdn-7.motorsport.com/images/mgl/27NQLaX0/s300/gabriel-bortoleto-audi-f1-team.webp", bio: "A champion in the making. Bortoleto joins Sauber-Audi with a pedigree of winning everywhere he competes.", specs: { height: "1.78m", weight: "67kg", entry: "2025" } },
  { id: 100, name: "Arvid Lindblad", number: 41, teamId: 8, nationality: "BRITISH", careerWins: 0, championships: 0, imageUrl: "/images/drivers/albon-profile.webp", bio: "The 2026 rookie sensation. Lindblad joins RB with massive hype as the latest prodigy from the British racing scene.", specs: { height: "1.75m", weight: "65kg", entry: "2026" } }
];

export const teamsStore = { getAll: () => [...teams], getById: (id) => teams.find(t => t.id === Number(id)) };
export const driversStore = { getAll: () => [...drivers], getById: (id) => drivers.find(d => d.id === Number(id)) };

// ─── Races (Definitive 131-Race Historical Record) ────────────────────────
let races = [
  // 2020 (17 Rounds)
  { id: 2001, round: 1, name: "Austrian GP", circuit: "Red Bull Ring", date: "2020-07-05", season: 2020, winnerName: "Valtteri Bottas", poleName: "Valtteri Bottas" },
  { id: 2002, round: 2, name: "Styrian GP", circuit: "Red Bull Ring", date: "2020-07-12", season: 2020, winnerName: "Lewis Hamilton", poleName: "Lewis Hamilton" },
  { id: 2003, round: 3, name: "Hungarian GP", circuit: "Hungaroring", date: "2020-07-19", season: 2020, winnerName: "Lewis Hamilton", poleName: "Lewis Hamilton" },
  { id: 2004, round: 4, name: "British GP", circuit: "Silverstone", date: "2020-08-02", season: 2020, winnerName: "Lewis Hamilton", poleName: "Lewis Hamilton" },
  { id: 2005, round: 5, name: "70th Anniv. GP", circuit: "Silverstone", date: "2020-08-09", season: 2020, winnerName: "Max Verstappen", poleName: "Valtteri Bottas" },
  { id: 2006, round: 6, name: "Spanish GP", circuit: "Barcelona", date: "2020-08-16", season: 2020, winnerName: "Lewis Hamilton", poleName: "Lewis Hamilton" },
  { id: 2007, round: 7, name: "Belgian GP", circuit: "Spa", date: "2020-08-30", season: 2020, winnerName: "Lewis Hamilton", poleName: "Lewis Hamilton" },
  { id: 2008, round: 8, name: "Italian GP", circuit: "Monza", date: "2020-09-06", season: 2020, winnerName: "Pierre Gasly", poleName: "Lewis Hamilton" },
  { id: 2009, round: 9, name: "Tuscan GP", circuit: "Mugello", date: "2020-09-13", season: 2020, winnerName: "Lewis Hamilton", poleName: "Lewis Hamilton" },
  { id: 2010, round: 10, name: "Russian GP", circuit: "Sochi", date: "2020-09-27", season: 2020, winnerName: "Valtteri Bottas", poleName: "Lewis Hamilton" },
  { id: 2011, round: 11, name: "Eifel GP", circuit: "Nürburgring", date: "2020-10-11", season: 2020, winnerName: "Lewis Hamilton", poleName: "Valtteri Bottas" },
  { id: 2012, round: 12, name: "Portuguese GP", circuit: "Portimão", date: "2020-10-25", season: 2020, winnerName: "Lewis Hamilton", poleName: "Lewis Hamilton" },
  { id: 2013, round: 13, name: "Emilia Romagna GP", circuit: "Imola", date: "2020-11-01", season: 2020, winnerName: "Lewis Hamilton", poleName: "Valtteri Bottas" },
  { id: 2014, round: 14, name: "Turkish GP", circuit: "Istanbul", date: "2020-11-15", season: 2020, winnerName: "Lewis Hamilton", poleName: "Lance Stroll" },
  { id: 2015, round: 15, name: "Bahrain GP", circuit: "Sakhir", date: "2020-11-29", season: 2020, winnerName: "Lewis Hamilton", poleName: "Lewis Hamilton" },
  { id: 2016, round: 16, name: "Sakhir GP", circuit: "Sakhir", date: "2020-12-06", season: 2020, winnerName: "Sergio Pérez", poleName: "Valtteri Bottas" },
  { id: 2017, round: 17, name: "Abu Dhabi GP", circuit: "Yas Marina", date: "2020-12-13", season: 2020, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  // 2021 (Full 22 Rounds)
  { id: 2101, round: 1, name: "Bahrain GP", season: 2021, winnerName: "Lewis Hamilton", poleName: "Max Verstappen" },
  { id: 2102, round: 2, name: "Emilia Romagna GP", season: 2021, winnerName: "Max Verstappen", poleName: "Lewis Hamilton" },
  { id: 2103, round: 3, name: "Portuguese GP", season: 2021, winnerName: "Lewis Hamilton", poleName: "Valtteri Bottas" },
  { id: 2104, round: 4, name: "Spanish GP", season: 2021, winnerName: "Lewis Hamilton", poleName: "Lewis Hamilton" },
  { id: 2105, round: 5, name: "Monaco GP", season: 2021, winnerName: "Max Verstappen", poleName: "Charles Leclerc" },
  { id: 2106, round: 6, name: "Azerbaijan GP", season: 2021, winnerName: "Sergio Pérez", poleName: "Charles Leclerc" },
  { id: 2107, round: 7, name: "French GP", season: 2021, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2108, round: 8, name: "Styrian GP", season: 2021, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2109, round: 9, name: "Austrian GP", season: 2021, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2110, round: 10, name: "British GP", season: 2021, winnerName: "Lewis Hamilton", poleName: "Max Verstappen" },
  { id: 2111, round: 11, name: "Hungarian GP", season: 2021, winnerName: "Esteban Ocon", poleName: "Lewis Hamilton" },
  { id: 2112, round: 12, name: "Belgian GP", season: 2021, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2113, round: 13, name: "Dutch GP", season: 2021, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2114, round: 14, name: "Italian GP", season: 2021, winnerName: "Daniel Ricciardo", poleName: "Max Verstappen" },
  { id: 2115, round: 15, name: "Russian GP", season: 2021, winnerName: "Lewis Hamilton", poleName: "Lando Norris" },
  { id: 2116, round: 16, name: "Turkish GP", season: 2021, winnerName: "Valtteri Bottas", poleName: "Valtteri Bottas" },
  { id: 2117, round: 17, name: "USA GP", season: 2021, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2118, round: 18, name: "Mexico City GP", season: 2021, winnerName: "Max Verstappen", poleName: "Valtteri Bottas" },
  { id: 2119, round: 19, name: "Sao Paulo GP", season: 2021, winnerName: "Lewis Hamilton", poleName: "Valtteri Bottas" },
  { id: 2120, round: 20, name: "Qatar GP", season: 2021, winnerName: "Lewis Hamilton", poleName: "Lewis Hamilton" },
  { id: 2121, round: 21, name: "Saudi Arabian GP", season: 2021, winnerName: "Lewis Hamilton", poleName: "Lewis Hamilton" },
  { id: 2122, round: 22, name: "Abu Dhabi GP", season: 2021, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  // 2022 (Full 22 Rounds)
  { id: 2201, round: 1, name: "Bahrain GP", season: 2022, winnerName: "Charles Leclerc", poleName: "Charles Leclerc" },
  { id: 2202, round: 2, name: "Saudi Arabian GP", season: 2022, winnerName: "Max Verstappen", poleName: "Sergio Pérez" },
  { id: 2203, round: 3, name: "Australian GP", season: 2022, winnerName: "Charles Leclerc", poleName: "Charles Leclerc" },
  { id: 2204, round: 4, name: "Emilia Romagna GP", season: 2022, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2205, round: 5, name: "Miami GP", season: 2022, winnerName: "Max Verstappen", poleName: "Charles Leclerc" },
  { id: 2206, round: 6, name: "Spanish GP", season: 2022, winnerName: "Max Verstappen", poleName: "Charles Leclerc" },
  { id: 2207, round: 7, name: "Monaco GP", season: 2022, winnerName: "Sergio Pérez", poleName: "Charles Leclerc" },
  { id: 2208, round: 8, name: "Azerbaijan GP", season: 2022, winnerName: "Max Verstappen", poleName: "Charles Leclerc" },
  { id: 2209, round: 9, name: "Canadian GP", season: 2022, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2210, round: 10, name: "British GP", season: 2022, winnerName: "Carlos Sainz", poleName: "Carlos Sainz" },
  { id: 2211, round: 11, name: "Austrian GP", season: 2022, winnerName: "Charles Leclerc", poleName: "Max Verstappen" },
  { id: 2212, round: 12, name: "French GP", season: 2022, winnerName: "Max Verstappen", poleName: "Charles Leclerc" },
  { id: 2213, round: 13, name: "Hungarian GP", season: 2022, winnerName: "Max Verstappen", poleName: "George Russell" },
  { id: 2214, round: 14, name: "Belgian GP", season: 2022, winnerName: "Max Verstappen", poleName: "Carlos Sainz" },
  { id: 2215, round: 15, name: "Dutch GP", season: 2022, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2216, round: 16, name: "Italian GP", season: 2022, winnerName: "Max Verstappen", poleName: "Charles Leclerc" },
  { id: 2217, round: 17, name: "Singapore GP", season: 2022, winnerName: "Sergio Pérez", poleName: "Charles Leclerc" },
  { id: 2218, round: 18, name: "Japanese GP", season: 2022, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2219, round: 19, name: "USA GP", season: 2022, winnerName: "Max Verstappen", poleName: "Carlos Sainz" },
  { id: 2220, round: 20, name: "Mexican GP", season: 2022, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2221, round: 21, name: "Sao Paulo GP", season: 2022, winnerName: "George Russell", poleName: "Kevin Magnussen" },
  { id: 2222, round: 22, name: "Abu Dhabi GP", season: 2022, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  // 2023 (Full 22 Rounds)
  { id: 2301, round: 1, name: "Bahrain GP", season: 2023, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2302, round: 2, name: "Saudi Arabian GP", season: 2023, winnerName: "Sergio Pérez", poleName: "Sergio Pérez" },
  { id: 2303, round: 3, name: "Australian GP", season: 2023, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2304, round: 4, name: "Azerbaijan GP", season: 2023, winnerName: "Sergio Pérez", poleName: "Charles Leclerc" },
  { id: 2305, round: 5, name: "Miami GP", season: 2023, winnerName: "Max Verstappen", poleName: "Sergio Pérez" },
  { id: 2306, round: 6, name: "Monaco GP", season: 2023, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2307, round: 7, name: "Spanish GP", season: 2023, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2308, round: 8, name: "Canadian GP", season: 2023, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2309, round: 9, name: "Austrian GP", season: 2023, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2310, round: 10, name: "British GP", season: 2023, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2311, round: 11, name: "Hungarian GP", season: 2023, winnerName: "Max Verstappen", poleName: "Lewis Hamilton" },
  { id: 2312, round: 12, name: "Belgian GP", season: 2023, winnerName: "Max Verstappen", poleName: "Charles Leclerc" },
  { id: 2313, round: 13, name: "Dutch GP", season: 2023, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2314, round: 14, name: "Italian GP", season: 2023, winnerName: "Max Verstappen", poleName: "Carlos Sainz" },
  { id: 2315, round: 15, name: "Singapore GP", season: 2023, winnerName: "Carlos Sainz", poleName: "Carlos Sainz" },
  { id: 2316, round: 16, name: "Japanese GP", season: 2023, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2317, round: 17, name: "Qatar GP", season: 2023, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2318, round: 18, name: "USA GP", season: 2023, winnerName: "Max Verstappen", poleName: "Charles Leclerc" },
  { id: 2319, round: 19, name: "Mexico City GP", season: 2023, winnerName: "Max Verstappen", poleName: "Charles Leclerc" },
  { id: 2320, round: 20, name: "Sao Paulo GP", season: 2023, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2321, round: 21, name: "Las Vegas GP", season: 2023, winnerName: "Max Verstappen", poleName: "Charles Leclerc" },
  { id: 2322, round: 22, name: "Abu Dhabi GP", season: 2023, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  // 2024 (Full 24 Rounds)
  { id: 2401, round: 1, name: "Bahrain GP", season: 2024, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2402, round: 2, name: "Saudi Arabian GP", season: 2024, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2403, round: 3, name: "Australian GP", season: 2024, winnerName: "Carlos Sainz", poleName: "Max Verstappen" },
  { id: 2404, round: 4, name: "Japanese GP", season: 2024, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2405, round: 5, name: "Chinese GP", season: 2024, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2406, round: 6, name: "Miami GP", season: 2024, winnerName: "Lando Norris", poleName: "Max Verstappen" },
  { id: 2407, round: 7, name: "Emilia Romagna GP", season: 2024, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2408, round: 8, name: "Monaco GP", season: 2024, winnerName: "Charles Leclerc", poleName: "Charles Leclerc" },
  { id: 2409, round: 9, name: "Canadian GP", season: 2024, winnerName: "Max Verstappen", poleName: "George Russell" },
  { id: 2410, round: 10, name: "Spanish GP", season: 2024, winnerName: "Max Verstappen", poleName: "Lando Norris" },
  { id: 2411, round: 11, name: "Austrian GP", season: 2024, winnerName: "George Russell", poleName: "Max Verstappen" },
  { id: 2412, round: 12, name: "British GP", season: 2024, winnerName: "Lewis Hamilton", poleName: "George Russell" },
  { id: 2413, round: 13, name: "Hungarian GP", season: 2024, winnerName: "Oscar Piastri", poleName: "Lando Norris" },
  { id: 2414, round: 14, name: "Belgian GP", season: 2024, winnerName: "Lewis Hamilton", poleName: "Charles Leclerc" },
  { id: 2415, round: 15, name: "Dutch GP", season: 2024, winnerName: "Lando Norris", poleName: "Lando Norris" },
  { id: 2416, round: 16, name: "Italian GP", season: 2024, winnerName: "Charles Leclerc", poleName: "Lando Norris" },
  { id: 2417, round: 17, name: "Azerbaijan GP", season: 2024, winnerName: "Oscar Piastri", poleName: "Charles Leclerc" },
  { id: 2418, round: 18, name: "Singapore GP", season: 2024, winnerName: "Lando Norris", poleName: "Lando Norris" },
  { id: 2419, round: 19, name: "USA GP", season: 2024, winnerName: "Charles Leclerc", poleName: "Lando Norris" },
  { id: 2420, round: 20, name: "Mexican GP", season: 2024, winnerName: "Carlos Sainz", poleName: "Carlos Sainz" },
  { id: 2421, round: 21, name: "Sao Paulo GP", season: 2024, winnerName: "Max Verstappen", poleName: "Lando Norris" },
  { id: 2422, round: 22, name: "Las Vegas GP", season: 2024, winnerName: "George Russell", poleName: "George Russell" },
  { id: 2423, round: 23, name: "Qatar GP", season: 2024, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2424, round: 24, name: "Abu Dhabi GP", season: 2024, winnerName: "Lando Norris", poleName: "Lando Norris" },
  // 2025 (Full 24 Rounds)
  { id: 2501, round: 1, name: "Australian GP", season: 2025, winnerName: "Lando Norris", poleName: "Lando Norris" },
  { id: 2502, round: 2, name: "Chinese GP", season: 2025, winnerName: "Oscar Piastri", poleName: "Max Verstappen" },
  { id: 2503, round: 3, name: "Japanese GP", season: 2025, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2504, round: 4, name: "Bahrain GP", season: 2025, winnerName: "Oscar Piastri", poleName: "Max Verstappen" },
  { id: 2505, round: 5, name: "Saudi Arabian GP", season: 2025, winnerName: "Oscar Piastri", poleName: "Max Verstappen" },
  { id: 2506, round: 6, name: "Miami GP", season: 2025, winnerName: "Oscar Piastri", poleName: "Max Verstappen" },
  { id: 2507, round: 7, name: "Emilia Romagna GP", season: 2025, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2508, round: 8, name: "Monaco GP", season: 2025, winnerName: "Lando Norris", poleName: "Charles Leclerc" },
  { id: 2509, round: 9, name: "Spanish GP", season: 2025, winnerName: "Oscar Piastri", poleName: "Max Verstappen" },
  { id: 2510, round: 10, name: "Canadian GP", season: 2025, winnerName: "George Russell", poleName: "Max Verstappen" },
  { id: 2511, round: 11, name: "Austrian GP", season: 2025, winnerName: "Lando Norris", poleName: "Max Verstappen" },
  { id: 2512, round: 12, name: "British GP", season: 2025, winnerName: "Lando Norris", poleName: "Max Verstappen" },
  { id: 2513, round: 13, name: "Belgian GP", season: 2025, winnerName: "Oscar Piastri", poleName: "Max Verstappen" },
  { id: 2514, round: 14, name: "Hungarian GP", season: 2025, winnerName: "Lando Norris", poleName: "Max Verstappen" },
  { id: 2515, round: 15, name: "Dutch GP", season: 2025, winnerName: "Oscar Piastri", poleName: "Max Verstappen" },
  { id: 2516, round: 16, name: "Italian GP", season: 2025, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2517, round: 17, name: "Azerbaijan GP", season: 2025, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2518, round: 18, name: "Singapore GP", season: 2025, winnerName: "George Russell", poleName: "Max Verstappen" },
  { id: 2519, round: 19, name: "USA GP", season: 2025, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2520, round: 20, name: "Mexican GP", season: 2025, winnerName: "Lando Norris", poleName: "Lando Norris" },
  { id: 2521, round: 21, name: "Sao Paulo GP", season: 2025, winnerName: "Lando Norris", poleName: "Lando Norris" },
  { id: 2522, round: 22, name: "Las Vegas GP", season: 2025, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2523, round: 23, name: "Qatar GP", season: 2025, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  { id: 2524, round: 24, name: "Abu Dhabi GP", season: 2025, winnerName: "Max Verstappen", poleName: "Max Verstappen" },
  // 2026 (Provisional)
  { id: 2601, round: 1, name: "Australian GP", season: 2026, winnerName: "TBD", poleName: "TBD" },
  { id: 2616, round: 16, name: "Madrid GP", season: 2026, winnerName: "TBD", poleName: "TBD" },
  { id: 2624, round: 24, name: "Abu Dhabi GP", season: 2026, winnerName: "TBD", poleName: "TBD" },
];
export const racesStore = { getAll: () => [...races], getBySeason: (season) => races.filter(r => r.season === Number(season)) };

// ─── Results (Exhaustive Final Standing Seeds) ─────────────────────────────
let raceResults = [
  // 2020 STANDINGS (Full Field)
  { id: 2001, raceId: 2017, driverId: 4, teamId: 3, points: 347 },
  { id: 2002, raceId: 2017, driverId: 41, teamId: 3, points: 223 },
  { id: 2003, raceId: 2017, driverId: 1, teamId: 1, points: 214 },
  { id: 2004, raceId: 2017, driverId: 34, teamId: 5, points: 125 }, // Racing Point
  { id: 2005, raceId: 2017, driverId: 53, teamId: 6, points: 119 }, // Renault
  { id: 2006, raceId: 2017, driverId: 35, teamId: 4, points: 105 },
  { id: 2007, raceId: 2017, driverId: 66, teamId: 1, points: 105 },
  { id: 2008, raceId: 2017, driverId: 5, teamId: 2, points: 98 },
  { id: 2009, raceId: 2017, driverId: 10, teamId: 4, points: 97 },
  { id: 2010, raceId: 2017, driverId: 44, teamId: 8, points: 75 }, // AlphaTauri
  { id: 2011, raceId: 2017, driverId: 45, teamId: 5, points: 75 },
  { id: 2012, raceId: 2017, driverId: 46, teamId: 6, points: 62 },
  { id: 2013, raceId: 2017, driverId: 50, teamId: 2, points: 33 },
  { id: 2014, raceId: 2017, driverId: 58, teamId: 8, points: 32 },
  { id: 2015, raceId: 2017, driverId: 15, teamId: 5, points: 10 },
  { id: 2016, raceId: 2017, driverId: 51, teamId: 9, points: 4 }, // Alfa Romeo
  { id: 2017, raceId: 2017, driverId: 54, teamId: 9, points: 4 },
  { id: 2018, raceId: 2017, driverId: 68, teamId: 3, points: 3 }, // Russell at Merc
  { id: 2019, raceId: 2017, driverId: 56, teamId: 10, points: 2 },
  { id: 2020, raceId: 2017, driverId: 57, teamId: 10, points: 1 },
  { id: 2021, raceId: 2017, driverId: 61, teamId: 7, points: 0 },
  { id: 2022, raceId: 2017, driverId: 62, teamId: 7, points: 0 },
  { id: 2023, raceId: 2017, driverId: 63, teamId: 10, points: 0 },

  // 2021 STANDINGS (Full Field)
  { id: 2101, raceId: 2122, driverId: 1, teamId: 1, points: 395.5 },
  { id: 2102, raceId: 2122, driverId: 4, teamId: 3, points: 387.5 },
  { id: 2103, raceId: 2122, driverId: 41, teamId: 3, points: 226 },
  { id: 2104, raceId: 2122, driverId: 34, teamId: 1, points: 190 },
  { id: 2105, raceId: 2122, driverId: 35, teamId: 2, points: 164.5 },
  { id: 2106, raceId: 2122, driverId: 10, teamId: 4, points: 160 },
  { id: 2107, raceId: 2122, driverId: 5, teamId: 2, points: 116 },
  { id: 2108, raceId: 2122, driverId: 53, teamId: 4, points: 115 },
  { id: 2109, raceId: 2122, driverId: 44, teamId: 8, points: 110 },
  { id: 2110, raceId: 2122, driverId: 13, teamId: 6, points: 81 },
  { id: 2111, raceId: 2122, driverId: 46, teamId: 6, points: 74 },
  { id: 2112, raceId: 2122, driverId: 50, teamId: 5, points: 43 },
  { id: 2113, raceId: 2122, driverId: 45, teamId: 5, points: 34 },
  { id: 2114, raceId: 2122, driverId: 22, teamId: 8, points: 32 },
  { id: 2115, raceId: 2122, driverId: 68, teamId: 7, points: 16 },
  { id: 2116, raceId: 2122, driverId: 51, teamId: 9, points: 10 },
  { id: 2117, raceId: 2122, driverId: 54, teamId: 9, points: 3 },
  { id: 2118, raceId: 2122, driverId: 59, teamId: 10, points: 0 },
  { id: 2119, raceId: 2122, driverId: 57, teamId: 10, points: 0 },
  { id: 2120, raceId: 2122, driverId: 61, teamId: 7, points: 0 },

  // 2022 STANDINGS (Full Field)
  { id: 2201, raceId: 2222, driverId: 1, teamId: 1, points: 454 },
  { id: 2202, raceId: 2222, driverId: 5, teamId: 2, points: 308 },
  { id: 2203, raceId: 2222, driverId: 34, teamId: 1, points: 305 },
  { id: 2204, raceId: 2222, driverId: 68, teamId: 3, points: 275 },
  { id: 2205, raceId: 2222, driverId: 35, teamId: 2, points: 246 },
  { id: 2206, raceId: 2222, driverId: 4, teamId: 3, points: 240 },
  { id: 2207, raceId: 2222, driverId: 10, teamId: 4, points: 122 },
  { id: 2208, raceId: 2222, driverId: 46, teamId: 6, points: 92 },
  { id: 2209, raceId: 2222, driverId: 13, teamId: 6, points: 81 },
  { id: 2210, raceId: 2222, driverId: 41, teamId: 9, points: 49 },
  { id: 2211, raceId: 2222, driverId: 53, teamId: 4, points: 37 },
  { id: 2212, raceId: 2222, driverId: 50, teamId: 5, points: 37 },
  { id: 2213, raceId: 2222, driverId: 57, teamId: 10, points: 25 },
  { id: 2214, raceId: 2222, driverId: 44, teamId: 8, points: 23 },
  { id: 2215, round: 22, raceId: 2222, driverId: 45, teamId: 5, points: 18 },
  { id: 2216, raceId: 2222, driverId: 59, teamId: 10, points: 12 },
  { id: 2217, raceId: 2222, driverId: 22, teamId: 8, points: 12 },
  { id: 2218, raceId: 2222, driverId: 71, teamId: 9, points: 6 },
  { id: 2219, raceId: 2222, driverId: 66, teamId: 7, points: 4 },
  { id: 2220, raceId: 2222, driverId: 64, teamId: 7, points: 2 }, // De Vries Williams cameo
  { id: 2221, raceId: 2222, driverId: 61, teamId: 7, points: 2 },
  { id: 2222, raceId: 2222, driverId: 15, teamId: 5, points: 0 },

  // 2023 STANDINGS (Full Field)
  { id: 2301, raceId: 2322, driverId: 1, teamId: 1, points: 575 },
  { id: 2302, raceId: 2322, driverId: 34, teamId: 1, points: 285 },
  { id: 2303, raceId: 2322, driverId: 4, teamId: 3, points: 234 },
  { id: 2304, raceId: 2322, driverId: 13, teamId: 5, points: 206 },
  { id: 2305, raceId: 2322, driverId: 5, teamId: 2, points: 206 },
  { id: 2306, raceId: 2322, driverId: 10, teamId: 4, points: 205 },
  { id: 2307, raceId: 2322, driverId: 35, teamId: 2, points: 200 },
  { id: 2308, raceId: 2322, driverId: 68, teamId: 3, points: 175 },
  { id: 2309, raceId: 2322, driverId: 70, teamId: 4, points: 97 },
  { id: 2310, raceId: 2322, driverId: 45, teamId: 5, points: 74 },
  { id: 2311, raceId: 2322, driverId: 44, teamId: 8, points: 62 },
  { id: 2312, raceId: 2322, driverId: 46, teamId: 6, points: 58 },
  { id: 2313, raceId: 2322, driverId: 66, teamId: 7, points: 27 },
  { id: 2314, raceId: 2322, driverId: 22, teamId: 8, points: 17 },
  { id: 2315, raceId: 2322, driverId: 41, teamId: 9, points: 10 },
  { id: 2316, raceId: 2322, driverId: 15, teamId: 10, points: 9 },
  { id: 2317, raceId: 2322, driverId: 71, teamId: 9, points: 6 },
  { id: 2318, raceId: 2322, driverId: 57, teamId: 10, points: 3 },
  { id: 2319, raceId: 2322, driverId: 72, teamId: 8, points: 2 },
  { id: 2320, raceId: 2322, driverId: 73, teamId: 7, points: 1 },
  { id: 2321, raceId: 2322, driverId: 53, teamId: 8, points: 6 }, // Ricciardo return mid-season
  { id: 2322, raceId: 2322, driverId: 64, teamId: 8, points: 0 },

  // 2024 STANDINGS (Full Field)
  { id: 2401, raceId: 2424, driverId: 1, teamId: 1, points: 437 },
  { id: 2402, raceId: 2424, driverId: 10, teamId: 4, points: 374 },
  { id: 2403, raceId: 2424, driverId: 5, teamId: 2, points: 356 },
  { id: 2404, raceId: 2424, driverId: 70, teamId: 4, points: 292 },
  { id: 2405, raceId: 2424, driverId: 35, teamId: 2, points: 290 },
  { id: 2406, raceId: 2424, driverId: 4, teamId: 3, points: 245 },
  { id: 2407, raceId: 2424, driverId: 68, teamId: 3, points: 242 },
  { id: 2408, raceId: 2424, driverId: 34, teamId: 1, points: 152 },
  { id: 2409, raceId: 2424, driverId: 13, teamId: 5, points: 92 },
  { id: 2410, raceId: 2424, driverId: 15, teamId: 10, points: 41 },
  { id: 2411, raceId: 2424, driverId: 44, teamId: 6, points: 40 },
  { id: 2412, raceId: 2424, driverId: 22, teamId: 8, points: 35 },
  { id: 2413, raceId: 2424, driverId: 66, teamId: 7, points: 32 },
  { id: 2414, raceId: 2424, driverId: 45, teamId: 5, points: 24 },
  { id: 2415, raceId: 2424, driverId: 46, teamId: 10, points: 23 },
  { id: 2416, raceId: 2424, driverId: 57, teamId: 10, points: 14 },
  { id: 2417, raceId: 2424, driverId: 53, teamId: 8, points: 12 },
  { id: 2418, raceId: 2424, driverId: 81, teamId: 6, points: 5 },
  { id: 2419, raceId: 2424, driverId: 82, teamId: 10, points: 7 },
  { id: 2420, raceId: 2424, driverId: 72, teamId: 8, points: 4 },
  { id: 2421, raceId: 2424, driverId: 71, teamId: 9, points: 0 },
  { id: 2422, raceId: 2424, driverId: 41, teamId: 9, points: 0 },

  // 2025 STANDINGS (Full Field)
  { id: 2501, raceId: 2524, driverId: 10, teamId: 4, points: 423 },
  { id: 2502, raceId: 2524, driverId: 1, teamId: 1, points: 421 },
  { id: 2503, raceId: 2524, driverId: 70, teamId: 4, points: 410 },
  { id: 2504, raceId: 2524, driverId: 68, teamId: 3, points: 319 },
  { id: 2505, raceId: 2524, driverId: 5, teamId: 2, points: 242 },
  { id: 2506, raceId: 2524, driverId: 4, teamId: 2, points: 235 }, // Hamilton Ferrari debut
  { id: 2507, raceId: 2524, driverId: 83, teamId: 3, points: 198 }, // Antonelli Mercedes
  { id: 2508, raceId: 2524, driverId: 13, teamId: 5, points: 145 },
  { id: 2509, raceId: 2524, driverId: 34, teamId: 1, points: 110 },
  { id: 2510, raceId: 2524, driverId: 15, teamId: 11, points: 55 }, // Hulk Audi prep
  { id: 2511, raceId: 2524, driverId: 46, teamId: 10, points: 42 },
  { id: 2512, raceId: 2524, driverId: 72, teamId: 8, points: 38 },
  { id: 2513, raceId: 2524, driverId: 22, teamId: 8, points: 31 },
  { id: 2514, raceId: 2524, driverId: 66, teamId: 7, points: 22 },
  { id: 2515, raceId: 2524, driverId: 82, teamId: 10, points: 18 },
  { id: 2516, raceId: 2524, driverId: 81, teamId: 6, points: 12 },
  { id: 2517, raceId: 2524, driverId: 35, teamId: 7, points: 11 }, // Sainz Williams
  { id: 2518, raceId: 2524, driverId: 44, teamId: 6, points: 8 },
  { id: 2519, raceId: 2524, driverId: 84, teamId: 1, points: 5 }, // Hadjar Red Bull cameo
  { id: 2520, raceId: 2524, driverId: 85, teamId: 11, points: 4 }, // Bortoleto debut
  { id: 2521, raceId: 2524, driverId: 41, teamId: 3, points: 3 }, // Bottas Merc reserve cameo
];
export const resultsStore = {
  getAll: () => [...raceResults],
  getBySeason: (season) => {
    const sRaces = races.filter(r => r.season === Number(season)).map(r => r.id);
    return raceResults.filter(res => sRaces.includes(res.raceId));
  }
};

// ─── News ──────────────────────────────────────────────────────────────────
let news = [
  { id: 201, title: "Hamilton Equals Schumacher", summary: "Lewis Hamilton clinches 7th title at the 2020 Turkish GP in a wet-weather masterclass.", category: "Historical", date: "2020-11-15", season: 2020, teamId: 2 },
  { id: 211, title: "The Duel in the Desert", summary: "Max Verstappen wins his maiden title after a controversial final lap battle in Abu Dhabi.", category: "Historical", date: "2021-12-12", season: 2021, teamId: 1, imageUrl: "https://live-production.wcms.abc-cdn.net.au/3f7112b220234d7c64b5c41d3720fa38?impolicy=wcms_crop_resize&cropH=3209&cropW=4814&xPos=0&yPos=0&width=862&height=575" },
  { id: 221, title: "The Ground Effect Reset", summary: "Ferrari starts the 2022 era with a dominant 1-2 in Bahrain as Red Bull suffers double DNF.", category: "Historical", date: "2022-03-20", season: 2022, teamId: 2, imageUrl: "https://cdn.racingnews365.com/2026/_1456x910_crop_center-center_65_none/14251549/thumb-bahrain.webp?v=1770826911" },
  { id: 231, title: "Verstappen's Absolute Dominance", summary: "Red Bull breaks the record for consecutive wins as Max clinches his 3rd title in Qatar.", category: "Historical", date: "2023-10-07", season: 2023, teamId: 1 },
  { id: 241, title: "McLaren's Resurgence", summary: "Lando Norris wins the 2024 Drivers' Championship in a season of incredible convergence.", category: "Paddock", date: "2024-12-08", season: 2024, teamId: 4, imageUrl: "https://images.ps-aws.com/c?url=https%3A%2F%2Fd3cm515ijfiu6w.cloudfront.net%2Fwp-content%2Fuploads%2F2024%2F03%2F01123520%2Fzak-brown-mclaren-f1.jpg" },
  { id: 251, title: "Hamilton's Ferrari Debut", summary: "Lewis Hamilton takes his first win in Red at the 2025 British GP, sending fans into a frenzy.", category: "Editorial", date: "2025-07-06", season: 2025, teamId: 2, imageUrl: "https://ewxd4bbz5hp.exactdn.com/wp-content/uploads/2025/09/In-our-Italian-home-with-Lewis-and-Charles-%F0%9F%87%AE%F0%9F%87%B9.jpg?strip=all" },
  { id: 252, title: "Lando Wins First Championship", summary: "In a dramatic season finale, Lando Norris clinches his maiden World Title, ending the 2025 season as the king of F1.", category: "Breaking", date: "2025-11-23", season: 2025, teamId: 4, imageUrl: "https://media.formula1.com/image/upload/t_16by9Centre/c_lfill,w_3392/q_auto/v1740000000/trackside-images/2025/F1_Grand_Prix_of_Abu_Dhabi/2250554872.webp" },
  { id: 253, title: "Max's Great Comeback", summary: "Following a difficult start to the season, Max Verstappen delivers a masterclass in the final rounds to secure P2 in the standings.", category: "Analysis", date: "2025-11-15", season: 2025, teamId: 1, imageUrl: "https://cdn.racingnews365.com/2026/Verstappen/_1456x910_crop_center-center_65_none/14251024/XPB_1393940_HiRes.webp?v=1770807728" },
  { id: 261, title: "FIA issue statements on power unit technical meetings", summary: "The FIA has finalized a series of high-level summits with chassis and engine manufacturers regarding the 2026 power unit regulations and energy recovery systems.", category: "Regulations", date: "2026-02-18", season: 2026, imageUrl: "https://i0.wp.com/thejudge13.com/wp-content/uploads/2025/04/fia-meeting.jpeg?w=2016&ssl=1" },
  { id: 262, title: "AS IT HAPPENED: Pre-season testing resumes in Bahrain", summary: "Follow the live telemetry and lap times as teams hit the track in Sakhir for the first time this year under the desert sun.", category: "Live", date: "2026-02-18", season: 2026, imageUrl: "https://cdn.racingnews365.com/2026/Verstappen/_1456x910_crop_center-center_65_none/14251024/XPB_1393940_HiRes.webp?v=1770807728" },
  { id: 263, title: "Hamilton feeling 'in the best place I've been for a long time'", summary: "Lewis Hamilton discusses his mindset ahead of the season opener and his transition to the Scuderia Ferrari for the 2025 campaign.", category: "Interview", date: "2024-03-01", season: 2024, imageUrl: "https://media.formula1.com/image/upload/t_16by9North/c_lfill,w_3392/q_auto/v1740000000/trackside-images/2025/F1_Grand_Prix_Of_Australia___Previews/2204824585.webp" },
  { id: 264, title: "Aston Martin make changes to trackside engineering structure", summary: "The Silverstone-based team announces a strategic reshuffle of their technical staff to optimize performance following the recent wind tunnel correlation data.", category: "Paddock", date: "2024-02-15", season: 2024, imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop" },
  { id: 70, title: "2026 Technical Revolution", summary: "The new era of F1 begins today with simplified aerodynamics and 100% sustainable fuels. This technical reset is designed to promote closer racing and a more competitive field across the entire grid.", category: "Systems", date: "2026-02-18", season: 2026, imageUrl: "https://www.formulaonehistory.com/wp-content/uploads/2025/03/2026-F1-Season-Car-920x580.webp" }

];
export const newsStore = {
  getAll: () => [...news].sort((a, b) => new Date(b.date) - new Date(a.date)),
  getByTeam: (teamId) => news.filter(n => n.teamId === Number(teamId)),
  getBySeason: (season) => news.filter(n => n.season === Number(season))
};
