# API Reference - Influfinder Backend

**Base URL:** `http://localhost:8000/api/v1`

---

## 🔐 Authentication Endpoints

### 1. Register with Email

**POST** `/auth/register/email`

```json
// Request
{
  "email": "creator@example.com",
  "password": "SecurePass123!",
  "username": "my_username",
  "user_type": "CREATOR",
  "country": "ES"
}

// Response 201
{
  "user": {
    "id": "uuid-123",
    "email": "creator@example.com",
    "username": "my_username",
    "user_type": "CREATOR",
    "is_verified": false,
    "created_at": "2026-01-15T10:30:00Z"
  },
  "message": "Verification email sent"
}
```

### 2. Register with Instagram OAuth

**POST** `/auth/register/instagram`

```json
// Request
{
  "access_token": "instagram_token_here",
  "user_type": "CREATOR",
  "country": "ES"
}

// Response 201
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid-123",
    "email": "creator@instagram.com",
    "username": "instagram_username",
    "user_type": "CREATOR",
    "profile": {
      "instagram_handle": "@instagram_username",
      "instagram_followers": 50000,
      "tier_level": 0,
      "karma_score": 0
    }
  }
}
```

### 3. Login with Email

**POST** `/auth/login`

```json
// Request
{
  "email": "creator@example.com",
  "password": "SecurePass123!"
}

// Response 200
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": "uuid-123",
    "email": "creator@example.com",
    "username": "my_username",
    "user_type": "CREATOR",
    "is_verified": true,
    "profile": {
      "tier_level": 2,
      "karma_score": 450,
      "rating": 4.8,
      "completed_collaborations": 7
    }
  }
}
```

### 4. Login with OAuth

**POST** `/auth/login/oauth`

```json
// Request
{
  "provider": "instagram",  // instagram, facebook, tiktok, google
  "access_token": "instagram_token",
  "user_type": "CREATOR",
  "country": "ES"
}

// Response 200 (si usuario existe)
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}

// Response 201 (si crea usuario auto)
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... },
  "message": "New user created"
}
```

### 5. Refresh Token

**POST** `/auth/refresh`

```
Headers:
Authorization: Bearer {refresh_token}

// Response 200
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 1800
}
```

### 6. Verify Email

**POST** `/auth/verify-email`

```json
// Request
{
  "token": "email_verification_token_from_email"
}

// Response 200
{
  "message": "Email verified successfully"
}
```

### 7. Resend Verification Email

**POST** `/auth/resend-verification`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{
  "message": "Verification email sent"
}
```

### 8. Forgot Password

**POST** `/auth/forgot-password`

```json
// Request
{
  "email": "creator@example.com"
}

// Response 200
{
  "message": "Password reset email sent"
}
```

### 9. Reset Password

**POST** `/auth/reset-password`

```json
// Request
{
  "token": "reset_token_from_email",
  "password": "NewPassword123!"
}

// Response 200
{
  "message": "Password reset successful"
}
```

### 10. Change Password (Authenticated)

**POST** `/auth/change-password`

```
Headers:
Authorization: Bearer {access_token}

// Request
{
  "current_password": "OldPassword123!",
  "new_password": "NewPassword456!"
}

// Response 200
{
  "message": "Password changed successfully"
}
```

### 11. Logout

**POST** `/auth/logout`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{
  "message": "Logged out successfully"
}
```

---

## 💼 Offer Endpoints

### 1. Create Offer (Business only)

**POST** `/offers`

