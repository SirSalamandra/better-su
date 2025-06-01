import { AddAudioElementOnPage, AddViewedTagOnPost } from "../utils/common"
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


  switch (message.type as Messages) {
    case Messages.ViewedTag:
      const { artistId } = message.payload;
      await viewedTagHandler(artistId);
      break;

    case Messages.AudioElement:
      await audioElementHandler();
      break;

    default:
      console.log("message type not supported");
      break;
  }
})

const viewedTagHandler = async (artistId: string) => {
  const storage = await Database.instance.get()
  const artist = storage.find(x => x.artistId === artistId);

  if (artist == null) {
    return
  }

  artist.postsIds.forEach((postId) => {
    AddViewedTagOnPost(document, postId);
  });
}

const audioElementHandler = async () => {
  AddAudioElementOnPage(document);
}