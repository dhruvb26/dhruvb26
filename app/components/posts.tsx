import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";
import { PenIcon } from "lucide-react";
import { ConstructionIcon } from "lucide-react";

export function BlogPosts() {
  let allBlogs = getBlogPosts();

  if (allBlogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
        <ConstructionIcon className="text-yellow-500" size={48} />
        <h2 className="text-2xl text-neutral-800 dark:text-neutral-200">
          still building this page
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
          I'm busy writing some amazing blogs. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
}
