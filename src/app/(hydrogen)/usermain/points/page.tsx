'use client';

import type { NextPage } from "next";
import Top1 from "@/components-figma/top1";
import ComponentNotice from "@/components-figma/component-notice";
import Footer from "@/components-figma/footer";

import List from "@/components-figma/list-notice";
import Page from "@/components-figma/page";

import Link from "next/link";

import { Input } from '@/components/ui/input';


import { useState, useEffect, use } from "react";


import { PiMagnifyingGlassBold } from 'react-icons/pi';

import { useSearchParams } from 'next/navigation';

import DateCell from '@/components/ui/date-cell';


import { getColumns } from '@/app/shared-vienna/point/columns-user';

import PointTableWidget from '@/components/doingdoit/point-table-widget-user';


import { useAnimation, motion, m } from "framer-motion";

import Image from "next/image";


import { useSession, signIn, signOut } from 'next-auth/react';


export default function PointPage() {


  const { data: session, status } = useSession();




  const [userData, setUserData] = useState({
    id: 0,
    email: "",
    nickname: "",
    avatar: "",
  });

  useEffect(() => {

    const fetchData = async () => {
      if (session?.user?.email) {
        const res = await fetch(`/api/vienna/user/getUserByEmail?_email=${session?.user?.email}`);
        const posts  = await res?.json() as any;
        setUserData(posts?.data);
      }
    }

    fetchData();
  }, [session?.user?.email]);



  ///console.log('PointPage userData', userData);





  const [data, setData] = useState([]);


  const [loading, setLoading] = useState(false);




  const searchParams = useSearchParams()
 
  const search = searchParams.get('search') || ''

  const [searchTerm, setSearchTerm] = useState("");

  const [searchResults, setSearchResults] = useState([]);



  // sort by date or view count
  const [sortBy, setSortBy] = useState("createdAt");
  

  // search update
  useEffect(() => {

    if (search !== "") {
      setSearchTerm(search);

    } else {
      setSearchTerm("");
    }


  }, [search]);



  // handleSearch
  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);

    if (searchTerm !== "") {
      const newFeedList = data.filter((feed: any) => {
        return Object.values(feed).join(" ").toLowerCase().includes(searchTerm.toLowerCase());
      });
      setSearchResults(newFeedList);
    } else {
      setSearchResults(data);
    }
  };


  console.log('PointPage userData?.id', userData?.id);


  const [totalPoint, setTotalPoint] = useState(0);

  useEffect(() => {
    //getTotalPointByUserId api
    const fetchData = async () => {


      setLoading(true);

      const res = await fetch(`/api/vienna/point/getTotalPointByUserId?_userId=${userData?.id}`);

      const posts  = await res?.json() as any;

      //console.log("board data===========================", posts.data);

      setTotalPoint(posts?.data);

      setLoading(false);

    };

    fetchData();

  } , [userData?.id]);




  if (
    session?.user?.email &&
    session?.user?.email.includes ('@unove.space')
  ) {
    signOut(
      {
        callbackUrl: '/usermain/user/login',
      }
    );

    return <></>
  }



  return (

    <>

    <div className="bg-dark felx sticky top-0 z-50 ">
              <Top1
                logo="/usermain/images/logo1.svg"
                topBackgroundColor="#fff"
                topBorderBottom="1px solid #ddd"
                topBoxSizing="border-box"
                frameDivBorderBottom="unset"
                frameDivBoxSizing="unset"
                divColor="#212121"
                frameDivBorderBottom1="unset"
                frameDivBoxSizing1="unset"
                divColor1="#212121"
                frameDivBorderBottom2="unset"
                frameDivBoxSizing2="unset"
                divColor2="#212121"
                divColor3="#212121"
                aboutColor="#212121"
                frameDivBorder="1px solid #666"
                divColor4="#212121"
                frameDivBorder1="1px solid #666"
                divColor5="#212121"
                frameDivBorderBottom3="unset"
                frameDivBoxSizing3="unset"
              />
          </div>


    <div className="relative bg-white w-full overflow-hidden flex flex-col items-center justify-start">
      <div className="self-stretch flex flex-col items-center justify-start">
  
      <div className="self-stretch xl:bg-background flex flex-col items-center justify-start py-5 xl:py-10  text-center text-base text-grey-9 font-menu-off">
      
      <div className="w-full xl:w-[1000px] flex flex-col items-center justify-start gap-[20px] xl:gap-[40px]">


        <div className="self-stretch bg-white flex flex-col items-center justify-end  p-5 xl:p-[50px] gap-[20px] xl:gap-[40px]">




          <div
            className="self-stretch flex flex-row items-center justify-center xl:pb-5 gap-[12px] z-[0] text-left text-sm text-dark font-menu-off xl:border-b-[1px] border-solid border-grey-e"
          >

            <motion.div
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
            {/* history back */}

              <button
                type="button"
                onClick={() => {
                  history.back();
                }}
              >

                <div className="flex-1 flex flex-row items-center justify-start gap-[12px]">


                    <Image
                      width="24"
                      height="24"
                      className="relative w-6 h-6 overflow-hidden shrink-0"
                      alt=""
                      src="/usermain/images/back.svg"
                    />

                    
                  

                </div>

              </button>
            
            </motion.div>


            {/* absolute horizontal center */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-row items-center justify-center gap-[12px] text-dark text-base xl:text-xl font-extrabold">
              포인트
            </div>

          </div>




          <div className="w-full xl:w-[400px] flex flex-col items-center justify-center text-left text-sm ">

            <div className=" self-stretch flex flex-row items-center justify-start gap-[12px]">


            
                <div className="rounded-81xl bg-grey-f1 flex flex-row items-center justify-center py-3 px-5 text-left text-sm xl:text-base font-extrabold text-grey-9 font-menu-off">
                  포인트
                </div>
                

                <div className="p-5 font-extrabold  text-dark text-2xl xl:text-4xl ">
                  { // , number format, 43,000

                    totalPoint && totalPoint.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")


                  }P
                </div>

             

            </div>


            <div className="mt-3 self-stretch flex flex-col items-center justify-start gap-[32px]">
                        



        {false ? (
          <div className="self-stretch flex flex-col items-center justify-center p-8">
            <div  className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>

              
          </div>

        ) : (

          <PointTableWidget

            // table border none
            className="xl:w-[900px] xl:p-10 border-0 p-0 h-screen"

            title=""

            variant="modern"
            //variant="minimal"
            //variant="classic"
            //variant="elegant"
            //

            
            //data={data}

            //total={data.length}

  

            // @ts-ignore
            getColumns={getColumns}
            enablePagination={true}
            
            enableSearch={false}
            searchPlaceholder="제목, 내용"

            //className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"

            //className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"

            // no table border
            //className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium border-0"

            sticky
            //  scroll={{ x: 600, }}
            
            scroll={{ x: 0, }}

            // header hidden
            //hideHeader={true}

            // 

            //paginatorClassName="flex flex-col items-center justify-center text-center text-3xs text-grey-6 font-menu-off"

            // <div className="relative font-extrabold text-black">1</div>

            paginatorClassName=" flex flex-row items-center justify-center text-center text-3xs text-grey-6 font-menu-off"
            
            
            paginatorGap={20}


            // no show count per page

            // no show count per page


          />

        )}


          </div>
        </div>




        </div>
      </div>
    </div>

      </div>
      <Footer
        footerAlignSelf="stretch"
        footerBorderTop="1px solid #eee"
        footerBoxSizing="border-box"
      />
    </div>






    <div className="block xl:hidden sticky bottom-0 z-50  ">


<div className="self-stretch bg-white shadow-[0px_0px_20px_rgba(0,_0,_0,_0.1)] flex flex-col items-center justify-center text-center text-3xs text-grey-9 font-noto-sans-kr">
  
  <div className="self-stretch flex flex-row flex-wrap items-center justify-between ml-5 mr-5">

    

    {/*
    <Link 
        href={'/'}
        className="h-[60px]  flex flex-col items-center justify-center p-2.5 box-border gap-[4px]   text-dark">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        loading="eager"
        alt=""
        src="/homefill.svg"
      />
      <b className="relative">홈</b>
    </Link>
    */}

    <Link 
        href={'/'}
        className="h-[60px]  flex flex-col items-center justify-center p-2.5 box-border gap-[4px]  ">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        loading="eager"
        alt=""
        src="/homeline.svg"
      />
      <b className="relative">홈</b>
    </Link>


      {/*
    <div className="h-[60px] flex-1 flex flex-col items-center justify-center p-2.5 box-border gap-[4px]   text-dark">
      <input
        className="m-0 w-6 h-6 relative overflow-hidden shrink-0"
        type="checkbox"
      />
      <b className="relative">홈</b>
    </div>
        */}


    {/*
    <Link
        href={'/usermain/feeds'}
        className="h-[60px] flex-1 flex flex-col items-center justify-center p-2.5 box-border gap-[4px]  ">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        loading="eager"
        alt=""
        src="/newspaperline.svg"
      />
      <div className="relative">피드</div>
    </Link>
    */}


    <Link 
        href={'/usermain/feeds'}
        className="h-[60px]  flex flex-col items-center justify-center p-2.5 box-border gap-[4px]  ">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        loading="eager"
        alt=""
        src="/newspaperline.svg"
      />
      <b className="relative">피드</b>
    </Link>



    <Link 
        href={'/usermain/feeds/statistics'}
        className="h-[60px]  flex flex-col items-center justify-center p-2.5 box-border gap-[4px]    ">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        loading="eager"
        alt=""
        src="/piechart2line.svg"
      />
      <b className="relative">통계</b>
    </Link>

    
    {/*
    <Link
        href={'/usermain/feeds/statistics'}
        className="h-[60px]  flex flex-col items-center justify-center p-2.5 box-border gap-[4px]  ">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        loading="eager"
        alt=""
        src="/piechart2line.svg"
      />
      <div className="relative">통계</div>
    </Link>
    
    <div className="h-[60px] w-[48.8px] hidden flex-col items-center justify-center p-2.5 box-border gap-[4px] text-dark">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        alt=""
        src="/piechart2fill.svg"
      />
      <b className="relative">통계</b>
    </div>
    */}



    <Link 
        href={'/usermain/boards'}
        className="h-[60px]  flex flex-col items-center justify-center p-2.5 box-border gap-[4px]   ">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        loading="eager"
        alt=""
        src="/message2line.svg"
      />
      <b className="relative">게시판</b>
    </Link>
    {/*
    <Link
        href={'/usermain/boards'}
        className="h-[60px] flex-1 flex flex-col items-center justify-center p-2.5 box-border gap-[4px]  ">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        loading="eager"
        alt=""
        src="/message2line.svg"
      />
      <div className="relative">게시판</div>
    </Link>


    <div className="h-[60px] w-[55.7px] hidden flex-col items-center justify-center p-2.5 box-border gap-[4px] text-dark">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        alt=""
        src="/message2fill.svg"
      />
      <b className="relative">게시판</b>
    </div>
    */}



    <Link 
        href={'/usermain/survey/result'}
        className="h-[60px]  flex flex-col items-center justify-center p-2.5 box-border gap-[4px]  ">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        loading="eager"
        alt=""
        src="/questionanswerline.svg"
      />
      <b className="relative">설문</b>
    </Link>
    
    {/*
    <Link
        href={'/usermain/surveys'}
        className="h-[60px] flex-1 flex flex-col items-center justify-center p-2.5 box-border gap-[4px]  ">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        loading="eager"
        alt=""
        src="/questionanswerline.svg"
      />
      <div className="relative">설문</div>
    </Link>
    <div className="h-[60px] w-[65px] hidden flex-col items-center justify-center p-2.5 box-border gap-[4px] text-dark">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        alt=""
        src="/questionanswerfill.svg"
      />
      <b className="relative">설문</b>
    </div>
    */}


    <Link 
        href={'/usermain/user/my-page'}
        className="h-[60px]  flex flex-col items-center justify-center p-2.5 box-border gap-[4px]   text-dark ">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        loading="eager"
        alt=""
        src="/usersettingsfill.svg"
      />
      <b className="relative">마이</b>
    </Link>

    {/*
    <Link
        href={'/usermain/user/my-page'}
        className="h-[60px] flex-1 flex flex-col items-center justify-center p-2.5 box-border gap-[4px]  ">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        loading="eager"
        alt=""
        src="/usersettingsline.svg"
      />
      <div className="relative">마이</div>
    </Link>
    <div className="h-[60px] w-[55.7px] hidden flex-col items-center justify-center p-2.5 box-border gap-[4px] text-dark">
      <img
        className="w-6 h-6 relative overflow-hidden shrink-0"
        alt=""
        src="/usersettingsfill.svg"
      />
      <b className="relative">마이</b>
    </div>
    */}


  </div>

</div>

  </div>



    </>






    
  );
};


