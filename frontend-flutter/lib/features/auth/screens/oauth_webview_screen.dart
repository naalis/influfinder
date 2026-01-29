import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../../../core/services/api_client.dart';
import '../../../core/services/token_service.dart';
import '../../../core/models/social_account_model.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';

class OAuthWebViewScreen extends StatefulWidget {
  final SocialPlatform platform;

  const OAuthWebViewScreen({super.key, required this.platform});

  @override
  State<OAuthWebViewScreen> createState() => _OAuthWebViewScreenState();
}

class _OAuthWebViewScreenState extends State<OAuthWebViewScreen> {
  WebViewController? _controller;
  final ApiClient _apiClient = ApiClient();
  bool _isLoading = true;
  String? _error;

  String get _platformPath {
    switch (widget.platform) {
      case SocialPlatform.instagram:
        return 'instagram';
      case SocialPlatform.tiktok:
        return 'tiktok';
      case SocialPlatform.youtube:
        return 'youtube';
    }
  }

  String get _platformName {
    switch (widget.platform) {
      case SocialPlatform.instagram:
        return 'Instagram';
      case SocialPlatform.tiktok:
        return 'TikTok';
      case SocialPlatform.youtube:
        return 'YouTube';
    }
  }

  @override
  void initState() {
    super.initState();
    _initWebView();
  }

  @override
  void dispose() {
    _apiClient.dispose();
    super.dispose();
  }

  Future<void> _initWebView() async {
    try {
      final response = await _apiClient.get('/auth/$_platformPath/login');

      if (response.statusCode != 200) {
        if (mounted) {
          setState(() {
            _error = 'Failed to get auth URL (${response.statusCode})';
            _isLoading = false;
          });
        }
        return;
      }

      final authUrl = jsonDecode(response.body)['auth_url'] as String;

      final controller = WebViewController()
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setNavigationDelegate(NavigationDelegate(
          onNavigationRequest: (request) {
            if (request.url.startsWith('influfinder://oauth/callback')) {
              _handleCallback(request.url);
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
          onPageStarted: (_) {
            if (mounted) setState(() => _isLoading = true);
          },
          onPageFinished: (_) {
            if (mounted) setState(() => _isLoading = false);
          },
          onWebResourceError: (error) {
            if (mounted) {
              setState(() {
                _error = 'Web error: ${error.description}';
                _isLoading = false;
              });
            }
          },
        ))
        ..loadRequest(Uri.parse(authUrl));

      if (mounted) {
        setState(() {
          _controller = controller;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Connection error: $e';
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _handleCallback(String url) async {
    final uri = Uri.parse(url);
    final token = uri.queryParameters['token'];
    final refreshToken = uri.queryParameters['refresh_token'];

    if (token != null) {
      await TokenService().saveTokens(
        accessToken: token,
        refreshToken: refreshToken,
      );
      if (mounted) Navigator.of(context).pop(true);
    } else {
      final error = uri.queryParameters['error'];
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(error ?? 'Authentication failed'),
            backgroundColor: Colors.red,
          ),
        );
        Navigator.of(context).pop(false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        title: Text(
          'Connect $_platformName',
          style: AppTypography.h3,
        ),
        leading: IconButton(
          icon: const Icon(Icons.close, color: AppColors.textMuted),
          onPressed: () => Navigator.of(context).pop(false),
        ),
      ),
      body: Stack(
        children: [
          if (_error != null)
            Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      size: 48,
                      color: AppColors.textMuted,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      _error!,
                      style: AppTypography.body.copyWith(
                        color: AppColors.textSecondary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    TextButton(
                      onPressed: () {
                        setState(() {
                          _error = null;
                          _isLoading = true;
                        });
                        _initWebView();
                      },
                      child: Text(
                        'Try again',
                        style: AppTypography.label.copyWith(
                          color: AppColors.cyan,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            )
          else if (_controller != null)
            WebViewWidget(controller: _controller!),

          if (_isLoading)
            const Center(
              child: CircularProgressIndicator(
                color: AppColors.cyan,
              ),
            ),
        ],
      ),
    );
  }
}
