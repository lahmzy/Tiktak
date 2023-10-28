import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { MdOutlineCancel } from "react-icons/md";
import Link from "next/link";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { GoVerified } from "react-icons/go";
import { BsFillPlayFill, BsPauseCircleFill } from "react-icons/bs";
import axios from "axios";
import { BASE_URL } from "@/utils";
import { Video } from "@/types";
import { postDetailQuery } from "@/utils/queries";
import { client } from "@/utils/client";
import Comments from "@/components/Comments";
import LikeButton from "@/components/LikeButton";
import useAuthStore from "@/store/authStore";
import Image from "next/image";


interface IserverSideProps {
  params: {
    id: string;
  };
}

interface IpostDetails {
  postDetails: Video;
}

const Detail = ({ postDetails }: IpostDetails) => {
  const [post, setPost] = useState(postDetails);
  const [playing, setPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const { userProfile }: any = useAuthStore();
  const [comment , setComment ] = useState('')
  const [isPostingComment, setIsPostingComment] = useState(false)
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);


  const onVideoPress = (): void => {
    if (playing) {
      setPlaying(false);
      videoRef?.current?.pause();
    } else {
      videoRef?.current?.play();

      setPlaying(true);
    }
  };

  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const {data} = await axios.put(`${BASE_URL}/api/like`, {
       
        userId: userProfile._id,
        postId: post._id,
        like:like,
      });
     
      setPost({ ...post, likes:data.likes });
      console.log(data.likes,"hey")
    }
  };


  const addComment = async (e:React.FormEvent) => {
    e.preventDefault()
    setIsPostingComment(true)

    const response = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
      userId: userProfile._id,
      comment
    })

    setPost({...post,comments:response.data.comments})
    setComment("")
    setIsPostingComment(false)
  }

  if (!post) return null;

  return (
    <div className="flex w-full absolute left-0 top-0  bg-white flex-wrap lg:flex-wrap">
      <div className="relative w-[1000px] lg:w-3/4 flex justify-center items-center bg-blurred-img bg-no-repeat bg-cover">
        <div className="absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
          <p onClick={() => router.back()}>
            <MdOutlineCancel className="text-white text-[35px] cursor-pointer" />
          </p>
        </div>
        <div className="relative">
          <div className="lg:h-[100vh] h-[60vh]">
            <video
              muted={isVideoMuted}
              className="h-full cursor-pointer"
              src={post.video.asset.url}
              ref={videoRef}
              loop
            ></video>
          </div>
          <div className="absolute top-[45%] left-[45%] cursor-pointer">
            {!playing ? (
              <button onClick={() => onVideoPress()}>
                <BsFillPlayFill className="text-white text-6xl lg:text-8xl" />
              </button>
            ) : (
              <button onClick={onVideoPress}>
                <BsPauseCircleFill className="text-white lg:text-8xl text-6xl" />
              </button>
            )}
          </div>
        </div>
        <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor pointer">
          {isVideoMuted ? (
            <button onClick={() => setIsVideoMuted(false)}>
              <HiVolumeOff className="text-white text-2xl lg:text-4xl" />
            </button>
          ) : (
            <button onClick={() => setIsVideoMuted(true)}>
              <HiVolumeUp className="text-white text-2xl lg:text-4xl" />
            </button>
          )}
        </div>
      </div>

      <div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
        <div className="lg:mt-20 mt-10">
          <Link href={`/profile/${post.postedBy._id}`}>
            <div className="flex gap-4 mb-4 bg-white w-full pl-10 cursor-pointer">
              <Image
                width={60}
                height={60}
                alt="user-profile"
                className="rounded-full"
                src={post.postedBy.image}
              />
              <div>
                <div className="text-xl font-bold lowercase tracking-wider flex gap-2 items-center justify-center">
                  {post.postedBy.userName.replace(/\s+/g, "")}{" "}
                  <GoVerified className="text-blue-400 text-xl" />
                </div>
                <p className="text-md"> {post.postedBy.userName}</p>
              </div>
            </div>
          </Link>
          <div className="px-10">
            <p className=" text-md text-gray-600">{post.caption}</p>
          </div>
          <div className="mt-10 px-10">
            {userProfile && (
              <LikeButton
                likes={post.likes}
                flex="flex"
                handleLike={() => handleLike(true)}
                handleDislike={() => handleLike(false)}
              />
            )}
          </div>
          <Comments
          comment={comment}
          setComment={setComment}
          addComment={addComment}
          comments={post.comments}
          isPostingComment={isPostingComment}
          />
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({
  params: { id },
}: IserverSideProps) => {
  const { data } = await axios.get(`${BASE_URL}/api/post/${id}`);

  return {
    props: { postDetails: data },
  };
};

export default Detail;
