const Newsletter = () => {
  return (
    <section className="py-24 bg-[#1f2017]/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-4xl font-light text-[#cbbfbd] mb-4">
          Stay in the Literary Loop
        </h3>
        <p className="text-xl text-[#888374] mb-12 font-light">
          Get early access to new releases, author interviews, and exclusive
          content
        </p>
        <div className="max-w-md mx-auto">
          <div className="flex rounded-full bg-[#7d7765]/20 p-2 backdrop-blur-sm border border-[#888374]/30">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent px-6 py-3 text-[#dedede] placeholder-[#888374] focus:outline-none font-light"
            />
            <button className="bg-[#cbbfbd] text-[#1f2017] px-8 py-3 rounded-full font-medium hover:bg-[#dedede] transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
