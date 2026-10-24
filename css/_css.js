/* Eldaria – pomocnik stylów.
   Każdy plik css/*.css.js to zwykły CSS w środku css`...`. Ta funkcja dopisuje go
   do JEDNEGO elementu <style> w <head>, w kolejności z index.html (kolejność = kaskada).

   Dlaczego nie zwykłe pliki .css? Gra przy powiększaniu na komputerze czyta i
   przepisuje tekst stylów (scaleMQ w js/core/viewport.js przelicza progi @media).
   Przeglądarka nie pozwala skryptom czytać zewnętrznych plików .css, gdy gra jest
   otwierana prosto z dysku (file://) – a tekst w <style> czytać wolno.
   Ścieżki url(assets/...) liczą się względem index.html. */
function css(s, ...v) {
  let st = document.getElementById('eldaria-css');
  if (!st) { st = document.createElement('style'); st.id = 'eldaria-css'; document.head.appendChild(st); }
  st.textContent += String.raw(s, ...v) + '\n';
}