```
Headers:
Authorization: Bearer {access_token}

// Request
{
  "title": "Instagram Post - Summer Campaign",
  "description": "Necesitamos post de verano para nuestro producto",
  "category": "FASHION",
  "platforms": ["INSTAGRAM", "TIKTOK"],
  "budget_min": 500,
  "budget_max": 2000,
  "currency": "EUR",
  "requirements": {
    "influencer": {
      "min_followers": 50000,
      "min_engagement_rate": 5.0,
      "verified_required": true
    },
    "regular": {
      "min_followers": 1000,
      "min_engagement_rate": 2.0
    }
  },
  "content_specs": {
    "formats": ["POST", "REEL"],
    "required_hashtags": ["#summer2026", "#sustainable"],
    "required_mentions": ["@ourcompany"],
    "caption_requirements": "Min 50 chars describing product benefits"
  },
  "application_deadline": "2026-02-01T23:59:59Z",
  "content_deadline": "2026-03-01T23:59:59Z",
  "is_public": true
}

// Response 201
{
  "id": "offer-123",
  "title": "Instagram Post - Summer Campaign",
  "status": "DRAFT",
  "business_id": "uuid-business",
  "created_at": "2026-01-15T10:30:00Z",
  "views_count": 0
}
```

### 2. Get All Offers (with filters)

**GET** `/offers?category=FASHION&platforms=INSTAGRAM&budget_min=500&budget_max=2000&search=summer&page=1&limit=20&sort_by=recent`

```
// Response 200
{
  "total": 145,
  "page": 1,
  "limit": 20,
  "offers": [
    {
      "id": "offer-123",
      "title": "Instagram Post - Summer Campaign",
      "description": "Necesitamos post de verano...",
      "category": "FASHION",
      "platforms": ["INSTAGRAM", "TIKTOK"],
      "budget_min": 500,
      "budget_max": 2000,
      "currency": "EUR",
      "business": {
        "id": "uuid-business",
        "username": "fashion_brand",
        "rating": 4.9
      },
      "status": "ACTIVE",
      "is_public": true,
      "views_count": 1250,
      "applications_count": 23,
      "created_at": "2026-01-10T08:00:00Z"
    },
    // ... more offers
  ]
}
```

### 3. Get Offer Details

**GET** `/offers/{id}`

```
Headers:
Authorization: Bearer {access_token} (opcional)

// Response 200
{
  "id": "offer-123",
  "title": "Instagram Post - Summer Campaign",
  "description": "Necesitamos post de verano...",
  "category": "FASHION",
  "platforms": ["INSTAGRAM", "TIKTOK"],
  "budget_min": 500,
  "budget_max": 2000,
  "requirements": {
    "influencer": {
      "min_followers": 50000,
      "min_engagement_rate": 5.0,
      "verified_required": true
    },
    "regular": {
      "min_followers": 1000,
      "min_engagement_rate": 2.0
    }
  },
  "content_specs": {
    "formats": ["POST", "REEL"],
    "required_hashtags": ["#summer2026", "#sustainable"],
    "required_mentions": ["@ourcompany"]
  },
  "status": "ACTIVE",
  "business": {
    "id": "uuid-business",
    "username": "fashion_brand",
    "profile": {
      "rating": 4.9,
      "completed_collaborations": 34,
      "tier_level": 5
    }
  },
  "applications_count": 23,
  "collaborations_count": 12,
  "views_count": 1250,
  "created_at": "2026-01-10T08:00:00Z"
}
```

### 4. Update Offer

**PATCH** `/offers/{id}`

```
Headers:
Authorization: Bearer {access_token}

// Request (solo campos a actualizar)
{
  "title": "Instagram Post - Updated",
  "budget_min": 600,
  "budget_max": 2500
}

// Response 200
{ ... offer actualizado ... }
```

### 5. Publish Offer (DRAFT → ACTIVE)

**POST** `/offers/{id}/publish`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{
  "id": "offer-123",
  "status": "ACTIVE",
  "message": "Offer published successfully"
}
```

### 6. Archive Offer

**POST** `/offers/{id}/archive`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{
  "id": "offer-123",
  "status": "ARCHIVED",
  "message": "Offer archived successfully"
}
```

### 7. Get My Created Offers

