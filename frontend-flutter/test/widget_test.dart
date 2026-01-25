import 'package:flutter_test/flutter_test.dart';
import 'package:influfinder_flutter/main.dart';

void main() {
  testWidgets('App launches correctly', (WidgetTester tester) async {
    await tester.pumpWidget(const InflufinderApp());
    await tester.pumpAndSettle();

    // Verify the app shows the welcome screen
    expect(find.text('Get Started'), findsOneWidget);
  });
}
