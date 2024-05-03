'use client';

import type { NextPage } from "next";
import Top1 from "@/components-figma/top1";

import InputDate from "@/components-figma/input-date";
import Tag from "@/components-figma/tag";
import MealQuantityContainer from "@/components-figma/meal-quantity-container";
import BtnBigOn from "@/components-figma/btn-big-on";
import Footer from "@/components-figma/footer";

import Link from "next/link";

import { useState, useEffect, use } from "react";

import { useSession, signIn, signOut } from 'next-auth/react';



import { DatePicker } from '@/components/ui/datepicker';


import { Input } from '@/components/ui/input';
//PiMagnifyingGlassBold
import { PiMagnifyingGlassBold, PiXBold } from 'react-icons/pi';


import Image from "next/image";

import { useAnimation, motion, m } from "framer-motion";


import { Modal } from '@/components/ui/modal';


import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';

import { Text, Title } from '@/components/ui/text';

import PostFeed from '@/app/shared/profile/post-feed';
import FollowerModal from '@/app/shared/profile/follower-modal';
import { postData, followersData, followingData } from '@/data/profile-data';



///import DatabaseTableWidgetDiet from '@/components-figma/doingdoit/database-table-widget-diet';


import DatabaseTableWidgetSearch from '@/components-figma/doingdoit/database-table-widget-search';



//import DatabaseTableWidgetDiet from '@/components/doingdoit/user-food-table-widget';


import DatabaseTableWidgetSelect from '@/components-figma/doingdoit/database-table-widget-select';



/////import { data as calorieData } from '@/data/doingdoit/feed/calorie-db-data';


////import { data as calorieData } from '@/data/doingdoit/feed/calorie-db-data-new';



//import { getColumns } from '@/app/shared-vienna/feed/calorie-db-columns-user';


import { getColumns } from '@/app/shared-vienna/food/columns-feed';

import { getColumns as getColumnsSelect } from '@/app/shared-vienna/food/columns-database';


///import { getColumns as getColumnsSelect } from '@/data/doingdoit/feed/calorie-db-data-new';




import toast from "react-hot-toast";
import { set } from "lodash";

import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

import { usePathname, useRouter } from 'next/navigation';


import Uploader from '@/components/doingdoit/upload/uploaderFeedImage';



import dynamic from 'next/dynamic';
import { fa } from "@faker-js/faker";
import { boolean } from "zod";
import { data } from "@/data/doingdoit/board/data";


const QuillEditor = dynamic(() => import('@/components-figma/ui/quill-editor'), {
  ssr: false,
});