**GET** `/offers/me/created?status=ACTIVE&page=1&limit=20`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{
  "total": 8,
  "offers": [
    { ... offer 1 ... },
    { ... offer 2 ... }
  ]
}
```

---

## 🤝 Collaboration Endpoints

### 1. Create Application (Creator applies to offer)

**POST** `/applications`

```
Headers:
Authorization: Bearer {access_token}

// Request
{
  "offer_id": "offer-123",
  "message": "Hello! I'm very interested in this collaboration. My followers are highly engaged with fashion content.",
  "media_attachments": [
    "https://instagram.com/p/ABC123...",
    "https://tiktok.com/@me/video/..."
  ],
  "proposed_fee": 1500
}

// Response 201
{
  "id": "app-456",
  "offer_id": "offer-123",
  "creator_id": "uuid-creator",
  "status": "APPLIED",
  "message": "Application created successfully",
  "created_at": "2026-01-15T14:20:00Z"
}
```

### 2. Get Creator's Applications

**GET** `/applications?status=APPLIED&page=1`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{
  "total": 7,
  "applications": [
    {
      "id": "app-456",
      "offer": {
        "id": "offer-123",
        "title": "Instagram Post - Summer Campaign",
        "budget_min": 500,
        "budget_max": 2000
      },
      "status": "APPLIED",
      "message": "Hello! I'm very interested...",
      "media_attachments": [
        "https://instagram.com/p/ABC123..."
      ],
      "proposed_fee": 1500,
      "created_at": "2026-01-15T14:20:00Z"
    }
  ]
}
```

### 3. Get Application Details

**GET** `/applications/{id}`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{ ... application con todos los detalles ... }
```

### 4. Review Application (Business accepts/rejects)

**POST** `/applications/{id}/review`

```
Headers:
Authorization: Bearer {access_token}

// Request
{
  "action": "accept",  // or "reject"
  "rejection_reason": null  // si action es "reject"
}

// Response 200
{
  "id": "app-456",
  "status": "ACCEPTED",
  "message": "Application accepted",
  "collaboration_id": "collab-789"  // generado automáticamente
}
```

### 5. Get Collaborations

**GET** `/collaborations?status=SCHEDULED&role=CREATOR&page=1`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{
  "total": 5,
  "collaborations": [
    {
      "id": "collab-789",
      "offer": {
        "id": "offer-123",
        "title": "Instagram Post - Summer Campaign",
        "category": "FASHION"
      },
      "creator": {
        "id": "uuid-creator",
        "username": "creator_name",
        "profile": {
          "tier_level": 2,
          "karma_score": 450,
          "rating": 4.8
        }
      },
      "business": {
        "id": "uuid-business",
        "username": "fashion_brand",
        "profile": {
          "rating": 4.9
        }
      },
      "status": "SCHEDULED",
      "agreed_fee": 1500,
      "scheduled_date": "2026-03-01T10:00:00Z",
      "created_at": "2026-01-15T14:30:00Z"
    }
  ]
}
```

### 6. Get Collaboration Details

**GET** `/collaborations/{id}`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{ ... collaboration completa con todos los detalles ... }
```

### 7. Schedule Collaboration

**POST** `/collaborations/{id}/schedule`

```
Headers:
Authorization: Bearer {access_token}

// Request
{
  "scheduled_date": "2026-03-01T10:00:00Z"
}

// Response 200
{
  "id": "collab-789",
  "status": "SCHEDULED",
  "scheduled_date": "2026-03-01T10:00:00Z",
  "message": "Collaboration scheduled"
}
```

### 8. Rate Collaboration

**POST** `/collaborations/{id}/rate`

```
Headers:
Authorization: Bearer {access_token}

// Request
{
  "rating": 5,
  "feedback": "Excellent work! Very professional and responsive."
}

// Response 200
{
  "id": "collab-789",
  "status": "COMPLETED",  // si ambos ya calificaron
  "message": "Rating submitted",
  "creator_rating": 5,
  "business_rating": 5
}
```

---

## 📸 Content Submission Endpoints

### 1. Submit Content

**POST** `/submissions`

```
Headers:
Authorization: Bearer {access_token}

