export interface Country {
  name: string;
  code: string;
  states: string[];
}

export const countries: Country[] = [
  {
    name: "United States",
    code: "US",
    states: [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
      "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
      "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
      "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
      "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
      "New Hampshire", "New Jersey", "New Mexico", "New York",
      "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
      "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
      "West Virginia", "Wisconsin", "Wyoming"
    ]
  },
  {
    name: "Canada",
    code: "CA",
    states: [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick",
      "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
      "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",
      "Yukon"
    ]
  },
  {
    name: "United Kingdom",
    code: "GB",
    states: [
      "England", "Northern Ireland", "Scotland", "Wales"
    ]
  },
  {
    name: "Australia",
    code: "AU",
    states: [
      "Australian Capital Territory", "New South Wales", "Northern Territory",
      "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia"
    ]
  },
  {
    name: "India",
    code: "IN",
    states: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
      "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
      "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
      "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
      "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ]
  },
  {
    name: "Germany",
    code: "DE",
    states: [
      "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen",
      "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern",
      "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland",
      "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"
    ]
  },
  {
    name: "France",
    code: "FR",
    states: [
      "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany",
      "Centre-Val de Loire", "Corsica", "Grand Est", "Hauts-de-France",
      "Île-de-France", "Normandy", "Nouvelle-Aquitaine", "Occitanie",
      "Pays de la Loire", "Provence-Alpes-Côte d'Azur"
    ]
  },
  {
    name: "Japan",
    code: "JP",
    states: [
      "Aichi", "Akita", "Aomori", "Chiba", "Ehime", "Fukui", "Fukuoka",
      "Fukushima", "Gifu", "Gunma", "Hiroshima", "Hokkaido", "Hyogo",
      "Ibaraki", "Ishikawa", "Iwate", "Kagawa", "Kagoshima", "Kanagawa",
      "Kochi", "Kumamoto", "Kyoto", "Mie", "Miyagi", "Miyazaki", "Nagano",
      "Nagasaki", "Nara", "Niigata", "Oita", "Okayama", "Okinawa", "Osaka",
      "Saga", "Saitama", "Shiga", "Shimane", "Shizuoka", "Tochigi", "Tokushima",
      "Tokyo", "Tottori", "Toyama", "Wakayama", "Yamagata", "Yamaguchi", "Yamanashi"
    ]
  },
  {
    name: "Brazil",
    code: "BR",
    states: [
      "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará",
      "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso",
      "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná",
      "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte",
      "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina",
      "São Paulo", "Sergipe", "Tocantins"
    ]
  },
  {
    name: "Mexico",
    code: "MX",
    states: [
      "Aguascalientes", "Baja California", "Baja California Sur", "Campeche",
      "Chiapas", "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato",
      "Guerrero", "Hidalgo", "Jalisco", "México", "Mexico City", "Michoacán",
      "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro",
      "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco",
      "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
    ]
  },
  {
    name: "China",
    code: "CN",
    states: [
      "Anhui", "Beijing", "Chongqing", "Fujian", "Gansu", "Guangdong",
      "Guangxi", "Guizhou", "Hainan", "Hebei", "Heilongjiang", "Henan",
      "Hong Kong", "Hubei", "Hunan", "Inner Mongolia", "Jiangsu", "Jiangxi",
      "Jilin", "Liaoning", "Macau", "Ningxia", "Qinghai", "Shaanxi",
      "Shandong", "Shanghai", "Shanxi", "Sichuan", "Tianjin", "Tibet",
      "Xinjiang", "Yunnan", "Zhejiang"
    ]
  },
  {
    name: "Italy",
    code: "IT",
    states: [
      "Abruzzo", "Aosta Valley", "Apulia", "Basilicata", "Calabria",
      "Campania", "Emilia-Romagna", "Friuli-Venezia Giulia", "Lazio",
      "Liguria", "Lombardy", "Marche", "Molise", "Piedmont", "Sardinia",
      "Sicily", "Trentino-Alto Adige", "Tuscany", "Umbria", "Veneto"
    ]
  },
  {
    name: "Spain",
    code: "ES",
    states: [
      "Andalusia", "Aragon", "Asturias", "Balearic Islands", "Basque Country",
      "Canary Islands", "Cantabria", "Castile and León", "Castilla-La Mancha",
      "Catalonia", "Extremadura", "Galicia", "La Rioja", "Madrid",
      "Murcia", "Navarre", "Valencia"
    ]
  },
  {
    name: "South Korea",
    code: "KR",
    states: [
      "Busan", "Chungcheongbuk-do", "Chungcheongnam-do", "Daegu", "Daejeon",
      "Gangwon-do", "Gwangju", "Gyeonggi-do", "Gyeongsangbuk-do",
      "Gyeongsangnam-do", "Incheon", "Jeju", "Jeollabuk-do", "Jeollanam-do",
      "Sejong", "Seoul", "Ulsan"
    ]
  },
  {
    name: "Netherlands",
    code: "NL",
    states: [
      "Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen",
      "Limburg", "North Brabant", "North Holland", "Overijssel",
      "South Holland", "Utrecht", "Zeeland"
    ]
  },
  {
    name: "Singapore",
    code: "SG",
    states: ["Singapore"]
  },
  {
    name: "New Zealand",
    code: "NZ",
    states: [
      "Auckland", "Bay of Plenty", "Canterbury", "Gisborne", "Hawke's Bay",
      "Manawatu-Wanganui", "Marlborough", "Nelson", "Northland", "Otago",
      "Southland", "Taranaki", "Tasman", "Waikato", "Wellington", "West Coast"
    ]
  },
  {
    name: "Ireland",
    code: "IE",
    states: [
      "Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway",
      "Kerry", "Kildare", "Kilkenny", "Laois", "Leitrim", "Limerick",
      "Longford", "Louth", "Mayo", "Meath", "Monaghan", "Offaly",
      "Roscommon", "Sligo", "Tipperary", "Waterford", "Westmeath",
      "Wexford", "Wicklow"
    ]
  },
  {
    name: "South Africa",
    code: "ZA",
    states: [
      "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo",
      "Mpumalanga", "North West", "Northern Cape", "Western Cape"
    ]
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    states: [
      "Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah",
      "Sharjah", "Umm Al Quwain"
    ]
  },
  {
    name: "Saudi Arabia",
    code: "SA",
    states: [
      "Al Bahah", "Al Jawf", "Al Madinah", "Al-Qassim", "Asir",
      "Eastern Province", "Ha'il", "Jazan", "Makkah", "Najran",
      "Northern Borders", "Riyadh", "Tabuk"
    ]
  }
];

export function getCountryByName(countryName: string): Country | undefined {
  return countries.find(c => c.name === countryName);
}

export function getStatesForCountry(countryName: string): string[] {
  const country = getCountryByName(countryName);
  return country ? country.states : [];
}
