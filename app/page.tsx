import LogsClient from "./components/LogsClient";

const getLogs = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logs`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch logs");
  }

  return response.json();
};

const Home = async () => {
  try {
    const logs = await getLogs();
    return <LogsClient initialLogs={logs} />;
  } catch (error) {
    console.error("Error:", error);
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-600">
          {error instanceof Error
            ? error.message
            : "Failed to load logs. Please try again later."}
        </p>
      </div>
    );
  }
};

export default Home;
