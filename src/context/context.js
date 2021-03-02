import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [followers, setFolllowers] = useState(mockFollowers);
  const [repos, setRepos] = useState(mockRepos);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState(0);

  // check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then((response) => {
        // console.log("response", response);
        let { data } = response;
        let {
          rate: { remaining },
        } = data;
        // console.log(remaining);

        setRequests(remaining);
        if (remaining === 0) {
          // throw an error
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider value={{ githubUser, followers, repos, requests }}>
      {children}
    </GithubContext.Provider>
  );
};

const useGlobalContext = () => {
  return React.useContext(GithubContext);
};

export { useGlobalContext, GithubProvider };
