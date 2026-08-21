# PulseChat API Documentation

This document provides complete, formalized documentation for all 13 RESTful HTTP API endpoints and WebSocket (Socket.io) real-time event specifications for the **PulseChat** real-time messaging application.

---

## Overview & Server Information

- **API Title**: Chat API (v1.0.0, OAS 3.0)
- **Base URL**: `https://frontend-task-chatapp.onrender.com/api`
- **WebSocket Host Origin**: `https://frontend-task-chatapp.onrender.com` (Socket.io path: `/socket.io/`)
- **Authentication**: JWT Bearer Token (`Authorization: Bearer <token>`)

---

## Authentication & Authorization Model

1. **Login & Registration**: Executed via `POST /auth/login` with a phone number and name. There is no separate signup step — a new phone number registers automatically, while an existing phone number authenticates the user.
2. **Protected REST Requests**: Must include the JWT token in the HTTP request header:
   ```http
   Authorization: Bearer <token>
   ```
3. **WebSocket Connection**: Connect to the root origin (`https://frontend-task-chatapp.onrender.com`) with the token in the Socket.io handshake auth object:
   ```javascript
   const socket = io("https://frontend-task-chatapp.onrender.com", {
     auth: { token }
   });
   ```

---

## Group Management Rules

- A conversation is either a **Direct** (1-to-1) chat or a **Group** chat (3 or more members).
- Groups have a `name` and one or more `admins` (the group creator starts as an admin).
- **Admin Privileges**: Only admins can add members, remove members, promote members to admin, and rename the group.
- **Member Actions**: Any member can leave the group by passing their own `userId` to the remove participant endpoint.
- **Group Messaging**: Group messages use the standard `POST /messages` endpoint and emit `message:new` WebSocket events.

---

## WebSocket Event Contracts (Socket.io)

| Event Name | Direction | Payload Structure / Ack | Description |
| :--- | :--- | :--- | :--- |
| `message:send` | Client → Server | `{ conversationId: string, text: string }` | Dispatches a message to a conversation via WebSocket. |
| `message:new` | Server → Client | `Message` object | Emitted when a new direct or group message arrives. |
| `conversation:updated` | Server → Client | `Conversation` object | Emitted when a group is created, renamed, or members/admins change. |

---

## Complete REST API Endpoints Specification

### 1. User Authentication (Login / Register)

- **Endpoint**: `POST /auth/login`
- **Access**: Public
- **Description**: Registers a new account or logs in an existing user by phone number and name.

#### Request Body
```json
{
  "phone": "+15551234567",
  "name": "Ada Lovelace"
}
```

