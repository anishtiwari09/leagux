"use client";
import React, { useEffect, useRef, useState } from "react";
import NewsArticle from "./NewsArticle";
import { MESSAGE_TYPE } from "../utility/Constant";

export default function ArticleList({ articles }) {
  const [allArticles, setAllArticles] = useState(articles || []);
  const [isOffline, setIsOffline] = useState(false);
  const [cachingData, setCachingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const handleMarksForOfllineReading = (i, imageRef) => {
    console.log(imageRef);
    let article = allArticles[i];
    article.localImage = imageRef?.current.src;
    article.localImageUrl = imageRef?.current?.src;
    navigator.serviceWorker.controller.postMessage({
      type: MESSAGE_TYPE.addToOffline,
      data: JSON.stringify(article),
      id: article.title,
      imageUrl: imageRef?.current?.src || "",
    });
    article.isOffline = true;
    setAllArticles([...allArticles]);
  };
  const getCachedData = async () => {
    let jsonKeys = [];
    try {
      const cache = await caches.open("offlinePost");
      const requests = await cache.keys();

      for (const request of requests) {
        console.log(request.url);
        const response = await caches.match(request.url);
        console.log(response);

        if (response && response.headers) {
          let key = request.url.substring(request.url.lastIndexOf("/") + 1);
          jsonKeys.push(window.decodeURI(key));
        }
      }

      for (let article of allArticles) {
        let originalTitle = article.title;
        originalTitle = originalTitle?.replaceAll(":", "_");
        if (jsonKeys.includes(originalTitle)) {
          article.isOffline = true;
        } else article.isOffline = false;
      }
      setAllArticles([...allArticles]);
    } catch (error) {
      console.error("Error retrieving JSON keys:", error);
    }
    return jsonKeys;
  };
  useEffect(() => {
    getCachedData();
  }, []);

  const handleGettingCachingData = async () => {
    let allResponses = [];
    setLoading(true);
    try {
      const cache = await window.caches.open("offlinePost");
      const requests = await cache.keys();
      for (const request of requests) {
        let response = await caches.match(request.url);
        console.log(response);

        if (response) {
          response = await response.text();
          allResponses.push(JSON.parse(response));
        }
      }
    } catch (e) {
      console.log(e);
    }
    setCachingData([...allResponses]);
    setLoading(false);
  };
  useEffect(() => {
    setIsOffline(!window.navigator.onLine);
    if (!window.navigator.onLine) {
      handleGettingCachingData();
    }
    window.addEventListener("online", () => {
      setIsOffline(false);
    });
    window.addEventListener("offline", () => {
      window.location.reload();
    });
    return () => {
      window.removeEventListener("offline", () => {});
      window.removeEventListener("online", () => {});
    };
  }, []);
  console.log(cachingData);
  return (
    <div>
      {isOffline ? (
        <>
          {showModal && (
            <div className="fixed top-0 w-full h-full">
              <div className="bg-black opacity-50 top-0 absolute w-full h-full"></div>
              <div className="w-[400px] bg-white min-h-[200px] top-0 z-10 relative rounded-md m-auto p-4 text-center">
                <h3 className="mt-2">
                  You are offline but still you can read you favorite article by
                  clicking ok button
                </h3>
                {!loading && (
                  <button
                    className="rounded-md bg-blue-500 p-2 text-center m-auto block text-white"
                    onClick={() => setShowModal(false)}
                  >
                    Ok
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-8 items-center">
            {cachingData?.map((article, i) => (
              <NewsArticle
                article={article}
                key={i}
                onClick={handleMarksForOfllineReading}
                index={i}
                isOffline={isOffline}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-8 items-center">
          {allArticles?.map((article, i) => (
            <NewsArticle
              article={article}
              key={i}
              onClick={handleMarksForOfllineReading}
              index={i}
              isOffline={isOffline}
            />
          ))}
        </div>
      )}
    </div>
  );
}
