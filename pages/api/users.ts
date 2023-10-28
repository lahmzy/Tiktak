// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { allUsersQuery} from "@/utils/queries";
import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/utils/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const query = allUsersQuery();
    const data = await client.fetch(query);

    data ?  res.status(200).json(data) : res.status(200).json([])
   
  } 
}
