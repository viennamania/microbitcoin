/**
 * @swagger
 * /api/doingdoit/feed/getStatisticsMealFoodMonthByEmail:
 * get:
 *  description: 이메일로 피드 통계를 가져옵니다.
 */

// /api/doingdoit/feed/getStatisticsMealFoodMonthByUserId

import { NextResponse, NextRequest } from 'next/server';

import { getStatisticsMealFoodMonthByEmail } from '@/lib/api/feed';

///import { get } from 'lodash';


/* ======================================
getStatisticsByEmail
======================================= */
export const GET = async (req: NextRequest, res: NextResponse) => {




  

  const _email = req.nextUrl.searchParams.get('_email');

  const _mealDate = req.nextUrl.searchParams.get('_mealDate');



  

  const results = await getStatisticsMealFoodMonthByEmail(
    _email as any,
    _mealDate as any,
  );



  ////console.log('getStatisticsMealFoodDayByEmail results: ', results);

  
  

  try {
    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(`First Error: ${error}`, { status: 500 });
  }


};