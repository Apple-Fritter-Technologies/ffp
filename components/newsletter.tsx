import GridPattern from "./gird-pattern";

const Newsletter = () => {
  return (
    <section className="my-14 py-24 lg:mx-28 bg-foreground rounded-3xl relative">
      {/* Background Pattern */}
      <GridPattern />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-5xl font-bold font-title text-background mb-3">
          Stay in the Literary Loop
        </h3>
        <p className="text-lg text-accent-1 mb-12 font-light">
          Get early access to new releases, author interviews, and exclusive
          content
        </p>
        <div className="max-w-md mx-auto">
          <div className="flex rounded-full bg-accent-2/20 p-2 backdrop-blur-sm border border-accent-2/30">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent px-6 py-3 text-background placeholder-accent-1 focus:outline-none font-light "
            />
            <button className="bg-accent-2 text-white px-8 py-3 rounded-full font-medium hover:bg-accent-3 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
