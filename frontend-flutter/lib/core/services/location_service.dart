import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';

class LocationResult {
  final String? country;
  final String? city;
  final String? error;
  final bool permissionDenied;
  final bool serviceDisabled;
  final bool isAllowedCountry;

  LocationResult({
    this.country,
    this.city,
    this.error,
    this.permissionDenied = false,
    this.serviceDisabled = false,
    this.isAllowedCountry = false,
  });

  bool get hasError => error != null || permissionDenied || serviceDisabled;
}

class LocationService {
  static const List<String> allowedCountries = [
    'Peru',
    'United Arab Emirates',
    'Italy',
  ];

  Future<LocationResult> detectLocation() async {
    try {
      // 1. Check if location services are enabled
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        return LocationResult(
          serviceDisabled: true,
          error: 'Location services are disabled',
        );
      }

      // 2. Check and request permission
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          return LocationResult(
            permissionDenied: true,
            error: 'Location permission denied',
          );
        }
      }

      if (permission == LocationPermission.deniedForever) {
        return LocationResult(
          permissionDenied: true,
          error: 'Location permission permanently denied',
        );
      }

      // 3. Get current position
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.medium,
        timeLimit: const Duration(seconds: 10),
      );

      // 4. Reverse geocode to get country and city
      final placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );

      if (placemarks.isEmpty) {
        return LocationResult(
          error: 'Could not determine location',
        );
      }

      final placemark = placemarks.first;
      final country = placemark.country ?? '';
      final city = placemark.locality ?? placemark.subAdministrativeArea ?? '';

      // 5. Check if country is allowed
      final isAllowed = allowedCountries.contains(country);

      return LocationResult(
        country: country,
        city: city,
        isAllowedCountry: isAllowed,
      );
    } catch (e) {
      return LocationResult(
        error: 'Failed to detect location: $e',
      );
    }
  }

  /// Check if a country name is in the allowed list
  static bool isCountryAllowed(String country) {
    return allowedCountries.contains(country);
  }
}
