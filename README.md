# 📬 Email Client (Front-End)

This project is a front-end implementation of a single-page email client using JavaScript, HTML, and CSS. It interacts with a Django-based API to send, receive, read, archive, and reply to emails.

## ✨ Features

* Single Page App (SPA): Dynamic rendering using JavaScript with no full page reloads.
* Compose Email: Send messages to registered users via a simple form.
* Inbox, Sent & Archive Views: View categorized emails in different mailboxes.
* Email View: See the full contents of any individual email.
* Mark as Read/Unread: Emails update read status when opened.
* Archive/Unarchive: Move emails in and out of the Archive.
* Reply Functionality: Compose a reply with pre-filled fields based on the original message.

## 📸 Screenshots

<img src="https://github.com/apiyarali/Email-Client/blob/92b6871ab7132da853d0597993ae7642da3bd17b/screenshots/inbox.jpg" alt="inbox" width="400">

<img src="https://github.com/apiyarali/Email-Client/blob/92b6871ab7132da853d0597993ae7642da3bd17b/screenshots/email.jpg" alt="inbox" width="400">


## 🚀 Getting Started

1. Clone the Repository

2. Set Up the Backend

  Navigate to the project folder and run the following commands:
  ```
  python manage.py makemigrations mail
  python manage.py migrate
  ```

3. Start the Server
  ```
  python manage.py runserver
  ```

4. Register a New User
5. 
   * Open your browser at http://localhost:8000
   * Use any email and password to register (e.g. foo@example.com)
   * All email data is stored in the local database (not sent to external servers)

## 🛠️ How It Works

### Views

* Inbox View (#emails-view): Displays emails in the selected mailbox.
* Compose View (#compose-view): Form for composing new emails.
* Email Detail View (#email-detail-view): Shows full email content with options to archive or reply.

### JavaScript Highlights

* Uses fetch() to interact with the following API routes:
  * GET /emails/<mailbox>
  * GET /emails/<email_id>
  * POST /emails
  * PUT /emails/<email_id>
* Event listeners toggle views dynamically and fetch data on-demand.
* Archive and read status are updated using PUT requests.
* Replies pre-fill the compose form with the original sender, subject, and quoted body.

## 📡 API Reference

**GET /emails/<mailbox>**
  Fetches all emails in the given mailbox (inbox, sent, archive).

**GET /emails/<id>**
  Fetches details of a specific email by ID.

**POST /emails**
  Sends a new email. Requires:
  ```
  json
  {
    "recipients": "user@example.com",
    "subject": "Hello!",
    "body": "How are you?"
  }
  ```

**PUT /emails/<id>**
  Updates email status. Accepts:
  ```
  json
  {
    "read": true,
    "archived": false
  }
  ```

## 🧠 Learnings

* DOM manipulation for SPA behavior
* API consumption using fetch()
* Conditional rendering and dynamic view switching
* Form handling and event delegation
* Use of PUT/POST requests for state updates

## 📌 Notes

* All backend logic is provided and CSRF-exempt for development simplicity.
* No emails are actually sent to external servers—this is a simulation.

## Inspiration

Project inspired by Harvard's CS33 Web Programming curriculum.

