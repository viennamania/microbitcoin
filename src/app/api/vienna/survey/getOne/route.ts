/**
 * @swagger
 * /api/doingdoit/food/getOne:
 * get:
 *    description: 음식 상세 조회
 * responses:
 *    200:
 *      description: 조회 성공
 *    500:
 *      description: 조회 실패
 */



import { NextResponse, NextRequest } from 'next/server';

import { getOne } from '@/lib/api/survey';


/* ======================================

======================================= */
export const GET = async (req: NextRequest, res: NextResponse) => {

  const id = req.nextUrl.searchParams.get('id');

  const results = await getOne(
    id as string
  ) ;

  try {
    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(`First Error: ${error}`, { status: 500 });
  }


};
