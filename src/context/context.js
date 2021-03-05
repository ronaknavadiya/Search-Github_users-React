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
  const [error, setError] = useState({ show: false, msg: "" });

  const searchGithubUser = async (user) => {
    setLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((error) =>
      console.log("error:", error)
    );
    if (response) {
      toggleError();
      setGithubUser(response.data);
      const { login, followers_url, repos_url } = response.data;

      // // REPOS
      // axios(`${repos_url}?per_page=100`).then((response) => {
      //   // console.log("res", response);
      //   setRepos(response.data);
      // });

      // // FOLLOWERS
      // axios(`${followers_url}?per_page=100`).then((response) => {
      //   // console.log("res", response);
      //   setFolllowers(response.data);
      // });

      await Promise.allSettled([
        axios(`${repos_url}?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results;
          const status = "fulfilled";
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFolllowers(followers.value.data);
          }
        })
        .catch((error) => console.log("error:", error));
      // repos
      // https://api.github.com/users/john-smilga/repos?per_page=100

      // followers
      // https://api.github.com/users/john-smilga/followers
    } else {
      toggleError(true, "Can't find user with that username");
    }
    checkRequests();
    setLoading(false);
  };

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
          toggleError(true, "Sorry,you have exceeded your hourly rate limit!");
          // throw an error
        }
      })
      .catch((error) => console.log("error", error));
  };

  function toggleError(show = false, message = "") {
    setError({ show: show, msg: message });
  }

  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        followers,
        repos,
        requests,
        error,
        searchGithubUser,
        loading,
        setLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

const useGlobalContext = () => {
  return React.useContext(GithubContext);
};

export { useGlobalContext, GithubProvider };
