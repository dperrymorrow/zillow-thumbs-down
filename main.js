
const storageKey = "zillow-no-thanks";
const selectors = {
  card: "zsg-photo-card-content", actions: "zsg-photo-card-actions",
  thumb: "_ext_thumb_down", blackListed: "_ext_black_listed"
};
let blackList = [];


function processCard($card) {
  if ($card.querySelector(`.${selectors.thumb}`)) return;

  const $thumb = document.createElement("div");
  $thumb.classList.add(selectors.thumb);
  $card.querySelector(`.${selectors.actions}`).appendChild($thumb);
  const id = $card.querySelector("*[data-fm-zpid]").getAttribute("data-fm-zpid");

  if (blackList.includes(id)) $card.classList.add(selectors.blackListed);

  $thumb.addEventListener("click", $event => {
    $event.stopPropagation();
    if (blackList.includes(id)) {
      $card.classList.remove(selectors.blackListed);
      whiteListProperty(id);
    } else {
      $card.classList.add(selectors.blackListed);
      blackListProperty(id);
    }
  });
}

function addThumbs() {
  Array.from(document.querySelectorAll(`.${selectors.card}`)).forEach(processCard);
}

function whiteListProperty(id) {
  const index = blackList.indexOf(id);
  if (index) blackList.splice(index);
  save();
}

function blackListProperty(id) {
  blackList.push(id);
  save();
}

function save() {
  chrome.storage.sync.set({ [storageKey]: blackList });
}

chrome.storage.sync.get(storageKey, result => {
  blackList = result[storageKey] || [];
  console.log("Value currently is " + result[storageKey]);
  setInterval(addThumbs, 1000);
});
