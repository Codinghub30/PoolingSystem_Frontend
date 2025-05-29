import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/apiConfig";

const PollHistory = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await axiosInstance.get("/poll/get-history");
        setPolls(res.data);
      } catch (error) {
        console.error("Error fetching poll history", error);
      }
    };

    fetchPolls();
  }, []);

  const getPercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(0);
  };

  return (
    <div
      style={{
        padding: "20px",
        margin: "auto",
        maxWidth: 700,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        width: "520px",
      }}
    >
      <h2 style={{ marginBottom: 30, fontWeight: "600" }}>
        View <b>Poll History</b>
      </h2>

      {polls.length === 0 && <p>No polls found.</p>}

      {polls.map((poll, i) => {
        const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

        return (
          <div
            key={poll._id}
            style={{
              marginBottom: "2.5rem",
              border: "1px solid #7b81f7",
              borderRadius: 8,
              padding: 20,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h4 style={{ marginBottom: 10, fontWeight: "600" }}>
              Question {i + 1}
            </h4>

            <div
              style={{
                background: "linear-gradient(90deg, #666666 0%, #333333 100%)",
                color: "white",
                padding: "12px 15px",
                borderRadius: "6px 6px 0 0",
                fontWeight: "600",
                fontSize: 16,
                marginBottom: 20,
                userSelect: "none",
              }}
            >
              {poll.question}
            </div>

            <div>
              {poll.options.map((option, idx) => {
                const pct = Number(getPercentage(option.votes, totalVotes));
                return (
                  <div
                    key={option._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 8,
                      borderRadius: 6,
                      overflow: "hidden",
                      border: "1px solid #ddd",
                      fontSize: 14,
                      cursor: "default",
                      backgroundColor: idx % 2 === 0 ? "#f9f9ff" : "#ffffff",
                      userSelect: "none",
                      position: "relative",
                      height: 36,
                    }}
                  >
                    {/* Progress bar colored portion */}
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: pct + "%",
                        backgroundColor: "#7b81f7",
                        borderRadius: "6px 0 0 6px",
                        transition: "width 0.3s ease",
                      }}
                    ></div>

                    {/* Option text portion */}
                    <div
                      style={{
                        position: "relative",
                        paddingLeft: 15,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: pct > 50 ? "white" : "#333", // Better contrast on bar
                        fontWeight: "600",
                        flexGrow: 1,
                        zIndex: 1,
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingRight: 12,
                      }}
                      title={option.text}
                    >
                      <span>
                        {idx + 1}. {option.text}
                      </span>
                      <span>{pct > 0 ? pct + "%" : ""}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PollHistory;
