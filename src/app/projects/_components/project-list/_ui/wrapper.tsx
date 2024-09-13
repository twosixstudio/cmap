export function Wrapper(props: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 px-10 py-20">
      {props.children}
    </div>
  );
}
