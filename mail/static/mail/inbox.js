document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email());

  // Sending Mail
  document.querySelector('#compose-form').addEventListener('submit', new_email);

  // By default, load the inbox
  load_mailbox('inbox');

});

function compose_email(to="", subject="", body="") {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#display_view').style.display = 'none';

  // Clear messages
  document.querySelector('#message').innerHTML = '';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = to;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#display_view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  // Show email title
  const titleDiv = document.createElement('div');
  titleDiv.className = 'row m-3 mb-4 p-3 border-bottom border-primary';
  titleDiv.id = 'title';

  ['From', 'Subject', 'Timestamp'].forEach(title => {
    const headingDiv = document.createElement('div');
    headingDiv.className = 'col';

    headingDiv.innerHTML = title;
    titleDiv.append(headingDiv);
  })

  document.querySelector('#emails-view').append(titleDiv);

  // Get email
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Show emails
    emails.forEach(email => {

      // Create a separate div link element for each email
      const anchor = document.createElement('A');
      anchor.href = 'javascript:void(0)';
      anchor.id = 'email-list';

      // Open email for when particular div is clicked
      anchor.addEventListener('click', () => open_email(email.id))

      const element = document.createElement('div');
      element.id = 'email-list';

      // Change div background color if email has been open/read
      if (email.read==true){
        element.className = 'row table-secondary m-3 p-3 border border-primary';
      } else {
        element.className = 'row m-3 p-3 border border-primary';  
      }
      
      anchor.append(element);

      ['sender', 'subject', 'timestamp'].forEach(heading => {
        const inner_elm = document.createElement('div');
        inner_elm.className = 'col';

        inner_elm.innerHTML = email[heading];
        element.append(inner_elm);
      })

      document.querySelector('#emails-view').append(anchor);
    })
  });
}

function new_email(event){

  //Get the input value
  let recipient_input = document.querySelector('#compose-recipients').value;
  let subject_input = document.querySelector('#compose-subject').value;
  let body_input = document.querySelector('#compose-body').value;
  
  const newEmail = {
    recipients: recipient_input,
    subject: subject_input,
    body: body_input
  }

  //Send email
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify(newEmail)
  })
  .then(response => response.json())
  .then(result => {
    //Display error message
    let message = document.querySelector('#message')

    if (result.message){
      load_mailbox('sent');
      message.className = '';
      message.innerHTML = '';
    } else if (result.error){
      const err_message = result.error
      message.className = "alert alert-danger";
      message.innerHTML = err_message;
    }
  })
  event.preventDefault();
}

function open_email(id){

  // Show the email and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#display_view').style.display = 'block';

  // Get particular email
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {

    document.querySelector('#from').innerHTML = email['sender'];
    document.querySelector('#to').innerHTML =email.recipients.join(", ")
    document.querySelector('#subject').innerHTML = email['subject'];
    document.querySelector('#timestamp').innerHTML = email['timestamp'];
    document.querySelector('#body').innerHTML = email['body'];

    let archiveBtn = document.querySelector('#archive')
    let mailboxName = document.querySelector('h2').innerHTML

    // Hide Archive button from sent mailbox
    if (mailboxName == email.sender){
      archiveBtn.style.display = 'none';
    } else {
      archiveBtn.style.display = 'inline'; 
    }

    // Set archive button value
    archiveBtn.innerHTML = email.archived ? 'Un-archive' : 'Archive'

    // Archive email
    archiveBtn.onclick = (event) => {
      event.preventDefault();
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: !email.archived
        })
      })
      .then (() => {
        email.archived = !email.archived
        archiveBtn.innerHTML = email.archived ? 'Un-archive' : 'Archive'
        load_mailbox('inbox');
      })
    };

    // Reply email
    document.querySelector('#reply').onclick = (event) => {
      event.preventDefault();

      let rplTo = email['sender']

      // Add Re: to reply only once
      let rplSubject
      if (email['subject'].startsWith('Re: ')){
        rplSubject = email['subject']
      } else {
        rplSubject = 'Re: ' + email['subject']
      }

      let rplBody = '\n\n On ' + email['timestamp'] + ' ' + email['sender'] + ' wrote:' + '\n' + email['body']
      compose_email(rplTo, rplSubject, rplBody);
    };
  })

  // Mark email as read
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
    read: true
    })
  })
}