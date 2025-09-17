type Props = {
  children: React.ReactNode;
  onclick?: () => Promise<void>;
}

export const MoleculesTimeline = (props: Props) => {
  return (
    <div className="timeline flex flex-col items-center">
      {props.children}
      <button onClick={props.onclick} className="my-4 text-white p-3 rounded-3xl bg-green-500 text-xl hover:opacity-50">
        もっと見る
      </button>
    </div>
  );
};
