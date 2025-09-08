import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState(30);
  const [shortcode, setShortcode] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [expiry, setExpiry] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setShortUrl("");
      const payload = { url, validity: Number(validity), shortcode: shortcode || undefined };
      const res = await axios.post("http://localhost:8000/api/shorturls", payload);
      setShortUrl(res.data.shortUrl);
      setExpiry(res.data.expiry);
      setStats(null);
    } catch (err) {
      setError(err.response?.data?.error || "Request failed");
    }
  };

  const fetchStats = async () => {
    try {
      if (!shortUrl) return;
      const code = shortUrl.split("/").pop();
      const res = await axios.get(`http://localhost:8000/api/shorturls/${code}/stats`);
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load stats");
    }
  };

  return (
  <div className="p-10 bg-gray-200 min-h-screen flex justify-center items-center">
    <div className="w-full max-w-xl">
      <h1 className="text-2xl font-bold text-center">URL Shortener</h1>
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-3 bg-white p-6 shadow-xl rounded-xl"
      >
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter long URL"
          className="border p-2 outline-none rounded-xl"
        />
        <div className="flex gap-3">
          <input
            type="number"
            min="1"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            placeholder="Validity (minutes)"
            className="border p-2 w-40 rounded-xl"
          />
          <input
            type="text"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            placeholder="Custom shortcode (optional)"
            className="border p-2 flex-1 rounded-xl"
          />
        </div>
        <button className="bg-blue-500 rounded-xl text-white p-2 w-32">
          Shorten
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {shortUrl && (
        <div className="mt-4 flex flex-col items-start gap-3">
          <div className="flex items-center gap-3">
            <a
              href={shortUrl}
              className="text-blue-600"
              target="_blank"
              rel="noreferrer"
            >
              {shortUrl}
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              className="text-sm border px-2 py-1 rounded"
            >
              Copy
            </button>
            {expiry && (
              <span className="text-sm text-gray-600">
                expires: {new Date(expiry).toLocaleString()}
              </span>
            )}
            <button
              onClick={fetchStats}
              className="text-sm border px-2 py-1 rounded"
            >
              View stats
            </button>
          </div>

          {stats && (
            <div className="mt-3 text-sm text-gray-700">
              <div>Clicks: {stats.clicks}</div>
              <div>Created: {new Date(stats.createdAt).toLocaleString()}</div>
              <div>Expiry: {new Date(stats.expireAt).toLocaleString()}</div>
              <div>
                Original:{" "}
                <a
                  className="text-blue-600"
                  href={stats.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {stats.originalUrl}
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

}

export default App;
