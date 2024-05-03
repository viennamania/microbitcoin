/**
 * @swagger
 * /api/doingdoit/food/deleteMany:
 * post:
 *  description: 음식 삭제
 * responses:
 *    200:
 *      description: 삭제 성공
 *    500:
 *      description: 삭제 실패
 */


import { NextResponse, NextRequest } from 'next/server';

///import { deleteMany } from '@/lib/api/food';

export const POST = async (req: NextRequest, res: NextResponse) => {

  
  const data = await req.json();

  //const results = await deleteMany(data as any);

  const results = 'deleteMany';
  

  try {
    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(`First Error: ${error}`, { status: 500 });
  }


};
