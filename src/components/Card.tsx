export default function Card() {
  return (
    <div className="w-full max-w-2xl overflow-hidden bg-white border-2 rounded-lg border-sky-200/50">
      <img src="/rings.jpg" alt="" className="h-[200px] w-full object-cover" />
      <div className="p-8">
        <h1 className="flex flex-col text-4xl text-center lg:text-5xl font-baskerville drop-shadow-sm">
          <span className="text-transparent uppercase bg-gold-gradient bg-clip-text">
            Sheldon
          </span>
          <span className="text-[0.6em] font-thin relative lg:bottom-0.5 font-greatvibes  bg-gold-gradient text-transparent bg-clip-text max-lg:-my-1">
            -and-
          </span>
          <span className="text-transparent uppercase bg-gold-gradient bg-clip-text">
            Ishitta
          </span>
        </h1>
        <div className="flex flex-col pt-4 mt-4 border-t">
          <div className="flex flex-col text-center">
            <span className="font-bold">Date</span>
            <span>11 January 2025</span>
          </div>

          <div className="grid gap-8 pt-4 mt-4 text-center border-t lg:grid-cols-2 max-lg:divide-y lg:divide-x">
            <div className="flex flex-col">
              <h2 className="text-xl text-transparent uppercase lg:text-2xl font-baskerville bg-gold-gradient bg-clip-text drop-shadow-md">
                Nuptials
              </h2>

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
              <h2 className="text-xl text-transparent uppercase lg:text-2xl font-baskerville bg-gold-gradient bg-clip-text drop-shadow-md">
                Reception
              </h2>
              <div>
                <p className="mt-2 font-bold">Time</p>
                <p>7PM onwards</p>
              </div>

              <div>
                <p className="mt-2 font-bold">Location</p>
                <p>Hotel Shree Panchratna, Sangamvadi, Pune</p>
                <a
                  href="https://maps.app.goo.gl/LfYuuL65qCzh7mTt5"
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