// Request
{
  "collaboration_id": "collab-789",
  "content_urls": [
    "https://example.s3.amazonaws.com/photo1.jpg",
    "https://example.s3.amazonaws.com/photo2.jpg"
  ],
  "captions": {
    "instagram": "Beautiful summer vibes with @ourcompany ☀️ #summer2026 #sustainable",
    "tiktok": "Check out our new summer collection!"
  },
  "platform": "INSTAGRAM",
  "platform_post_id": "12345678_9876543"
}

// Response 201
{
  "id": "submission-101",
  "collaboration_id": "collab-789",
  "status": "SUBMITTED",
  "message": "Content submitted for review",
  "created_at": "2026-03-02T15:45:00Z"
}
```

### 2. Get Submission Details

**GET** `/submissions/{id}`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{
  "id": "submission-101",
  "collaboration_id": "collab-789",
  "creator_id": "uuid-creator",
  "status": "SUBMITTED",
  "content_urls": [
    "https://example.s3.amazonaws.com/photo1.jpg"
  ],
  "captions": {
    "instagram": "Beautiful summer vibes..."
  },
  "platform": "INSTAGRAM",
  "submitted_at": "2026-03-02T15:45:00Z",
  "reviewed_at": null,
  "ai_score": null
}
```

### 3. Analyze Content with AI

**POST** `/submissions/{id}/analyze-ai`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{
  "id": "submission-101",
  "status": "UNDER_REVIEW",
  "ai_score": 87.5,
  "ai_analysis": {
    "hashtags_found": ["#summer2026", "#sustainable"],
    "hashtags_missing": [],
    "mentions_found": ["@ourcompany"],
    "mentions_missing": [],
    "quality_rating": 9,
    "relevance_rating": 8,
    "compliance_percentage": 100,
    "suggestions": [
      "Consider adding more emojis for better engagement"
    ]
  },
  "passed_requirements": true,
  "message": "Content analyzed successfully"
}
```

### 4. Approve/Reject Content

**POST** `/submissions/{id}/approve`

```
Headers:
Authorization: Bearer {access_token}

// Request (para aprobar)
{}

// Response 200
{
  "id": "submission-101",
  "status": "APPROVED",
  "reviewed_by": "uuid-business",
  "reviewed_at": "2026-03-03T10:15:00Z",
  "message": "Content approved"
}
```

**POST** `/submissions/{id}/reject`

```
// Request
{
  "reviewer_notes": "Hashtags don't match. Please resubmit with #summer2026"
}

// Response 200
{
  "id": "submission-101",
  "status": "REJECTED",
  "reviewer_notes": "Hashtags don't match...",
  "message": "Content rejected"
}
```

---

## 🔔 Notification Endpoints

### 1. Get Notifications

**GET** `/notifications?page=1&limit=20`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{
  "total": 45,
  "unread_count": 7,
  "notifications": [
    {
      "id": "notif-111",
      "type": "APPLICATION_RECEIVED",
      "title": "New Application",
      "content": "creator_name applied to your offer 'Instagram Post...'",
      "related_offer_id": "offer-123",
      "related_application_id": "app-456",
      "is_read": false,
      "created_at": "2026-01-15T14:20:00Z"
    },
    {
      "id": "notif-112",
      "type": "TIER_UPGRADED",
      "title": "Congratulations!",
      "content": "You've reached Tier 2: PRO! 🎉",
      "is_read": true,
      "created_at": "2026-01-10T08:00:00Z"
    }
  ]
}
```

### 2. Mark Notification as Read

**PATCH** `/notifications/{id}/read`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{
  "id": "notif-111",
  "is_read": true,
  "read_at": "2026-01-15T15:30:00Z"
}
```

### 3. Delete Notification

**DELETE** `/notifications/{id}`

```
Headers:
Authorization: Bearer {access_token}

