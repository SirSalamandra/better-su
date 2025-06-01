import { GetArtistId, GetPostId, HOSTS_ALLOWED } from "../utils/common";
import { Database } from "../utils/database";
import { Messages } from "./utils";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Better .su installed with success");
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const url = new URL(tab.url);
  const host = url.host;

  if (HOSTS_ALLOWED.includes(host) === false) {
    return;
  }

  if (changeInfo.status != "complete") {
    return;
  }

  const artistId: string | null = GetArtistId(url);
  const postId: string | null = GetPostId(url);
  const storage = await Database.instance.get()

  if (artistId != null) {
    const artistIndex = storage.findIndex(x => x.artistId === artistId);

    if (artistIndex === -1) {
      const content: Content = {
        artistId: artistId,
        postsIds: [],
        site: host
      }

      storage.push(content);
      Database.instance.update(storage);
    }

    if (postId != null) {
      if (!storage[artistIndex].postsIds.includes(postId)) {
        storage[artistIndex].postsIds.push(postId);
        Database.instance.update(storage);
      }
    }
  }

  if (postId == null) {
    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, {
        type: Messages.ViewedTag,
        payload: { artistId }
      })
    }, 500);

  }
  else {
    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, {
        type: Messages.AudioElement,
      });
    }, 500);
  }
});
