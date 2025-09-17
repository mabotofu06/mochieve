"use client";

type Props = {
  title: string;
  date: string;
};
const NewsCard = (props: Props) => {
  return (
    <div className="w-full mb-4 rounded-3xl h-40 shadow-lg p-4">
      <p className="text-xl mb-2">{props.date}</p>
      <p className="text-xl font-semibold">{props.title}</p>
    </div>
  );
};

export default function Page() {
  return (
    <div className="flex flex-col items-center h-screen overflow-y-auto bg-white custom-scrollbar px-5 py-10">
      <NewsCard date="2025/10/15" title="アルファ版（v0.0.1）をリリースしました！" />
    </div>
  );
}
