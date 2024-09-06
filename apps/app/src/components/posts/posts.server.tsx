import { getPostsQuery } from "@v1/supabase/queries";

export async function PostsServer() {
  const posts = await getPostsQuery();

  return (
    <div>
      {posts?.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
