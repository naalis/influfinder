export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface City {
  name: string;
  country: string;
  popular?: boolean;
}

export const countries: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
];

export const citiesByCountry: Record<string, City[]> = {
  US: [
    { name: "Miami", country: "US", popular: true },
    { name: "Los Angeles", country: "US", popular: true },
    { name: "New York", country: "US", popular: true },
    { name: "San Francisco", country: "US" },
    { name: "Las Vegas", country: "US" },
    { name: "Chicago", country: "US" },
    { name: "Houston", country: "US" },
    { name: "Atlanta", country: "US" },
    { name: "Dallas", country: "US" },
    { name: "Seattle", country: "US" },
    { name: "Boston", country: "US" },
    { name: "Phoenix", country: "US" },
    { name: "San Diego", country: "US" },
    { name: "Denver", country: "US" },
    { name: "Austin", country: "US" },
  ],
  ES: [
    { name: "Madrid", country: "ES", popular: true },
    { name: "Barcelona", country: "ES", popular: true },
    { name: "Valencia", country: "ES" },
    { name: "Sevilla", country: "ES" },
    { name: "Málaga", country: "ES" },
    { name: "Bilbao", country: "ES" },
    { name: "Ibiza", country: "ES" },
    { name: "Marbella", country: "ES" },
  ],
  MX: [
    { name: "Mexico City", country: "MX", popular: true },
    { name: "Cancún", country: "MX" },
    { name: "Guadalajara", country: "MX" },
    { name: "Monterrey", country: "MX" },
    { name: "Playa del Carmen", country: "MX" },
    { name: "Tulum", country: "MX" },
    { name: "Los Cabos", country: "MX" },
  ],
  AR: [
    { name: "Buenos Aires", country: "AR", popular: true },
    { name: "Córdoba", country: "AR" },
    { name: "Mendoza", country: "AR" },
    { name: "Rosario", country: "AR" },
    { name: "Mar del Plata", country: "AR" },
  ],
  CO: [
    { name: "Bogotá", country: "CO" },
    { name: "Medellín", country: "CO", popular: true },
    { name: "Cartagena", country: "CO" },
    { name: "Cali", country: "CO" },
    { name: "Barranquilla", country: "CO" },
  ],
  BR: [
    { name: "São Paulo", country: "BR", popular: true },
    { name: "Rio de Janeiro", country: "BR", popular: true },
    { name: "Brasília", country: "BR" },
    { name: "Salvador", country: "BR" },
    { name: "Fortaleza", country: "BR" },
    { name: "Florianópolis", country: "BR" },
  ],
  GB: [
    { name: "London", country: "GB", popular: true },
    { name: "Manchester", country: "GB" },
    { name: "Birmingham", country: "GB" },
    { name: "Edinburgh", country: "GB" },
    { name: "Glasgow", country: "GB" },
    { name: "Liverpool", country: "GB" },
    { name: "Bristol", country: "GB" },
  ],
  FR: [
    { name: "Paris", country: "FR", popular: true },
    { name: "Nice", country: "FR" },
    { name: "Lyon", country: "FR" },
    { name: "Marseille", country: "FR" },
    { name: "Cannes", country: "FR" },
    { name: "Bordeaux", country: "FR" },
    { name: "Monaco", country: "FR" },
  ],
  DE: [
    { name: "Berlin", country: "DE", popular: true },
    { name: "Munich", country: "DE" },
    { name: "Frankfurt", country: "DE" },
    { name: "Hamburg", country: "DE" },
    { name: "Cologne", country: "DE" },
    { name: "Düsseldorf", country: "DE" },
  ],
  IT: [
    { name: "Milan", country: "IT", popular: true },
    { name: "Rome", country: "IT" },
    { name: "Florence", country: "IT" },
    { name: "Venice", country: "IT" },
    { name: "Naples", country: "IT" },
    { name: "Turin", country: "IT" },
  ],
  PT: [
    { name: "Lisbon", country: "PT", popular: true },
    { name: "Porto", country: "PT" },
    { name: "Faro", country: "PT" },
    { name: "Madeira", country: "PT" },
  ],
  AE: [
    { name: "Dubai", country: "AE", popular: true },
    { name: "Abu Dhabi", country: "AE" },
    { name: "Sharjah", country: "AE" },
  ],
  SA: [
    { name: "Riyadh", country: "SA" },
    { name: "Jeddah", country: "SA" },
    { name: "Dammam", country: "SA" },
  ],
  JP: [
    { name: "Tokyo", country: "JP", popular: true },
    { name: "Osaka", country: "JP" },
    { name: "Kyoto", country: "JP" },
    { name: "Yokohama", country: "JP" },
  ],
  KR: [
    { name: "Seoul", country: "KR", popular: true },
    { name: "Busan", country: "KR" },
    { name: "Incheon", country: "KR" },
  ],
  AU: [
    { name: "Sydney", country: "AU", popular: true },
    { name: "Melbourne", country: "AU" },
    { name: "Brisbane", country: "AU" },
    { name: "Perth", country: "AU" },
    { name: "Gold Coast", country: "AU" },
  ],
  CA: [
    { name: "Toronto", country: "CA", popular: true },
    { name: "Vancouver", country: "CA" },
    { name: "Montreal", country: "CA" },
    { name: "Calgary", country: "CA" },
  ],
  CL: [
    { name: "Santiago", country: "CL" },
    { name: "Valparaíso", country: "CL" },
    { name: "Viña del Mar", country: "CL" },
  ],
  PE: [
    { name: "Lima", country: "PE" },
    { name: "Cusco", country: "PE" },
    { name: "Arequipa", country: "PE" },
  ],
  NL: [
    { name: "Amsterdam", country: "NL", popular: true },
    { name: "Rotterdam", country: "NL" },
    { name: "The Hague", country: "NL" },
  ],
  SE: [
    { name: "Stockholm", country: "SE" },
    { name: "Gothenburg", country: "SE" },
    { name: "Malmö", country: "SE" },
  ],
  NO: [
    { name: "Oslo", country: "NO" },
    { name: "Bergen", country: "NO" },
  ],
  DK: [
    { name: "Copenhagen", country: "DK" },
    { name: "Aarhus", country: "DK" },
  ],
  CH: [
    { name: "Zurich", country: "CH" },
    { name: "Geneva", country: "CH" },
    { name: "Basel", country: "CH" },
  ],
  AT: [
    { name: "Vienna", country: "AT" },
    { name: "Salzburg", country: "AT" },
  ],
  BE: [
    { name: "Brussels", country: "BE" },
    { name: "Antwerp", country: "BE" },
  ],
  PL: [
    { name: "Warsaw", country: "PL" },
    { name: "Krakow", country: "PL" },
  ],
  IN: [
    { name: "Mumbai", country: "IN", popular: true },
    { name: "Delhi", country: "IN" },
    { name: "Bangalore", country: "IN" },
    { name: "Goa", country: "IN" },
  ],
  SG: [
    { name: "Singapore", country: "SG", popular: true },
  ],
  TH: [
    { name: "Bangkok", country: "TH", popular: true },
    { name: "Phuket", country: "TH" },
    { name: "Chiang Mai", country: "TH" },
  ],
  ID: [
    { name: "Jakarta", country: "ID" },
    { name: "Bali", country: "ID", popular: true },
    { name: "Yogyakarta", country: "ID" },
  ],
  PH: [
    { name: "Manila", country: "PH" },
    { name: "Cebu", country: "PH" },
    { name: "Boracay", country: "PH" },
  ],
  MY: [
    { name: "Kuala Lumpur", country: "MY" },
    { name: "Penang", country: "MY" },
  ],
  ZA: [
    { name: "Cape Town", country: "ZA" },
    { name: "Johannesburg", country: "ZA" },
  ],
  NG: [
    { name: "Lagos", country: "NG" },
    { name: "Abuja", country: "NG" },
  ],
  EG: [
    { name: "Cairo", country: "EG" },
    { name: "Alexandria", country: "EG" },
  ],
  TR: [
    { name: "Istanbul", country: "TR", popular: true },
    { name: "Ankara", country: "TR" },
    { name: "Antalya", country: "TR" },
  ],
  GR: [
    { name: "Athens", country: "GR" },
    { name: "Mykonos", country: "GR" },
    { name: "Santorini", country: "GR" },
  ],
  IE: [
    { name: "Dublin", country: "IE" },
    { name: "Cork", country: "IE" },
  ],
  NZ: [
    { name: "Auckland", country: "NZ" },
    { name: "Wellington", country: "NZ" },
    { name: "Queenstown", country: "NZ" },
  ],
};

// Popular cities for quick selection
export const popularCities: City[] = [
  { name: "Miami", country: "US", popular: true },
  { name: "Dubai", country: "AE", popular: true },
  { name: "Madrid", country: "ES", popular: true },
  { name: "London", country: "GB", popular: true },
  { name: "Los Angeles", country: "US", popular: true },
  { name: "Paris", country: "FR", popular: true },
  { name: "New York", country: "US", popular: true },
  { name: "Barcelona", country: "ES", popular: true },
  { name: "Tokyo", country: "JP", popular: true },
  { name: "Milan", country: "IT", popular: true },
  { name: "São Paulo", country: "BR", popular: true },
  { name: "Singapore", country: "SG", popular: true },
];

export function getCitiesForCountry(countryCode: string): City[] {
  return citiesByCountry[countryCode] || [];
}

export function getCountryByCode(code: string): Country | undefined {
  return countries.find(c => c.code === code);
}
