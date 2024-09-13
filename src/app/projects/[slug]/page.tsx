export default function Page(props: { params: { slug: string } }) {
  return <div>Project {props.params.slug}</div>;
}
