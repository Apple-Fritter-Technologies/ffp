const Stats = () => {
  const statusData = [
    {
      value: "1000+",
      label: "Monthly visitors and growing",
    },
    {
      value: "4.9/5",
      label: "Stars on Amazon",
    },
    {
      value: "2000+",
      label: "Podcast Downloads",
    },
  ];
  return (
    <section className="py-14 lg:mx-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-28">
          {statusData.map((item, index) => (
            <div key={index}>
              <div className="text-6xl font-light mb-2">{item.value}</div>
              <p className="text-[#888374] font-light text-xl">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Stats;
