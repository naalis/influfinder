import 'dart:convert';
import 'dart:io' show Platform;
import 'package:http/http.dart' as http;
import 'token_service.dart';

class ApiClient {
  static const String _prodBaseUrl = 'https://api.influfinder.com/api/v1';
  static const String _localBaseUrl = 'http://localhost:8000/api/v1';
  static const String _androidEmulatorUrl = 'http://10.0.2.2:8000/api/v1';

  final http.Client _client;
  final TokenService _tokenService;

  ApiClient({http.Client? client, TokenService? tokenService})
      : _client = client ?? http.Client(),
        _tokenService = tokenService ?? TokenService();

  /// Detecta URL base segun plataforma
  String get baseUrl {
    const bool isProduction = false;
    if (isProduction) return _prodBaseUrl;

    try {
      if (Platform.isAndroid) return _androidEmulatorUrl;
    } catch (_) {}
    return _localBaseUrl;
  }

  /// Headers con JWT si existe
  Future<Map<String, String>> _headers() async {
    final headers = {'Content-Type': 'application/json'};
    final token = await _tokenService.getAccessToken();
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  /// Intenta refrescar el token
  Future<bool> _refreshToken() async {
    final refreshToken = await _tokenService.getRefreshToken();
    if (refreshToken == null) return false;

    try {
      final response = await _client.post(
        Uri.parse('$baseUrl/auth/refresh'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'refresh_token': refreshToken}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        await _tokenService.saveTokens(
          accessToken: data['access_token'],
          refreshToken: data['refresh_token'],
        );
        return true;
      }
    } catch (_) {}

    return false;
  }

  /// Ejecuta request con reintento automatico si hay 401
  Future<http.Response> _requestWithRefresh(
    Future<http.Response> Function() request,
  ) async {
    final response = await request();

    if (response.statusCode == 401) {
      final refreshed = await _refreshToken();
      if (refreshed) {
        return await request();
      }
    }

    return response;
  }

  /// GET request
  Future<http.Response> get(String endpoint) async {
    return _requestWithRefresh(() async {
      final url = Uri.parse('$baseUrl$endpoint');
      return _client.get(url, headers: await _headers());
    });
  }

  /// POST request
  Future<http.Response> post(String endpoint, {Map<String, dynamic>? body}) async {
    return _requestWithRefresh(() async {
      final url = Uri.parse('$baseUrl$endpoint');
      return _client.post(url, headers: await _headers(), body: jsonEncode(body));
    });
  }

  /// PUT request
  Future<http.Response> put(String endpoint, {Map<String, dynamic>? body}) async {
    return _requestWithRefresh(() async {
      final url = Uri.parse('$baseUrl$endpoint');
      return _client.put(url, headers: await _headers(), body: jsonEncode(body));
    });
  }

  /// DELETE request
  Future<http.Response> delete(String endpoint) async {
    return _requestWithRefresh(() async {
      final url = Uri.parse('$baseUrl$endpoint');
      return _client.delete(url, headers: await _headers());
    });
  }

  void dispose() {
    _client.close();
  }
}
