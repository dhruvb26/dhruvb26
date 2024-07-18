import { BlogPosts } from "app/components/posts";
import Image from "next/image";

export default function Resume() {
  return (
    <section className="max-w-3xl mx-auto ">
      <section className="mb-6 space-y-2">
        <span className="font-bold text-xl">Education</span>
        <br />
        <div className="flex flex-row">
          <div className="mr-4">
            <Image
              src="/asu.png"
              width={200}
              height={200}
              alt="Dhruv"
              className="rounded-full"
            />
          </div>
          <div>
            <span className="text-lg font-semibold">
              {" "}
              Arizona State University, Tempe, AZ{" "}
            </span>
            <br />
            <span className="text-neutral-400"> GPA:</span> 4.0/4.0
            <br />
            <span className="text-neutral-400">Coursework: </span>{" "}
            Object-Oriented Programming, Digital Design, Computer Organization &
            Assembly, Calculus, Discrete Math, Probability & Stats, Data
            Structures & Algorithms, Deep Learning{" "}
          </div>
        </div>
      </section>
      <section className="mb-6 space-y-4">
        <span className="font-bold text-xl">Experience</span>

        <br />
        <div className="flex flex-row">
          <div className="mr-4">
            <Image
              src="/privateblok.png"
              width={200}
              height={200}
              alt="Dhruv"
              className="rounded-full"
            />
          </div>
          <div>
            <span className="text-lg font-semibold"> SWE Intern </span>
            <br />
            <a href="https://privateblok.ai/home" target="_blank">
              <span className="text-neutral-400 italic hover:underline">
                {" "}
                PrivateBlok | June 2024 - Present
              </span>
            </a>
            <br />
            <span className="text-neutral-400">Coursework: </span>{" "}
            Object-Oriented Programming, Digital Design, Computer Organization &
            Assembly, Calculus, Discrete Math, Probability & Stats, Data
            Structures & Algorithms, Deep Learning{" "}
          </div>
        </div>
        <div className="flex flex-row">
          <div className="mr-4">
            <Image
              src="/ethical-spectacle.png"
              width={200}
              height={200}
              alt="Dhruv"
              className="rounded-full px-2"
            />
          </div>
          <div>
            <span className="text-lg font-semibold"> Researcher </span>
            <br />
            <a href="https://ethicalspectacle.com/" target="_blank">
              <span className="text-neutral-400 italic hover:underline">
                {" "}
                Ethical Spectale Research | May 2024 - Present
              </span>
            </a>
            <br />
            <span className="text-neutral-400">Coursework: </span>{" "}
            Object-Oriented Programming, Digital Design, Computer Organization &
            Assembly, Calculus, Discrete Math, Probability & Stats, Data
            Structures & Algorithms, Deep Learning{" "}
          </div>
        </div>
        <div className="flex flex-row">
          <div className="mr-4">
            <Image
              src="/asu-white.png"
              width={200}
              height={200}
              alt="Dhruv"
              className="rounded-full"
            />
          </div>
          <div>
            <span className="text-lg font-semibold">
              {" "}
              Engineering Tutor & UGTA{" "}
            </span>
            <br />
            <a href="https://engineering.asu.edu/" target="_blank">
              <span className="text-neutral-400 italic hover:underline">
                Ira A. Fulton Schools of Engineering | Aug 2023 - Present
              </span>
            </a>
            <br />
            <span className="text-neutral-400">Coursework: </span>{" "}
            Object-Oriented Programming, Digital Design, Computer Organization &
            Assembly, Calculus, Discrete Math, Probability & Stats, Data
            Structures & Algorithms, Deep Learning{" "}
          </div>
        </div>
      </section>
      <section className="mb-6 space-y-4">
        <span className="font-bold text-xl">Experience</span>
        <br />
        <div className="flex flex-row">
          <div className="mr-4">
            <Image
              src="/privateblok.png"
              width={200}
              height={200}
              alt="Dhruv"
              className="rounded-full"
            />
          </div>
          <div>
            <span className="text-lg font-semibold"> SWE Intern </span>
            <br />
            <a href="https://privateblok.ai/home" target="_blank">
              <span className="text-neutral-400 italic hover:underline">
                {" "}
                PrivateBlok | June 2024 - Present
              </span>
            </a>
            <br />
            <span className="text-neutral-400">Coursework: </span>{" "}
            Object-Oriented Programming, Digital Design, Computer Organization &
            Assembly, Calculus, Discrete Math, Probability & Stats, Data
            Structures & Algorithms, Deep Learning{" "}
          </div>
        </div>
        <div className="flex flex-row">
          <div className="mr-4">
            <Image
              src="/ethical-spectacle.png"
              width={200}
              height={200}
              alt="Dhruv"
              className="rounded-full px-2"
            />
          </div>
          <div>
            <span className="text-lg font-semibold"> Researcher </span>
            <br />
            <a href="https://ethicalspectacle.com/" target="_blank">
              <span className="text-neutral-400 italic hover:underline">
                {" "}
                Ethical Spectale Research | May 2024 - Present
              </span>
            </a>
            <br />
            <span className="text-neutral-400">Coursework: </span>{" "}
            Object-Oriented Programming, Digital Design, Computer Organization &
            Assembly, Calculus, Discrete Math, Probability & Stats, Data
            Structures & Algorithms, Deep Learning{" "}
          </div>
        </div>
        <div className="flex flex-row">
          <div className="mr-4">
            <Image
              src="/asu-white.png"
              width={200}
              height={200}
              alt="Dhruv"
              className="rounded-full"
            />
          </div>
          <div>
            <span className="text-lg font-semibold">
              {" "}
              Engineering Tutor & UGTA{" "}
            </span>
            <br />
            <a href="https://engineering.asu.edu/" target="_blank">
              <span className="text-neutral-400 italic hover:underline">
                Ira A. Fulton Schools of Engineering | Aug 2023 - Present
              </span>
            </a>
            <br />
            <span className="text-neutral-400">Coursework: </span>{" "}
            Object-Oriented Programming, Digital Design, Computer Organization &
            Assembly, Calculus, Discrete Math, Probability & Stats, Data
            Structures & Algorithms, Deep Learning{" "}
          </div>
        </div>
      </section>
    </section>
  );
}
