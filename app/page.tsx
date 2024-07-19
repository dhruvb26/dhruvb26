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
          <p className="text-sm text-gray-500">📍 Delhi, India | Phoenix, AZ</p>
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
        {`Visionary full stack developer devoted to engineering cutting-edge products that solve real-world challenges and elevate user experiences. Continuously expanding my technical repertoire, with a focus on AI and Neural Networks. I thrive in collaborative environments and firmly believe in technology's power to drive positive societal change.`}
      </p>
      <p className="mb-4">
        Currently immersed in the fascinating world of LLM agents, exploring
        their network effects at{" "}
        <a
          href="https://ethicalspectacle.com/"
          className="hover:text-rose-300"
          target="_blank"
        >
          Ethical Spectacle.
        </a>{" "}
        Simultaneously honing data analysis skills and gaining invaluable
        insights as an intern at{" "}
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
