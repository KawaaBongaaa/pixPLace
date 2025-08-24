const langs = ['en','ru','es','fr','de','zh','pt-br','ar','hi','ja','it','ko','tr','pl'];
const langBtn = document.getElementById('langBtn');
const langMenu = document.getElementById('langMenu');
langs.forEach(l => {
  const li = document.createElement('li');
  li.textContent = l;
  li.onclick = () => alert("Language switched to: " + l);
  langMenu.appendChild(li);
});
langBtn.onclick = () => langMenu.classList.toggle('hidden');

async function loadPinterest(boardUrl, containerSelector, type="grid") {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  // Симуляция (так как Pinterest API требует ключ)
  let imgs = [
    'https://picsum.photos/400?1',
    'https://picsum.photos/400?2',
    'https://picsum.photos/400?3',
    'https://picsum.photos/400?4',
    'https://picsum.photos/400?5',
    'https://picsum.photos/400?6',
  ];
  imgs.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = "pixPLace AI generated artwork";
    if (type === "grid") container.appendChild(img);
    else container.appendChild(img);
  });
}
loadPinterest("https://www.pinterest.com/888k_ideas/to-print/", "#gallery1 .grid", "grid");
loadPinterest("https://www.pinterest.com/888k_ideas/sticker-logo-wallpaper-art-posters-clipart/", "#gallery2 .carousel", "carousel");
