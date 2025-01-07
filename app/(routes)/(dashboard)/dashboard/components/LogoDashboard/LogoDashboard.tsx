import Image from "next/image";
import Link from "next/link";

export function LogoDashboard() {
  return (
    <Link
      href="/"
      className="flex items-center h-20 gap-2 border-b cursor-pointer min-h-20 px-6"
    >
      {/* <Image src="/logo.svg" alt="Logo" height={30} width={30} priority /> */}
      <Image
        src="/yevimaquinas.svg"
        alt="Logo"
        height={100}
        width={100}
        priority
      />
      <h1 className="text-xl font-bold">Fleet Care</h1>
    </Link>
  );
}
