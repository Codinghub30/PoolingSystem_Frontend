import React, { useEffect, useState } from "react";
import axios from "axios";
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
    <div style={{ padding: "20px", margin: "auto", width: "350px" }}>
      <h2>
        View <b>Poll History</b>
      </h2>

      {polls.length === 0 && <p>No polls found.</p>}

      {polls.map((poll, i) => {
        const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

        return (
          <div
            key={poll._id}
            style={{
              marginBottom: "2rem",
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 15,
            }}
          >
            <h4>Question {i + 1}</h4>
            <div
              style={{
                background: "#666",
                color: "white",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "12px",
              }}
            >
              {poll.question}
            </div>

            <div>
              {poll.options.map((option, idx) => {
                const pct = getPercentage(option.votes, totalVotes);

                return (
                  <div
                    key={option._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 8,
                      background: idx % 2 === 0 ? "#f5f5f5" : "#ffffff",
                      borderRadius: 4,
                      padding: "6px 10px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <div
                      style={{
                        flex: pct,
                        backgroundColor: "#7b81f7",
                        height: 25,
                        borderRadius: "4px 0 0 4px",
                        display: pct === 0 ? "none" : "block",
                        color: "white",
                        textAlign: "right",
                        paddingRight: 8,
                        lineHeight: "25px",
                        fontWeight: "600",
                        fontSize: 14,
                      }}
                    >
                      {pct > 0 && pct + "%"}
                    </div>
                    <div
                      style={{ flex: 100 - pct, paddingLeft: 10, fontSize: 14 }}
                    >
                      {idx + 1}. {option.text}
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