// Response 204 (No Content)
```

### 4. Get Unread Count

**GET** `/notifications/unread-count`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{
  "unread_count": 7
}
```

---

## 💬 Message Endpoints

### 1. Send Message

**POST** `/messages`

```
Headers:
Authorization: Bearer {access_token}

// Request
{
  "recipient_id": "uuid-other-user",
  "content": "Hi! Are you available for a collaboration?",
  "attachments": [
    "https://example.s3.amazonaws.com/portfolio.pdf"
  ],
  "collaboration_id": "collab-789"  // opcional
}

// Response 201
{
  "id": "msg-222",
  "sender_id": "uuid-me",
  "recipient_id": "uuid-other-user",
  "content": "Hi! Are you available...",
  "is_read": false,
  "created_at": "2026-01-15T16:45:00Z"
}
```

### 2. Get Conversations

**GET** `/messages?page=1&limit=50`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{
  "total": 5,
  "conversations": [
    {
      "other_user": {
        "id": "uuid-user123",
        "username": "creator_name",
        "profile": {
          "tier_level": 2
        }
      },
      "last_message": "Thanks for the collaboration!",
      "unread_count": 0,
      "last_message_at": "2026-01-15T16:45:00Z"
    },
    {
      "other_user": {
        "id": "uuid-user456",
        "username": "fashion_brand"
      },
      "last_message": "When can you start?",
      "unread_count": 3,
      "last_message_at": "2026-01-15T10:20:00Z"
    }
  ]
}
```

### 3. Get Chat with User

**GET** `/messages/{user_id}?page=1&limit=50`

```
Headers:
Authorization: Bearer {access_token}

// Response 200
{
  "total": 12,
  "messages": [
    {
      "id": "msg-220",
      "sender": {
        "id": "uuid-user123",
        "username": "creator_name"
      },
      "content": "Hi! Are you interested?",
      "attachments": [],
      "is_read": true,
      "created_at": "2026-01-14T09:00:00Z"
    },
    {
      "id": "msg-221",
      "sender": {
        "id": "uuid-me",
        "username": "my_username"
      },
      "content": "Yes! Tell me more about the project",
      "is_read": true,
      "created_at": "2026-01-14T10:15:00Z"
    },
    {
      "id": "msg-222",
      "sender": {
        "id": "uuid-user123",
        "username": "creator_name"
      },
      "content": "Perfect! Let's discuss the details...",
      "is_read": true,
      "created_at": "2026-01-15T09:30:00Z"
    }
  ]
}
```

---

## ℹ️ Health & Info Endpoints

### 1. Health Check

**GET** `/health`

```
// Response 200
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-01-15T17:00:00Z"
}
```

### 2. API Info

**GET** `/info`

```
// Response 200
{
  "api_name": "Influfinder Backend",
  "version": "1.0.0",
  "environment": "production",
  "docs_url": "https://api.influfinder.com/docs",
  "health": "operational"
}
```

---

## 📝 Common Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| **200** | OK | GET request successful |
| **201** | Created | POST created resource |
| **204** | No Content | DELETE successful |
| **400** | Bad Request | Invalid JSON or missing fields |
| **401** | Unauthorized | Missing or invalid token |
| **403** | Forbidden | Don't have permission (e.g., can't edit other user's offer) |
| **404** | Not Found | Resource doesn't exist |
| **422** | Validation Error | Invalid field values |
| **500** | Server Error | Backend issue |

## 🔑 Authentication Headers

Todos los endpoints autenticados requieren:

```
Authorization: Bearer {access_token}
```

Ejemplo:
```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:8000/api/v1/collaborations
```

## 🎯 Error Response Format

```json
{
  "detail": "Error message here",
  "status_code": 400
}
```

Ejemplo:
```json
{
  "detail": "Email already registered",
  "status_code": 400
}
```

---

**API completamente documentada** ✅
