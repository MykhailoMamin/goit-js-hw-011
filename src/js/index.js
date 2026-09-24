import { getImages } from "./pixabay-api";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loadButton = document.querySelector(".load-more");

let page = 1;
let searchResult = "";
const PER_PAGE = 40;

loadButton.classList.add("is-hidden");

function createMarkup(data) {
  return data.map(item => `<div class="photo-card">
  <a href="${item.largeImageURL}">
    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes ${item.likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${item.views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${item.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${item.downloads}</b>
      </p>
    </div>
  </a>
</div>`).join("");
}

const lightbox =
  new SimpleLightbox(`.gallery a`, {
    captionsData: "alt",
    captionPosition: "bottom",
    captionDelay: 250,
  })

function checkEndOfResults(totalHits) {
  if (page * PER_PAGE >= totalHits) {
    loadButton.classList.add("is-hidden");
    Notify.info("We're sorry, but you've reached the end of search results.");
  } else {
    loadButton.classList.remove("is-hidden");
  }
}

searchForm.addEventListener("submit", async event => {
  event.preventDefault();
  gallery.innerHTML = "";
  loadButton.classList.add("is-hidden");

  const value = event.target.elements.searchQuery.value;
  page = 1;
  searchResult = value;
  try {
    const data = await getImages(value, page);
    if (data.hits.length === 0) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return;
    }

    gallery.insertAdjacentHTML("beforeend", createMarkup(data.hits));
    lightbox.refresh()
    Notify.success(`Hooray! We found ${data.totalHits} images.`)
    checkEndOfResults(data.totalHits);  
  } catch (error) {
    console.log(error.message);
  }
});

loadButton.addEventListener("click", async () => {
  const nextPage = page + 1;
  try {
    const data = await getImages(searchResult, nextPage)
    gallery.insertAdjacentHTML("beforeend", createMarkup(data.hits));
    lightbox.refresh();
    page = nextPage;  
    checkEndOfResults(data.totalHits);
    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
  } catch (error) {
    console.log(error);
  }
});