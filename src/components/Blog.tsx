import { useEffect, useState } from "react";

interface BlogPost {
  title: string;
  link: string;
  summary: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch("https://tomatofoodguide.blogspot.com/feeds/posts/default?alt=json")
      .then((res) => res.json())
      .then((data) => {
        const entries = data.feed.entry || [];
        const parsedPosts = entries.map((entry: any) => ({
          title: entry.title.$t,
          link: entry.link.find((l: any) => l.rel === "alternate").href,
          summary: entry.summary?.$t.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 120) + "...",
        }));
        setPosts(parsedPosts);
      })
      .catch((err) => console.error("Failed to load blog feed:", err));
  }, []);

  return (
    <section id="blog" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-10">Latest Blogs</h2>

        <div className="space-y-6 max-w-3xl mx-auto">
          {posts.map((post, index) => (
            <a 
              key={index}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition"
            >
              <h3 className="text-xl font-semibold text-foreground mb-2">{post.title}</h3>
              <p className="text-muted-foreground text-sm">{post.summary}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
