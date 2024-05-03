/**
 * @swagger
 * /api/doingdoit/user/setOne:
 * post:
 *  description: 사용자 정보를 저장합니다.
 *  responses:
 *    200:
 *      description: 사용자 정보를 저장 성공했습니다.
 *    500:
 *      description: 사용자 정보를 저장 실패했습니다.
 */



import { NextResponse, NextRequest } from 'next/server';


///import {setUser, getUser, getAllUsers, getUserCount } from '@/lib/api/user';

import { setManager } from '@/lib/api/user';




export const POST = async (req: NextRequest, res: NextResponse) => {

  const data = await req.json();


  const results = await setManager(data as any);
  

  try {
    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(`First Error: ${error}`, { status: 500 });
  }


};