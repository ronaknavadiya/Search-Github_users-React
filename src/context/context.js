import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [folllowers, setFolllowers] = useState(mockFollowers);
  const [repos, setRepos] = useState(mockRepos);

  return (
    <GithubContext.Provider value={{ githubUser, folllowers, repos }}>
      {children}
    </GithubContext.Provider>
  );
};

const useGlobalContext = () => {
  return React.useContext(GithubContext);
};

export { useGlobalContext, GithubProvider };
