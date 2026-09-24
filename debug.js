// Діагностична панель: лише ЧИТАЄ адресу, cookies і localStorage, нічого не пише.
(function () {
  var KEYS = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","fbclid"];
  var cookiesAtLoad = document.cookie;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function row(k, v) { return "<tr><th>" + esc(k) + "</th><td>" + (v ? esc(v) : '<span class="empty">порожньо</span>') + "</td></tr>"; }

  function render() {
    var params = new URLSearchParams(location.search);
    var html = "<h2>Мітки в адресі цієї сторінки</h2><div class='panel'><table>";
    KEYS.forEach(function (k) { html += row(k, params.get(k)); });
    html += row("referrer", document.referrer);
    html += "</table></div>";

    html += "<h2>localStorage цього сайту</h2><div class='panel'><table>";
    var n = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i); n++;
        html += row(key, localStorage.getItem(key));
      }
    } catch (e) { html += row("помилка", e.message); }
    if (!n) html += row("записів немає", "");
    html += "</table></div>";

    var now = document.cookie;
    var same = now === cookiesAtLoad;
    html += "<h2>Cookies</h2><div class='panel'><table>";
    html += row("при завантаженні", cookiesAtLoad);
    html += row("зараз", now);
    html += "<tr><th>висновок</th><td class='" + (same ? "ok" : "bad") + "'>" +
      (same ? "нових cookies не з'явилось" : "з'явились нові cookies — перевірте, хто їх записав") + "</td></tr>";
    html += "</table></div>";

    if (window.hbWidgetSettings) {
      html += "<h2>window.hbWidgetSettings</h2><div class='panel'><code>" + esc(JSON.stringify(window.hbWidgetSettings)) + "</code></div>";
    }
    document.getElementById("debug").innerHTML = html;
  }

  render();
  setInterval(render, 3000);
})();
