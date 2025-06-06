import { AddAudioElementOnPage, AddViewedTagOnPost } from "./utils/common"
import { Database } from "./utils/database";
import { Messages } from "./utils/enums"

const browser_api = (typeof browser !== "undefined" && browser) || chrome

browser_api.runtime.onMessage.addListener(async (message) => {
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

  console.log(artist);
  
  artist.postsIds.forEach((postId) => {
    AddViewedTagOnPost(document, postId);
  });
}

const audioElementHandler = async () => {
  AddAudioElementOnPage(document);
}