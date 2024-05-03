import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import LogoIcon from "./logo-icon";

import Link from "next/link";

import { motion } from "framer-motion";

type FooterType = {
  /** Style props */
  footerAlignSelf?: CSSProperties["alignSelf"];
  footerBorderTop?: CSSProperties["borderTop"];
  footerBoxSizing?: CSSProperties["boxSizing"];
};

const Footer: NextPage<FooterType> = ({
  footerAlignSelf,
  footerBorderTop,
  footerBoxSizing,
}) => {
  const footerStyle: CSSProperties = useMemo(() => {
    return {
      alignSelf: footerAlignSelf,
      borderTop: footerBorderTop,
      boxSizing: footerBoxSizing,
    };
  }, [footerAlignSelf, footerBorderTop, footerBoxSizing]);

  return (

    <div
      className="bg-dark overflow-hidden flex flex-col items-center justify-center relative gap-[10px] text-center text-sm text-white font-menu-off"
      style={footerStyle}
    >
      <div className="w-[1920px] flex flex-col items-center justify-center py-[100px] px-0 box-border gap-[32px] z-[0]">
        
        

        <div className="flex flex-col items-center justify-center gap-[12px]">
          <div className="flex flex-row items-center justify-center gap-[12px]">
            
            <Link
              href="/usermain/user/terms"
              className="relative"
            >
              Terms of Use
            </Link>

            <div className="relative bg-white w-px h-3" />
            <Link
              href="/usermain/user/privacy"
              className="relative"
            >
              Privacy Policy
            </Link>

          </div>

{/*
상호명 : 디보이드 | 대표자 : 정보영 | 서울 강서구 강서로47길 165 901-368호
사업자등록번호 : 359-17-02121 | 통신판매업신고번호 : 제 2023-서울강서-3713호
이메일 doingdoit.official@gmail.com

Copyright ⓒ 디보이드 All Rights Reserved 
*/}



          <div className="flex flex-col items-center justify-center text-xs text-grey-c">
            <div className="text-left relative leading-[20px] whitespace-pre-wrap">



              <div className="flex flex-col items-start justify-start ">

                <div className="flex flex-row items-center justify-center">
                  <div className="w-9">email</div><div>: microbitcoin@gmail.com</div>
                </div>
              </div>

              
            </div>
          </div>

        </div>
        <div className="relative text-xs text-grey-c">
          Copyright Ⓒ OnePay All Rights Reserved
        </div>
      </div>

      


      {/* float buttom right absolute position stikcy */}
      {/*
      <div className=" z-50 flex flex-col items-center justify-end gap-[40px] text-grey-6 fixed bottom-0 right-0 mr-10 mb-10">
        
      
        <motion.div
          className="box"
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link
            href="/"
          >
          <img
            className=" w-16 h-16"
            alt=""
            src="/usermain/images/chtalk-logo-1@2x.png"
          />
          </Link>
        </motion.div>

      </div>
      */}

    

    </div>
  );
};

export default Footer;
