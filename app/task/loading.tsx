
export default function Loading() {
  return (
    <div className="min-h-screen ">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-115 flex-col bg-white">
        {/* Header */}
        <div className="flex h-22 items-center justify-between bg-black px-5">
          <div className="h-8 w-20 animate-pulse rounded bg-gray-700" />
          <div className="flex h-15 w-15 items-center justify-center rounded-full border-[7px] border-gray-700">
            <div className="h-5 w-7 animate-pulse rounded bg-gray-600" />
          </div>
        </div>

        {/* Task summary */}
        <div className="flex h-14.5 items-center gap-3 px-3">
          <div className="h-9 w-21.25 animate-pulse rounded-full bg-gray-300" />
          <div className="h-6 w-28 animate-pulse rounded bg-gray-200" />
          <div className="ml-auto h-9 w-36.25 animate-pulse rounded-full bg-gray-300" />
        </div>

        <div className="mx-2 border-t border-gray-200" />

        {/* Todo list */}
        <div className="px-2">
          {[1, 2, 3, 4, 5].map((item, index) => (
            <div
              key={item}
              className="flex h-14.25 items-center justify-between border-b border-gray-200 px-4"
            >
              <div
                className={`h-4 animate-pulse rounded bg-gray-200 ${
                  index === 0
                    ? "w-28"
                    : index === 1
                      ? "w-36"
                      : index === 2
                        ? "w-24"
                        : index === 3
                          ? "w-32"
                          : "w-28"
                }`}
              />
              {index < 3 && (
                <div className="h-6 w-6 animate-pulse rounded-full bg-gray-300" />
              )}
            </div>
          ))}
        </div>

        {/* Comment box */}
        <div className="mt-auto p-3 pt-6">
          <div className="h-32.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-md">
            <div className="h-5 w-44 animate-pulse rounded bg-gray-200" />

            <div className="mt-7 flex items-center justify-between">
              <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />

              <div className="flex items-center gap-3">
                <div className="h-6 w-6 animate-pulse rounded-full border-2 border-gray-300" />
                <div className="h-12 w-17 animate-pulse rounded-2xl bg-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
