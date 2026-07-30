/* Bridgeway Medical Logistics
   Progressive enhancement only. Every function here is optional: with
   JavaScript disabled the form still posts to /api/quote.php and the visitor
   gets a server-rendered confirmation page. Nothing on this site is
   scroll-driven and nothing observes the viewport. */

(function () {
  'use strict';

  /* Footer year -------------------------------------------------------- */
  document.querySelectorAll('#year').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* Quote form --------------------------------------------------------- */
  var form = document.getElementById('quote-form');
  if (!form) return;

  var statusBox = document.getElementById('form-status');
  var submitBtn = document.getElementById('quote-submit');
  var stamp = form.querySelector('input[name="rendered_at"]');

  /* Timestamp for the server-side timing check. Set from JS so a bot that
     fetches the raw HTML and posts instantly has no valid value. */
  if (stamp) stamp.value = String(Math.floor(Date.now() / 1000));

  var RULES = {
    facility: { label: 'Facility name', test: function (v) { return v.length >= 2; },
                msg: 'Enter the facility name.' },
    name:     { label: 'Your name',     test: function (v) { return v.length >= 2; },
                msg: 'Enter your name.' },
    email:    { label: 'Work email',    test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
                msg: 'Enter a valid email address.' },
    phone:    { label: 'Phone',         test: function (v) { return (v.replace(/\D/g, '').length >= 10); },
                msg: 'Enter a phone number with at least 10 digits.' },
    /* Both ends are required: a courier run cannot be quoted from one address. */
    pickup:   { label: 'Pickup address',   test: function (v) { return v.length >= 4; },
                msg: 'Enter the pickup address.' },
    dropoff:  { label: 'Delivery address', test: function (v) { return v.length >= 4; },
                msg: 'Enter the delivery address.' }
  };

  function setError(field, message) {
    var input = form.elements[field];
    var slot = document.getElementById(field + '-err');
    if (!input) return;
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      if (slot) slot.textContent = message;
    } else {
      input.removeAttribute('aria-invalid');
      if (slot) slot.textContent = '';
    }
  }

  function validate() {
    var firstBad = null;
    Object.keys(RULES).forEach(function (key) {
      var input = form.elements[key];
      if (!input) return;
      var ok = RULES[key].test(input.value.trim());
      setError(key, ok ? '' : RULES[key].msg);
      if (!ok && !firstBad) firstBad = input;
    });
    return firstBad;
  }

  /* Clear a field's error as soon as it becomes valid, so the message does
     not sit there contradicting what the visitor just typed. */
  Object.keys(RULES).forEach(function (key) {
    var input = form.elements[key];
    if (!input) return;
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true' && RULES[key].test(input.value.trim())) {
        setError(key, '');
      }
    });
  });

  function showStatus(kind, html) {
    if (!statusBox) return;
    statusBox.className = 'form__status form__status--' + kind;
    statusBox.innerHTML = html;
    statusBox.hidden = false;
  }

  form.addEventListener('submit', function (event) {
    var firstBad = validate();
    if (firstBad) {
      event.preventDefault();
      firstBad.focus();
      showStatus('err', 'Please correct the highlighted fields.');
      return;
    }

    /* fetch is what makes this an inline submit rather than a page load. If
       it is unavailable, fall through to the normal form POST. */
    if (!window.fetch) return;

    event.preventDefault();
    if (statusBox) statusBox.hidden = true;
    submitBtn.setAttribute('aria-busy', 'true');
    submitBtn.disabled = true;
    var originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        return res.json().catch(function () {
          throw new Error('bad-response');
        });
      })
      .then(function (data) {
        if (!data || data.ok !== true) {
          if (data && data.fields) {
            Object.keys(data.fields).forEach(function (k) { setError(k, data.fields[k]); });
          }
          throw new Error((data && data.error) || 'failed');
        }
        form.reset();
        if (stamp) stamp.value = String(Math.floor(Date.now() / 1000));
        showStatus('ok',
          '<strong>Request received.</strong> Joseph will follow up shortly. ' +
          'If this is time-critical, call dispatch at ' +
          '<a href="tel:+15165541252">(516) 554-1252</a>.');
      })
      .catch(function () {
        showStatus('err',
          '<strong>That did not send.</strong> Please call dispatch at ' +
          '<a href="tel:+15165541252">(516) 554-1252</a> or email ' +
          '<a href="mailto:josephhenry@gmail.com">josephhenry@gmail.com</a>.');
      })
      .finally(function () {
        submitBtn.removeAttribute('aria-busy');
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      });
  });
})();
