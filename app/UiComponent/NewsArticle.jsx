import Image from "next/image";
import { useRef } from "react";
import { MESSAGE_TYPE } from "../utility/Constant";
export default function NewsArticle({ article, index, onClick, isOffline }) {
  const imageRef = useRef();

  return (
    <div className="flex flex-col gap-1 max-w-[500px] border border-gray-200 p-2 rounded w-full">
      <div>
        <h3>Source: {article?.source?.name}</h3>
      </div>
      <div>
        {article?.urlToImage ? (
          isOffline ? (
            <img src={article.localImage} alt={article?.title} />
          ) : (
            <Image
              ref={imageRef}
              src={article?.urlToImage}
              width={500}
              height={200}
              alt={article?.title}
              loading="lazy"
            />
          )
        ) : (
          ""
        )}
      </div>
      <h1 className="text-[32px] font-bold">{article?.title}</h1>
      <p className="p-1 text-[12px] font-bold">{article?.publishedAt}</p>
      <div>
        <p className="text-[18px]">{article?.content}</p>
      </div>
      {isOffline ? (
        ""
      ) : article?.isOffline === undefined ? (
        <button
          className="border border-spacing-1 w-fit p-2 invisible rounded-md bg-blue-500 text-white ml-auto"
          // onClick={() => onClick(index)}
        >
          Remove from offline Reading
        </button>
      ) : article?.isOffline ? (
        <button
          className="border border-spacing-1 w-fit p-2 rounded-md bg-blue-500 text-white ml-auto"
          onClick={() =>
            onClick(index, imageRef, MESSAGE_TYPE.removeFromOffline)
          }
        >
          Remove from offline Reading
        </button>
      ) : (
        <button
          className="border border-spacing-1 w-fit p-2 rounded-md bg-blue-500 text-white ml-auto"
          onClick={() => onClick(index, imageRef)}
        >
          Marks for offline Reading
        </button>
      )}
    </div>
  );
}
