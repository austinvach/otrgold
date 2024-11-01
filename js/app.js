const navbar = document.getElementById("navbar");
const episodeSelectionDiv = document.getElementById("episodeSelectionDiv");
const seriesDropdown = document.getElementById("seriesDropdown");
const episodeDropdown = document.getElementById("episodeDropdown");
const audioPlayerDiv = document.getElementById("audioPlayerDiv");
const audioPlayer = document.getElementById("audioPlayer");
const videoPlayerDiv = document.getElementById("videoPlayerDiv");
const introVideo = document.getElementById("introVideo");
const seriesVideo = document.getElementById("seriesVideo");
const transitionDelay = 5;
const series = {
  // "21st Precinct": {
  //   videoId: "21st-precinct",
  //   feed: "https://feeds.megaphone.fm/VKRX3382871919",
  // },
  // "Academy Award": {
  //   videoId: "academy-award",
  //   feed: "https://feeds.megaphone.fm/VKRX3969796462",
  // },
  // "Boston Blackie": {
  //   videoId: "boston-blackie",
  //   feed: "https://feeds.megaphone.fm/VKRX2949349551",
  // },
  // "Box 13": {
  //   videoId: "box-13",
  //   feed: "https://feeds.megaphone.fm/VKRX7483366394",
  // },
  // "Casey, Crime Photographer": {
  //   videoId: "casey-crime-photographer",
  //   feed: "https://feeds.megaphone.fm/VKRX3743269369",
  // },
  // "CBS Radio Mystery Theater": {
  //   videoId: "cbsrmt",
  //   feed: "https://feeds.megaphone.fm/VKRX3013755423",
  // },
  Dragnet: {
    videoId: "dragnet",
    feed: "https://feeds.megaphone.fm/VKRX4795506165",
  }
  // ,
  // Escape: {
  //   videoId: "escape",
  //   feed: "https://feeds.megaphone.fm/VKRX7138521916",
  // },
  // Gunsmoke: {
  //   videoId: "gunsmoke",
  //   feed: "https://feeds.megaphone.fm/VKRX5135261643",
  // },
  // "Inner Sanctum": {
  //   videoId: "inner-sanctum",
  //   feed: "https://feeds.megaphone.fm/VKRX4551496236",
  // },
  // "Richard Diamond, Private Detective": {
  //   videoId: "richard-diamond",
  //   feed: "https://feeds.megaphone.fm/VKRX8711189538",
  // },
  // Suspense: {
  //   videoId: "suspense",
  //   feed: "https://feeds.megaphone.fm/VKRX1793797555",
  // },
  // "The Adventures of Philip Marlowe": {
  //   videoId: "philip-marlowe",
  //   feed: "https://feeds.megaphone.fm/VKRX7325986260",
  // },
  // "The Adventures of Wild Bill Hickok": {
  //   videoId: "wild-bill-hickok",
  //   feed: "https://feeds.megaphone.fm/VKRX2357501255",
  // },
  // "The Whistler": {
  //   videoId: "the-whistler",
  //   feed: "https://feeds.megaphone.fm/VKRX5055337755",
  // },
  // "Yours Truly, Johnny Dollar": {
  //   videoId: "johnny-dollar",
  //   feed: "https://feeds.megaphone.fm/VKRX5983157895",
  // },
};
let playIntro;
let selectedSeries;
let selectedEpisode;
let selectedEpisodes;
let listeningHistory;

document.addEventListener("DOMContentLoaded", async () => {
  // Populates the emoji category dropdowns.
  checkLocalStorage();
  // loadUI();
  populateSeriesDropdown();
  populateEpisodeDropdown();
});

