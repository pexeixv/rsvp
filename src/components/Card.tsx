export default function Card() {
  return (
    <div className="w-full max-w-2xl overflow-hidden bg-white border-2 rounded-lg border-sky-200/50">
      <img src="/rings.jpg" alt="" className="h-[200px] w-full object-cover" />
      <div className="p-8">
        <h1 className="flex flex-col text-6xl font-black text-center lg:text-7xl font-greatvibes">
          Sheldon{" "}
          <span className="text-[0.6em] font-thin relative bottom-2">
            -weds-
          </span>{" "}
          Ishitta
        </h1>
        <div className="flex flex-col pt-4 mt-4 border-t">
          <div className="flex flex-col text-center">
            <span className="font-bold">Date</span>
            <span>11 January 2025</span>
          </div>

          <div className="grid gap-8 pt-4 mt-4 text-center border-t lg:grid-cols-2 max-lg:divide-y lg:divide-x">
            <div className="flex flex-col">
              <h2 className="text-4xl font-bold font-greatvibes">Ceremony</h2>

              <div>
                <p className="mt-2 font-bold">Time</p>
                <p>4PM</p>
              </div>

              <div>
                <p className="mt-2 font-bold">Location</p>
                <p>St. Anne's Church, Pulgate, Pune Camp</p>
                <a
                  href="https://maps.app.goo.gl/sSVGKCGdLVVb9QAa9"
                  target="_blank"
                  className="text-xs underline"
                >
                  View on Google Maps
                </a>
              </div>
            </div>

            <div className="flex flex-col max-lg:border-t max-lg:pt-4">
              <h2 className="text-4xl font-bold font-greatvibes">Reception</h2>
              <div>
                <p className="mt-2 font-bold">Time</p>
                <p>7PM onwards</p>
              </div>

              <div>
                <p className="mt-2 font-bold">Location</p>
                <p>RSI Club, Pune Camp</p>
                <a
                  href="https://maps.app.goo.gl/gSz4orXGt1LVisuH6"
                  target="_blank"
                  className="text-xs underline"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
