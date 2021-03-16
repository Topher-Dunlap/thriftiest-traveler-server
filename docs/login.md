# Login

Used to collect a Token for a registered User.

**URL** : `/api/account/auth/login/`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
    "email": "[valid email address]",
    "password": "[password in plain text]"
}
```

**Data example**

```json
{
    "username": "iloveauth@example.com",
    "password": "abcd1234"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "success": "User logged in." 
}
```

## Error Response

**Condition** : If 'username' and 'password' combination is wrong.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
  "error": "Incorrect email or password."
}
```

**Condition** : Missing value in submitted form.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
  "error": "Missing '${key}' in request body"
}
```

**Condition** : Any other error that occurs for POST on this path.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
  "error": "Something went wrong please try again."
}
```
