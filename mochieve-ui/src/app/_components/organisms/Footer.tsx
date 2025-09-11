import { title } from "process";

function getMenuItems() {
  const menuItems = [
    {
      name: "Home",
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12l9-9 9 9M4 10v10h16V10" />
        </svg>
      )
    },{
      name: "About",
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 8v4l3 3h-2l-3-3V8h2z" />
        </svg>
      )
    },{
      name: "Contact",
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 10.5a8.38 8.38 0 01-7.5 7.5A8.38 8.38 0 013 10.5V7a4 4 0 014-4h6a4 4 0 014 4v3.5z" />
          <path d="M8 15h8" />
        </svg>
      )
    }
  ];

  return menuItems.map((item, index) => {
    return (
      <a href="#" className="flex items-center text-green-800 hover:underline" key={index}>
        {item.icon}
        {item.name}
      </a>
    );
  });
}

const postAbsData = [
  {id: "1", title: "Post Title 1", img:"https://pbs.twimg.com/media/GMQKeJIaoAAhx9v?format=jpg"},
  {id: "2", title: "Post Title 2", img:"https://pbs.twimg.com/media/GMQKeJIaoAAhx9v?format=jpg"},
  {id: "3", title: "Post Title 3", img:"https://pbs.twimg.com/media/GMQKeJIaoAAhx9v?format=jpg"},
  {id: "4", title: "Post Title 4", img:"https://pbs.twimg.com/media/GMQKeJIaoAAhx9v?format=jpg"},
  {id: "5", title: "Post Title 5", img:"https://pbs.twimg.com/media/GMQKeJIaoAAhx9v?format=jpg"}
]

const tagList = [
  { id: "1", name: "オリジナル" },
  { id: "2", name: "オリジナルマンガ" },
  { id: "3", name: "二次創作" }
];

function PickUpUserCard(props: {id: string, title: string, img: string}) {
  return (
    <div className="pickup-user-item bg-white text-green-800 h-30 overflow-hidden p-2 border-b">
      <div className="w-10 h-10 bg-green-600 rounded-full"></div>
      <div className="px-1">{props.title}</div>
      <div className="px-1">{props.title}</div>
    </div>
  );
}

export default function OrganismsFooter() {
  const iconSize = "w-10 h-10";
  return (
    <footer className="bg-white-300 shadow flex flex-col justify-between w-70 p-3 min-h-[800px]">
      <div className="pickup-menu mt-10">
        <div className="border rounded-xl p-2 h-60">
          <div className="pickup-form relative flex items-center">
            <input type="text" placeholder="Search..." className="search-form border p-2 rounded-4xl w-full" />
            <button className="pickup-button rounded-full bg-green-400 text-white ms-3 absolute right-1">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polygon points="9,8 17,12 9,16 11,12" fill="currentColor" />
              </svg>
            </button>
          </div>
          <div className="pickup-tags flex flex-col m-2">
            <span className="text-lg font-semibold">注目のタグ</span>
            <div className="flex flex-col text-md ms-3">
              {tagList.map((tag) => (
                <span className="tag mb-2" key={tag.id}>{tag.name}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="pickup-wippro mt-3 rounded-xl border border-green-600">
          <p className="p-1 text-lg font-semibold border-b-amber-50">注目のユーザ</p>
          <div className="pickup-wippro-list overflow-hidden overflow-y-scroll h-80 rounded-b-xl">
            {postAbsData.map((post) => (
              <PickUpUserCard key={post.id} {...post} />
            ))}
          </div>
        </div>

      </div>

      <div className="footer-menu bg-white text-xs">
        <div className="text-xs">
          <p>お問い合わせ</p>
          <p>プライバシーポリシー</p>
          <p>利用規約</p>
          <p>ヘルプ</p>
        </div>
        <div className="flex items-center mt-2">
          <p>©Wippy 2025 </p>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start"
            aria-label="GitHub"
          >
          <svg
            className="w-6 h-6 text-gray-700 hover:text-green-700"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.477 2 2 6.484 2 12.012c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .267.18.578.688.48C19.138 20.188 22 16.435 22 12.012 22 6.484 17.523 2 12 2z"/>
          </svg>
        </a>
        </div>
      </div>
    </footer>
  );
}
