'use client';


import Top1 from "@/components-figma/top1";
import Prog from "@/components-figma/prog";
import FormContainer5 from "@/components-figma/form-container5";
import Footer from "@/components-figma/footer";
//import { Link } from "react-router-dom";
import Link from "next/link";

import { useRouter, useSearchParams } from "next/navigation";

import { set } from "lodash";

import Image from "next/image";
import { array } from "prop-types";
import { ar } from "@faker-js/faker";

/*
router.push(`/usermain/survey/result?selection=${selection}`);

const [selection, setSelection] = useState(['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A']);
*/

import { metaObject } from "@/config/site.config";

import type { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next';


import { use, useEffect, useState, ReactElement,  ReactNode} from "react";

import Script from 'next/script';




/*
export const metadata = {
  ...metaObject('설문조사 결과'),
};
*/


/*
export const getStaticProps: GetStaticProps = async () => {
  const pageid = 'surveyresult';
  const title = 'Doingdoit';
  const image = 'https://doingdoit-v1.vercel.app/logo.png';
  const description = 'Doingdoit';

  return {
    props: {
      pageid: pageid,
      title: title,
      image: image,
      description: description,
    },
  };
}


export type NextPageWithLayout<P = {}> = NextPage<P> & {
  authorization?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

const Page: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = (props) => {

  ////const { pageid, title, image,  description } = props;
*/




export default function SurveyResultPage({ params }: any) {

  const { id } = params;

  
  const kakaoInit = () => {

    console.log('kakaoInit');
    
    // 페이지가 로드시 실행
    if (!window.Kakao.isInitialized()) {
        // 선언되지 않았을 때만 실행하도록 if문 추가
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY);
    }
  };



  const [loading, setLoading] = useState(true);



  /*
  if (selection === null) {
    router.push(`/usermain/survey/question1`);
  }

  const [selectionArray, setSelectionArray] = useState<string[]>();

  useEffect(() => {

    if (selection) {
      setSelectionArray(selection.split(','));
    }

  } , [selection]);

  // result of mbti test (I N T P)
  // ex) ['E', 'I', 'E', 'I']
  // ex) ['E', 'I', 'E', 'I']
  const [mbti, setMbti] = useState([]);
  
  const [character, setCharacter] = useState('');

  const [nutrition, setNutrition] = useState('');


  console.log("selectionArray=======", selectionArray);

  useEffect(() => {

    //  selectionArray[0] is 'A' or 'B'
    //  selectionArray[1] is 'A' or 'B'
    //  selectionArray[2] is 'A' or 'B'
    //  selectionArray[3] is 'A' or 'B'
    //  selectionArray[4] is 'A' or 'B'
    //  selectionArray[5] is 'A' or 'B'
    //  selectionArray[6] is 'A' or 'B'
    //  selectionArray[7] is 'A' or 'B'
    //  selectionArray[8] is 'A' or 'B'
    //  selectionArray[9] is 'A' or 'B'


    if (selectionArray) {

      let aaa = 0;

      if (selectionArray[0] === 'A') {
        aaa = aaa + 3;
      } else if (selectionArray[0] === 'B') {
        aaa = aaa + 2;
      } else if (selectionArray[0] === 'C') {
        aaa = aaa + 1;
      } else if (selectionArray[0] === 'D') {
        aaa = aaa + 0;
      }

      if (selectionArray[1] === 'A') {
        aaa = aaa + 3;
      } else if (selectionArray[1] === 'B') {
        aaa = aaa + 2;
      } else if (selectionArray[1] === 'C') {
        aaa = aaa + 1;
      } else if (selectionArray[1] === 'D') {
        aaa = aaa + 0;
      }

      if (selectionArray[2] === 'A') {
        aaa = aaa + 3;
      } else if (selectionArray[2] === 'B') {
        aaa = aaa + 2;
      } else if (selectionArray[2] === 'C') {
        aaa = aaa + 1;
      } else if (selectionArray[2] === 'D') {
        aaa = aaa + 0;
      }

      if (selectionArray[3] === 'A') {
        aaa = aaa + 3;
      } else if (selectionArray[3] === 'B') {
        aaa = aaa + 2;
      } else if (selectionArray[3] === 'C') {
        aaa = aaa + 1;
      } else if (selectionArray[3] === 'D') {
        aaa = aaa + 0;
      }


      if (selectionArray[4] === 'A') {
        aaa = aaa + 3;
      } else if (selectionArray[4] === 'B') {
        aaa = aaa + 2;
      } else if (selectionArray[4] === 'C') {
        aaa = aaa + 1;
      } else if (selectionArray[4] === 'D') {
        aaa = aaa + 0;
      }

      if (selectionArray[5] === 'A') {
        aaa = aaa + 3;
      } else if (selectionArray[5] === 'B') {
        aaa = aaa + 2;
      } else if (selectionArray[5] === 'C') {
        aaa = aaa + 1;
      } else if (selectionArray[5] === 'D') {
        aaa = aaa + 0;
      }

      if (aaa <= 5) {
        setNutrition('low');
      } else if (aaa <= 12) {
        setNutrition('middle');
      } else {
        setNutrition('high');
      }



      let mbti = ['', '', '', '']; // I N T P

      if (selectionArray[6] === 'A') { //Q1=> 'S' or 'N'
        mbti[1] = 'S'; // I N T P

      } else {
        mbti[1] = 'N';
      }

      if (selectionArray[7] === 'A') { //Q2=> 'T' or 'F'
        mbti[2] = 'T';
      } else {
        mbti[2] = 'F';
      }

      if (selectionArray[8] === 'A') { //Q3=> 'J' or 'P'
        mbti[3] = 'J';
      } else {
        mbti[3] = 'P';
      }

      if (selectionArray[9] === 'A') { //Q4=> 'F' or 'T'
        //mbti[2] = 'F';
      } else {
        //mbti[2] = 'T';
      }

      if (selectionArray[10] === 'A') { //Q5=> 'I' or 'E'
        mbti[0] = 'I';
      } else {
        mbti[0] = 'E';
      }

      if (selectionArray[11] === 'A') { //Q6=> 'N' or 'S'
        //mbti[1] = 'N';
      } else {
        //mbti[1] = 'S';
      }

      if (selectionArray[12] === 'A') { //Q7=> 'P' or 'J'
        //mbti[3] = 'P';
      } else {
        //mbti[3] = 'J';
      }

      if (selectionArray[13] === 'A') { //Q8=> 'T' or 'F'
        //mbti[2] = 'T';
      } else {
        //mbti[2] = 'F';
      }

      if (selectionArray[14] === 'A') { //Q9=> 'N' or 'S'
        //mbti[1] = 'N';
      } else {
        //mbti[1] = 'S';
      }

      if (selectionArray[15] === 'A') { //Q10=> 'J' or 'P'
        //mbti[3] = 'J';
      } else {
        //mbti[3] = 'P';
      }

      setMbti(mbti as never[]);

      //ISTJ, ISFJ, ESTJ, ESFJ => SJ
      //ISTP, ISFP, ESTP, ESFP => SP
      //INTP, INTJ, ENTP, ENTJ => NT
      //INFP, INFJ, ENFP, ENFJ => NF

      if (
        (mbti[0] === 'I' && mbti[1] === 'S' && mbti[2] === 'T' && mbti[3] === 'J')
      || (mbti[0] === 'I' && mbti[1] === 'S' && mbti[2] === 'F' && mbti[3] === 'J')
      || (mbti[0] === 'E' && mbti[1] === 'S' && mbti[2] === 'T' && mbti[3] === 'J')
      || (mbti[0] === 'E' && mbti[1] === 'S' && mbti[2] === 'F' && mbti[3] === 'J')

      ) {
        setCharacter('SJ');
      } else if (
        (mbti[0] === 'I' && mbti[1] === 'S' && mbti[2] === 'T' && mbti[3] === 'P') 
      || (mbti[0] === 'I' && mbti[1] === 'S' && mbti[2] === 'F' && mbti[3] === 'P')
      || (mbti[0] === 'E' && mbti[1] === 'S' && mbti[2] === 'T' && mbti[3] === 'P')
      || (mbti[0] === 'E' && mbti[1] === 'S' && mbti[2] === 'F' && mbti[3] === 'P')

      ) {
        setCharacter('SP');

      } else if (
        (mbti[0] === 'I' && mbti[1] === 'N' && mbti[2] === 'T' && mbti[3] === 'P')
      || (mbti[0] === 'I' && mbti[1] === 'N' && mbti[2] === 'T' && mbti[3] === 'J')
      || (mbti[0] === 'E' && mbti[1] === 'N' && mbti[2] === 'T' && mbti[3] === 'P')
      || (mbti[0] === 'E' && mbti[1] === 'N' && mbti[2] === 'T' && mbti[3] === 'J')

      ) {
        setCharacter('NT');
      } else  if (
        (mbti[0] === 'I' && mbti[1] === 'N' && mbti[2] === 'F' && mbti[3] === 'P')
      || (mbti[0] === 'I' && mbti[1] === 'N' && mbti[2] === 'F' && mbti[3] === 'J')
      || (mbti[0] === 'E' && mbti[1] === 'N' && mbti[2] === 'F' && mbti[3] === 'P')
      || (mbti[0] === 'E' && mbti[1] === 'N' && mbti[2] === 'F' && mbti[3] === 'J')

      ) {
        setCharacter('NF');
      }


      setTimeout(() => {
        setLoading(false);
      } , 10000);

     

   

    }

  } , [selectionArray]);

  console.log("mbti=======", mbti);

  */

  const [createdAt, setCreatedAt] = useState('');

  const [nutrition, setNutrition] = useState('');
  const [character, setCharacter] = useState('');


  const [loadingResult, setLoadingResult] = useState(true);



  // fetch survey result from server
  useEffect(() => {

    const fetchSurveyResult = async () => {
      
      if (id) {

        setLoadingResult(true);

        const res = await fetch(`/api/vienna/survey/resultById?_id=${id}`);
        const json = await res?.json();
  
        //////console.log(json);
  
        const data = json as any;

        console.log("data=======", data);

        if (data) {

          setCreatedAt(data?.data?.createdAt);

          const surveyResult = JSON.parse(decodeURIComponent(data?.data?.surveyResult)) as any;

          const { character, nutrition } = surveyResult;

          setCharacter(character?.[0]?.code);
          setNutrition(nutrition);


          if (!data?.data?.viewCount) {

            setTimeout(() => {
            
              setLoadingResult(false);
    
            } , 3000);

          } else {
              
            setLoadingResult(false);

          }


        } else {

          setLoadingResult(false);

        }

      }

    }

    fetchSurveyResult();

  } , [id]);

  

  console.log("character=======", character);
  console.log("nutrition=======", nutrition);
  

  const onShare = async () => {

    await window.Kakao.Share.sendDefault({
      objectType: "text",
      ////text: `${currentUser?.displayName} 님은 총 ${totalAmount}권(${totalAmount}원)을 읽었습니다.`,
      text: `당신의 식단 MBTI는?`,
      link: {
        // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
        mobileWebUrl: "https://doingdoit.com/usermain/survey/result/" + id,
        webUrl: "https://doingdoit.com/usermain/survey/result/" + id,
      },
    });

  };
  



  return (

    <>


    <Script
      src="https://developers.kakao.com/sdk/js/kakao.js"
      onLoad={kakaoInit}
    />

  
    <div className="bg-dark sticky top-0 z-50 ">
  
    <Top1
            logo="/usermain/images/logo.png"
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
            frameDivBorderBottom3="2px solid #212121"
            frameDivBoxSizing3="border-box"
          />
    </div>


    <div className="relative bg-white w-full overflow-hidden flex flex-col items-center justify-start text-center text-sm text-grey-6 font-menu-off">
      <div className="self-stretch flex flex-col items-center justify-start">

   


        <div className="self-stretch xl:bg-background flex flex-col items-center justify-start xl:py-10 px-0">
          <div className=" w-96 xl:w-[1000px] flex flex-col items-center justify-start">

            <div className="self-stretch bg-white flex flex-col items-center justify-end  p-5 xl:p-10 gap-[40px]">
              
              {/*
              <Prog />
              */}


              <div className="self-stretch flex flex-col items-center justify-end gap-[20px] text-left text-sm text-grey-6 font-menu-off">

              <div className="self-stretch flex flex-col items-center justify-end gap-[8px]">
                <div className="self-stretch relative">Show me the money!</div>
                <div className="self-stretch relative text-xl xl:text-5xl font-extrabold text-dark">
                  Take a survey
                </div>
              </div>

              <div className="self-stretch rounded-81xl bg-grey-e h-3 overflow-hidden shrink-0 flex flex-col items-start justify-center">
              

                  <div className={`flex-1 relative rounded-81xl bg-orange w-[100%] `} />


              </div>

              </div>




              {/*
              <div className="self-stretch flex flex-col items-center justify-end">
                <div className="self-stretch flex flex-col items-center justify-end gap-[8px]">
                  
                  <div className="self-stretch relative">
                    {new Date().toLocaleDateString()}
                    
                  </div>


                  <div className="mt-5 self-stretch relative text-3xl xl:text-17xl font-extrabold text-dark">
                    당신의 식단 MBTI는
                  </div>
                </div>
              </div>
              
              <div className="relative w-[300px] h-[300px] text-center text-29xl text-dark font-jalnan">
                <div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50%] bg-input-bg" />

                <div className="mt-10  flex flex-col items-center justify-end gap-[20px]">
                  
                  <img
                    className="relative w-[86.9px] h-40 overflow-hidden shrink-0"
                    alt=""
                    src="/usermain/images/frame-survey.svg"
                  />

                  <div className="relative text-17xl ">
                    {mbti[0]}{mbti[1]}{mbti[2]}{mbti[3]}
                  </div>
                </div>

              </div>
              */}




              <div className="mt-5 self-stretch relative text-3xl xl:text-17xl font-extrabold text-dark">
                당신의 유형은
              </div>


              {/* 2024.01.03 15:34

              local time
              
              */}
              <div className="self-stretch relative text-base xl:text-xl font-extrabold text-grey-9 ">
                {
                  createdAt && (
                    new Date(createdAt).toLocaleDateString() + ' ' + new Date(createdAt).toLocaleTimeString()
                  )
                }
              </div>



              { // loading  some of thiking animation of mbti test result
              ///loading ? (

              loadingResult ? (

                <>
                <div className="mt-5 mb-10 self-stretch relative text-3xl xl:text-17xl font-extrabold text-dark">
                  <div className="animate-pulse">...</div>
                </div>
               
                </>
        

              ) : (

                <>



              {character !== '' && (
              <div className="flex flex-col items-center justify-center w-full ">

                <Image
                  src={`/images/${character?.toLowerCase()}_1.png`}
                  width={800}
                  height={800}
                  alt="Picture of result"
                  className="w-full"
                />
                <Image
                  src={`/images/${character?.toLowerCase()}_2.png`}
                  width={800}
                  height={800}
                  alt="Picture of result"
                  className="w-full"
                />

              </div>
              )}

              { nutrition !== '' && (
              <div className="flex flex-col items-center justify-center w-full ">
                <Image
                  src={`/images/nutrition_${nutrition}.png`}
                  width={800}
                  height={800}
                  alt="Picture of result"
                  className="w-full"
                />
              </div>
              )}
              
              
              <div className="self-stretch flex flex-row items-center justify-center gap-[20px] text-base text-dark">
                
                <Link
                  href="/usermain/survey/question1"
                  style={{ textDecoration: 'none' }}
                 className="rounded-81xl bg-white box-border w-32 xl:w-60 h-14 flex flex-row items-center justify-center gap-[8px] border-[1px] border-solid border-dark">
                  <img
                    className="relative w-6 h-6 overflow-hidden shrink-0"
                    alt=""
                    src="/usermain/images/loopleftline.svg"
                  />
                  <div className="relative font-extrabold">
                    다시 하기
                  </div>
                </Link>

                {/* kakao share button */}
                {/*
                    const { Kakao, location } = window;
                    Kakao.Link.sendScrap({
                      requestUrl: location.href,
                    });
                */}
                {/* share  home url/usermain/survey/result/${id} */}

              

                <button
                  onClick={() => {

                    onShare();

                  }}
                  
                  className="rounded-81xl bg-dark box-border w-32 xl:w-60 h-14 flex flex-row items-center justify-center gap-[8px] text-white">
             
                
                  <img
                    className="relative w-6 h-6 overflow-hidden shrink-0"
                    alt=""
                    src="/usermain/images/sharefill1.svg"
                  />
                  <div className="relative font-extrabold">공유하기</div>
                  
                </button>
                
              </div>



              </>
              )}



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






    {!loadingResult && (


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
            <b className="relative">Home</b>
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
            <b className="relative">Home</b>
          </Link>


            {/*
          <div className="h-[60px] flex-1 flex flex-col items-center justify-center p-2.5 box-border gap-[4px]   text-dark">
            <input
              className="m-0 w-6 h-6 relative overflow-hidden shrink-0"
              type="checkbox"
            />
            <b className="relative">Home</b>
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
            <b className="relative">Feeds</b>
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
            <b className="relative">Stats</b>
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
            <b className="relative">Stats</b>
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
            <b className="relative">Posts</b>
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
            <b className="relative">Posts</b>
          </div>
          */}



          <Link 
              href={'/usermain/survey/result'}
              className="h-[60px]  flex flex-col items-center justify-center p-2.5 box-border gap-[4px]   text-dark">
            <img
              className="w-6 h-6 relative overflow-hidden shrink-0"
              loading="eager"
              alt=""
              src="/questionanswerfill.svg"
            />
            <b className="relative">Survey</b>
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
            <b className="relative">Survey</b>
          </div>
          */}


          <Link 
              href={'/usermain/user/my-page'}
              className="h-[60px]  flex flex-col items-center justify-center p-2.5 box-border gap-[4px]   ">
            <img
              className="w-6 h-6 relative overflow-hidden shrink-0"
              loading="eager"
              alt=""
              src="/usersettingsline.svg"
            />
            <b className="relative">My</b>
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
            <b className="relative">My</b>
          </div>
          */}


        </div>

      </div>

    </div>

    )}







    </>

  );
};



/*
Page.getLayout = function getLayout(page) {
  return (
    <>
      {page}
    </>
  )
}


export default Page;
*/
