// Умная регистрация Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // Проверяем, что мы в продакшене
    if (window.location.protocol === 'https:') {
      navigator.serviceWorker.register('./service-worker.js')
        .then(function(registration) {
          console.log('SW registered successfully: ', registration);
          
          // Проверяем обновления
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('SW update found!');
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New content is available; please refresh.');
              }
            });
          });
        })
        .catch(function(registrationError) {
          console.log('SW registration failed: ', registrationError);
          // Не блокируем приложение при ошибке SW
        });
    }
  });

  // Обработка обновлений
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    window.location.reload();
  });
}