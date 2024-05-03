/**
 * @swagger
 * /api/doingdoit/healthinfo/getAll:
 * get:
 *    description: 건강정보 전체 조회
 * responses:
 *    200:
 *      description: 조회 성공
 *    500:
 *      description: 조회 실패
 */



import { NextResponse, NextRequest } from 'next/server';

import { getAll } from '@/lib/api/healthinfo';


export const POST = async (req: NextRequest, res: NextResponse) => {

  const data = await req.json();

  const results = await getAll(data as any);


  try {
    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(`First Error: ${error}`, { status: 500 });
  }


};
