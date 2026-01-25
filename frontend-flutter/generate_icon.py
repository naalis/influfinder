#!/usr/bin/env python3
"""Generate Influfinder app icon - correct isotype design."""

from PIL import Image, ImageDraw
import math

def create_gradient_background(size):
    """Create horizontal gradient: magenta → purple → blue → cyan."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))

    color_stops = [
        (0.0, (219, 39, 119)),    # Magenta/Pink
        (0.3, (139, 50, 180)),    # Purple
        (0.6, (79, 90, 200)),     # Blue-purple
        (1.0, (34, 211, 238)),    # Cyan
    ]

    for x in range(size):
        t = x / size

        for i in range(len(color_stops) - 1):
            if color_stops[i][0] <= t <= color_stops[i + 1][0]:
                t1, c1 = color_stops[i]
                t2, c2 = color_stops[i + 1]
                local_t = (t - t1) / (t2 - t1) if t2 != t1 else 0
                r = int(c1[0] + (c2[0] - c1[0]) * local_t)
                g = int(c1[1] + (c2[1] - c1[1]) * local_t)
                b = int(c1[2] + (c2[2] - c1[2]) * local_t)
                for y in range(size):
                    img.putpixel((x, y), (r, g, b, 255))
                break

    return img

def add_rounded_corners(img, radius):
    """Add iOS-style rounded corners."""
    size = img.size[0]
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius, fill=255)
    result = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    result.paste(img, mask=mask)
    return result

def draw_isotype(img, cx, cy, scale):
    """
    Draw the Influfinder isotype:
    - Ring (ring light) at top, open at bottom
    - Head (circle) inside the ring
    - Body with arrow/tripod pointing down
    """
    draw = ImageDraw.Draw(img)
    white = (255, 255, 255, 255)
    s = scale

    # === RING (Ring Light) - at the top, open at bottom ===
    ring_radius = int(150 * s)
    ring_thickness = int(35 * s)
    ring_cy = cy - int(80 * s)  # Ring center above image center

    # Draw ring as thick arc, OPEN AT BOTTOM
    # PIL angles: 0° is right (3 o'clock), counterclockwise
    # We want gap at bottom (270° in standard, or 90° in PIL going down)
    # Draw from 220° to 320° (leaving ~100° gap at bottom)
    for t in range(ring_thickness):
        r = ring_radius - ring_thickness//2 + t
        bbox = [cx - r, ring_cy - r, cx + r, ring_cy + r]
        # Start at -50° (bottom right), end at 230° (bottom left) - gap at bottom
        draw.arc(bbox, start=-50, end=230, fill=white, width=1)

    # === HEAD (circle inside the ring) ===
    head_radius = int(48 * s)
    head_cy = ring_cy + int(5 * s)  # Slightly below ring center
    draw.ellipse([
        cx - head_radius, head_cy - head_radius,
        cx + head_radius, head_cy + head_radius
    ], fill=white)

    # === BODY (arrow/pin pointing down with tripod legs) ===
    body_top = head_cy + head_radius - int(5 * s)
    body_bottom = cy + int(210 * s)
    body_width = int(28 * s)

    # Main body stem (center)
    stem_top = body_top
    stem_bottom = body_bottom

    # Draw the arrow body - narrowing then spreading
    # Upper part (neck) - thin
    neck_width = int(24 * s)
    neck_bottom = ring_cy + ring_radius + int(20 * s)

    draw.polygon([
        (cx - neck_width//2, stem_top),
        (cx - neck_width//2, neck_bottom),
        (cx + neck_width//2, neck_bottom),
        (cx + neck_width//2, stem_top),
    ], fill=white)

    # Arrow/tripod part - three legs spreading out
    arrow_top = neck_bottom - int(10 * s)
    arrow_bottom = body_bottom
    leg_spread = int(85 * s)
    leg_width = int(24 * s)

    # Center leg
    draw.polygon([
        (cx - leg_width//2, arrow_top),
        (cx - leg_width//2, arrow_bottom),
        (cx + leg_width//2, arrow_bottom),
        (cx + leg_width//2, arrow_top),
    ], fill=white)

    # Left leg (angled outward)
    draw.polygon([
        (cx - leg_width//2, arrow_top + int(30*s)),
        (cx - leg_spread, arrow_bottom),
        (cx - leg_spread + leg_width, arrow_bottom),
        (cx, arrow_top + int(60*s)),
    ], fill=white)

    # Right leg (angled outward)
    draw.polygon([
        (cx + leg_width//2, arrow_top + int(30*s)),
        (cx + leg_spread, arrow_bottom),
        (cx + leg_spread - leg_width, arrow_bottom),
        (cx, arrow_top + int(60*s)),
    ], fill=white)

def create_app_icon(size=1024):
    """Create the complete app icon."""
    img = create_gradient_background(size)
    corner_radius = int(size * 0.2237)
    img = add_rounded_corners(img, corner_radius)

    cx, cy = size // 2, size // 2
    scale = size / 1024
    draw_isotype(img, cx, cy, scale)

    return img

def main():
    """Generate all iOS icon sizes."""
    ios_sizes = {
        'Icon-App-1024x1024@1x.png': 1024,
        'Icon-App-60x60@3x.png': 180,
        'Icon-App-60x60@2x.png': 120,
        'Icon-App-83.5x83.5@2x.png': 167,
        'Icon-App-76x76@2x.png': 152,
        'Icon-App-76x76@1x.png': 76,
        'Icon-App-40x40@3x.png': 120,
        'Icon-App-40x40@2x.png': 80,
        'Icon-App-40x40@1x.png': 40,
        'Icon-App-20x20@3x.png': 60,
        'Icon-App-20x20@2x.png': 40,
        'Icon-App-20x20@1x.png': 20,
        'Icon-App-29x29@3x.png': 87,
        'Icon-App-29x29@2x.png': 58,
        'Icon-App-29x29@1x.png': 29,
    }

    icon_dir = '/Users/aniksasardashantovar/influfinder_flutter/ios/Runner/Assets.xcassets/AppIcon.appiconset'

    print("Generating Influfinder icons...")
    master = create_app_icon(1024)

    import os
    os.makedirs('/Users/aniksasardashantovar/influfinder_flutter/assets', exist_ok=True)
    master.save('/Users/aniksasardashantovar/influfinder_flutter/assets/app_icon.png')
    print("Saved: assets/app_icon.png (1024x1024)")

    for filename, size in ios_sizes.items():
        icon = create_app_icon(size)
        icon.save(f'{icon_dir}/{filename}')
        print(f"Generated: {filename} ({size}x{size})")

    print("\nDone!")

if __name__ == '__main__':
    main()
