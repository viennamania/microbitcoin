import type { NextPage } from "next";
import ListInfo from "./list-info";

import Link from "next/link";

const FormContainerGuide: NextPage = () => {
  return (
    <div className="self-stretch flex flex-row items-center justify-center gap-[20px] text-left text-xs text-grey-6 font-menu-off">
      
      <Link
        href="/usermain/boards/guide-details"
        className="no-underline flex">
        <ListInfo />
      </Link>

      <Link
        href="/usermain/boards/guide-details"
        className="no-underline flex">
      <ListInfo />
      </Link>

    </div>
  );
};

export default FormContainerGuide;
