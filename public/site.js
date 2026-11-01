'use strict';
const labels = {data: 'Data & logic', desktop: 'Desktop', network: 'Network & services', developer: 'Developer tools'};
const grid = document.querySelector('#package-grid');
const status = document.querySelector('#catalog-status');
const search = document.querySelector('#package-search');
let packages = [];
let category = 'all';
function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const matches = packages.filter(item => (category === 'all' || item.category === category) && `${item.name} ${item.description}`.toLocaleLowerCase().includes(query));
  grid.replaceChildren();
  for (const item of matches) {
    const card = document.createElement('a');
    card.className = 'package';
    card.href = `https://github.com/BuoyBay/${encodeURIComponent(item.name)}`;
    const heading = document.createElement('h3');
    heading.textContent = item.name;
    const arrow = document.createElement('span');
    arrow.textContent = '↗';
    arrow.setAttribute('aria-hidden', 'true');
    heading.append(arrow);
    const description = document.createElement('p');
    description.textContent = item.description;
    const tag = document.createElement('span');
    tag.className = 'category';
    tag.textContent = labels[item.category] ?? 'Buoy package';
    card.append(heading, description, tag);
    grid.append(card);
  }
  status.textContent = matches.length ? `${matches.length} ${matches.length === 1 ? 'package' : 'packages'}${query || category !== 'all' ? ' matched' : ' to explore'}` : 'No matches. Try a different search or category.';
}
search.addEventListener('input', render);
for (const button of document.querySelectorAll('[data-category]')) {
  button.addEventListener('click', () => {
    category = button.dataset.category;
    for (const other of document.querySelectorAll('[data-category]')) other.setAttribute('aria-pressed', String(other === button));
    render();
  });
}
fetch('/catalog.json', {headers: {'Accept': 'application/json'}})
  .then(response => { if (!response.ok) throw new Error('Catalog unavailable'); return response.json(); })
  .then(data => {
    if (!Array.isArray(data) || data.some(item => !/^[a-z0-9][a-z0-9-]*$/.test(item.name) || typeof item.description !== 'string')) throw new Error('Invalid catalog');
    packages = data;
    render();
  })
  .catch(() => { status.textContent = 'The catalog could not be loaded. You can browse all repositories on GitHub.'; });
