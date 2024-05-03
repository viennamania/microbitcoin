/**
 * @swagger
 * /api/doingdoit/user/getAttendanceCountByUserId:
 * get:
 *  description: 사용자의 출석 수를 가져옵니다.
 * responses:
 *    200:
 *      description: 사용자의 출석 수 가져오기 성공
 *    500:
 *      description: 사용자의 출석 수 가져오기 실패
 */


import { NextResponse, NextRequest } from 'next/server';

/////import { memberData } from '@/data/doingdoit/user/member-data';


//import { getAttendanceCountByUserId,  } from '@/lib/api/user';


///import { get } from 'lodash';


/* ======================================

======================================= */
export const GET = async (req: NextRequest, res: NextResponse) => {


  const _userId = req.nextUrl.searchParams.get('_userId');
 



  //const results = await getAttendanceCountByUserId(
  //  _userId as any,
  //);

  const results = 'getAttendanceCountByUserId';
  
  //console.log('getCommentCountByEmail results: ' + JSON.stringify(results));


  try {
    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(`First Error: ${error}`, { status: 500 });
  }


};