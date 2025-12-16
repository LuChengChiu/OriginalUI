import { useState, useEffect } from "react";
import Switch from "./components/ui/switch";

function App() {
  const [isActive, setIsActive] = useState(false);
  const [currentDomain, setCurrentDomain] = useState("");
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [domainStats, setDomainStats] = useState({});

  useEffect(() => {
    const initializeExtension = async () => {
      try {
        // Load extension state from storage
        chrome.storage.local.get(["isActive", "domainStats"], (result) => {
          setIsActive(result.isActive || false);
          setDomainStats(result.domainStats || {});
        });

        // Get current domain with timeout
        const domainResponse = await new Promise((resolve) => {
          const timeout = setTimeout(() => resolve(null), 1000); // 3 second timeout

          chrome.runtime.sendMessage(
            { action: "getCurrentDomain" },
            (response) => {
              clearTimeout(timeout);
              if (chrome.runtime.lastError) {
                console.error(
                  "Error getting current domain:",
                  chrome.runtime.lastError
                );
                resolve(null);
              } else {
                resolve(response);
              }
            }
          );
        });

        if (domainResponse && domainResponse.domain) {
          setCurrentDomain(domainResponse.domain);

          // Check if domain is whitelisted with timeout
          const whitelistResponse = await new Promise((resolve) => {
            const timeout = setTimeout(
              () => resolve({ isWhitelisted: false }),
              1000
            );

            chrome.runtime.sendMessage(
              { action: "checkDomainWhitelist", domain: domainResponse.domain },
              (response) => {
                clearTimeout(timeout);
                if (chrome.runtime.lastError) {
                  console.error(
                    "Error checking whitelist:",
                    chrome.runtime.lastError
                  );
                  resolve({ isWhitelisted: false });
                } else {
                  resolve(response);
                }
              }
            );
          });

          setIsWhitelisted(whitelistResponse.isWhitelisted);
        }
      } catch (error) {
        console.error("Extension initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeExtension();

    // Listen for storage changes to update counts in real-time
    const storageListener = (changes, namespace) => {
      if (namespace === "local") {
        if (changes.domainStats) {
          setDomainStats(changes.domainStats.newValue || {});
        }
      }
    };

    chrome.storage.onChanged.addListener(storageListener);

    // Cleanup listener on unmount
    return () => {
      chrome.storage.onChanged.removeListener(storageListener);
    };
  }, []);

  const handleToggle = (newState) => {
    setIsActive(newState);
    chrome.storage.local.set({ isActive: newState });
  };

  const handleWhitelistToggle = () => {
    const whitelistAction = isWhitelisted ? "remove" : "add";

    const timeout = setTimeout(() => {
      console.error("Timeout updating whitelist");
    }, 5000);

    chrome.runtime.sendMessage(
      { action: "updateWhitelist", domain: currentDomain, whitelistAction },
      (response) => {
        clearTimeout(timeout);
        if (chrome.runtime.lastError) {
          console.error("Error updating whitelist:", chrome.runtime.lastError);
        } else if (response && response.success) {
          setIsWhitelisted(!isWhitelisted);
        }
      }
    );
  };

  const handleResetStats = () => {
    if (!currentDomain) return;

    const updatedStats = { ...domainStats };
    delete updatedStats[currentDomain];

    chrome.storage.local.set(
      {
        domainStats: updatedStats,
      },
      () => {
        setDomainStats(updatedStats);
      }
    );
  };

  if (loading) {
    return (
      <div className="w-80 h-auto p-4 bg-[#1F2937]">
        <div className="text-white text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-80 h-auto p-4 bg-[#1F2937]">
      <header className="mb-6">
        <h1 className="text-xl font-bold font-days-one bg-linear-to-r from-purple-600 to-violet-400 bg-clip-text text-transparent">
          JustUI
        </h1>
      </header>

      <main className="space-y-4">
        {/* Extension Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Extension Status
            </h2>
            <p className="text-sm text-gray-600">
              {isActive ? "Active" : "Inactive"}
            </p>
          </div>
          <Switch checked={isActive} onChange={handleToggle} />
        </div>

        {/* Current Domain Status */}
        {currentDomain && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-semibold text-gray-800">
                Current Domain
              </h3>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  isWhitelisted
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {isWhitelisted ? "Whitelisted" : "Not Whitelisted"}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{currentDomain}</p>

            {isWhitelisted && (
              <button
                onClick={handleWhitelistToggle}
                className="w-full px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                Remove from Whitelist
              </button>
            )}

            {!isWhitelisted && (
              <button
                onClick={handleWhitelistToggle}
                className="w-full px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Add to Whitelist
              </button>
            )}
          </div>
        )}

        {/* Status Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Element Removal Status
          </h3>
          <p className="text-sm text-gray-600">
            {isActive && !isWhitelisted
              ? "✓ Elements will be removed on this domain"
              : isActive && isWhitelisted
              ? "⏸ Domain is whitelisted (clean site, no removal)"
              : "⏸ Extension is inactive"}
          </p>
        </div>

        {/* Statistics */}
        {currentDomain && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-semibold text-gray-800">
                Removal Stats
              </h3>
              {domainStats[currentDomain] && (
                <button
                  onClick={handleResetStats}
                  className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                  title="Reset statistics for this domain"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Default Rules:</span>
                <span className="text-sm font-semibold text-purple-600">
                  {domainStats[currentDomain]?.defaultRulesRemoved || 0}{" "}
                  elements
                </span>
              </div>
              {!!domainStats[currentDomain]?.customRulesRemoved && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Custom Rules:</span>
                  <span className="text-sm font-semibold text-violet-600">
                    {domainStats[currentDomain]?.customRulesRemoved || 0}{" "}
                    elements
                  </span>
                </div>
              )}
              <div className="pt-2 mt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800">
                    Total:
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {(domainStats[currentDomain]?.defaultRulesRemoved || 0) +
                      (domainStats[currentDomain]?.customRulesRemoved ||
                        0)}{" "}
                    elements
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Link */}
        <div className="pt-4 border-t border-gray-600">
          <button
            onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') })}
            className="w-full px-3 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
          >
            ⚙️ Advanced Settings
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
