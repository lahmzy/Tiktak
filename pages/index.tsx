import Image from 'next/image'
import { Inter } from 'next/font/google'
import { NextPage } from 'next'
import axios from 'axios'
import {Video} from '@/types'
import VideoCard from '@/components/VideoCard'
import NoResult from '@/components/NoResult'
import { BASE_URL } from '@/utils'

interface HomeProps {
  videos: Video[]
}

interface ITopic {
  query:{
    topic: string
  }
}

const inter = Inter({ subsets: ['latin'] })

const Home = ({videos}: HomeProps) => {
  
  
  return (
    <div className='flex flex-col gap-10 videos h-full'>
      {videos.length? (videos.map((video:Video) => (
        <VideoCard post={video} key={video._id} />
      ))) : (
        <NoResult text='No Videos' />
      )}
    </div>
  )
}

export const getServerSideProps = async ({query}:ITopic) => {
  console.log(query)

  const {topic} = query

  let response = null;

  if (topic){
    response = await axios.get(`${BASE_URL}/api/discover/${topic}`)

  }else{
    response = await axios.get(`${BASE_URL}/api/post`)
  }
 

  return {
    props:{
      videos: response.data
    }
  }
}

export default Home
