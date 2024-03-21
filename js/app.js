var videoPlayerDiv = document.getElementById("videoPlayerDiv");
var audioPlayerDiv = document.getElementById("audioPlayerDiv");
var audioPlayer = document.getElementById("audioPlayer");
var introVideo = document.getElementById("introVideo");
var seriesTitleVideo = document.getElementById("seriesTitleVideo");
var introInProgress = true;
const series = {
  "21st Precinct": {
    videoId: "21st-precinct",
    feed: "https://feeds.megaphone.fm/VKRX3382871919",
  },
  "Academy Award": {
    videoId: "academy-award",
    feed: "https://feeds.megaphone.fm/VKRX3969796462",
  },
  "Boston Blackie": {
    videoId: "boston-blackie",
    feed: "https://feeds.megaphone.fm/VKRX2949349551",
  },
  "Box 13": {
    videoId: "box-13",
    feed: "https://feeds.megaphone.fm/VKRX7483366394",
  },
  "Casey, Crime Photographer": {
    videoId: "casey-crime-photographer",
    feed: "https://feeds.megaphone.fm/VKRX3743269369",
  },
  "CBS Radio Mystery Theater": {
    videoId: "cbsrmt",
    feed: "https://feeds.megaphone.fm/VKRX3013755423",
  },
  Dragnet: {
    videoId: "dragnet",
    feed: "https://feeds.megaphone.fm/VKRX6250604841",
  },
  Escape: {
    videoId: "escape",
    feed: "https://feeds.megaphone.fm/VKRX7138521916",
  },
  Gunsmoke: {
    videoId: "gunsmoke",
    feed: "https://feeds.megaphone.fm/VKRX5135261643",
  },
  "Inner Sanctum": {
    videoId: "inner-sanctum",
    feed: "https://feeds.megaphone.fm/VKRX4551496236",
  },
  "Richard Diamond, Private Detective": {
    videoId: "richard-diamond",
    feed: "https://feeds.megaphone.fm/VKRX8711189538",
  },
  Suspense: {
    videoId: "suspense",
    feed: "https://feeds.megaphone.fm/VKRX1793797555",
  },
  "The Adventures of Philip Marlowe": {
    videoId: "philip-marlowe",
    feed: "https://feeds.megaphone.fm/VKRX7325986260",
  },
  "The Adventures of Wild Bill Hickok": {
    videoId: "wild-bill-hickok",
    feed: "https://feeds.megaphone.fm/VKRX2357501255",
  },
  "The Whistler": {
    videoId: "the-whistler",
    feed: "https://feeds.megaphone.fm/VKRX5055337755",
  },
  "Yours Truly, Johnny Dollar": {
    videoId: "johnny-dollar",
    feed: "https://feeds.megaphone.fm/VKRX5983157895",
  },
};

document.addEventListener("DOMContentLoaded", (e) => {
  // Populates the emoji category dropdowns.
  populateSeriesDropdown();
  populateEpisodeDropdown();
});

// This function populates the series dropdown with options.
function populateSeriesDropdown() {
  // console.log('populateSeriesDropdown');
  const seriesDropdown = document.getElementById("seriesDropdown");

  Object.entries(series).forEach(([key, value]) => {
    const isSelected = key === "Suspense";
    const option = new Option(key, key, false, isSelected);
    seriesDropdown.append(option);
  });
}

function populateEpisodeDropdown() {
  // console.log('populateEpisodeDropdown');
  var selectedSeries = document.getElementById("seriesDropdown").value;
  var podcastUrl = series[selectedSeries].feed;
  fetch(podcastUrl)
    .then((response) => response.text())
    .then((data) => {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(data, "text/xml");
      var items = xmlDoc.getElementsByTagName("item");
      var episodeDropdown = document.getElementById("episodeDropdown");
      episodeDropdown.innerHTML = "";
      for (var i = 0; i < items.length; i++) {
        var episodeUrl = items[i]
          .getElementsByTagName("enclosure")[0]
          .getAttribute("url");
        var episodeTitle =
          items[i].getElementsByTagName("title")[0].textContent;
        const option = new Option(episodeTitle, episodeUrl, false, false);
        episodeDropdown.prepend(option);
      }
      episodeDropdown.selectedIndex = 0;
    });
}

// Helper function to add event listeners.
function addEventListenerById(id, event, handler) {
  document.getElementById(id).addEventListener(event, handler);
}

addEventListenerById("seriesDropdown", "change", (e) => {
  populateEpisodeDropdown();
});

addEventListenerById("start", "click", (e) => {
  console.log("start", audioPlayer.src);
  audioPlayer.src = document.getElementById("episodeDropdown").value;
  audioPlayer.play();
  var selectedSeries = document.getElementById("seriesDropdown").value;
  var seriesVideoId = series[selectedSeries].videoId;
  seriesTitleVideo.src = `assets/titles/${seriesVideoId}.mp4`;
  introVideo.play();
  videoPlayerDiv.classList.remove("hidden");
  audioPlayerDiv.classList.remove("hidden");
});

