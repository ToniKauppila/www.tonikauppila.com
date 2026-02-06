(function () {
  if (typeof bodymovin === 'undefined') return;

  var defaultOptions = {
    renderer: 'svg',
    loop: true,
    autoplay: true
  };

  function init() {
    var containers = document.querySelectorAll('[data-lottie-path]');
    containers.forEach(function (el) {
      var path = el.getAttribute('data-lottie-path');
      if (!path) return;
      bodymovin.loadAnimation({
        container: el,
        path: path,
        loop: defaultOptions.loop,
        autoplay: defaultOptions.autoplay,
        renderer: defaultOptions.renderer
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
