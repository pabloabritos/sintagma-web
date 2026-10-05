const header = document.querySelector("[data-header]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// Novedades leídas en vivo de la API de WordPress de cada sitio oficial.
const feeds = {
  cppc: {
    // Obras sociales, liquidaciones, gremial, becas y cursos; sin efemérides.
    url: "https://cppc.org.ar/wp-json/wp/v2/posts?categories=72,73,76,71,145,66,62,59,42&categories_exclude=23&per_page=6&_fields=date,title,link",
    site: "https://cppc.org.ar/",
  },
  caja: {
    url: "https://cajasalud.com.ar/wp-json/wp/v2/posts?per_page=3&_fields=date,title,link",
    site: "https://cajasalud.com.ar/",
    // Solo se muestran si son recientes; si no, quedan los accesos fijos.
    maxAgeDays: 90,
  },
};

const decodeTitle = (html) => new DOMParser().parseFromString(html, "text/html").body.textContent.trim();

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });

const renderPosts = (list, posts, site) => {
  list.replaceChildren(
    ...posts
      .filter((post) => post.link.startsWith(site))
      .map((post) => {
        const item = document.createElement("li");
        const date = document.createElement("time");
        date.dateTime = post.date;
        date.textContent = formatDate(post.date);
        const link = document.createElement("a");
        link.href = post.link;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.textContent = decodeTitle(post.title.rendered);
        item.append(date, link);
        return item;
      }),
  );
};

const loadFeed = async (name) => {
  const feed = feeds[name];
  const list = document.querySelector(`[data-feed="${name}"]`);
  const wrap = document.querySelector(`[data-feed-wrap="${name}"]`);

  try {
    const response = await fetch(feed.url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(response.status);
    let posts = await response.json();

    if (feed.maxAgeDays) {
      const cutoff = Date.now() - feed.maxAgeDays * 24 * 60 * 60 * 1000;
      posts = posts.filter((post) => new Date(post.date).getTime() >= cutoff);
    }
    if (!posts.length) throw new Error("sin novedades");

    renderPosts(list, posts, feed.site);
    if (wrap) wrap.hidden = false;
  } catch {
    // Si la fuente no responde, se ofrece el link al sitio oficial.
    if (wrap) return;
    const item = document.createElement("li");
    item.className = "pro-loading";
    item.textContent = "No pudimos cargar las novedades en este momento. Podés verlas directamente en el sitio oficial.";
    list.replaceChildren(item);
  }
};

loadFeed("cppc");
loadFeed("caja");