document.addEventListener("click", async (e) => {
  switch (e.target.id) {
    case "seriesDropdown":
      populateEpisodeDropdown();
      break;
    case "start":
      audioPlayer.src = episodeDropdown.value;
      seriesVideo.src = `assets/titles/${series[seriesDropdown.value].videoId}.mp4`;
      navbar.classList.remove("visible");
      episodeSelectionDiv.classList.add("hidden");
      audioPlayerDiv.classList.replace("hidden", "flex");
      videoPlayerDiv.classList.remove("hidden");
      break;
    case "introVideo":
      playPause();
      break;
    case "exitButton":
      exitFunction();
      break;
  }
});

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case " ":
      playPause();
      break;
    case "r":
      stopAndReset(seriesVideo);
      stopAndReset(introVideo);
      stopAndReset(audioPlayer);
      if (introVideo.classList.contains("fadeOut")) {
        introVideo.classList.remove("fadeOut");
      }
      break;
    case "Escape":
      exitFunction();
      break;
  }
  e.preventDefault(); // Prevent the default action (scrolling)
});

document.addEventListener("mousemove", (e) => {
  if (!audioPlayer.paused) {
    e.clientY < 50
      ? navbar.classList.add("visible")
      : navbar.classList.remove("visible");
  }
});


audioPlayer.addEventListener('timeupdate', (e) => {
  if (!listeningHistory[selectedSeries]) {
    listeningHistory[selectedSeries] = {};
  }
  listeningHistory[selectedSeries] = {
    ...listeningHistory[selectedSeries],
    [selectedEpisode]: audioPlayer.currentTime
  }
  //console.log("audioPlayer", selectedEpisode);
  saveUserSettings();
});

audioPlayer.addEventListener("pause", () => {
  !introVideo.paused
    ? introVideo.pause()
    : !seriesVideo.paused && seriesVideo.pause();
});

audioPlayer.addEventListener("play", () => {
  playIntro ? introVideo.play() : seriesVideo.play();
});

introVideo.addEventListener('timeupdate', function() {
  if (this.currentTime >= transitionDelay && playIntro) {
    this.classList.add("fadeOut");
    seriesVideo.play();
    playIntro = false;
  }
});

episodeDropdown.addEventListener('change', (e) => {
  selectedEpisode = episodeDropdown.selectedOptions[0].text;
  selectedEpisodes[selectedSeries] = selectedEpisode;
  if (audioPlayer.currentTime > 0) {
    listeningHistory[selectedSeries] = {
      ...listeningHistory[selectedSeries],
      [selectedEpisode]: audioPlayer.currentTime
    }
  }
  saveUserSettings();
});

seriesDropdown.addEventListener('change', (e) => {
  selectedSeries = seriesDropdown.value;
  let selectedIndex = selectedEpisodes[selectedSeries] 
    ? Array.from(episodeDropdown.options).findIndex(option => option.text === selectedEpisodes[selectedSeries]) 
    : 0;
  episodeDropdown.selectedIndex = selectedIndex;
  populateEpisodeDropdown();
});

