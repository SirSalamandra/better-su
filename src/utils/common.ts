export const HOSTS_ALLOWED = ["kemono.su", "coomer.su"]

export const AddViewedTagOnPost = (document: Document, postId: string) => {
  const postCardElement = document.querySelector(`[data-id="${postId}"]`) as HTMLElement;
  
  if (postCardElement == null) {
    return;
  }

  const cardFooterContent = postCardElement.querySelector('footer > div > div');

  const viewedLabel = document.createElement("label")
  viewedLabel.innerHTML = "viewed";
  viewedLabel.style.color = "#b4ffb4"

  cardFooterContent.append(viewedLabel);
}

export const AddAudioElementOnPage = (document: Document) => {
  const postAttachmentsElement = document.getElementsByClassName('post__attachments')[0] as HTMLElement;

  if (postAttachmentsElement != null) {
    const mp3Links = document.querySelectorAll<HTMLAnchorElement>('li > a[href*=".mp3"');

    mp3Links.forEach((mp3Link) => {
      const parentElement = mp3Link.parentElement;
      parentElement.style.display = "flex";
      parentElement.style.flexDirection = "column";

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

export const GetArtistId = (url: URL): string | null => {
  const parametersPathname = url.pathname.split("/");

  // search for the artist, if it exists in the URL, get the artist ID
  if (url.href.includes("/user/") === true) {
    return parametersPathname[parametersPathname.indexOf("user") + 1];
  }

  return null;
}

export const GetPostId = (url: URL): string | null => {
  const parametersPathname = url.pathname.split("/");

  // search's for the post, if it exists in the URL, get the post ID
  if (url.href.includes("/post/") === true) {
    return parametersPathname[parametersPathname.indexOf("post") + 1];
  }

  return null;
}
