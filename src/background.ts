const __localStorageName = "artists";
const __hostsAllowed = ["kemono.su", "coomer.su"]

chrome.runtime.onInstalled.addListener(async () => {
  console.log("Visited URLs Tracker installed");
  // chrome.storage.local.clear();
  await initiateLocalStorage();
});

// chrome.contextMenus.create({
//   id: "test",
//   type: "normal",
//   title: "This is a test",
//   // onclick: () => console.log("This is a test")
// })

// chrome.contextMenus.onClicked.addListener(() => console.log("this is a test"))

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

const getPostId = (url: URL): string | null => {
  const parametersPathname = url.pathname.split("/");

  // search's for the post, if it exists in the URL, get the post ID
  if (url.href.includes("/post/") === true) {
    return parametersPathname[parametersPathname.indexOf("post") + 1];
  }

  return null;
}

const addViewedTagOnPost = (postId: string) => {
  const postCardElement = document.querySelector(`[data-id="${postId}"]`) as HTMLElement;

  if (postCardElement != null) {
    const cardFooterContent = postCardElement.querySelector('footer > div > div');

    const viewedLabel = document.createElement("label")
    viewedLabel.innerHTML = "viewed";
    viewedLabel.style.color = "#b4ffb4"

    cardFooterContent.append(viewedLabel);
  }
}

const addAudioToPost = () => {
  const postAttachmentsElement = document.getElementsByClassName('post__attachments')[0] as HTMLElement;

  if (postAttachmentsElement != null) {
    const mp3Links = document.querySelectorAll<HTMLAnchorElement>('li > a[href*=".mp3"');

    mp3Links.forEach((mp3Link) => {
      const parentElement = mp3Link.parentElement;

      const audioElement = document.createElement("audio")
      audioElement.controls = true;

      const sourceElement = document.createElement("source")
      sourceElement.src = mp3Link.href;
      sourceElement.type = "audio/ogg";

      audioElement.append(sourceElement);
      parentElement.append(audioElement);
    })
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const url = new URL(tab.url);
  const host = url.host;

  if (__hostsAllowed.includes(host) === false) return;

  if (changeInfo.status === "complete") {
    const artistId: number | null = getArtistId(url);
    const postId: string | null = getPostId(url);

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
      function injectedFunction(artists, artistId) {

        setTimeout(() => {
          const artist = artists.find((x) => x.artistId === artistId);

          if (artist != null) {
            artist.postsIds.forEach((postId) => addViewedTagOnPost(postId));
          }
        }, 500);
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injectedFunction,
        args: [artists, artistId],
      });
    }
    else {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          setTimeout(() => {
            addAudioToPost();
          }, 500);
        },
        args: [artists, artistId],
      });

    }
  }
});
