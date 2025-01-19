const __localStorageName = "artists";
const __hostsAllowed = ["kemono.su", "coomer.su"]

chrome.runtime.onInstalled.addListener(async () => {
  console.log("Visited URLs Tracker installed");
  // chrome.storage.local.clear();
  await initiateLocalStorage();
});

const initiateLocalStorage = async () => {
  let data = await getLocalStorage();

  if (data == null) {
    const initialData = [];
    await updateLocalStorage(initialData);
    data = await getLocalStorage();
  }
}

const getLocalStorage = async (): Promise<Artist[] | null> => {
  const result = await chrome.storage.local.get(__localStorageName);

  if (__localStorageName in result) {
    return result[__localStorageName];
  }

  return null;
}

const updateLocalStorage = async (data: Artist[]) => {
  await chrome.storage.local.set({ [__localStorageName]: data });
}

const getArtistId = (url: URL): number | null => {
  const parametersPathname = url.pathname.split("/");

  // search for the artist, if it exists in the URL, get the artist ID
  if (url.href.includes("/user/") === true) {
    return parseInt(parametersPathname[parametersPathname.indexOf("user") + 1]);
  }

  return null;
}

const getPostId = (url: URL): number | null => {
  const parametersPathname = url.pathname.split("/");

  // search's for the post, if it exists in the URL, get the post ID
  if (url.href.includes("/post/") === true) {
    return parseInt(parametersPathname[parametersPathname.indexOf("post") + 1]);
  }

  return null;
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const url = new URL(tab.url);

  const host = url.host;
  if (__hostsAllowed.includes(host) === false) return;

  if (changeInfo.status === "complete") {
    console.log("update completed")

    const artistId: number | null = getArtistId(url);
    const postId: number | null = getPostId(url);

    const artists = await getLocalStorage();

    if (artistId != null) {
      const artistIndex = artists.findIndex(x => x.artistId === artistId);

      if (artistIndex === -1) {
        const artist: Artist = {
          artistId: artistId,
          postsIds: [],
          site: host
        }

        artists.push(artist);
        await updateLocalStorage(artists);
      }

      if (postId != null) {
        if (artists[artistIndex].postsIds.includes(postId) == false) {
          artists[artistIndex].postsIds.push(postId);
          await updateLocalStorage(artists);
        }
      }
    }

    if (postId == null) {
      console.log("editando o dom")

      function injectedFunction(artists, artistId) {
        setTimeout(() => {
          const artist = artists.find((x) => x.artistId === artistId);

          if (artist != null) {
            artist.postsIds.forEach((postId) => {
              // console.log(`[data-id="${postId}"]`);

              const postElement = document.querySelector(`[data-id="${postId}"]`);
              // console.log("postElement", postElement);

              if (postElement) {
                const footerElement = postElement.getElementsByClassName("post-card__footer");
                // console.log("footerElement", footerElement);

                if (footerElement.length > 0) {
                  const visualizedNotation = document.createElement("div");
                  visualizedNotation.innerText = "visualized";
                  footerElement.item(0).append(visualizedNotation);
                }
              }
            });
          }
        }, 500);
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injectedFunction,
        args: [artists, artistId],
      });
    }
  }
});
