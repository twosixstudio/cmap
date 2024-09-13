import Link from "next/link";
import { createProjectAction } from "~/server/api/actions";
import { PageClient } from "./page.client";
import { auth } from "auth";
import { Suspense } from "react";
import { getThing } from "~/server/api/test";

export default async function HomePage() {
  const session = await auth();
  // const session = await auth();
  const data = await getThing();

  return (
    <Suspense fallback="loading...">
      <Link
        href={session ? "/api/auth/signout" : "/api/auth/signin"}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        {session ? "Sign out" : "Sign in"}
      </Link>
      <div>
        {data?.map((x) =>
          x.projects.map((y) => (
            <Link key={y.projectId} href={`/projects/${y.projectId}`}>
              <p>
                {y.project.name} |{/* {y.project.subtitle} */}
              </p>
            </Link>
          )),
        )}
      </div>
      {session && <PageClient />}
    </Suspense>
  );
  // return (
  //   <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
  //     {JSON.stringify(session)}
  //     {/* <div className="text-white">{JSON.stringify(data)}</div> */}
  //     <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
  //       <div className="flex flex-col items-center justify-center gap-4">
  //         <p className="text-center text-2xl text-white">
  //           {session && (
  //             <span>Logged some change in as {session.user?.name}</span>
  //           )}
  //         </p>
  //         <Link
  //           href={session ? "/api/auth/signout" : "/api/auth/signin"}
  //           className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
  //         >
  //           {session ? "Sign out" : "Sign in"}
  //         </Link>
  //         {session && (
  //           <div>
  //             <PageClient />
  //             <form action={createProjectAction}>
  //               <button className="bg-white">Add project</button>
  //             </form>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </main>
  // );
}
