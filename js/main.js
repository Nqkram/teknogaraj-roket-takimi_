/* =====================================================================
   TEKNOGARAJ ROKET TAKIMI — main.js
   ---------------------------------------------------------------------
   Bu dosya sadece 3 iş yapar:
     1) Mobil menüyü açar/kapatır (aria-expanded ile senkron)
     2) "Roketimiz" ve "İletişim" açılır menülerini yönetir
        (fare + klavye: Enter / Space / Escape / Tab)
     3) Menüden bir bağlantıya tıklanınca menüyü kapatır

   NOT: Tüm elementler "varsa" kontrolüyle alınır; sayfadan bir bölüm
   silinse bile script hata vermez ve çalışmaya devam eder.
   Harici kütüphane kullanılmaz.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Kısa yardımcılar ---------- */
  var sec  = function (s, k) { return (k || document).querySelector(s); };
  var hepsi = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };

  var ustcubuk   = sec('.ustcubuk');
  if (!ustcubuk) { return; }                 // Navbar yoksa hiçbir şey yapma

  var menu       = sec('#ana-menu', ustcubuk);
  var hamburger  = sec('#hamburger', ustcubuk);
  var acilirBtnlar = hepsi('.acilir-buton', ustcubuk);

  /* =====================================================================
     1) MOBİL MENÜ
     ===================================================================== */
  function menuyuKapat() {
    if (!menu || !hamburger) { return; }
    menu.classList.remove('acik');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function menuyuAcKapat() {
    if (!menu || !hamburger) { return; }
    var acik = menu.classList.toggle('acik');
    hamburger.setAttribute('aria-expanded', acik ? 'true' : 'false');
  }

  if (hamburger && menu) {
    hamburger.addEventListener('click', menuyuAcKapat);
  }

  /* =====================================================================
     2) AÇILIR ALT MENÜLER (dropdown)
     ===================================================================== */
  function tumAcilirlariKapat(haric) {
    acilirBtnlar.forEach(function (btn) {
      if (btn === haric) { return; }
      var kutu = document.getElementById(btn.getAttribute('aria-controls'));
      if (kutu) { kutu.classList.remove('acik'); }
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  acilirBtnlar.forEach(function (btn) {
    var kutu = document.getElementById(btn.getAttribute('aria-controls'));
    if (!kutu) { return; }                   // Hedef kutu yoksa atla (güvenli)

    /* Fare veya klavye (Enter/Space button elementinde click üretir) */
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var acikMi = kutu.classList.contains('acik');
      tumAcilirlariKapat(btn);
      kutu.classList.toggle('acik', !acikMi);
      btn.setAttribute('aria-expanded', !acikMi ? 'true' : 'false');
    });

    /* Ok tuşu ile aşağı inince ilk bağlantıya odaklan */
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        tumAcilirlariKapat(btn);
        kutu.classList.add('acik');
        btn.setAttribute('aria-expanded', 'true');
        var ilk = kutu.querySelector('a');
        if (ilk) { ilk.focus(); }
      }
    });

    /* TAB ile menünün dışına çıkılırsa kutuyu kapat (focus tuzağı olmaz) */
    kutu.addEventListener('focusout', function () {
      window.setTimeout(function () {
        if (!kutu.contains(document.activeElement) && document.activeElement !== btn) {
          kutu.classList.remove('acik');
          btn.setAttribute('aria-expanded', 'false');
        }
      }, 0);
    });
  });

  /* Sayfanın boş bir yerine tıklanınca açılır menüleri kapat */
  document.addEventListener('click', function (e) {
    if (ustcubuk.contains(e.target)) { return; }
    tumAcilirlariKapat(null);
  });

  /* ESC: önce açık dropdown'ı, yoksa mobil menüyü kapat; odağı geri ver */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }

    var acikBtn = acilirBtnlar.filter(function (b) {
      return b.getAttribute('aria-expanded') === 'true';
    })[0];

    if (acikBtn) {
      tumAcilirlariKapat(null);
      acikBtn.focus();                       // Odak kaybolmasın
      return;
    }

    if (menu && menu.classList.contains('acik')) {
      menuyuKapat();
      if (hamburger) { hamburger.focus(); }
    }
  });

  /* =====================================================================
     3) MENÜDEN BİR BAĞLANTIYA TIKLANINCA MENÜYÜ KAPAT
     ===================================================================== */
  if (menu) {
    hepsi('a', menu).forEach(function (a) {
      a.addEventListener('click', function () {
        menuyuKapat();
        tumAcilirlariKapat(null);
      });
    });
  }

  /* Masaüstü genişliğine dönülürse mobil menü durumunu sıfırla */
  var genis = window.matchMedia('(min-width: 901px)');
  var sifirla = function (mq) { if (mq.matches) { menuyuKapat(); } };
  if (genis.addEventListener) {
    genis.addEventListener('change', sifirla);
  } else if (genis.addListener) {
    genis.addListener(sifirla);              // Eski tarayıcı desteği
  }
})();
