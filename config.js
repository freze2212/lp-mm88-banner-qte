window.REDIRECT_URL = window.REDIRECT_URL || "";

(function() {
  var DOMAIN_MAP = {
    "mm883vip.com": "https://l0rr6.mm4111.com/register.html",
    "www.mm883vip.com": "https://l0rr6.mm4111.com/register.html",
    "mm88win.cc": "https://mm88e9e28qc.mm88cc.com/register.html",
    "www.mm88win.cc": "https://mm88e9e28qc.mm88cc.com/register.html"
  };
  var DEFAULT_URL = "#";

  function getTargetUrl(map) {
    var h = (window.location.hostname || "").toLowerCase().trim();
    var normH = h.replace(/^www\./, "");
    var m = map || DOMAIN_MAP;
    var entry = m[h] || m[normH] || m["www." + normH];
    if (entry) {
      return (typeof entry === "object" ? (entry.main_url || entry.url || entry.link) : entry) || DEFAULT_URL;
    }
    return m === DOMAIN_MAP ? (DOMAIN_MAP[normH] || DEFAULT_URL) : "";
  }

  var initialTarget = getTargetUrl(DOMAIN_MAP);
  window.REDIRECT_URL = initialTarget;

  function updateAllLinks(url) {
    var target = url || window.REDIRECT_URL || DEFAULT_URL;
    window.REDIRECT_URL = target;

    if (window.SITE_CONFIG) {
      window.SITE_CONFIG.defaultLink = target;
      window.SITE_CONFIG.registerUrl = target;
    }
    if (window.LINK_CONFIG) {
      window.LINK_CONFIG.default = target;
    }
    if (window.LP_CONFIG) {
      window.LP_CONFIG.gameUrl = target;
    }

    var links = document.querySelectorAll("a.redirect-link, a.btn-register, a.cta-btn, a.btn-link, #mainRedirectBtn");
    for (var i = 0; i < links.length; i++) {
      links[i].href = target;
      links[i].setAttribute("href", target);
    }
  }

  // Update immediately and on DOM load
  updateAllLinks(initialTarget);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      updateAllLinks(window.REDIRECT_URL);
    });
  }

  // Capture click event on redirect button
  document.addEventListener("click", function(e) {
    var btn = e.target.closest("a.redirect-link, a.btn-register, a.cta-btn, a.btn-link, #mainRedirectBtn");
    if (btn) {
      e.preventDefault();
      var destination = window.REDIRECT_URL || getTargetUrl(DOMAIN_MAP) || DEFAULT_URL;
      window.location.href = destination;
    }
  }, true);

  // Sync with domains.json dynamically
  function fetchDomains() {
    var urls = ["./domains.json?t=" + Date.now(), "/domains.json?t=" + Date.now()];
    function tryFetch(idx) {
      if (idx >= urls.length) return;
      fetch(urls[idx], { cache: "no-store" })
        .then(function(r) { return r.json(); })
        .then(function(dj) {
          if (dj && typeof dj === "object") {
            var target = getTargetUrl(dj);
            if (target) {
              window.REDIRECT_URL = target;
              updateAllLinks(target);
            }
          }
        })
        .catch(function() {
          tryFetch(idx + 1);
        });
    }
    tryFetch(0);
  }

  fetchDomains();
})();

// Dynamic real-time sync
(function(){try{fetch('/domains.json').then(function(r){return r.json();}).then(function(d){if(!d)return;var h=(window.location.hostname||'').toLowerCase();var nh=h.replace(/^www\./,'');var e=d[h]||d[nh];if(e){var u=e.main_url||e.url||e.link||(typeof e==='string'?e:'');if(u){window.REDIRECT_URL=u;var l=document.querySelectorAll('a.redirect-link,a.btn-register');for(var i=0;i<l.length;i++){l[i].href=u;}}}}).catch(function(){});}catch(e){}})();
