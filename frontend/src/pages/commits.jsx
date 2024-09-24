import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import { Card, CardFooter } from "../components/ui/card";
import {
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import Groups from "../components/groups";
import { useNavigate } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { Button } from "../components/ui/button";
import { GiNotebook } from "react-icons/gi";
import Commit from "../components/commit";

const Commits = () => {
  const navigate = useNavigate();
  const [commits, setCommits] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const api = useAxios();

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("api/commit/");
        console.log(response.data);
        setCommits(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCommits();
  }, []);

  return (
    <div className="bg-gradient-to-r from-rose-500 to-teal-200">
      <Navbar />
      <div className="flex flex-row relative">
        {/* left group */}
        <div className="bg-black w-24 fixed h-screen">
          <Groups />
        </div>
        {/* line */}
        <div className="sticky top-0 h-screen w-[0.5px] bg-white ml-24"></div>

        <div className="my-5 flex flex-col ml-40 relative">
          {commits.map((commit) => (
            <Commit commit={commit} key={commit.id} />
          ))}
        </div>
        <div className="fixed top-[83vh] right-[5vh] ">
        <GiNotebook
          size={72}
          className="bg-black text-white hover:scale-125 border-4 border-black rounded-full p-2 "
          onClick={() => navigate("post/")}
        />
      </div>
      </div>
      
    </div>
  );
};

export default Commits;
