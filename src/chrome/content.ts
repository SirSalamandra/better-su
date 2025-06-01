import { AddViewedTagOnPost } from "../utils/common"
import { Database } from "../utils/database";
import { Messages } from "./utils"

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === Messages.ViewedTag) {
    const { artistId } = message.payload;
    const storage = await Database.instance.get()
    const artist = storage.find(x => x.artistId === artistId);

    if (artist == null) {
      return
    }

    artist.postsIds.forEach((postId) => {
      AddViewedTagOnPost(document, postId);
    });
  }
})