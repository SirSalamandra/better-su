import { AddAudioElementOnPage, AddViewedTagOnPost, GetArtistId, GetPostId } from "../utils/common";
import { Database } from "../utils/database";
import { Messages } from "./utils";

const __hostsAllowed = ["kemono.su", "coomer.su"]

chrome.runtime.onInstalled.addListener(() => {
  console.log("Better .su installed with success");
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const url = new URL(tab.url);
  const host = url.host;

  if (__hostsAllowed.includes(host) === false) {
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
  // else {
  //   await chrome.scripting.executeScript({
  //     target: { tabId: tab.id },
  //     func: () => {
  //       setTimeout(() => {
  //         AddAudioElementOnPage(document);
  //       }, 500);
  //     },
  //     args: [storage, artistId],
  //   });
  // }
});
