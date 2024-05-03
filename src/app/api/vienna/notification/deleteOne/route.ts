/**
 * @swagger
 * /api/doingdoit/notification/deleteOne:
 * get:
 *    description: 알림을 삭제합니다.
 * parameters: id
 * responses:
 *    200:
 *      description: 알림을 삭제했습니다.
 *    500:
 *      description: 알림을 삭제하지 못했습니다.
 */



import { NextResponse, NextRequest } from 'next/server';

import { deleteOne } from '@/lib/api/notification';



export const GET = async (req: NextRequest, res: NextResponse) => {


  const id = req.nextUrl.searchParams.get('id');

 

  const results = await deleteOne(
    id as any,
  ) ;

  ////console.log("guide getAll======", results);
  

  try {
    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(`First Error: ${error}`, { status: 500 });
  }


};
