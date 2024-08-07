import {
  ArrowUpRightFromSquareIcon,
  Github,
  Linkedin,
  MailIcon,
  Text,
} from "lucide-react";

export function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mb-16">
      <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-6 md:space-y-0 dark:text-neutral-300">
        <li>
          <a
            className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
            rel="noopener noreferrer"
            target="_blank"
            href="mailto:dk.bansal0026@gmail.com"
          >
            {/* <MailIcon size={18} /> */}

            <p className="ml-2 h-7">email</p>
          </a>
        </li>
        <li>
          <a
            className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
            rel="noopener noreferrer"
            target="_blank"
            href="https://x.com/_dhruvb_"
          >
            {/* <MailIcon size={18} /> */}

            <p className="ml-2 h-7">X</p>
          </a>
        </li>
        <li>
          <a
            className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.linkedin.com/in/dhruvb26/"
          >
            {/* <ArrowUpRightFromSquareIcon size={18} /> */}

            <p className="ml-2 h-7">linkedin</p>
          </a>
        </li>
        <li>
          <a
            className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/dhruvb26"
          >
            {/* <Github size={16} /> */}
            <p className="ml-1 h-7">github</p>
          </a>
        </li>
        <li>
          <a
            className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
            rel="noopener noreferrer"
            target="_blank"
            href="https://drive.google.com/file/d/16Sf70NRVo0ibVGAAj0ryje92E5kn5k_u/view?usp=drive_link"
          >
            {/* <Text size={16} /> */}
            <p className="ml-2 h-7">resume</p>
          </a>
        </li>
      </ul>
    </footer>
  );
}
