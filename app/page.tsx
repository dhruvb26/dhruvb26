import { BlogPosts } from "app/components/posts";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function Page() {
  return (
    <section className="">
      <div className="flex items-center mb-8 justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-left tracking-tighter mr-4">
            Dhruv Bansal
          </h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "medium",
            })}{" "}
          </p>
        </div>
        <Image
          src="/me.png"
          width={150}
          height={150}
          alt="Dhruv"
          className=""
        />
      </div>
      <p className="mb-4">
        {`Passionate full stack developer dedicated to crafting innovative products that address real challenges and enhance user experiences. Constantly expanding my skill set & reading about AI and Neural Networks. I thrive on collaborative projects and believe in the power of technology to drive positive change.`}
      </p>
      <p className="mb-4">
        Currently, I'm delving into the fascinating world of LLM agents and
        exploring their network effects at{" "}
        <a
          href="https://ethicalspectacle.com/"
          className="hover:text-rose-300"
          target="_blank"
        >
          Ethical Spectacle.
        </a>{" "}
        Simultaneously, I'm honing my data analysis skills and gaining
        invaluable insights as an intern at{" "}
        <a
          href="https://privateblok.ai/home"
          className="hover:bg-gradient-to-r bg-white from-blue-700 to-emerald-500 bg-clip-text inline-block text-transparent "
          target="_blank"
        >
          PrivateBlok.
        </a>
        <br />
        <br />
        Check out my resume{" "}
        <a
          href="https://drive.google.com/file/d/16Sf70NRVo0ibVGAAj0ryje92E5kn5k_u/view?usp=drive_link"
          className="underline hover:text-blue-400 "
          target="_blank"
        >
          here
          <ArrowUpRight size={16} className="inline" />
        </a>
        <br />
        <br />
        Building{" "}
        <a
          href="https://cssgasu.club"
          className="underline hover:text-emerald-400 "
          target="_blank"
        >
          CSSG at ASU
          <ArrowUpRight size={16} className="inline" />
        </a>
      </p>

      {/* <div className="my-8">
        <BlogPosts />
      </div> */}
    </section>
  );
}
