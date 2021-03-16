# Create User's Account

Create an Account for the User if an Account for that User does
not already exist. Each User can only have one Account.

**URL** : `/api/account/create/`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

Provide all fields of Account to be created.

```json
{
    "first_name": "[unicode 64 chars max]",
    "last_name": "[unicode 64 chars max]",
    "email": "[valid email]",
    "password": "[see password constraints]"
}
```

**Password constraints**
* Password must be longer than 8 characters
* Password must be less than 72 characters
* Password must not start or end with empty spaces
* Password must contain 1 upper case, lower case, number and special character

**Data example** All fields must be sent.

```json
{
    "first_name": "[unicode 64 chars max]",
    "last_name": "[unicode 64 chars max]",
    "email": "test@gmail.com",
    "password": "[see password constraints]"
}
```

## Success Response

**Condition** : If everything is OK and an Account didn't exist for this User.

**Code** : `201 CREATED`

**Content example**

```json
{
  "success": "User Account Created."
}
```

## Error Responses

**Condition** : If Account already exists for User.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
  "error": "Email already taken"
}
```

### Or

**Condition** : If fields are missed.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
  "error": "Missing '${field}' in request body"
}
```
