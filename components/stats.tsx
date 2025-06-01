const Stats = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-[#7d7765]/10 to-[#888374]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-4xl font-light text-[#cbbfbd] mb-2">1000+</div>
            <p className="text-[#888374] font-light">Curated Titles</p>
          </div>
          <div>
            <div className="text-4xl font-light text-[#cbbfbd] mb-2">50k+</div>
            <p className="text-[#888374] font-light">Happy Readers</p>
          </div>
          <div>
            <div className="text-4xl font-light text-[#cbbfbd] mb-2">200+</div>
            <p className="text-[#888374] font-light">Independent Authors</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
