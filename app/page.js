import ArticleList from "./UiComponent/ArticleList";
import { getNews, getNewsHeadline } from "./utility/api";
export default async function Home() {
  let articles = [];
  let res = null;
  try {
    res = await getNewsHeadline("in");

    res = await res.json();
    ({ articles } = res);
    articles = articles || [];
    articles = articles.filter(({ title }) => title !== "[Removed]");
  } catch (e) {
    res = null;
    console.log(e);
  }

  articles = articles || [];
  return (
    <main className="w-full h-full ">
      <ArticleList articles={articles} />
    </main>
  );
}
