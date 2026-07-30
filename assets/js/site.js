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


  /* ZIP coverage check -------------------------------------------------- */
  /* 394 ZIPs across the nine served counties, from a public state/county/ZIP
     crosswalk. Embedded rather than fetched: it is 3KB and the answer should
     be instant. An unrecognised ZIP is never told "no" -- a wrong no loses a
     booking, and ZIP boundaries do not follow county lines cleanly. */
  var ZONES = {"Hudson County":["07002","07029","07030","07032","07047","07087","07093","07094","07302","07304","07305","07306","07307","07310","073HH","10004"],"Essex County":["07003","07004","07006","07009","07017","07018","07021","07028","07039","07040","07041","07042","07043","07044","07050","07052","07068","07078","07079","07102","07103","07104","07105","07106","07107","07108","07109","07110","07111","07112","07114","071HH"],"Bergen County":["07010","07020","07022","07024","07026","07031","07057","07070","07071","07072","07073","07074","07075","070HH","07401","07407","07410","07417","07423","07430","07432","07436","07446","07450","07452","07458","07463","07481","07601","07603","07604","07605","07606","07607","07608","07620","07621","07624","07626","07627","07628","07630","07631","07632","07640","07641","07642","07643","07644","07645","07646","07647","07648","07649","07650","07652","07656","07657","07660","07661","07662","07663","07666","07670","07675","076HH"],"Manhattan":["10001","10002","10003","10004","10005","10006","10007","10009","10010","10011","10012","10013","10014","10016","10017","10018","10019","10020","10021","10022","10023","10024","10025","10026","10027","10028","10029","10030","10031","10032","10033","10034","10035","10036","10037","10038","10039","10040","10041","10044","10048","10069","100HH","10103","10111","10112","10115","10119","10128","10152","10153","10154","10162","10165","10167","10169","10170","10171","10172","10173","10177","10271","10278","10279","10280","10282","102HH"],"Staten Island":["10301","10302","10303","10304","10305","10306","10307","10308","10309","10310","10312","10314","103HH"],"The Bronx":["10451","10452","10453","10454","10455","10456","10457","10458","10459","10460","10461","10462","10463","10464","10465","10466","10467","10468","10469","10470","10471","10472","10473","10474","10475","104HH"],"Nassau County":["11001","11003","11010","11020","11021","11023","11024","11030","11040","11042","11050","11096","110HH","114HH","11501","11507","11509","11510","11514","11516","11518","11520","11530","11542","11545","11547","11548","11550","11552","11553","11554","11557","11558","11559","11560","11561","11563","11565","11566","11568","11569","11570","11572","11575","11576","11577","11579","11580","11581","11590","11596","11598","115HH","11709","11710","11714","11732","11735","11753","11756","11758","11762","11765","11771","11783","11791","11793","11797","117HH","11801","11803","11804"],"Queens":["11004","11005","11101","11102","11103","11104","11105","11106","111HH","11354","11355","11356","11357","11358","11360","11361","11362","11363","11364","11365","11366","11367","11368","11369","11370","11371","11372","11373","11374","11375","11377","11378","11379","11385","113HH","11411","11412","11413","11414","11415","11416","11417","11418","11419","11420","11421","11422","11423","11426","11427","11428","11429","11430","11432","11433","11434","11435","11436","11691","11692","11693","11694","11697","116HH"],"Brooklyn":["11201","11203","11204","11205","11206","11207","11208","11209","11210","11211","11212","11213","11214","11215","11216","11217","11218","11219","11220","11221","11222","11223","11224","11225","11226","11228","11229","11230","11231","11232","11233","11234","11235","11236","11237","11238","11239","112HH"]};
  var ZIP_TO_ZONE = (function () {
    var m = {};
    Object.keys(ZONES).forEach(function (zone) {
      ZONES[zone].forEach(function (z) { m[z] = zone; });
    });
    return m;
  })();

  var zipForm = document.getElementById('zipcheck');
  if (zipForm) {
    var zipInput = document.getElementById('zip');
    var zipOut = document.getElementById('zipout');
    zipForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = (zipInput.value || '').trim();
      if (!/^\d{5}$/.test(v)) {
        zipOut.className = 'zipcheck__out zipcheck__out--warn';
        zipOut.textContent = 'Enter a five digit ZIP code.';
        return;
      }
      var zone = ZIP_TO_ZONE[v];
      if (zone) {
        zipOut.className = 'zipcheck__out zipcheck__out--ok';
        zipOut.textContent = v + ' is in our ' + zone + ' zone. Call dispatch for a window.';
      } else {
        zipOut.className = 'zipcheck__out zipcheck__out--warn';
        zipOut.textContent = v + ' is outside the nine counties listed. Call dispatch anyway, runs outside the zones are quoted case by case.';
      }
    });
  }

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
