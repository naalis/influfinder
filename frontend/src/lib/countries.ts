export interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
}

export const countries: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸", phoneCode: "+1" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", phoneCode: "+52" },
  { code: "ES", name: "Spain", flag: "🇪🇸", phoneCode: "+34" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", phoneCode: "+54" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", phoneCode: "+57" },
  { code: "PE", name: "Peru", flag: "🇵🇪", phoneCode: "+51" },
  { code: "CL", name: "Chile", flag: "🇨🇱", phoneCode: "+56" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", phoneCode: "+55" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", phoneCode: "+44" },
  { code: "DE", name: "Germany", flag: "🇩🇪", phoneCode: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", phoneCode: "+33" },
  { code: "IT", name: "Italy", flag: "🇮🇹", phoneCode: "+39" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", phoneCode: "+351" },
  { code: "CA", name: "Canada", flag: "🇨🇦", phoneCode: "+1" },
  { code: "AU", name: "Australia", flag: "🇦🇺", phoneCode: "+61" },
  { code: "JP", name: "Japan", flag: "🇯🇵", phoneCode: "+81" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", phoneCode: "+82" },
  { code: "CN", name: "China", flag: "🇨🇳", phoneCode: "+86" },
  { code: "IN", name: "India", flag: "🇮🇳", phoneCode: "+91" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", phoneCode: "+58" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨", phoneCode: "+593" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴", phoneCode: "+591" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾", phoneCode: "+595" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾", phoneCode: "+598" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷", phoneCode: "+506" },
  { code: "PA", name: "Panama", flag: "🇵🇦", phoneCode: "+507" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹", phoneCode: "+502" },
  { code: "HN", name: "Honduras", flag: "🇭🇳", phoneCode: "+504" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻", phoneCode: "+503" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮", phoneCode: "+505" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴", phoneCode: "+1" },
  { code: "PR", name: "Puerto Rico", flag: "🇵🇷", phoneCode: "+1" },
  { code: "CU", name: "Cuba", flag: "🇨🇺", phoneCode: "+53" },
];

export function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code);
}
