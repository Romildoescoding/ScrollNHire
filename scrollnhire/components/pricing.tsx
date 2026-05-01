export function Pricing() {
  return (
    <section className="bg-black text-white py-32 px-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-semibold">Simple pricing</h2>
        <p className="text-gray-400 mt-2">Free during early access</p>
      </div>

      <div className="flex gap-10 justify-center">
        {/* FREE */}
        <div className="w-[300px] p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
          <h3 className="text-xl font-semibold mb-4">Free</h3>
          <p className="text-gray-400 mb-6">Start hiring, no cost.</p>

          <ul className="space-y-3 text-gray-300">
            <li>✔ Scroll & discover talent</li>
            <li>✔ Basic chat</li>
            <li>✔ Limited saves</li>
          </ul>
        </div>

        {/* PRO */}
        <div className="w-[300px] p-8 rounded-2xl bg-blue-600 text-black">
          <h3 className="text-xl font-semibold mb-4">Pro</h3>
          <p className="mb-6">Scale your hiring.</p>

          <ul className="space-y-3">
            <li>✔ Unlimited chats</li>
            <li>✔ Advanced filters</li>
            <li>✔ Full pipeline</li>
            <li>✔ Analytics</li>
          </ul>

          <div className="mt-6 text-sm font-medium">Coming soon</div>
        </div>
      </div>
    </section>
  );
}