function checkLocalStorage() {
  // Checks if local storage is available.
  if (
    // This function checks if a specific type of web storage is available.
    (function storageAvailable(type) {
      try {
        // Define a test string.
        const x = "__storage_test__";
        // Try to use the storage.
        window[type].setItem(x, x);
        // Try to remove the test item from the storage.
        window[type].removeItem(x);
        // If both operations are successful, then the storage is available.
        return true;
      } catch (e) {
        // If any of the operations fail, then the storage might not be available.
        // The function checks for specific error codes and names that indicate quota exceeded errors.
        // It also checks if there's already something in the storage.
        return (
          e instanceof DOMException &&
          (e.code === 22 ||
            e.code === 1014 ||
            e.name === "QuotaExceededError" ||
            e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
          window[type] &&
          window[type].length !== 0
        );
      }
    })("localStorage")
  ) {
    // Retrieves the user's selected emoji category, skin tone, and card preview time from local storage.
    selectedSeries = localStorage.getItem('selectedSeries');
    selectedEpisodes = JSON.parse(localStorage.getItem('selectedEpisodes')) || {};
    listeningHistory = JSON.parse(localStorage.getItem('listeningHistory')) || {};
    // selectedEpisode = selectedEpisodes[selectedSeries];
    console.log("LOADING", selectedEpisodes, listeningHistory);
  } else {
    // Logs a message to the console if local storage is not available.
    console.log("LOCAL STORAGE NOT AVAILABLE");
  }
}

function exitFunction() {
  audioPlayer.pause();
  seriesVideo.pause();
  navbar.classList.add("visible");
  episodeSelectionDiv.classList.remove("hidden");
  audioPlayerDiv.classList.add("hidden");
  videoPlayerDiv.classList.add("hidden");
}

// function loadUI() {
  
// }

function playPause() {
  if (audioPlayer.paused) {
    playIntro = audioPlayer.currentTime <= transitionDelay;
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
}

function populateEpisodeDropdown() {
  const feed = series[seriesDropdown.value].feed;
  fetch(feed)
    .then((response) => response.text())
    .then((data) => {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(data, "text/xml");
      var items = xmlDoc.getElementsByTagName("item");
      episodeDropdown.innerHTML = "";
      for (var i = 0; i < items.length; i++) {
        var episodeUrl = items[i]
          .getElementsByTagName("enclosure")[0]
          .getAttribute("url");
        var episodeTitle = items[i].getElementsByTagName("title")[0].textContent;
        var isSelected = selectedEpisodes[selectedSeries] === episodeTitle;
        const option = new Option(episodeTitle, episodeUrl, false, isSelected);
        episodeDropdown.prepend(option);
      }
      if(!selectedEpisodes[selectedSeries]){
        console.log(`No pre-selected episode for "${selectedSeries}. Setting to first in the list."`);
        episodeDropdown.selectedIndex = 0;
        selectedEpisode = episodeDropdown.selectedOptions[0].text;
        selectedEpisodes[selectedSeries] = selectedEpisode;
        saveUserSettings();
      }
      // if (listeningHistory[selectedSeries] && listeningHistory[selectedSeries][selectedEpisode]) {
      //   // Set the audio player's current time to the stored time
      //   audioPlayer.currentTime = listeningHistory[selectedSeries][selectedEpisode];
      //   console.log(`${selectedEpisode} has been played before. Setting audioPlayer.currentTime to ${audioPlayer.currentTime}`);
      //   showVideoPlayerDiv();
      // } else {
      //   // If there's no stored time, start from the beginning
      //   audioPlayer.currentTime = 0;
      // }
    });
}

function populateSeriesDropdown() {
  Object.entries(series).forEach(([key, value]) => {
    const isSelected = selectedSeries === key;
    const option = new Option(key, undefined, false, isSelected);
    seriesDropdown.append(option);
  });
  if(!selectedSeries){
    console.log("No pre-selected series. Setting to first series in the list.");
    selectedSeries = seriesDropdown.value;
  }
}

function saveUserSettings() {
  localStorage.setItem('selectedSeries', selectedSeries);
  localStorage.setItem('selectedEpisodes', JSON.stringify(selectedEpisodes));
  localStorage.setItem('listeningHistory', JSON.stringify(listeningHistory));
  console.log("SAVING", selectedEpisodes, listeningHistory);
}

function stopAndReset(media) {
  media.pause();
  media.currentTime = 0;
}

function storageAvailable(type) {
  let storage;
  try {
    // Try to use the storage.
    storage = window[type];
    const x = "STORAGE_TEST";
    // Try to set an item.
    storage.setItem(x, x);
    // Try to remove the item.
    storage.removeItem(x);
    // If all the above operations are successful, then the storage is available.
    return true;
  } catch (e) {
    // If any of the operations fail, then the storage might not be available.
    // The function checks for specific error codes and names that indicate quota exceeded errors.
    // It also checks if there's already something in the storage.
    return (
      e instanceof DOMException &&
      (e.code === 22 ||
        e.code === 1014 ||
        e.name === "QuotaExceededError" ||
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      storage &&
      storage.length !== 0
    );
  }
}