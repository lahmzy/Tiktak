import React from "react";
import { NextPage } from "next";
import { footerList1, footerList2, footerList3 } from "../utils/constants";
import { useRouter } from "next/router";

const date = new Date();
const year = date.getFullYear();



interface FooterProps {
  items: string[];
  mt: Boolean;
}

const List = ({ items, mt }: FooterProps) => (
  <div className={`flex flex-wrap gap-2 ${mt && "mt-5"}`}>
    {items.map((item: string) => (
      <p
        key={item}
        className="text-gray-400 text-sm hover:underline cursor-pointer"
      >
        {item}
      </p>
    ))}
  </div>
);

const Footer: NextPage = () => {

  const {pathname} = useRouter()

  return (
    <div className={`mt-6 hidden ${pathname === "/upload"?"opacity-0" : ""} xl:block`}>
      <List items={footerList1} mt={false} />
      <List items={footerList2} mt />
      <List items={footerList3} mt />
      <p className="text-gray-400 text-sm mt-5"> &copy; {year} TikTik</p>
    </div>
  );
};

export default Footer;
