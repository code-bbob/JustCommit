import React from "react";
import { Card,CardFooter,CardHeader, CardDescription, CardTitle, CardContent } from './ui/card';
import { FaHeart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import useAxios from "../utils/useAxios";

const Commit =({commit})=>{
    const [likes, setLikes] = useState(commit.likes?.length);
    const [liked, setLiked] = useState(commit?.has_liked);
    const navigate = useNavigate();
    const api = useAxios();

    console.log(commit);
    
  const handleLike = async (e, commit) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      const response = await api.patch('/api/commit/', { commit_code: commit?.code });
      console.log(response.data);
  
      if (!liked) {
        setLikes(likes + 1);
        setLiked(true);
      }
      else{
        setLikes(likes - 1);
        setLiked(false);
      }

    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };
  
    return(
            <div className="w-auto max-w-[80%] my-4">
              <Card className=" bg-black text-white" onClick={() =>navigate(`/commit/${commit?.code}`)}>
                <CardHeader>
                <CardTitle>{commit?.title}</CardTitle>
                <div className="border-t border-white"></div>
                <CardDescription className="text-">
                          <p>Posted on: {commit?.date}</p>
                        </CardDescription>
                </CardHeader>
                <CardContent>
                  Lorem Lorem Lorem ipsum Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi, rerum neque repellat sit esse voluptate quis adipisci accusantium! Sit culpa odit, incidunt eaque delectus nobis omnis quibusdam dignissimos provident aliquam! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam illum inventore voluptatum tenetur officiis, ipsam nam doloremque itaque aliquid, eligendi, alias repellat amet ex. Sunt nulla voluptatum beatae laudantium officia. dolor sit amet consectetur adipisicing elit. Ipsa deleniti voluptas possimus vitae eos? Eveniet corrupti, ipsum dolor eius voluptas perferendis repudiandae maiores sit deleniti, sed similique vero quibusdam ab!{commit.content}
                  </CardContent>
                  <CardFooter><p className='text-xl font-bold mt-8'>{likes}</p>
                 
                  <FaHeart className={liked?'text-red-500 size-4 mt-8 mx-1 hover:scale-125 hover:text-red-800':'text-white size-4 mt-8 mx-1 hover:scale-125 hover:text-red-800'} onClick={(e) => handleLike(e, commit)}/>
                  <a href={`/user/${commit?.user?.uuid}`} className='font-serif font-medium italic ml-[600px]'>- {commit?.user?.name}</a>
                  </CardFooter>
              </Card>
            </div>
    )
}

export default Commit