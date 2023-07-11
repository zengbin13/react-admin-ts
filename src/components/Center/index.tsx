function Center(props: { children: JSX.Element }) {
  return <div className="flex justify-center items-center flex-1 h-full">{props.children}</div>;
}

export default Center;