addEventListenerById("introVideo", "play", (e) => {
  setTimeout(function () {
    introVideo.classList.add("fade-out");
    seriesTitleVideo.play();
    introInProgress = false;
  }, 5000);
});

audioPlayer.addEventListener("pause", function () {
    if (introInProgress) {
      introVideo.pause();
    } else {
      seriesTitleVideo.pause();
    }
  });
  
  audioPlayer.addEventListener("play", function () {
    if (introInProgress) {
      introVideo.play();
    } else {
      seriesTitleVideo.play();
    }
  });

document.addEventListener("mousemove", function (event) {
  if (window.innerHeight - event.clientY < 50) {
    audioPlayerDiv.classList.add("visible");
  } else {
    audioPlayerDiv.classList.remove("visible");
  }
});

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    if (audioPlayer.paused) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
    }
    event.preventDefault(); // Prevent the default action (scrolling)
  }
  // if (event.code === 'Escape') {
  //   exitFullscreen();
  //   console.log('exitFullscreen');
  // }
});

// // Helper function to get the selected value from a dropdown.
// function getSelectedValue(id) {
//   return document.getElementById(id).selectedOptions[0].value;
// }


// function exitFullscreen() {
//   if (document.exitFullscreen) {
//     document.exitFullscreen();
//   } else if (document.webkitExitFullscreen) { /* Safari */
//     document.webkitExitFullscreen();
//   } else if (document.msExitFullscreen) { /* IE11 */
//     document.msExitFullscreen();
//   } else if (document.mozCancelFullScreen) { /* Firefox */
//     document.mozCancelFullScreen();
//   }
// }

// ///////////////////////////////////////////
// // SETUP FUNCTIONS - ONLY RUN WHEN THE PAGE IS LOADED/RELOADED
// ///////////////////////////////////////////

// // Helper function to check if the specified type of web storage is available.
// function storageAvailable(type) {
//   let storage;
//   try {
//     // Try to use the storage.
//     storage = window[type];
//     const x = "STORAGE_TEST";
//     // Try to set an item.
//     storage.setItem(x, x);
//     // Try to remove the item.
//     storage.removeItem(x);
//     // If all the above operations are successful, then the storage is available.
//     return true;
//   } catch (e) {
//     // If any of the operations fail, then the storage might not be available.
//     // The function checks for specific error codes and names that indicate quota exceeded errors.
//     // It also checks if there's already something in the storage.
//     return (
//       e instanceof DOMException &&
//       (e.code === 22 ||
//         e.code === 1014 ||
//         e.name === "QuotaExceededError" ||
//         e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
//       storage &&
//       storage.length !== 0
//     );
//   }
// }

// // This function checks if local storage is available and retrieves any saved user preferences.
// function checkLocalStorage() {
//   // Checks if local storage is available.
//   if (// This function checks if a specific type of web storage is available.
// function storageAvailable(type) {
//   try {
//     // Define a test string.
//     const x = "__storage_test__";
//     // Try to use the storage.
//     window[type].setItem(x, x);
//     // Try to remove the test item from the storage.
//     window[type].removeItem(x);
//     // If both operations are successful, then the storage is available.
//     return true;
//   } catch (e) {
//     // If any of the operations fail, then the storage might not be available.
//     // The function checks for specific error codes and names that indicate quota exceeded errors.
//     // It also checks if there's already something in the storage.
//     return (
//       e instanceof DOMException &&
//       (e.code === 22 ||
//         e.code === 1014 ||
//         e.name === "QuotaExceededError" ||
//         e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
//       window[type] &&
//       window[type].length !== 0
//     );
//   }
// }("localStorage")) {
//     // Retrieves the user's selected emoji category, skin tone, and card preview time from local storage.
//     selectedEmojiCategory = localStorage.getItem("selectedEmojiCategory");
//     selectedEmojiSkinTone = localStorage.getItem("selectedEmojiSkinTone");
//     selectedCardPreviewTime = localStorage.getItem("selectedCardPreviewTime") || "8000";
//     selectedCardCount = localStorage.getItem("selectedCardCount") || 32;
//   } else {
//     // Logs a message to the console if local storage is not available.
//     console.log("LOCAL STORAGE NOT AVAILABLE");
//   }
// }

// // This function listens for keydown events.
// window.onkeydown = function (k) {
//   // Reset the game if the user presses the space bar, which has a key code of 32.
//   if (k.keyCode === 32) {
//     reset();
//   }
// };

// // This function saves the user's settings to local storage.
// function saveUserSettings() {
//   // Save the selected emoji category, skin tone, and card preview time to local storage.
//   localStorage.setItem("selectedEmojiCategory", selectedEmojiCategory);
//   localStorage.setItem("selectedEmojiSkinTone", selectedEmojiSkinTone);
//   localStorage.setItem("selectedCardPreviewTime", selectedCardPreviewTime);
//   localStorage.setItem("selectedCardCount", selectedCardCount);
// }