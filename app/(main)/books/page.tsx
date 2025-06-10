import BookCard from "@/components/bookCard";
import React from "react";

const BooksPage = () => {
  const btn = ["Bundles", "All Book", "Add Book", "Other Category"];

  return (
    <div className="min-h-screen flex lg:flex-row flex-col ">
      <div className="flex flex-col gap-4 text-white font-semibold bg-black rounded-3xl h-[80%] w-[15%] p-6 mx-16">
        {btn.map((item, index) => (
          <button
            key={index}
            className="bg-gradient-to-r from-accent-2 to-accent-3 hover:from-accent-3 hover:to-accent-2 rounded-xl w-44 p-3 mx-auto"
          >
            {item}
          </button>
        ))}
      </div>
      <BookCard />
    </div>
  );
};

export default BooksPage;
