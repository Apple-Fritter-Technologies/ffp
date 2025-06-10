import Image from "next/image";
import Link from "next/link";
import React from "react";

const PodcastsPage = () => {
  return (
    <div className="min-h-screen">
      <div className="rounded-3xl border-2 p-8 flex lg:flex-row flex-col gap-14 lg:mx-24 mx-5  items-center">
        <Image
          src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/14124586/0c3b965a0aed45f4b8583d027e1ad9a2/eyJoIjozNjAsInciOjM2MH0%3D/2.png?token-hash=RB3POm_h98K80Tbwyj6qMVlDqyACDweSz4iYvpQQnnw%3D&token-time=1750723200"
          alt=""
          width={500}
          height={300}
          className="rounded-full w-60 h-60 object-cover"
        />
        <div className="space-y-3 flex flex-col flex-wrap">
          <h1 className="font-bold text-xl">
            The Household Reformation Podcast
          </h1>
          <p className="lg:max-w-3xl max-w-fit">
            Welcome to The Household Reformation Podcast — where we seek to
            shape words and forge culture. I&#39;m Bryan Furlong, and my co-host
            is Pastor Austin Tucker. We&#39;re Reformed Baptists, husbands,
            fathers, and writers dedicated to rebuilding the ruins of
            Christendom, one household, one conversation, one generation at a
            time. This isn’t a podcast for the passive or the performative. It’s
            for those who want to build — men and women who believe the gospel
            isn&#39;t just a message for Sunday, but a call to total war against
            the idols of our age.
          </p>

          <div className="flex lg:flex-row flex-col gap-8 mt-4 text-white">
            <Link href="https://www.youtube.com/@householdreformationpodcast?sub_confirmation=1">
              <button className="lg:w-64 w-52 rounded-2xl p-4 bg-accent-2 font-bold text-lg">
                Subscribe
              </button>
            </Link>

            <Link href="https://www.youtube.com/@householdreformationpodcast">
              <button className="lg:w-64 w-52  rounded-2xl p-4 bg-accent-2 font-bold text-lg">
                Watch on YouTube
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 aspect-video m-20">
        <iframe
          width="90%"
          height="90%"
          src="https://www.youtube.com/embed/_Vu11wKSGII"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="rounded-xl"
        ></iframe>

        <iframe
          width="90%"
          height="90%"
          src="https://www.youtube.com/embed/yABk9HoDF9Y"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="rounded-xl"
        ></iframe>

        <iframe
          width="90%"
          height="90%"
          src="https://www.youtube.com/embed/9aaoYA0tOSU"
          title="Youtube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="rounded-xl"
        ></iframe>

        <iframe
          width="90%"
          height="90%"
          src="https://www.youtube.com/embed/4cHuSr2z3u8"
          title="Youtube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="rounded-xl"
        ></iframe>

        <iframe
          width="90%"
          height="90%"
          src="https://www.youtube.com/embed/ymKXD1330Yg"
          title="Youtube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="rounded-xl"
        ></iframe>

        <iframe
          width="90%"
          height="90%"
          src="https://www.youtube.com/embed/3fD9bWgvPqs"
          title="Youtube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="rounded-xl"
        ></iframe>
      </div>
    </div>
  );
};

export default PodcastsPage;