#### Response (200 OK)
> **Security Note**: The JWT token payload signature is sanitized in this documentation to comply with GitGuardian secret scanning policies.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.<JWT_TOKEN_MASKED_FOR_GITGUARDIAN_SECURITY>",
  "user": {
    "_id": "6a882468e5d6aac97521e25e",
    "name": "Ada Lovelace",
    "phone": "+15551234567",
    "createdAt": "2026-08-21T10:11:52.529Z"
  }
}
```

---

### 2. Get Current User Profile

- **Endpoint**: `GET /auth/me`
- **Access**: Protected (`Bearer <token>`)
- **Description**: Retrieves authenticated user profile associated with bearer token for session restoration.

#### Request Body
*None*

#### Response (200 OK)
```json
{
  "_id": "6a882468e5d6aac97521e25e",
  "name": "Ada Lovelace",
  "phone": "+15551234567",
  "createdAt": "2026-08-21T10:11:52.529Z"
}
```

---

### 3. Search Users

- **Endpoint**: `GET /users/search?q={query}`
- **Access**: Protected (`Bearer <token>`)
- **Description**: Searches users by display name or phone number query string.

#### Query Parameters
- `q` (*string, required*): Search query (e.g., `Ada`).

#### Request Body
*None*

#### Response (200 OK)
```json
[
  {
    "_id": "6a882468e5d6aac97521e25e",
    "name": "Ada Lovelace",
    "phone": "+15551234567"
  },
  {
    "_id": "6a8827c4e5d6aac97521e3ec",
    "name": "Ada Probe",
    "phone": "+15550001001"
  },
  {
    "_id": "6a882806e5d6aac97521e4b3",
    "name": "Ada Lovelace",
    "phone": "+15550000001"
  },
  {
    "_id": "6a88295ce5d6aac97521e62d",
    "name": "Ada Lovelace",
    "phone": "+8801733586288"
  },
  {
    "_id": "6a882970e5d6aac97521e631",
    "name": "Ada Lovelace",
    "phone": "+880173358628"
  },
  {
    "_id": "6a883617e5d6aac97521f5ed",
    "name": "Ada Renamed",
    "phone": "+1555157543"
  },
  {
    "_id": "6a883776e5d6aac97521f97b",
    "name": "Ada Updated",
    "phone": "+15551234100"
  },
  {
    "_id": "6a883786e5d6aac97521f9db",
    "name": "Ada Lovelace",
    "phone": "+1555123asdasdasd4567"
  },
  {
    "_id": "6a8837d5e5d6aac97521faa4",
    "name": "Ada Lovelace",
    "phone": "015551234567"
  },
  {
    "_id": "6a8837e9e5d6aac97521fab4",
    "name": "Ada Lovelace",
    "phone": "+880015551234567"
  },
  {
    "_id": "6a883e8be5d6aac975220c8f",
    "name": "Ada Renamed",
    "phone": "+880138014961"
  }
]
```

---

### 4. Create Group Conversation

- **Endpoint**: `POST /conversations/group`
- **Access**: Protected (`Bearer <token>`)
- **Description**: Creates a new multi-participant group conversation. Creator becomes initial group admin.

#### Request Body
```json
{
  "name": "Project Team",
  "participantIds": [
    "6a884047e5d6aac975220fc5",
    "6a882806e5d6aac97521e4b3"
  ]
}
```

#### Response (200 OK)
```json
{
  "_id": "6a88408fe5d6aac97522102e",
  "type": "group",
  "name": "Project Team",
  "createdBy": "6a882468e5d6aac97521e25e",
  "admins": [
    "6a882468e5d6aac97521e25e"
  ],
  "participants": [
    {
      "_id": "6a882468e5d6aac97521e25e",
      "name": "Ada Lovelace",
      "phone": "+15551234567"
    },
    {
      "_id": "6a884047e5d6aac975220fc5",
      "name": "Ada Lovelace",
      "phone": "+15551233567"
    },
    {
      "_id": "6a882806e5d6aac97521e4b3",
      "name": "Ada Lovelace",
      "phone": "+15550000001"
    }
  ],
  "createdAt": "2026-08-21T12:11:59.921Z",
  "updatedAt": "2026-08-21T12:11:59.921Z"
}
```

---

### 5. Add Members to a Group

- **Endpoint**: `POST /conversations/:id/participants`
- **Access**: Protected (`Bearer <token>` - Group Admin Only)
- **Description**: Adds one or more users to an existing group conversation.

#### Path Parameters
- `id` (*string, required*): Group conversation ID.

#### Request Body
```json
{
  "userIds": [
    "6a884047e5d6aac975220fc5"
  ]
}
```

#### Response (200 OK)
```json
{
  "_id": "6a88408fe5d6aac97522102e",
  "type": "group",
  "name": "Project Team",
  "createdBy": "6a882468e5d6aac97521e25e",
  "admins": [
    "6a882468e5d6aac97521e25e"
  ],
  "participants": [
    {
      "_id": "6a882468e5d6aac97521e25e",
      "name": "Ada Lovelace",
      "phone": "+15551234567"
    },
    {
      "_id": "6a884047e5d6aac975220fc5",
      "name": "Ada Lovelace",
      "phone": "+15551233567"
    },
    {
      "_id": "6a882806e5d6aac97521e4b3",
      "name": "Ada Lovelace",
      "phone": "+15550000001"
    }
  ],
  "createdAt": "2026-08-21T12:11:59.921Z",
  "updatedAt": "2026-08-21T12:16:58.634Z"
}
```

---

### 6. Remove a Member / Leave a Group

- **Endpoint**: `DELETE /conversations/:id/participants/:userId`
- **Access**: Protected (`Bearer <token>`)
- **Description**: Removes a participant from a group (Admin required to remove others; member passes own `userId` to leave).

#### Path Parameters
- `id` (*string, required*): Group conversation ID.
- `userId` (*string, required*): Member ID to remove or leave.

#### Request Body
*None*

#### Response (200 OK)
```json
{
  "_id": "6a88408fe5d6aac97522102e",
  "type": "group",
  "name": "Project Team",
  "createdBy": "6a882468e5d6aac97521e25e",
  "admins": [
    "6a882468e5d6aac97521e25e"
  ],
  "participants": [
    {
      "_id": "6a882468e5d6aac97521e25e",
      "name": "Ada Lovelace",
      "phone": "+15551234567"
    },
    {
      "_id": "6a882806e5d6aac97521e4b3",
      "name": "Ada Lovelace",
      "phone": "+15550000001"
    }
  ],
  "createdAt": "2026-08-21T12:11:59.921Z",
  "updatedAt": "2026-08-21T12:17:57.620Z"
}
```

---

### 7. Promote a Member to Admin

- **Endpoint**: `POST /conversations/:id/admins`
- **Access**: Protected (`Bearer <token>` - Group Admin Only)
- **Description**: Promotes an existing group member to administrative status.

#### Path Parameters
- `id` (*string, required*): Group conversation ID.

#### Request Body
```json
{
  "userId": "6a882806e5d6aac97521e4b3"
}
```

#### Response (200 OK)
```json
{
  "_id": "6a88408fe5d6aac97522102e",
  "type": "group",
  "name": "Project Team",
  "createdBy": "6a882468e5d6aac97521e25e",
  "admins": [
    "6a882468e5d6aac97521e25e",
    "6a882806e5d6aac97521e4b3"
  ],
  "participants": [
    {
      "_id": "6a882468e5d6aac97521e25e",
      "name": "Ada Lovelace",
      "phone": "+15551234567"
    },
    {
      "_id": "6a882806e5d6aac97521e4b3",
      "name": "Ada Lovelace",
      "phone": "+15550000001"
    }
  ],
  "createdAt": "2026-08-21T12:11:59.921Z",
  "updatedAt": "2026-08-21T12:18:49.290Z"
}
```

---

### 8. Rename Group

- **Endpoint**: `PATCH /conversations/:id`
- **Access**: Protected (`Bearer <token>` - Group Admin Only)
- **Description**: Renames an existing group conversation.

#### Path Parameters
- `id` (*string, required*): Group conversation ID.

#### Request Body
```json
{
  "name": "Renamed Team"
}
```

#### Response (200 OK)
```json
{
  "_id": "6a88408fe5d6aac97522102e",
  "type": "group",
  "name": "Renamed Team",
  "createdBy": "6a882468e5d6aac97521e25e",
  "admins": [
    "6a882468e5d6aac97521e25e",
    "6a882806e5d6aac97521e4b3"
  ],
  "participants": [
    {
      "_id": "6a882468e5d6aac97521e25e",
      "name": "Ada Lovelace",
      "phone": "+15551234567"
    },
    {
      "_id": "6a882806e5d6aac97521e4b3",
      "name": "Ada Lovelace",
      "phone": "+15550000001"
    }
  ],
  "createdAt": "2026-08-21T12:11:59.921Z",
  "updatedAt": "2026-08-21T12:19:33.635Z"
}
```

---

### 9. Start a Direct Conversation

- **Endpoint**: `POST /conversations`
- **Access**: Protected (`Bearer <token>`)
- **Description**: Initiates or retrieves an existing 1-on-1 direct conversation with another user.

#### Request Body
```json
{
  "userId": "6a884047e5d6aac975220fc5"
}
```

#### Response (200 OK)
```json
{
  "_id": "6a88428be5d6aac975221491",
  "participants": [
    "6a882468e5d6aac97521e25e",
    "6a884047e5d6aac975220fc5"
  ],
  "createdAt": "2026-08-21T12:20:27.514Z"
}
```

---

### 10. List My Conversations

- **Endpoint**: `GET /conversations`
- **Access**: Protected (`Bearer <token>`)
- **Description**: Lists all direct and group conversations the current user is a participant of.

#### Request Body
*None*

#### Response (200 OK)
```json
{
  "data": [
    {
      "_id": "6a88428be5d6aac975221491",
      "type": "direct",
      "lastMessage": {},
      "updatedAt": "2026-08-21T12:20:27.514Z",
      "participant": {
        "_id": "6a884047e5d6aac975220fc5",
        "name": "Ada Lovelace",
        "phone": "+15551233567"
      }
    },
    {
      "_id": "6a88408fe5d6aac97522102e",
      "type": "group",
      "lastMessage": {},
      "updatedAt": "2026-08-21T12:19:33.635Z",
      "name": "Renamed Team",
      "createdBy": "6a882468e5d6aac97521e25e",
      "admins": [
        "6a882468e5d6aac97521e25e",
        "6a882806e5d6aac97521e4b3"
      ],
      "participants": [
        {
          "_id": "6a882468e5d6aac97521e25e",
          "name": "Ada Lovelace",
          "phone": "+15551234567"
        },
        {
          "_id": "6a882806e5d6aac97521e4b3",
          "name": "Ada Lovelace",
          "phone": "+15550000001"
        }
      ]
    },
    {
      "_id": "6a8840a6e5d6aac97522105c",
      "type": "group",
      "lastMessage": {},
      "updatedAt": "2026-08-21T12:19:23.407Z",
      "name": "Project Team",
      "createdBy": "6a882468e5d6aac97521e25e",
      "admins": [
        "6a882468e5d6aac97521e25e",
        "6a8824a9e5d6aac97521e264"
      ],
      "participants": [
        {
          "_id": "6a882468e5d6aac97521e25e",
          "name": "Ada Lovelace",
          "phone": "+15551234567"
        },
        {
          "_id": "6a88239de5d6aac97521e231",
          "name": "Test Candidate",
          "phone": "+8801700000001"
        },
        {
          "_id": "6a88239ee5d6aac97521e234",
          "name": "Alice Smith",
          "phone": "+8801700000002"
        },
        {
          "_id": "6a8824a9e5d6aac97521e264",
          "name": "Bob Jones",
          "phone": "+8801700000003"
        }
      ]
    },
    {
      "_id": "6a883644e5d6aac97521f629",
      "type": "direct",
      "lastMessage": {
        "text": "Hello!",
        "sender": "6a882468e5d6aac97521e25e",
        "createdAt": "2026-08-21T12:12:04.076Z"
      },
      "updatedAt": "2026-08-21T12:12:04.311Z",
      "participant": {
        "_id": "6a88239ee5d6aac97521e234",
        "name": "Alice Smith",
        "phone": "+8801700000002"
      }
    }
  ]
}
```

---

### 11. Get Message History

- **Endpoint**: `GET /conversations/:id/messages`
- **Access**: Protected (`Bearer <token>`)
- **Description**: Retrieves paginated message history for a given conversation.

#### Path Parameters
- `id` (*string, required*): Conversation ID.

#### Query Parameters
- `limit` (*integer, optional*): Maximum number of messages per page (Default: `20`).
- `before` (*string, optional*): ISO date string cursor for loading messages before a specific timestamp.

#### Request Body
*None*

#### Response (200 OK)
```json
{
  "messages": [
    {
      "_id": "6a88433ce5d6aac97522167f",
      "conversation": "6a88408fe5d6aac97522102e",
      "sender": "6a882468e5d6aac97521e25e",
      "text": "Hello!",
      "createdAt": "2026-08-21T12:23:24.958Z"
    }
  ],
  "hasMore": false
}
```

---

### 12. Health Check

- **Endpoint**: `GET /health`
- **Access**: Public
- **Description**: Verifies backend server health status and runtime operational readiness.

#### Request Body
*None*

#### Response (200 OK)
```json
{
  "status": "ok",
  "timestamp": "2026-08-21T12:25:00.000Z"
}
```

---

### 13. Send a Message

- **Endpoint**: `POST /messages`
- **Access**: Protected (`Bearer <token>`)
- **Description**: Posts a new message into a direct or group conversation. Dispatches WebSocket `message:new` event automatically.

#### Request Body
```json
{
  "conversationId": "6a88408fe5d6aac97522102e",
  "text": "Hello!"
}
```

#### Response (200 OK)
```json
{
  "_id": "6a88433ce5d6aac97522167f",
  "conversation": "6a88408fe5d6aac97522102e",
  "sender": "6a882468e5d6aac97521e25e",
  "text": "Hello!",
  "createdAt": "2026-08-21T12:23:24.958Z"
}
```
