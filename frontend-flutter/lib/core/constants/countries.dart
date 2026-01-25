class Countries {
  Countries._();

  static const List<Map<String, String>> list = [
    {'code': 'PE', 'name': 'Peru', 'flag': '🇵🇪', 'phone': '+51'},
    {'code': 'AE', 'name': 'United Arab Emirates', 'flag': '🇦🇪', 'phone': '+971'},
    {'code': 'IT', 'name': 'Italy', 'flag': '🇮🇹', 'phone': '+39'},
  ];

  static String? getFlag(String countryName) {
    final country = list.firstWhere(
      (c) => c['name'] == countryName,
      orElse: () => {},
    );
    return country['flag'];
  }

  static String? getCode(String countryName) {
    final country = list.firstWhere(
      (c) => c['name'] == countryName,
      orElse: () => {},
    );
    return country['code'];
  }

  static String? getPhoneCode(String countryName) {
    final country = list.firstWhere(
      (c) => c['name'] == countryName,
      orElse: () => {},
    );
    return country['phone'];
  }

  static Map<String, String>? getCountry(String countryName) {
    try {
      return list.firstWhere((c) => c['name'] == countryName);
    } catch (e) {
      return null;
    }
  }

  static List<String> getCities(String countryName) {
    return cities[countryName] ?? [];
  }

  static const Map<String, List<String>> cities = {
    'Peru': [
      'Lima',
      'Arequipa',
      'Trujillo',
      'Chiclayo',
      'Cusco',
      'Piura',
      'Iquitos',
      'Huancayo',
      'Tacna',
      'Puno',
    ],
    'United Arab Emirates': [
      'Dubai',
      'Abu Dhabi',
      'Sharjah',
      'Al Ain',
      'Ajman',
      'Ras Al Khaimah',
      'Fujairah',
    ],
    'Italy': [
      'Rome',
      'Milan',
      'Naples',
      'Turin',
      'Florence',
      'Bologna',
      'Venice',
      'Genoa',
      'Palermo',
      'Bari',
      'Verona',
      'Catania',
    ],
  };
}
