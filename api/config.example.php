<?php
/**
 * Bridgeway Medical Logistics - form configuration
 *
 * SETUP
 *   1. Copy this file to config.php in the same folder.
 *   2. Fill in the values below.
 *   3. Never commit config.php. It is already in .gitignore.
 *
 * config.php is required by quote.php. Without it the form still works and
 * still logs every lead to disk, it just cannot send email.
 */

return [

  /* ------------------------------------------------------------------
     WHERE LEADS GO
     ------------------------------------------------------------------ */

  // Every quote request is emailed here. Use your real working inbox.
  'notify_to'   => 'josephhenry@gmail.com',

  // The From address on the notification. This MUST be an address on your
  // own domain or mail providers will treat it as spoofed and filter it.
  // Do not put a gmail.com address here.
  'notify_from' => 'dispatch@REPLACE-WITH-YOUR-DOMAIN.com',
  'notify_name' => 'Bridgeway Website',


  /* ------------------------------------------------------------------
     SMTP  (strongly recommended)

     Leave 'smtp_host' empty to use PHP mail() instead. mail() works on
     Hostinger but lands in spam more often, which for this business means
     a lost account. Ten minutes of setup here is worth it.

     Hostinger email settings (hPanel > Emails > Email Accounts >
     Configuration Settings):
        host = smtp.hostinger.com
        port = 465    secure = ssl
        user = the full email address
        pass = that mailbox's password
     ------------------------------------------------------------------ */

  'smtp_host'   => '',                        // e.g. 'smtp.hostinger.com'
  'smtp_port'   => 465,                       // 465 = ssl, 587 = tls
  'smtp_secure' => 'ssl',                     // 'ssl' or 'tls'
  'smtp_user'   => '',                        // e.g. 'dispatch@yourdomain.com'
  'smtp_pass'   => '',


  /* ------------------------------------------------------------------
     LEAD LOG

     Every submission is appended to a CSV here before any email is
     attempted, so a mail failure can never lose you a lead.

     Default resolves to a folder one level ABOVE this site's web root,
     which keeps it unreachable over HTTP. If your host will not allow
     that, point it somewhere inside the site and keep the shipped
     .htaccess in place.
     ------------------------------------------------------------------ */

  'lead_dir'    => __DIR__ . '/../../_bridgeway_leads',


  /* ------------------------------------------------------------------
     ABUSE LIMITS
     ------------------------------------------------------------------ */

  'max_per_hour'  => 6,      // submissions allowed per IP per hour
  'min_seconds'   => 3,      // a form filled faster than this is a bot
];
