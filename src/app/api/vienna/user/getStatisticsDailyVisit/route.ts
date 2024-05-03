/**
 * @swagger
 * /api/doingdoit/user/getStatisticsDailyVisit:
 * post:
 *  description: 일별 통계 조회
 * responses:
 *    200:
 *      description: 일별 통계 조회 성공
 *    500:
 *      description: 일별 통계 조회 실패
 */


import { NextResponse, NextRequest } from 'next/server';

////import { getUser, getAllUsers, getUserCount } from '@/lib/api/user';

///import { getStatisticsDailyVisit } from '@/lib/api/user';




export const POST = async (req: NextRequest, res: NextResponse) => {

  
  const data = await req.json();

  //const results = await getStatisticsDailyVisit(data as any);

  const results = 'getStatisticsDailyVisit';
  

  try {
    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(`First Error: ${error}`, { status: 500 });
  }


};
