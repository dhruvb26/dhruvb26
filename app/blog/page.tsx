import { BlogPosts } from "app/components/posts";

export const metadata = {
  title: "Dhruv Bansal | Blog | AI, Web Dev, Web3",
  description:
    "Explore the blog of Dhruv Bansal, a CS student at ASU. Read about the latest in AI, Web3 & more.",
};

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <BlogPosts />
    </section>
  );
}
