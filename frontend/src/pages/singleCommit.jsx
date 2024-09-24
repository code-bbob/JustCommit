import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Navbar from "../components/navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import useAxios from '../utils/useAxios';
import Commit from "../components/commit";
const SingleCommit = () => {
    const params = useParams();
    const commitCode = params.id
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const api = useAxios()

    const [commit, setCommit] = useState([]);

    useEffect(() => {
        async function getCommit() {
            try {
                const response = await api.get(`api/commit/${commitCode}`);
                setCommit(response.data);
                
            } catch (e) {
                console.log(e);
            }   
        }
        getCommit();
        console.log(commit);
    },[]);
    // This is a single group page that contains the name of the group, list of users it has on the side and the commits made in that group.
    
    return (
  <div className="bg-gradient-to-r from-rose-500 to-teal-200 h-[100vh]">
    <Navbar />
    <div className="ml-64">
    
    <Commit commit={commit} />
  </div>
  </div>
);


}

export default SingleCommit