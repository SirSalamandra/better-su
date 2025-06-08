import { Messages } from "./utils/enums";
import { ExtractDataFromUrl, GetDate, HOSTS_ALLOWED } from "./utils/common";
import { Database } from "./utils/database";

const browser_api = (typeof browser !== "undefined" && browser) || chrome

browser_api.runtime.onInstalled.addListener(() => {
  console.log("better .su installed with success")
})

browser_api.tabs.onUpdated.addListener(async (tabId: number, changeInfo, tab) => {
  const url = new URL(tab.url);
  const host = url.host;

  if (HOSTS_ALLOWED.includes(host) === false) {
    return;
  }

  if (changeInfo.status != "complete") {
    return;
  }

  const data = ExtractDataFromUrl(url);

  const storage = await Database.instance.get()

  if (data.creator_id != null) {
    const artistIndex = storage.findIndex(x => x.creator_id === data.creator_id);

    if (artistIndex === -1) {
      const content: Content = {
        creator_id: data.creator_id,
        content_origin: data.content_origin,
        posts: [],
        site: host
      }

      storage.push(content);
      Database.instance.update(storage);
    }

    if (data.post_id != null) {
      if (!storage[artistIndex].posts.some(x => x.post_id === data.post_id)) {
        const post: Post = {
          post_id: data.post_id,
          visualized_at: GetDate()
        }

        storage[artistIndex].posts.push(post);
        Database.instance.update(storage);
      }
    }
  }

  if (data.post_id == null) {
    sendMessage(tabId, Messages.ViewedTag, data.creator_id)
  }
  else {
    sendMessage(tabId, Messages.AudioElement);
  }
});

const sendMessage = (tabId: number, messageType: Messages, payload: any = {}): void => {
  setTimeout(() => {
    browser_api.tabs.sendMessage(tabId, {
      type: messageType,
      payload: payload
    });
  }, 500);
}