export default function FeedDetailOnePage({ params }: any) {








  const { _id } = params;

  console.log('FeedEditPage _id: ', _id);
  

  const { data: session, status } = useSession();

  const router = useRouter();


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* fetch user data from an API
  /api/doingdoit/user/getUser
  */
  const [userId, setUserId] = useState(session?.user?.id);
  const [userEmail, setUserEmail] = useState(session?.user?.email);
  const [userName, setUserName] = useState(session?.user?.name);
  const [userNickname, setUserNickname] = useState('');
  const [userAvatar, setUserAvatar] = useState(session?.user?.image);






  const [selectedTab, setSelectedTab] = useState('1');







  //const [mealDate, setMealDate] = useState('2023-01-01');

  const [feedEmail, setFeedEmail] = useState<string>('');

  const [mealDate, setMealDate] = useState('');

  const [mealTime, setMealTime] = useState<string>('');

  // mealSkip is true or false
  const [mealSkip, setMealSkip] = useState<boolean>(false);

  const [mealFood, setMealFood] = useState<any[]>([]);

  const [mealAmount, setMealAmount] = useState<number>(0);
  const [mealSpeed, setMealSpeed] = useState<number>(0);


  ////console.log("mealFood : ", mealFood);





  const [meal, setMeal] = useState( {
    date: mealDate,

    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
    midnightSnack: [],

  } as any);



  useEffect(() => {
    const fetchData = async () => {

      if (!session?.user?.email) return;

      const res = await fetch(`/api/vienna/user/getUserByEmail?_email=${session?.user?.email}`);

      if (res.status === 404) {
        return;
      }

      const json = await res?.json();



      //////console.log(json);

      const data = json as any;
      
      if (data?.data) {

        setUserNickname(data.data?.nickname);
        setUserId(data.data?.id);

        ///setFeedEmail(data.data?.email);

    
        

      } else {
        //alert(json.message);
      }
    };
    fetchData();
  } , [session?.user?.email]);





  useEffect(() => {

    // format 2013-01-01

    const date = new Date();

    const mealDate = `${date.getFullYear()}-${(date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;


    setMealDate( mealDate );

  } , []);






  const [feedData, setFeedData] = useState<any>({});



  /*
  useEffect(() => {

    
    const fetchData = async () => {

      if (!_id) return;

      const res = await fetch(`/api/vienna/feed/getFeedById?_id=${_id}`);

      if (res.status === 404) {

        ///alert("해당 피드가 없습니다.");
        return;
      }

      const json = await res?.json();

      const data = json as any;

      console.log("feed getOne data : " + data?.data);

      
      if (data?.data) {

        setFeedEmail(data.data?.email);

        
        ///console.log("feed getOne data.data?.mealDate : " + data.data?.mealDate);
        setMealDate(data.data?.mealDate );


        setMealTime(data.data?.mealTime);

        setMealSkip(data.data?.mealSkip);

        setMealFood(data.data?.mealFood || []) ;

        setMealAmount(data.data?.mealAmount);
        setMealSpeed(data.data?.mealSpeed);
        setFeedbackYn(data.data?.feedbackYn);
        

        setFeedData(data.data);


      } else {
        //alert(json.message);
      }
    };


    fetchData();
  } , [_id]);
  */







  

  const [mealTimeData, setMealTimeData] = useState(
    [] as any[]
  );


  const [isExistBreakfast, setIsExistBreakfast] = useState(false);
  const [isExistLunch, setIsExistLunch] = useState(false);
  const [isExistDinner, setIsExistDinner] = useState(false);
  const [isExistSnack, setIsExistSnack] = useState(false);
  const [isExistNightSnack, setIsExistNightSnack] = useState(false);

  useEffect(() => {

    const fetchData = async () => {

      
      if (!session?.user?.email) return;

      if (!mealDate) return;
  
      setLoading(true);


      // mealDateQuery like 2021-10-01
      ////onst mealDateQuery =  mealDate.getFullYear() + "-" + (mealDate.getMonth() + 1) + "-" + mealDate.getDate();
  
      const res = await fetch(`/api/vienna/feed/getStatisticsDayByEmail?_email=${session?.user?.email}&_mealDate=${mealDate}`);

      if (res.status === 404) {
        return;
      }

      try {

      const data  = await res?.json() as any;

      ///console.log(' data: ',data?.data?.);

      const mealTimeData = data?.data?.mealTimeData;

   
      console.log(' mealTimeData: ',mealTimeData);


      // set isExistBreakfast, isExistLunch, isExistDinner, isExistSnack, isExistNight

      setIsExistBreakfast(false);
      setIsExistLunch(false);
      setIsExistDinner(false);
      setIsExistSnack(false);
      setIsExistNightSnack(false);
      mealTimeData?.map ( (item: any) => {
          
          if (item?.mealTime === "아침") {
            setIsExistBreakfast(true);
          } else if (item?.mealTime === "점심") {
            setIsExistLunch(true);
          } else if (item?.mealTime === "저녁") {
            setIsExistDinner(true);
          } else if (item?.mealTime === "간식") {
            setIsExistSnack(true);
          } else if (item?.mealTime === "야식") {
            setIsExistNightSnack(true);
          }
  
        }
      );
  
  

      setMealTimeData (mealTimeData);



      



      const breakfast = mealTimeData?.filter((post: any) => post?.mealTime === '아침').reduce((acc: any, cur: any) => acc.concat(cur.mealFood), []);

      const lunch = mealTimeData?.filter((post: any) => post?.mealTime === '점심').reduce((acc: any, cur: any) => acc.concat(cur.mealFood), []);

      const dinner = mealTimeData?.filter((post: any) => post?.mealTime === '저녁').reduce((acc: any, cur: any) => acc.concat(cur.mealFood), []);

      const snack = mealTimeData?.filter((post: any) => post?.mealTime === '간식').reduce((acc: any, cur: any) => acc.concat(cur.mealFood), []);

      const midnightSnack = mealTimeData?.filter((post: any) => post?.mealTime === '야식').reduce((acc: any, cur: any) => acc.concat(cur.mealFood), []);


      setMeal({
        date: mealDate,

        breakfast: breakfast,


        lunch: lunch,

        dinner: dinner,

        snack: snack,

        midnightSnack: midnightSnack,


      });


      } catch (error) {
        console.log(error);
      }


  
      setLoading(false);
  
    };

    fetchData();
  }
  ,[ session?.user?.email, mealDate  ]);






  ///console.log("meal.dinner : " + meal.dinner);




  const [enableBtn, setEnableBtn] = useState(false);
  useEffect(() => {
    if (mealDate && mealTime && mealFood && mealAmount && mealSpeed) {
      setEnableBtn(true);
    } else {
      setEnableBtn(false);
    }
  }, [mealDate, mealTime, mealFood, mealAmount, mealSpeed]);


  const [feedbackYn, setFeedbackYn] = useState<string>('N');



  ////const [items, setItems] = useState<string[]>([]);

  
  
  
 


  /*
   const [itemText, setItemText] = useState<string>('');
  function handleItemAdd(): void {
    if (itemText.trim() !== '') {
      const newItem: string = itemText;

      setItems([...items, newItem]);
      setValue('tags', [...items, newItem]);
      setItemText('');
    }
  }
  */

  /*
  function handleItemRemove(text: string): void {
    
    const updatedItems = mealFood.filter((item) => item?.foodName !== text);

    setMealFood(updatedItems);

  }
  */



  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openCloseConfirmModal, setOpenCloseConfirmModal] = useState(false);
  

  const [modalData, setModalData] = useState({
    title: '식품DB',
    data: followersData,
  });

  ///const [active, setActive] = useState(tabs[0].id);

  useEffect(() => {
    setOpen(() => false);
  }, [pathname]);


  // handle follower and following modal open
  function handleTabClick(id: string) {
    if (id === 'followers') {
      
      setModalData({ title: '식품DB', data: followersData });

    } else if (id === 'following') {
      setModalData({ title: 'Following', data: followingData });
    }
    setOpen(() => true);
    ////setActive(() => id);

    setSelectedTab("1");
  }


  const [feedImage1, setFeedImage1] = useState<any>(null);
  const [feedImage2, setFeedImage2] = useState<any>(null);
  const [feedImage3, setFeedImage3] = useState<any>(null);
  const [feedImage4, setFeedImage4] = useState<any>(null);
  const [feedImage5, setFeedImage5] = useState<any>(null);
  const [feedImage6, setFeedImage6] = useState<any>(null);
  const [feedImage7, setFeedImage7] = useState<any>(null);
  const [feedImage8, setFeedImage8] = useState<any>(null);
  const [feedImage9, setFeedImage9] = useState<any>(null);
  const [feedImage10, setFeedImage10] = useState<any>(null);



  
  const addUploadedImage = async (imageNumber: number, url: string) => {
    try {
      //setUser(null);
      setError(null);

  

      if (imageNumber === 1) {
        setFeedImage1(url);
      } else if (imageNumber === 2) {
        setFeedImage2(url);
      } else if (imageNumber === 3) {
        setFeedImage3(url);
      } else if (imageNumber === 4) {
        setFeedImage4(url);
      } else if (imageNumber === 5) {
        setFeedImage5(url);
      } else if (imageNumber === 6) {
        setFeedImage6(url);
      } else if (imageNumber === 7) {
        setFeedImage7(url);
      } else if (imageNumber === 8) {
        setFeedImage8(url);
      } else if (imageNumber === 9) {
        setFeedImage9(url);
      } else if (imageNumber === 10) {
        setFeedImage10(url);
      }

    } catch (error) {
      console.log(error);
      //setError(error);
    }


  }





  const removeFeedImage = async (imageNumber: number) => {

    // rotate imageNumber
    // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

    // if imageNumber is 1, then remove imageNumber 1 and move imageNumber 2 to imageNumber 1

    // if imageNumber is 2, then remove imageNumber 2 and move imageNumber 3 to imageNumber 2

    // if imageNumber is 3, then remove imageNumber 3 and move imageNumber 4 to imageNumber 3

    // if imageNumber is 4, then remove imageNumber 4 and move imageNumber 5 to imageNumber 4

    // if imageNumber is 5, then remove imageNumber 5 and move imageNumber 6 to imageNumber 5

    if (imageNumber === 1) {
      setFeedImage1(feedImage2);
      setFeedImage2(feedImage3);
      setFeedImage3(feedImage4);
      setFeedImage4(feedImage5);
      setFeedImage5(feedImage6);
      setFeedImage6(feedImage7);
      setFeedImage7(feedImage8);
      setFeedImage8(feedImage9);
      setFeedImage9(feedImage10);
      setFeedImage10(null);
    } else if (imageNumber === 2) {

      setFeedImage2(feedImage3);
      setFeedImage3(feedImage4);
      setFeedImage4(feedImage5);
      setFeedImage5(feedImage6);
      setFeedImage6(feedImage7);
      setFeedImage7(feedImage8);
      setFeedImage8(feedImage9);
      setFeedImage9(feedImage10);
      setFeedImage10(null);

    } else if (imageNumber === 3) {

      setFeedImage3(feedImage4);
      setFeedImage4(feedImage5);
      setFeedImage5(feedImage6);
      setFeedImage6(feedImage7);
      setFeedImage7(feedImage8);
      setFeedImage8(feedImage9);
      setFeedImage9(feedImage10);
      setFeedImage10(null);

    } else if (imageNumber === 4) {

      setFeedImage4(feedImage5);
      setFeedImage5(feedImage6);
      setFeedImage6(feedImage7);
      setFeedImage7(feedImage8);
      setFeedImage8(feedImage9);
      setFeedImage9(feedImage10);
      setFeedImage10(null);

    } else if (imageNumber === 5) {

      setFeedImage5(feedImage6);
      setFeedImage6(feedImage7);
      setFeedImage7(feedImage8);
      setFeedImage8(feedImage9);
      setFeedImage9(feedImage10);
      setFeedImage10(null);

    } else if (imageNumber === 6) {
        
      setFeedImage6(feedImage7);
      setFeedImage7(feedImage8);
      setFeedImage8(feedImage9);
      setFeedImage9(feedImage10);
      setFeedImage10(null);

    } else if (imageNumber === 7) {

      setFeedImage7(feedImage8);
      setFeedImage8(feedImage9);
      setFeedImage9(feedImage10);
      setFeedImage10(null);

    } else if (imageNumber === 8) {

      setFeedImage8(feedImage9);
      setFeedImage9(feedImage10);
      setFeedImage10(null);

    } else if (imageNumber === 9) {
        
      setFeedImage9(feedImage10);
      setFeedImage10(null);

    } else if (imageNumber === 10) {

      setFeedImage10(null);

    }


  }

  

  const [feedTitle, setFeedTitle] = useState('');

  const [hiddenYn, setHiddenYn] = useState(false);



  const [isRegistering, setIsRegistering] = useState(false);

  const registerFeed = async () => {

    setIsRegistering(true);


    try {

      setError(null);

      // json post parameter
      const param = {
        userId: userId,
        email: userEmail,
        name: userName,
        nickname: userNickname,
        avatar: userAvatar,

        mealDate: mealDate,
        mealTime: mealTime,

        mealFood: mealFood,

        mealAmount: mealAmount,
        mealSpeed: mealSpeed,
        feedbackYn: feedbackYn,


        feedImage1: feedImage1,
        feedImage2: feedImage2,
        feedImage3: feedImage3,
        feedImage4: feedImage4,
        feedImage5: feedImage5,
        feedImage6: feedImage6,
        feedImage7: feedImage7,
        feedImage8: feedImage8,
        feedImage9: feedImage9,
        feedImage10: feedImage10,

       

        feedTitle: feedTitle,
        feedContent: feedTitle,
        hiddenYn: hiddenYn ? 'Y' : 'N',
      };

      const res = await fetch(`/api/vienna/feed/registerOneJson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(param),
      });


      if (res.status === 200) {

        const json = await res?.json();



        if (json === undefined) {
          //alert("이메일이 이미 존재합니다.");

          setIsRegistering(false);

          return;

        } else {

          const data = json as any;

          console.log("registerOneJson data : " + data?.data);


      
          if (data?.data?.id)  {
            ///window.location.href = "/";

            ///window.location.href = `/usermain/user/profile-edit/${email}  `;
            ///window.location.href = `/usermain/feeds/write2/${data?.data?.id}  `;

            // history back
            ///window.history.back();

            window.location.href = `/usermain/feeds/my`;


          } else {
            //alert(json.message);
          }    

        }


      } else {

        setIsRegistering(false);
        
        return;
      }

    } catch (error) {

      setIsRegistering(false);

      console.log(error);
      //setError(error);
    }

  }





  const register = async () => {

    setLoading(true);


    try {

      setError(null);

      // json post parameter
      const param = {
        userId: userId,
        email: userEmail,
        name: userName,
        nickname: userNickname,
        avatar: userAvatar,

        mealDate: mealDate,
        mealTime: mealTime,

        mealFood: mealFood,

        mealAmount: mealAmount,
        mealSpeed: mealSpeed,
        feedbackYn: feedbackYn,
      };

      const res = await fetch(`/api/vienna/feed/registerOneJson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(param),
      });


      if (res.status === 200) {

        const json = await res?.json();



        if (json === undefined) {
          //alert("이메일이 이미 존재합니다.");

          setLoading(false);

          return;
        } else {

          const data = json as any;

          console.log("registerOneJson data : " + data?.data);


      
          if (data?.data?.id)  {
            ///window.location.href = "/";

            ///window.location.href = `/usermain/user/profile-edit/${email}  `;
            window.location.href = `/usermain/feeds/write2/${data?.data?.id}  `;
          } else {
            //alert(json.message);
          }    

        }


      } else {
        
        return;
      }

    } catch (error) {

      setLoading(false);

      console.log(error);
      //setError(error);
    }

  }



  console.log("feedEmail : " + feedEmail);
  console.log("session?.user?.email : " + session?.user?.email);


  /* 피드 페이지가 없으면 해당 페이지가 없다고 보여준다. */
  /*
  if ( _id !== "1" &&   !feedEmail ) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-2xl font-bold">피드가 없습니다.</div>
        <button
          onClick={() => signIn()}
          className="bg-dark text-white px-4 py-2 rounded-md"
        >
          로그인
        </button>
      </div>
    );
  }
  */
  




  /* 로그인한 사용자와 글쓴이가 다르면 읽기만 가능한 페이지로 이동한다.

  goto feed detail page if the user is not the author of the feed
  
  */
  /*
  if ( feedEmail !== '' &&  session?.user?.email !== feedEmail) {

    window.location.href = `/usermain/feeds/${_id}`;

  }
  */



  const changeDate = (date: Date) => {

    // fetch data from API
    // mealTime of the date

    console.log("changeDate date : " + date);




    ///setMealDate(date);

    // format 2013-01-01
    // format 2013-01-01
    const mealDate = `${date.getFullYear()}-${(date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;

    setMealDate(mealDate);

    // release check mark
    setMealTime("");
  }



  const [selectedPage, setSelectedPage] = useState(1);



  /* 로그인이 안되어 있으면 로그인 하라는 메시지를 보여준다. */
  if (!session) {

    window.location.href = "/usermain/user/login";
    
    return (
      <></>

    )
   
  }
  



  /* doingdoit.com 이메일이면 로그아웃 시킨다. */
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

    <div className="bg-dark sticky top-0 z-50 ">

        <Top1
          logo="/usermain/images/logo1.svg"
          topBackgroundColor="#fff"
          topBorderBottom="1px solid #ddd"
          topBoxSizing="border-box"
          frameDivBorderBottom="2px solid #212121"
          frameDivBoxSizing="border-box"
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
        />
    </div>


    {/* page 1 */}

    
    { selectedPage === 1 && (
    

    <div className="min-h-screen relative bg-white w-full overflow-hidden flex flex-col items-center justify-start text-left text-sm text-dark font-menu-off">

      <div className="self-stretch flex flex-col items-center justify-start">
       
        <div className="self-stretch xl:bg-background flex flex-col items-center justify-start xl:py-10 px-0">

          {/*
          <div className="  xl:w-[1000px] flex flex-col items-center justify-start">
          */}

          <div className=" w-full 
          xl:w-[1000px] xl:pl-0 xl:pr-0   flex flex-col items-center justify-start">


            <div className="self-stretch bg-white flex flex-col items-center justify-end p-5 xl:p-10 gap-[20px] xl:gap-[40px]">
              
              <div
                className="self-stretch flex flex-row items-center justify-end pt-0 px-0 pb-5 text-left text-5xl text-dark font-menu-off border-b-[1px] border-solid border-grey-e"
                //style={bread1Style}
              >

                <div className="absolute   inset-x-0 flex items-center justify-center xl:relative xl:justify-start xl:w-full">
                  <div className="relative font-extrabold text-base xl:text-xl">
                    {'피드 작성하기'}
                  </div>
                </div>

                
                <motion.div
                  className="relative flex flex-row items-center justify-center gap-[8px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <button
                    onClick={() => setOpenCloseConfirmModal(true)}
                    className=" no-underline flex"
                  >
                    <Image
                      width="24"
                      height="24"
                      className="relative w-6 h-6 overflow-hidden shrink-0"
                      alt=""
                      src="/usermain/images/x2.svg"
                      
                    />
                  </button>
                </motion.div>
                
              </div>
              

              <div className="self-stretch flex flex-col items-center justify-end gap-[20px] xl:gap-[40px]">
                
                <div className="self-stretch flex flex-row items-center justify-start gap-[8px]">

                  <div className="relative font-extrabold flex items-center w-[72px] shrink-0">
                    <span className="[line-break:anywhere] w-full">
                      <span>일자</span>
                      <span className="text-red">*</span>
                    </span>
                  </div>

                  <div className="flex flex-col items-start justify-center gap-[8px] text-center text-grey-9">
                    
                    <DatePicker
                      //selected={
                        ///mealDate
                        ///new Date(mealDate)

                      //
                    
                      selected={
                        new Date(mealDate ? mealDate : new Date())
                      }

                      ///onChange={(date: Date) => setMealDate(date)}

                      onChange={(date: Date) => {
                        ///setMealDate(date);

                        changeDate(date);

                      }}

                      placeholderText=""
                      showFullMonthYearPicker
                      //popperPlacement="bottom-end"
                      //popperPlacement="bottom"
                      // popper placement center
                      popperPlacement="bottom"
                      

                      className=" w-48 "
                    />

                  </div>


                </div>








                <div className="self-stretch flex flex-row items-center justify-start gap-[8px]">
                  
                  <div className="relative font-extrabold flex items-center w-[72px] shrink-0">
                    
                      <span>식사시간</span>
                      <span className="text-red">*</span>
                    
                  </div>


                  <div className="flex flex-col items-start justify-center gap-[8px] text-center text-grey-9">



                    { mealTimeData?.length > 0 && (
                      <div className="self-stretch flex flex-row items-center justify-start gap-[8px]">


                        <div
                          className=" self-stretch rounded-xl flex flex-col xl:flex-row items-start justify-center p-5 gap-[20px] text-left text-base border-[1px] border-solid border-f1"     
                        >



                          <div className="flex-1 flex flex-col items-start justify-end gap-[8px] text-center text-xs text-grey-6">


                            {meal.breakfast && meal.breakfast?.length > 0 ? (
                              <div className="self-stretch flex flex-row items-center justify-start gap-[12px]">
                                <div className="rounded-81xl bg-grey-f1 flex flex-row items-center justify-center py-1 px-3">
                                  <div className="relative w-8 ">아침</div>
                                </div>
                                <div className="relative text-sm text-dark">
                                  {
                                    //meal.breakfast === '0' ? '-' : meal.breakfast

                                    meal.breakfast && meal.breakfast?.map((item: any) => {
                                      ///return item?.foodName + ', ';
                                      // last item don't add ','
                                      return item?.foodName + (meal.breakfast[meal.breakfast.length-1] === item ? '' : ', ');
                                    } )
                                  }
                                  
                                </div>
                              </div>
                            ) : isExistBreakfast && (
                              <div className="self-stretch flex flex-row items-center justify-start gap-[12px]">
                                <div className="rounded-81xl bg-grey-f1 flex flex-row items-center justify-center py-1 px-3">
                                  <div className="relative w-8">아침</div>
                                </div>
                                <div className="relative text-sm text-dark">
                                  skip(먹지 않았음)
                                </div>
                              </div>
                            )}
                          

                            {meal.lunch && meal.lunch?.length > 0 ? (
                              <div className="self-stretch flex flex-row items-center justify-start gap-[12px]">
                                <div className="rounded-81xl bg-grey-f1 flex flex-row items-center justify-center py-1 px-3">
                                  <div className="relative w-8">점심</div>
                                </div>
                                <div className="relative text-sm text-dark">
                                  {
                                    meal.lunch && meal.lunch?.map((item: any) => {
                                      //return item?.foodName + ', ';
                                      // last item don't add ','
                                      return item?.foodName + (meal.lunch[meal.lunch.length-1] === item ? '' : ', ');
                                    } )
                                  }
                                </div>
                              </div>
                            ) : isExistLunch && (
                              <div className="self-stretch flex flex-row items-center justify-start gap-[12px]">
                                <div className="rounded-81xl bg-grey-f1 flex flex-row items-center justify-center py-1 px-3">
                                  <div className="relative w-8">점심</div>
                                </div>
                                <div className="relative text-sm text-dark">
                                  skip(먹지 않았음)
                                </div>
                              </div>
                            )}
                            

                            {meal.dinner && meal.dinner?.length > 0 ? (
                              <div className="self-stretch flex flex-row items-center justify-start gap-[12px]">
                                <div className="rounded-81xl bg-grey-f1 flex flex-row items-center justify-center py-1 px-3">
                                  <div className="relative w-8">저녁</div>
                                </div>
                                <div className="relative text-sm text-dark">
                                  {
                                    meal.dinner && meal.dinner?.map((item: any) => {
                                      //return item?.foodName + ', ';
                                      // last item don't add ','
                                      return item?.foodName + (meal.dinner[meal.dinner.length-1] === item ? '' : ', ');
                                    } )
                                  }
                                </div>
                              </div>
                            ) : isExistDinner && (
                              <div className="self-stretch flex flex-row items-center justify-start gap-[12px]">
                                <div className="rounded-81xl bg-grey-f1 flex flex-row items-center justify-center py-1 px-3">
                                  <div className="relative w-8">저녁</div>
                                </div>
                                <div className="relative text-sm text-dark">
                                  skip(먹지 않았음)
                                </div>
                              </div>
                            )}

                            
                            {meal.snack && meal.snack?.length > 0 ? (
                              <div className="self-stretch flex flex-row items-center justify-start gap-[12px]">
                                <div className="rounded-81xl bg-grey-f1 flex flex-row items-center justify-center py-1 px-3">
                                  <div className="relative w-8">간식</div>
                                </div>
                                <div className="relative text-sm text-dark">
                                  {
                                    meal.snack && meal.snack?.map((item: any) => {
                                      ////return item?.foodName + ', ';
                                      // last item don't add ','
                                      return item?.foodName + (meal.snack[meal.snack.length-1] === item ? '' : ', ');
                                    } )
                                  }
                                </div>
                              </div>
                            ) : isExistSnack && (
                              <div className="self-stretch flex flex-row items-center justify-start gap-[12px]">
                                <div className="rounded-81xl bg-grey-f1 flex flex-row items-center justify-center py-1 px-3">
                                  <div className="relative w-8">간식</div>
                                </div>
                                <div className="relative text-sm text-dark">
                                  skip(먹지 않았음)
                                </div>
                              </div>
                            )}

                            {meal.midnightSnack && meal.midnightSnack?.length > 0 ? (
                              <div className="self-stretch flex flex-row items-center justify-start gap-[12px]">
                                <div className="rounded-81xl bg-grey-f1 flex flex-row items-center justify-center py-1 px-3">
                                  <div className="relative w-8">야식</div>
                                </div>
                                <div className="relative text-sm text-dark">
                                  {
                                    meal.midnightSnack && meal.midnightSnack?.map((item: any) => {
                                      ////return item?.foodName + ', ';
                                      // last item don't add ','
                                      return item?.foodName + (meal.midnightSnack[meal.midnightSnack.length-1] === item ? '' : ', ');
                                    } )
                                  }
                                </div>
                              </div>
                            ) : isExistNightSnack && (
                              <div className="self-stretch flex flex-row items-center justify-start gap-[12px]">
                                <div className="rounded-81xl bg-grey-f1 flex flex-row items-center justify-center py-1 px-3">
                                  <div className="relative w-8">야식</div>
                                </div>
                                <div className="relative text-sm text-dark">
                                  skip(먹지 않았음)
                                </div>
                              </div>
                            )}
                            

                          
                          </div>

                        </div>

                      </div>
                    )}

                   
                    {/* 피드를 모두 작성하셨습니다. */}

                    { isExistBreakfast && isExistLunch && isExistDinner && isExistSnack && isExistNightSnack ? (
                      
                      <div className="self-stretch flex flex-row items-center justify-start gap-[12px]">
                        <div className="relative">

                          <span className="text-red">*</span>
                          <span>{' '}피드를 모두 작성하셨습니다.</span>

                        </div>
                      </div>

                    ) : (
                      <>



                    <div className="flex flex-row items-center justify-center text-xs xl:text-sm ">
   
                   
                      
                      {!isExistBreakfast && (
                      <button

                        disabled={isExistBreakfast}

                        onClick = {() => setMealTime("아침")}

                        //className=`{"bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"}`
                        //className="bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"

                        className={`  ${ mealTime === "아침" ? "bg-dark text-white  font-extrabold " : "bg-grey-f1  " }   w-[50px]  xl:w-[100px] h-11 flex flex-row items-center justify-center `}
                      >
                        아침
                        {/* if isExistBreakfast, then check mark */}
                        {isExistBreakfast && (
                          <Image
                            width="24"
                            height="24"
                            className={`relative w-3 h-3 ml-2 `}
                            alt=""
                            src="/usermain/images/outlinecheck2.svg"
                          />
                        )}
                      </button>
                      )}

                      {!isExistLunch && (
                      <button

                        disabled={isExistLunch}

                        onClick = {() => setMealTime("점심")}

                        //className=`{"bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"}`
                        //className="bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"

                        className={`

                          ${ mealTime === "점심" ? "bg-dark text-white font-extrabold" : "bg-grey-f1 " } w-[50px]  xl:w-[100px] h-11 flex flex-row items-center justify-center `}
                      >
                        점심

                        {isExistLunch && (
                          <Image
                            width="24"
                            height="24"
                            className={`relative w-3 h-3 ml-2 `}
                            alt=""
                            src="/usermain/images/outlinecheck2.svg"
                          />
                        )}

                      </button>
                      )}

                      {!isExistDinner && (
                      <button

                        disabled={isExistDinner}

                        onClick = {() => setMealTime("저녁")}

                        //className=`{"bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"}`
                        //className="bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"

                        className={`  ${ mealTime === "저녁" ? "bg-dark text-white font-extrabold" : "bg-grey-f1 " } w-[50px]  xl:w-[100px] h-11 flex flex-row items-center justify-center `}
                      >
                        저녁

                        {isExistDinner && (
                          <Image
                            width="24"
                            height="24"
                            className={`relative w-3 h-3 ml-2 `}
                            alt=""
                            src="/usermain/images/outlinecheck2.svg"
                          />
                        )}

                      </button>
                      )}

                      {!isExistSnack && (

                      <button

                        disabled={isExistSnack}


                        onClick = {() => setMealTime("간식")}

                        //className=`{"bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"}`
                        //className="bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"

                        className={`
                          
                          

                          ${ mealTime === "간식" ? "bg-dark text-white font-extrabold" : "bg-grey-f1 " } w-[50px]  xl:w-[100px] h-11 flex flex-row items-center justify-center `}
                      >
                        간식

                        {isExistSnack && (
                          <Image
                            width="24"
                            height="24"
                            className={`relative w-3 h-3 ml-2 `}
                            alt=""
                            src="/usermain/images/outlinecheck2.svg"
                          />
                        )}

                      </button>
                      )}

                      {!isExistNightSnack && (

                      <button

                        disabled={isExistNightSnack}

                        onClick = {() => setMealTime("야식")}

                        //className=`{"bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"}`
                        //className="bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"

                        className={`  ${ mealTime === "야식" ? "bg-dark text-white font-extrabold" : "bg-grey-f1 " } w-[50px]  xl:w-[100px] h-11 flex flex-row items-center justify-center `}
                      >
                        야식

                        {isExistNightSnack && (
                          <Image
                            width="24"
                            height="24"
                            className={`relative w-3 h-3 ml-2 `}
                            alt=""
                            src="/usermain/images/outlinecheck2.svg"
                          />
                        )}
                        
                      </button>
                      )}

                    </div>
                  

                    {/* skip(먹지 않았음) 체크박스 dark color */}
                    <div className="flex flex-row items-center justify-center gap-[8px] text-left text-xs text-dark">
                      <input
                        
                        disabled={
                          mealTime !== "아침" && mealTime !== "점심" && mealTime !== "저녁" && mealTime !== "간식" && mealTime !== "야식"
                        }
                        checked={mealSkip}
                        type="checkbox"
                        id="skip"
                        name="skip"
                        value="skip"
                        // dark color input checkbox
                        className="w-5 h-5
                        text-dark  border-[1px] border-solid border-dark
                        "
                        onChange={(e) => {
                          
                          if (e.target.checked) {
                            ///setMealTime("skip");
                            
                            setMealSkip(true);

                            setMealFood([]);
                            setMealAmount(0);
                            setMealSpeed(0);


                          } else {
                            ///setMealTime("아침");
                            
                            setMealSkip(false);

                          }
                          

                        } }
                      />
                      <label htmlFor="skip">skip(먹지 않았음)</label>
                    </div>

                    </>
                    )}


                  </div>
                </div>


                {!mealSkip &&
                ( !isExistBreakfast || !isExistLunch || !isExistDinner || !isExistSnack || !isExistNightSnack ) && (
                
                
                
                <div className="self-stretch flex flex-col items-start justify-center gap-[12px]">
                  <div className="self-stretch flex flex-row items-center justify-start gap-[12px]">
                    <div className="relative">
                      <span>
                        <span className="font-extrabold">
                          <span>음식을 선택하세요</span>
                          <span className="text-xs">.</span>
                        </span>
                        <span className="text-xs">
                          <span className="font-menu-off">(최대 10개)</span>
                        </span>
                      </span>
                      <span className="font-extrabold text-red">*</span>
                    </div>
                    
                    {/* 찾기 버튼 */}
                    {/*
                    <div className="rounded-81xl bg-white flex flex-row items-center justify-start py-2 px-5 text-center text-xs border-[1px] border-solid border-dark">
                      <div className="relative font-extrabold">찾기</div>
                    </div>
                    */}
                    <button
                      ///onClick = {() =>  handleTabClick("음식선택")}
                      onClick = {() =>  handleTabClick("followers")}
                    >
                    <div className="rounded-81xl bg-white flex flex-row items-center justify-start py-2 px-5 text-center text-xs border-[1px] border-solid border-dark">

                      <div className="relative font-extrabold">찾기</div>
                      
                    </div>
                    </button>

                  </div>

                  <div className="flex flex-row items-center justify-center gap-[8px]">

                    {/*
                    <Tag
                      prop="케잌"
                      x="/usermain/images/x.svg"
                      tagBackgroundColor="#f1f1f1"
                      divColor="#999"
                    />
                    <Tag
                      prop="아메리카노"
                      x="/usermain/images/x3.svg"
                      tagBackgroundColor="#212121"
                      divColor="#fff"
                    />
                    */}
                    

                    {/*
                        <div
                        className="rounded-81xl bg-grey-f1 flex flex-row items-center justify-start py-3 px-5 gap-[20px] text-center text-xs text-grey-9 font-menu-off"
                        style={tagStyle}
                      >
                        <div className="relative font-extrabold" style={divStyle}>
                          {prop}
                        </div>
                        <img
                          className="relative w-4 h-4 overflow-hidden shrink-0"
                          alt=""
                          src={x}
                        />
                      </div>
                    */}


                    {mealFood?.length > 0 && (
                      <div
                        className="mt-0 flex flex-wrap gap-2"
                      >

                        {mealFood?.map(( item , index) => (

                          <div
                            key={index}
                            //className="flex items-center rounded-full border border-gray-300 py-1 pe-2.5 ps-3 text-sm font-medium text-gray-700"
                            className="rounded-81xl bg-[#212121] flex flex-row items-center justify-start py-3 px-5 gap-[20px] text-center text-xs text-grey-9 font-menu-off"
                          >
                            <div className="relative font-extrabold text-white  ">
                              {
                                item?.foodName
                              }
                            </div>
                            <button
                              ////onClick={() => handleItemRemove( item?.foodName )}

                              onClick={() => {

                                //const updatedItems = mealFood.filter((item) => item?.foodName !== text);

                                //setMealFood(updatedItems);

                                const updatedItems = mealFood.filter((data) => data?.id !== item?.id);

                                setMealFood(updatedItems);


                              } }
                            >
                              {/*
                              <PiXBold className="h-3.5 w-3.5" />
                              */}
                               <img
                                className="relative w-4 h-4 overflow-hidden shrink-0"
                                alt=""
                                src={'/usermain/images/x3.svg'}
                                />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </div>

                )}



                {!mealSkip &&
                ( !isExistBreakfast || !isExistLunch || !isExistDinner || !isExistSnack || !isExistNightSnack ) && (
                
                <div className="self-stretch flex flex-col items-start justify-center gap-[8px] text-left text-xs text-dark font-menu-off">
                  
                  <div className="self-stretch relative">
                    <span>
                      <span className="text-sm font-extrabold font-menu-off">
                        {"식사량"}
                      </span>
                      <span>{"(1인분 기준으로 식사량은 어땠나요?)"}</span>
                    </span>
                    <span className="text-sm font-extrabold text-red">*</span>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-[4px] text-grey-9">

                    <div className="flex flex-row items-center justify-center gap-[2px]">


                      {/*}
                      <div className="bg-grey-e w-[60px] h-8" />
                      <div className="bg-grey-e w-[60px] h-8" />
                      <div className="bg-dark w-[60px] h-8 flex flex-row items-center justify-center">
                        <Image
                          width="24"
                          height="24"
                          className="relative w-3 h-3 overflow-hidden shrink-0"
                          alt=""
                          src="/usermain/images/outlinecheck2.svg"
                        />
                      </div>
                      <div className="bg-grey-e w-[60px] h-8" />
                      <div className="bg-grey-e w-[60px] h-8" />
                      */}

                      {/* 식사량 선택버튼 */}
                      <button
                        onClick = {() => setMealAmount(1)}

                        //className=`{"bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"}`
                        //className="bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"

                        className={`  ${ mealAmount === 1 ? "bg-dark text-white" : "bg-grey-f1 " } w-[60px] h-8 flex flex-row items-center justify-center `}
                      >

                            <Image
                            width="24"
                            height="24"
                            className={`relative w-3 h-3 overflow-hidden shrink-0 ${ mealAmount === 1 ? "visible" : "hidden" } `}
                            alt=""
                            src="/usermain/images/outlinecheck2.svg"
                          />
                        
                        
                      </button>
                      <button
                        onClick = {() => setMealAmount(2)}

                        //className=`{"bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"}`
                        //className="bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"

                        className={`  ${ mealAmount === 2 ? "bg-dark text-white" : "bg-grey-f1 " } w-[60px] h-8 flex flex-row items-center justify-center `}
                      >
                            <Image
                            width="24"
                            height="24"
                            className={`relative w-3 h-3 overflow-hidden shrink-0 ${ mealAmount === 2 ? "visible" : "hidden" } `}
                            alt=""
                            src="/usermain/images/outlinecheck2.svg"
                          />
                        
                      </button>

                      <button
                        onClick = {() => setMealAmount(3)}

                        //className=`{"bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"}`
                        //className="bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"

                        className={`  ${ mealAmount === 3 ? "bg-dark text-white" : "bg-grey-f1 " } w-[60px] h-8 flex flex-row items-center justify-center `}
                      >
                        
                            <Image
                            width="24"
                            height="24"
                            className={`relative w-3 h-3 overflow-hidden shrink-0 ${ mealAmount === 3 ? "visible" : "hidden" } `}
                            alt=""
                            src="/usermain/images/outlinecheck2.svg"
                          />
                        
                      </button>

                      <button
                        onClick = {() => setMealAmount(4)}

                        //className=`{"bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"}`
                        //className="bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"

                        className={`  ${ mealAmount === 4 ? "bg-dark text-white" : "bg-grey-f1 " } w-[60px] h-8 flex flex-row items-center justify-center `}
                      >

                            <Image
                            width="24"
                            height="24"
                            className={`relative w-3 h-3 overflow-hidden shrink-0 ${ mealAmount === 4 ? "visible" : "hidden" } `}
                            alt=""
                            src="/usermain/images/outlinecheck2.svg"
                          />
                        
                      </button>

                      <button
                        onClick = {() => setMealAmount(5)}

                        //className=`{"bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"}`
                        //className="bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"

                        className={`  ${ mealAmount === 5 ? "bg-dark text-white" : "bg-grey-f1 " } w-[60px] h-8 flex flex-row items-center justify-center `}
                      >

                            <Image
                            width="24"
                            height="24"
                            className={`relative w-3 h-3 overflow-hidden shrink-0 ${ mealAmount === 5 ? "visible" : "hidden" } `}
                            alt=""
                            src="/usermain/images/outlinecheck2.svg"
                          />
                        
                      </button>




                    </div>

                    <div className="self-stretch flex flex-row items-center justify-center">

                      <div className="flex-1 relative font-extrabold">{"적게"}</div>
                      <div className="flex-1 relative font-extrabold text-dark text-center">
                        {"보통"}
                      </div>
                      <div className="flex-1 relative font-extrabold text-right">
                        {"많이"}
                      </div>

                    </div>

                  </div>
                </div>
                )}



                {!mealSkip &&
                ( !isExistBreakfast || !isExistLunch || !isExistDinner || !isExistSnack || !isExistNightSnack ) && (
                
                <div className="self-stretch flex flex-col items-start justify-center gap-[8px] text-left text-xs text-dark font-menu-off">
                  <div className="self-stretch relative">
                    <span>
                      <span className="text-sm font-extrabold font-menu-off">
                        {"식사 소요시간"}
                      </span>
                      <span>{"(15분 기준으로 어땠나요?)"}</span>
                    </span>
                    <span className="text-sm font-extrabold text-red">*</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-[4px] text-grey-9">

                    <div className="flex flex-row items-center justify-center gap-[2px]">


                      {/*}
                      <div className="bg-grey-e w-[60px] h-8" />
                      <div className="bg-grey-e w-[60px] h-8" />
                      <div className="bg-dark w-[60px] h-8 flex flex-row items-center justify-center">
                        <Image
                          width="24"
                          height="24"
                          className="relative w-3 h-3 overflow-hidden shrink-0"
                          alt=""
                          src="/usermain/images/outlinecheck2.svg"
                        />
                      </div>
                      <div className="bg-grey-e w-[60px] h-8" />
                      <div className="bg-grey-e w-[60px] h-8" />
                      */}

                      {/* 식사량 선택버튼 */}
                      <button
                        onClick = {() => setMealSpeed(1)}

                        //className=`{"bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"}`
                        //className="bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"

                        className={`  ${ mealSpeed === 1 ? "bg-dark text-white" : "bg-grey-f1 " } w-[60px] h-8 flex flex-row items-center justify-center `}
                      >
                        <img
                          className={`relative w-3 h-3 overflow-hidden shrink-0 ${ mealSpeed === 1 ? "visible" : "hidden" } `}
                          alt=""
                          src="/usermain/images/outlinecheck2.svg"
                        />
                      </button>
                      <button
                        onClick = {() => setMealSpeed(2)}

                        //className=`{"bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"}`
                        //className="bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"

                        className={`  ${ mealSpeed === 2 ? "bg-dark text-white" : "bg-grey-f1 " } w-[60px] h-8 flex flex-row items-center justify-center `}
                      >
                        <img
                          className={`relative w-3 h-3 overflow-hidden shrink-0 ${ mealSpeed === 2 ? "visible" : "hidden" } `}
                          alt=""
                          src="/usermain/images/outlinecheck2.svg"
                        />
                      </button>

                      <button
                        onClick = {() => setMealSpeed(3)}

                        //className=`{"bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"}`
                        //className="bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"

                        className={`  ${ mealSpeed === 3 ? "bg-dark text-white" : "bg-grey-f1 " } w-[60px] h-8 flex flex-row items-center justify-center `}
                      >
                        <img
                          className={`relative w-3 h-3 overflow-hidden shrink-0 ${ mealSpeed === 3 ? "visible" : "hidden" } `}
                          alt=""
                          src="/usermain/images/outlinecheck2.svg"
                        />
                      </button>

                      <button
                        onClick = {() => setMealSpeed(4)}

                        //className=`{"bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"}`
                        //className="bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"

                        className={`  ${ mealSpeed === 4 ? "bg-dark text-white" : "bg-grey-f1 " } w-[60px] h-8 flex flex-row items-center justify-center `}
                      >
                        <img
                          className={`relative w-3 h-3 overflow-hidden shrink-0 ${ mealSpeed === 4 ? "visible" : "hidden" } `}
                          alt=""
                          src="/usermain/images/outlinecheck2.svg"
                        />
                      </button>

                      <button
                        onClick = {() => setMealSpeed(5)}

                        //className=`{"bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"}`
                        //className="bg-grey-f1 w-[100px] h-11 flex flex-row items-center justify-center"

                        className={`  ${ mealSpeed === 5 ? "bg-dark text-white" : "bg-grey-f1 " } w-[60px] h-8 flex flex-row items-center justify-center `}
                      >
                        <img
                          className={`relative w-3 h-3 overflow-hidden shrink-0 ${ mealSpeed === 5 ? "visible" : "hidden" } `}
                          alt=""
                          src="/usermain/images/outlinecheck2.svg"
                        />
                      </button>

                    </div>

                    <div className="self-stretch flex flex-row items-center justify-center">

                      <div className="flex-1 relative font-extrabold">{"천친히"}</div>
                      <div className="flex-1 relative font-extrabold text-dark text-center">
                        {"보통"}
                      </div>
                      <div className="flex-1 relative font-extrabold text-right">
                        {"빠르게"}
                      </div>

                    </div>
                    
                  </div>
                </div>
                )}



                
              </div>
            </div>

            {/* stikcy bottom */}

            <div className=" hidden xl:flex w-full">
            
            {
            (mealTime !== "" && mealFood?.length > 0 && mealAmount !== 0 && mealSpeed !== 0
            && mealTime !== undefined && mealFood !== undefined && mealAmount !== undefined && mealSpeed !== undefined)
            ||
            ( mealTime !== "" && mealTime !== undefined && mealSkip === true)

            
            ? (
              <div className="flex w-full">

                { isExistBreakfast && isExistLunch && isExistDinner && isExistSnack && isExistNightSnack ? (
                  <>  </>
                ) : (
    

                  <button
                    ///</div>onClick={register}

                    onClick={
                      () => {
                        setSelectedPage(2);
                      }
                    }

                    className="w-full self-stretch flex flex-row items-center justify-center p-5  text-center text-base text-white font-bold bg-dark"
                  >
                    <div className="relative">{"다음"}</div>
                  </button>

                ) }

              </div>
  
            ) : (

              <div className="flex w-full">

               { isExistBreakfast && isExistLunch && isExistDinner && isExistSnack && isExistNightSnack ? (

                  <>  </>
                
                  ) : (

                  <button
                    className="w-full self-stretch flex flex-row items-center justify-center p-5  text-center text-base text-dark font-bold bg-grey-f1"
                    
                    onClick= {() => {
                      toast.error(
                        '필수 입력값을 모두 입력해주세요.',
                        {
                          //position: 'top-right',
                        }
                      );
                    } }
                  >
                    <div className="relative">{"다음"}</div>
                  </button>

                               
                ) }

              </div>

            )}
            </div>
              
            

           

          </div>
        </div>
      </div>




    
      
      <div className="hidden xl:block">
        <Footer
          footerAlignSelf="stretch"
          footerBorderTop="1px solid #eee"
          footerBoxSizing="border-box"
          
        />
      </div>
      
      {/* 다음 button sticky bottom */}

      {
      (mealTime !== "" && mealFood?.length > 0 && mealAmount !== 0 && mealSpeed !== 0
      && mealTime !== undefined && mealFood !== undefined && mealAmount !== undefined && mealSpeed !== undefined)
      ||
      ( mealTime !== "" && mealTime !== undefined && mealSkip === true)
      ? (
        <button
          className="fixed bottom-0 w-full xl:hidden"
          //onClick={register}

          onClick={
            () => {
              setSelectedPage(2);
            }
          }
        >
          <div className="relative flex flex-row items-center justify-center p-5 text-center text-base text-white font-bold bg-dark">
            {"다음"}
          </div>

        </button>
      ) : (
        <button
          className="fixed bottom-0 w-full xl:hidden"
          onClick= {() => {
            toast.error(
              '필수 입력값을 모두 입력해주세요.',
              {
                //position: 'top-right',
              }
            );
          } }
        >
          <div className="relative flex flex-row items-center justify-center p-5 text-center text-base text-dark font-bold bg-grey-f1">
            {"다음"}
          </div>

        </button>
      )} 


    </div>



    )}



    { selectedPage === 2 && (

    <div className="relative bg-white w-full overflow-hidden flex flex-col items-center justify-start text-left text-xs text-dark font-menu-off">
      <div className="self-stretch flex flex-col items-center justify-start">
       
        <div className="self-stretch xl:bg-background flex flex-col items-center justify-start py-5 xl:py-10">
          <div className=" w-full 
          xl:w-[1000px]   flex flex-col items-center justify-start">

            <div className=" 
            self-stretch bg-white flex flex-col items-center justify-end  p-5 xl:p-10 gap-[20px] xl:gap-[40px]">
              
  
              <div
                className="self-stretch flex flex-row items-center justify-between pt-0 px-0 pb-5 text-left text-5xl text-dark font-menu-off border-b-[1px] border-solid border-grey-e"
                //style={bread1Style}
              >
                <div className="relative tracking-[-0.02em] font-extrabold">
                  {'피드 작성하기'}
                </div>

                <button
                  onClick={() => {
                    setOpenCloseConfirmModal(true);
                  }}
                  className=" no-underline flex"
                >
                <Image
                  width="24"
                  height="24"
                  className="relative w-6 h-6 overflow-hidden shrink-0"
                  alt=""
                  src="/usermain/images/x2.svg"
                />
                </button>
              </div>
              
              
              <div className="self-stretch flex flex-col items-center justify-end gap-[40px]">
                

                {/* feed */}
                {/*
                {feed?.mealFood?.length === 0 && (
                  <div className="self-stretch flex flex-col items-center justify-center gap-[12px] text-sm">
                    <div className="self-stretch relative font-extrabold">
                      skip(먹지 않았음)
                    </div>
                  </div>
                )}
                */}

                    

                



                <div className="self-stretch flex flex-col items-start justify-center gap-[12px] text-sm">

                  
                  
                  <div className="self-stretch relative font-extrabold">
                    <span>이미지</span>
                  </div>
                  

                  {/* image upload */}

                  <div className="flex flex-row gap-2 items-center justify-center ">


                    { !feedImage1 && (
                      <div className="grid grid-cols-5 xl:grid-cols-10 gap-2 w-14 h-14 xl:w-20 xl:h-20">
                        <Uploader
                          number={0}
                          onSave={(url: string) => {
                            addUploadedImage(1, url);
                          }}
                        />
                      </div>
                    )}


                    
                    { feedImage1 && !feedImage2 && (
                      <div className="grid grid-cols-5 xl:grid-cols-10 gap-2">

                        <Uploader
                          number={1}
                          onSave={(url: string) => {
                            addUploadedImage(2, url);
                          }}
                        />

                        <div className="flex flex-col items-center justify-center ">
                          
                          <Image
                            src={feedImage1}
                            alt="food image"
                            width={150}
                            height={150}
                            className="relative  w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                            style={{objectFit: 'cover'}}
                          />

                          {/* remove button for image 1 */}
                          <button
                            onClick={() => removeFeedImage(1)}
                            //className="absolute top-0 right-0"
                          >
                            <Image
                              src="/usermain/images/x2.svg"
                              alt="remove image"
                              width={20}
                              height={20}
                              className="mt-2 relative w-5 h-5 rounded-sm overflow-hidden shrink-0 "
                              style={{objectFit: 'cover'}}
                            />
                          </button>

                        </div>
                        

                      </div>

                    )}

                    { feedImage1 && feedImage2 && !feedImage3 && (
                      <div className="grid grid-cols-5 xl:grid-cols-10 gap-2">
                        <Uploader
                          number={2}
                          onSave={(url: string) => {
                            addUploadedImage(3, url);
                          }}
                        />

                        <div className="flex flex-col items-center justify-center ">
                          <Image
                            src={feedImage1}
                            alt="food image"
                            width={150}
                            height={150}
                            className="relative w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                            style={{objectFit: 'cover'}}
                          />
                          <button
                            onClick={() => removeFeedImage(1)}
                          >
                            <Image
                              src="/usermain/images/x2.svg"
                              alt="remove image"
                              width={20}
                              height={20}
                              className="mt-2 relative w-5 h-5 rounded-sm overflow-hidden shrink-0 "
                              style={{objectFit: 'cover'}}
                            />
                          </button>
                        </div>

                        <div className="flex flex-col items-center justify-center ">
                          <Image
                            src={feedImage2}
                            alt="food image"
                            width={150}
                            height={150}
                            className="relative w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                            style={{objectFit: 'cover'}}
                          />
                          <button
                            onClick={() => removeFeedImage(2)}
                          >
                            <Image
                              src="/usermain/images/x2.svg"
                              alt="remove image"
                              width={20}
                              height={20}
                              className="mt-2 relative w-5 h-5 rounded-sm overflow-hidden shrink-0 "
                              style={{objectFit: 'cover'}}
                            />
                          </button>
                        </div>

                      </div>
                    )}
               

                    { feedImage1 && feedImage2 && feedImage3 && !feedImage4 && (
                      <div className="grid grid-cols-5 xl:grid-cols-10 gap-2">

                        <Uploader
                          number={3}
                          onSave={(url: string) => {
                            addUploadedImage(4, url);
                          }}
                        />
                         
                         <div className="flex flex-col items-center justify-center ">
                          <Image
                            src={feedImage1}
                            alt="food image"
                            width={150}
                            height={150}
                            className="relative w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                            style={{objectFit: 'cover'}}
                          />
                          <button
                            onClick={() => removeFeedImage(1)}
                          >
                            <Image
                              src="/usermain/images/x2.svg"
                              alt="remove image"
                              width={20}
                              height={20}
                              className="mt-2 relative w-5 h-5 rounded-sm overflow-hidden shrink-0 "
                              style={{objectFit: 'cover'}}
                            />
                          </button>
                        </div>

                        <div className="flex flex-col items-center justify-center ">
                          <Image
                            src={feedImage2}
                            alt="food image"
                            width={150}
                            height={150}
                            className="relative w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                            style={{objectFit: 'cover'}}
                          />
                          <button
                            onClick={() => removeFeedImage(2)}
                          >
                            <Image
                              src="/usermain/images/x2.svg"
                              alt="remove image"
                              width={20}
                              height={20}
                              className="mt-2 relative w-5 h-5 rounded-sm overflow-hidden shrink-0 "
                              style={{objectFit: 'cover'}}
                            />
                          </button>
                        </div>


                        <div className="flex flex-col items-center justify-center ">
                          <Image
                            src={feedImage3}
                            alt="food image"
                            width={150}
                            height={150}
                            className="relative w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                            style={{objectFit: 'cover'}}
                          />
                          <button
                            onClick={() => removeFeedImage(3)}
                          >
                            <Image
                              src="/usermain/images/x2.svg"
                              alt="remove image"
                              width={20}
                              height={20}
                              className="mt-2 relative w-5 h-5 rounded-sm overflow-hidden shrink-0 "
                              style={{objectFit: 'cover'}}
                            />
                          </button>
                        </div>


                      </div>
                    )}


                    { feedImage1 && feedImage2 && feedImage3 && feedImage4 && !feedImage5 && (
                      <div className="grid grid-cols-5 xl:grid-cols-10 gap-2">

                        <Uploader
                          number={4}
                          onSave={(url: string) => {
                            addUploadedImage(5, url);
                          }}
                        />

                        <div className="flex flex-col items-center justify-center ">
                         <Image
                          src={feedImage1}
                          alt="food image"
                          width={150}
                          height={150}
                          className="relative w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                          style={{objectFit: 'cover'}}
                        />
                        <button
                          onClick={() => removeFeedImage(1)}
                        >
                          <Image
                            src="/usermain/images/x2.svg"
                            alt="remove image"
                            width={20}
                            height={20}
                            className="mt-2 relative w-5 h-5 rounded-sm overflow-hidden shrink-0 "
                            style={{objectFit: 'cover'}}
                          />
                        </button>
                        </div>

                        <div className="flex flex-col items-center justify-center ">
                        <Image
                          src={feedImage2}
                          alt="food image"
                          width={150}
                          height={150}
                          className="relative w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                          style={{objectFit: 'cover'}}
                        />
                        <button
                          onClick={() => removeFeedImage(2)}
                        >
                          <Image
                            src="/usermain/images/x2.svg"
                            alt="remove image"
                            width={20}
                            height={20}
                            className="mt-2 relative w-5 h-5 rounded-sm overflow-hidden shrink-0 "
                            style={{objectFit: 'cover'}}
                          />
                        </button>
                        </div>

                        <div className="flex flex-col items-center justify-center ">
                        <Image
                          src={feedImage3}
                          alt="food image"
                          width={150}
                          height={150}
                          className="relative w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                          style={{objectFit: 'cover'}}
                        />
                        <button
                          onClick={() => removeFeedImage(3)}
                        >
                          <Image
                            src="/usermain/images/x2.svg"
                            alt="remove image"
                            width={20}
                            height={20}
                            className="mt-2 relative w-5 h-5 rounded-sm overflow-hidden shrink-0 "
                            style={{objectFit: 'cover'}}
                          />
                        </button>
                        </div>

                        <div className="flex flex-col items-center justify-center ">
                        <Image
                          src={feedImage4}
                          alt="food image"
                          width={150}
                          height={150}
                          className="relative w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                          style={{objectFit: 'cover'}}
                        />
                        <button
                          onClick={() => removeFeedImage(4)}
                        >
                          <Image
                            src="/usermain/images/x2.svg"
                            alt="remove image"
                            width={20}
                            height={20}
                            className="mt-2 relative w-5 h-5 rounded-sm overflow-hidden shrink-0 "
                            style={{objectFit: 'cover'}}
                          />
                        </button>
                        </div>


                      </div>
                    )}


                    { feedImage1 && feedImage2 && feedImage3 && feedImage4 && feedImage5 && !feedImage6 && (
                      <div className="grid grid-cols-5 xl:grid-cols-10 gap-2">


                        <Uploader
                          number={5}
                          onSave={(url: string) => {
                            addUploadedImage(6, url);
                          }}
                        />

                        <div className="flex flex-col items-center justify-center ">
                         <Image
                          src={feedImage1}
                          alt="food image"
                          width={150}
                          height={150}
                          className="relative w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                          style={{objectFit: 'cover'}}
                        />
                        <button
                          onClick={() => removeFeedImage(1)}
                        >
                          <Image
                            src="/usermain/images/x2.svg"
                            alt="remove image"
                            width={20}
                            height={20}
                            className="mt-2 relative w-5 h-5 rounded-sm overflow-hidden shrink-0 "
                            style={{objectFit: 'cover'}}
                          />
                        </button>
                        </div>



                        <div className="flex flex-col items-center justify-center ">
                        <Image
                          src={feedImage2}
                          alt="food image"
                          width={150}
                          height={150}
                          className="relative w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                          style={{objectFit: 'cover'}}
                        />
                        <button
                          onClick={() => removeFeedImage(2)}
                        >
                          <Image
                            src="/usermain/images/x2.svg"
                            alt="remove image"
                            width={20}
                            height={20}
                            className="mt-2 relative w-5 h-5 rounded-sm overflow-hidden shrink-0 "
                            style={{objectFit: 'cover'}}
                          />
                        </button>
                        </div>


                        <div className="flex flex-col items-center justify-center ">
                        <Image
                          src={feedImage3}
                          alt="food image"
                          width={150}
                          height={150}
                          className="relative w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                          style={{objectFit: 'cover'}}

                        />
                        <button
                          onClick={() => removeFeedImage(3)}
                        >
                          <Image
                            src="/usermain/images/x2.svg"
                            alt="remove image"
                            width={20}
                            height={20}
                            className="mt-2 relative w-5 h-5 rounded-sm overflow-hidden shrink-0 "
                            style={{objectFit: 'cover'}}
                          />
                        </button>
                        </div>

                        <div className="flex flex-col items-center justify-center ">
                        <Image
                          src={feedImage4}
                          alt="food image"
                          width={150}
                          height={150}
                          className="relative w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                          style={{objectFit: 'cover'}}

                        />
                        <button
                          onClick={() => removeFeedImage(4)}
                        >
                          <Image
                            src="/usermain/images/x2.svg"
                            alt="remove image"
                            width={20}
                            height={20}
                            className="mt-2 relative w-5 h-5 rounded-sm overflow-hidden shrink-0 "
                            style={{objectFit: 'cover'}}
                          />
                        </button>
                        </div>

                        <div className="flex flex-col items-center justify-center ">
                        <Image
                          src={feedImage5}
                          alt="food image"
                          width={150}
                          height={150}
                          className="relative w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                          style={{objectFit: 'cover'}}
                        />
                        <button
                          onClick={() => removeFeedImage(5)}
                        >
                          <Image
                            src="/usermain/images/x2.svg"
                            alt="remove image"
                            width={20}
                            height={20}
                            className="mt-2 relative w-5 h-5 rounded-sm overflow-hidden shrink-0 "
                            style={{objectFit: 'cover'}}
                          />
                        </button>
                        </div>

 
                      </div>
                    )}


                    { feedImage1 && feedImage2 && feedImage3 && feedImage4 && feedImage5 && feedImage6 && !feedImage7 && (
                      <div className="grid grid-cols-5 xl:grid-cols-10 gap-2">

                        <Uploader
                          number={6}
                          onSave={(url: string) => {
                            addUploadedImage(7, url);
                          }}
                        />


                         <Image
                          src={feedImage1}
                          alt="food image"
                          width={150}
                          height={150}
                          className="relative w-14 h-14 xl:w-20 xl:h-20 rounded-lg overflow-hidden shrink-0"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage2}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage3}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm "
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage4}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm "
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage5}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm "
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage6}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm "
                          style={{objectFit: 'cover'}}

                        />


                      </div>
                    )}



                    { feedImage1 && feedImage2 && feedImage3 && feedImage4 && feedImage5 && feedImage6 && feedImage7 && !feedImage8 && (
                      <div className="grid grid-cols-5 xl:grid-cols-10 gap-2">


                        <Uploader
                          number={7}
                          onSave={(url: string) => {
                            addUploadedImage(8, url);
                          }}
                        />


                         <Image
                          src={feedImage1}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm  overflow-hidden shrink-0"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage2}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage3}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage4}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage5}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage6}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage7}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />


                      </div>
                    )}


                    { feedImage1 && feedImage2 && feedImage3 && feedImage4 && feedImage5 && feedImage6 && feedImage7 && feedImage8 && !feedImage9 && (
                      <div className="grid grid-cols-5 xl:grid-cols-10 gap-2">

                        <Uploader
                          number={8}
                          onSave={(url: string) => {
                            addUploadedImage(9, url);
                          }}
                        />


                         <Image
                          src={feedImage1}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm  overflow-hidden shrink-0"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage2}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm  overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage3}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm  overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage4}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm  overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage5}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm  overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage6}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm  overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage7}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm  overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage8}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm  overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />


                      </div>
                    )}


                    { feedImage1 && feedImage2 && feedImage3 && feedImage4 && feedImage5 && feedImage6 && feedImage7 && feedImage8 && feedImage9 && !feedImage10 && (
                      <div className="grid grid-cols-5 xl:grid-cols-10 gap-2">

                        <Uploader
                          number={9}
                          onSave={(url: string) => {
                            addUploadedImage(10, url);
                          }}
                        />


                         <Image
                          src={feedImage1}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm  overflow-hidden shrink-0"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage2}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm  overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage3}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm   overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage4}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm  overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage5}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20 rounded-sm   overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage6}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm  overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage7}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm  overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage8}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm  overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage9}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm  overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />


                      </div>
                    )}


                    { feedImage1 && feedImage2 && feedImage3 && feedImage4 && feedImage5 && feedImage6 && feedImage7 && feedImage8 && feedImage9 && feedImage10 && (
                      <div className="grid grid-cols-5 xl:grid-cols-10 gap-2">
                         <Image
                          src={feedImage1}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm   overflow-hidden shrink-0"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage2}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm   overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage3}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm   overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage4}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm   overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage5}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm   overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage6}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm   overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage7}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm   overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage8}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm   overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage9}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20  rounded-sm   overflow-hidden"
                          style={{objectFit: 'cover'}}

                        />
                        <Image
                          src={feedImage10}
                          alt="food image"
                          width={150}
                          height={150}
                          className="mt-2 relative w-20 h-20   rounded-sm  overflow-hidden"
                          style={{objectFit: 'cover'}}
                         

                        />
                      </div>
                    )}
                    
                      

                  </div>

                </div>


                <div className="self-stretch flex flex-col items-start justify-center gap-[8px]">
                  <div className="self-stretch relative">
                    <span>
                      <span className="text-sm font-extrabold font-menu-off">
                        내용
                      </span>
                      <span>(30자 이내)</span>
                    </span>
                    <span className="text-sm font-extrabold text-red">*</span>
                  </div>

              
                 
                      <QuillEditor
                        placeholder="내용을 입력해 주세요"
                        value={feedTitle}
                        
                        onChange={(e) => {
                         
                          
                          setFeedTitle(e);


                        }}

                        className="@3xl:col-span-2 [&>.ql-container_.ql-editor]:min-h-[100px] w-full h-64 "
                        labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"

                        
                      />
         
                
          
                      <div className="self-stretch flex flex-row items-center justify-start gap-[8px] text-gray-500 ">
                        <input
                          type="checkbox"
                          className="w-5 h-5
                          text-dark  border-[1px] border-solid border-dark
                          "
           

                          
                          
                          //checked={ feed?.mealFood?.length === 0 ? true : value }

                          checked={hiddenYn}

                          onChange={(e) => {
                            setHiddenYn(e.target.checked);
                          }}



                        />
                        <label htmlFor="public">비공개하고싶어요!</label>
                      </div>
             
  

                </div>




                
                <div className="self-stretch flex flex-col items-start justify-center gap-[8px]">
                  


                </div>

              </div>
            </div>


            <div className="self-stretch flex flex-row items-center justify-between   ">

              <Button
                type="button"
                className="
                  rounded-none h-16 text-base font-semibold
                  p-5 self-stretch w-full flex flex-row items-center justify-center bg-grey-f1 text-dark
                "
                onClick={() => {
                  
                  //{`/usermain/feeds/write1/${_id}`}
                  ///window.location.href = `/usermain/feeds/write1/${_id}`;

                  setSelectedPage(1);


                } }
              >
                이전
              </Button>
              

              {/*   feedImage1  ? (

              check controller bio
               !getValues('bio')
               */}

                { feedTitle ? (
                  
              
                  <Button
                    isLoading={isRegistering}
                    type="button"
                    className="
                      rounded-none h-16 text-base font-semibold 
                      p-5 self-stretch w-full flex flex-row items-center justify-center bg-dark text-white
                    "
                    onClick={() => {
                      
                      //updateFeed();

                      //onSubmit(getValues());


                      //const hiddenYn = data.hidden === true ? 'Y' : 'N';

                      //////const hiddenYn = getValues('hidden') === true ? 'Y' : 'N';

                      
                      ///////updateFeed(feedTitle as string, feedTitle as string, hiddenYn as string);
                  

                      registerFeed();


                    } }
                  >
                    등록하기
                  </Button>
                
                ) : (
                  <Button
                    type="button"
                    className="
                      rounded-none h-16 text-base font-semibold 
                      p-5 self-stretch w-full flex flex-row items-center justify-center bg-grey-f1 text-dark
                    "

                    onClick= {() => {
                      toast.error(
                        '필수 입력값을 모두 입력해주세요.',
                        {
                          //position: 'top-right',
                        }
                      );
                    } }

                  >
                    등록하기
                  </Button>


                )}

            </div>



          </div>
        </div>
      </div>


      <div className="hidden xl:block">
      <Footer
        footerAlignSelf="stretch"
        footerBorderTop="1px solid #eee"
        footerBoxSizing="border-box"
      />
      </div>
      


    </div>


    ) }



  











    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
        ///setActive(() => 'posts');
      }}
      overlayClassName=" dark:bg-opacity-40 dark:backdrop-blur-lg"
      // y scrollable
      /*
      containerClassName="
        dark:bg-gray-100
        max-w-[860px]
        h-[70vh]
        overflow-y-scroll
        rounded-md p-5 lg:p-6
      "
      */

      containerClassName="
      dark:bg-gray-100
      xl:max-w-[860px]
      h-[70vh]
      overflow-y-scroll
      rounded-md p-5 lg:p-6
      "
    >
        

        {/*
        <div className="flex items-center justify-between pb-2 lg:pb-3">
          <Title
            as="h3"
            className="text-lg font-semibold text-gray-900 xl:text-xl"
          >
            당신의 식단을 알려주세요
          </Title>
          <Button
            variant="text"
            onClick={() => {
              setOpen(false);
              //setActive(() => 'posts');
            }}
            className="h-auto px-1 py-1"
          >
            <PiXBold className="h-5 w-5 text-base" />
          </Button>
        </div>
        */}


        <div
          className="self-stretch flex flex-row items-center justify-between pt-0 px-0 pb-5 text-left text-5xl text-dark font-menu-off border-b-[1px] border-solid border-grey-e"
        >
 

            <div className="relative tracking-[-0.02em] font-extrabold">
              {`당신의 식단을 알려주세요!`}
            </div>
          

          <button
            onClick={() => {
              setOpen(false);
            }}
            className=" no-underline flex"
          >
          <Image
            width="24"
            height="24"
            className="relative w-6 h-6 overflow-hidden shrink-0"
            alt=""
            src="/usermain/images/x2.svg"
          />
          </button>
          
        </div>


  

        <div className="self-stretch flex flex-col items-center justify-end gap-[20px]">

          <div className="self-stretch flex flex-row items-center justify-center text-center text-base text-grey-9">
            
            <button
              //className=" no-underline flex-1 box-border h-14 flex flex-row items-center justify-start text-black border-b-[2px] border-solid border-dark"
              //className=" no-underline flex-1 box-border h-14 flex flex-row items-center justify-start text-grey-9 border-b-[2px] border-solid border-grey-d"

              className={` no-underline flex-1 box-border h-14 flex flex-row items-center justify-start  border-b-[2px] border-solid
                ${selectedTab === "1" ? "border-dark text-black " : "border-grey-d text-grey-9" } `}

              onClick={() => setSelectedTab("1")}
              
            >
              <div className="flex-1 relative font-extrabold">
                음식 검색
              </div>
            </button>

            <button
              ///className=" no-underline flex-1 box-border h-14 flex flex-row items-center justify-start text-black border-b-[2px] border-solid border-dark"
              ///className=" no-underline flex-1 box-border h-14 flex flex-row items-center justify-start text-grey-9 border-b-[2px] border-solid border-grey-d"

              className={` no-underline flex-1 box-border h-14 flex flex-row items-center justify-start  border-b-[2px] border-solid
                ${selectedTab === "2" ? "border-dark text-black " : "border-grey-d text-grey-9" } `}
              
              onClick={() => setSelectedTab("2")}
            >
              <div className="flex-1 relative font-extrabold">My 음식</div>
            </button>


          </div>




          { selectedTab === "1" && (


            <DatabaseTableWidgetSearch
              title=""
              variant="minimal"

              //data={calorieData}

              //pageSize={10}

              sticky
              ///scroll={{ x: 1300, y: 760 }}

              scroll={{ x: 700, }}


              // @ts-ignore
              ///getColumns={getColumns}

              getColumns={getColumnsSelect}


              //enablePagination
              enableSearch={true}
              enablePagination={true}
              
              ///searchPlaceholder="식품명"
              searchPlaceholder="음식명을 입력하세요."


              handleAdd={(items: any[]) => {


                console.log("items===============", items);

                let newItems = [] as any[];

                items.map((item) => {

                  console.log("mealFood", mealFood);

                  // check if the foodCode are already in the list mealFood
                
                  if (!mealFood.map((food) => food.id).includes(item.id)) {

                    console.log("item=======", item);

                    newItems.push(item);
                  }


                  

                } );

                if (newItems.length > 0) {
                  setMealFood([...mealFood, ...newItems]);
                }


              } }


              // select ta

              setSelectedTab={setSelectedTab}


              className="w-full h-full"
              
            />

          )}

          { selectedTab === "2" && (
          <DatabaseTableWidgetSelect
            title=""
            variant="minimal"

            //data={calorieData}

            //pageSize={8}

            sticky
            ///scroll={{ x: 1300, y: 760 }}
            //scroll={{ x: 350, }}
            scroll={{ x: 550, y: 760 }}


            // @ts-ignore
            getColumns={getColumns}
            //enablePagination
            enableSearch={true}
            enablePagination={true}
            
            searchPlaceholder="식품명"



            handleAdd={(items: any[]) => {
              ///alert("handleAdd"+ JSON.stringify(items));

              setOpen(false);

              // add items to the list which are not already in the list mealFood

              // get foodCode from items
              // and check if the foodCode are already in the list mealFood
              // if not, add them to the list mealFood

              /*
              items.map((item) => {
                if (!mealFood.map((food) => food.foodCode).includes(item.foodCode)) {
                  setMealFood([...mealFood, item]);
                }
              } );
              */

              let newItems = [] as any[];

              console.log("items===", items);

              console.log("mealFood===", mealFood);

              items.map((item) => {

                ///console.log("item", item);

                if (!mealFood.map((food) => food.id).includes(item.foodCode)) {
                  newItems.push(item);
                }

                

              } );

              if (newItems.length > 0) {
                setMealFood([...mealFood, ...newItems]);
              }








              /*

              const newItems = items.filter((item) => !mealFood.includes(item));

              setMealFood([...mealFood, ...newItems]);
              */



            } }


            

          />

          )}


        </div>

      </Modal>











      {/* modal view */}
      <Modal
        isOpen={openCloseConfirmModal}
        onClose={() => {
          setOpenCloseConfirmModal(false);

          //setOpen(false);
          //setActive(() => 'posts');
        }}
        overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-lg"

        containerClassName="dark:bg-gray-100 max-w-[460px] rounded-xl p-5 "
      >

        <div className="flex flex-col items-center justify-center gap-10 m-5">
            
      
              <div className="">
                <Text
                  as="p"
                  className="text-sm text-gray-900 xl:text-lg"
                >
                
                  등록을 취소하시겠습니까?

                </Text>
              </div>
            


            <div className="flex flex-row items-center justify-center gap-5">

              {/* close button */}
              <Button
                ///size="lg"

                // rounded

                size="xl"


                
                className='text-white bg-grey-9 rounded-xl w-28 h-12 flex items-center justify-center'
                onClick={() => {

                  setOpenCloseConfirmModal(false);

                  //setOpen(false);
                  //setActive(() => 'posts');

                  ///withdrawal();

                  // go back to the previous page

                  router.back();

                  

                }}
              >
                예
              </Button>

              {/* 확인 button */}
              <Button
                size="lg"
              
                className='text-white bg-dark rounded-xl w-28 h-12 flex items-center justify-center'
                onClick={() => {
                  setOpenCloseConfirmModal(false);
                  //setActive(() => 'posts');

                  // api call


                }}
              >
                아니오
              </Button>
            </div>

          
        </div>

              {/*
        {modalData && <FollowerModal data={modalData.data} />}
              */}
      </Modal>







    </>

  );
};

