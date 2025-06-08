type StorageData = Content[]

type Content = {
  site: string,
  content_origin: string,
  creator?: string,
  creator_id: string,
  posts: Post[]
}

type Post = {
  post_id: string,
  post_name?: string,
  visualized_at: string
}

type URLData = {
  host: string,
  content_origin: string,
  creator_id: string,
  post_id: string
}