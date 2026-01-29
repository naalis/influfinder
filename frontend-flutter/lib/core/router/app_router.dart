import 'package:go_router/go_router.dart';
import '../../features/onboarding/screens/screens.dart';
import '../../features/onboarding/screens/coming_soon_screen.dart';
import '../../features/onboarding/screens/business_onboarding_screen.dart';
import '../../features/offers/screens/offer_detail_screen.dart';
import '../../features/auth/screens/oauth_connect_screen.dart';
import '../../features/auth/screens/oauth_webview_screen.dart';
import '../../features/auth/screens/signin_screen.dart';
import '../widgets/main_shell.dart';
import '../models/social_account_model.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/onboarding',
    routes: [
      // Onboarding routes
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const WelcomeScreen(),
      ),
      GoRoute(
        path: '/onboarding/select-type',
        builder: (context, state) => const SelectTypeScreen(),
      ),
      GoRoute(
        path: '/onboarding/location',
        builder: (context, state) {
          final type = state.uri.queryParameters['type'] ?? 'creator';
          return LocationScreen(userType: type);
        },
      ),
      GoRoute(
        path: '/onboarding/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/onboarding/profile-setup',
        builder: (context, state) => const ProfileSetupScreen(),
      ),
      GoRoute(
        path: '/onboarding/connect-instagram',
        builder: (context, state) => const ConnectInstagramScreen(),
      ),
      GoRoute(
        path: '/onboarding/categories',
        builder: (context, state) => const CategoriesScreen(),
      ),
      GoRoute(
        path: '/onboarding/success',
        builder: (context, state) => const SuccessScreen(),
      ),
      GoRoute(
        path: '/onboarding/business',
        builder: (context, state) => const BusinessOnboardingScreen(),
      ),

      // Sign in (existing users)
      GoRoute(
        path: '/signin',
        builder: (context, state) => const SignInScreen(),
      ),

      // Coming soon (country not available)
      GoRoute(
        path: '/coming-soon',
        builder: (context, state) {
          final country = state.uri.queryParameters['country'] ?? 'Unknown';
          return ComingSoonScreen(detectedCountry: country);
        },
      ),

      // Main app routes with shell
      GoRoute(
        path: '/home',
        builder: (context, state) => const MainShell(initialIndex: 0),
      ),
      GoRoute(
        path: '/search',
        builder: (context, state) => const MainShell(initialIndex: 1),
      ),
      GoRoute(
        path: '/collabs',
        builder: (context, state) => const MainShell(initialIndex: 2),
      ),
      GoRoute(
        path: '/notifications',
        builder: (context, state) => const MainShell(initialIndex: 3),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const MainShell(initialIndex: 4),
      ),

      // Offer detail
      GoRoute(
        path: '/offer/:id',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return OfferDetailScreen(offerId: id);
        },
      ),

      // OAuth connect
      GoRoute(
        path: '/connect/instagram',
        builder: (context, state) => const OAuthConnectScreen(
          platform: SocialPlatform.instagram,
        ),
      ),
      GoRoute(
        path: '/connect/tiktok',
        builder: (context, state) => const OAuthConnectScreen(
          platform: SocialPlatform.tiktok,
        ),
      ),
      GoRoute(
        path: '/connect/youtube',
        builder: (context, state) => const OAuthConnectScreen(
          platform: SocialPlatform.youtube,
        ),
      ),

      // OAuth WebView
      GoRoute(
        path: '/oauth/webview/:platform',
        builder: (context, state) {
          final platformStr = state.pathParameters['platform'] ?? 'instagram';
          final platform = SocialPlatform.values.firstWhere(
            (p) => p.name == platformStr,
            orElse: () => SocialPlatform.instagram,
          );
          return OAuthWebViewScreen(platform: platform);
        },
      ),
    ],
  );
}
