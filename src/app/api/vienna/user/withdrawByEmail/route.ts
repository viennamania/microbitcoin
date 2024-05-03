import { NextResponse, NextRequest } from 'next/server';

/////import { memberData } from '@/data/doingdoit/user/member-data';


import { withdrawByEmail, } from '@/lib/api/user';

///import { get } from 'lodash';


/* ======================================

======================================= */
export const GET = async (req: NextRequest, res: NextResponse) => {


  const _email  = req.nextUrl.searchParams.get('_email');


  const results = await withdrawByEmail(
    
    _email as string,
  );


  


  try {
    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(`First Error: ${error}`, { status: 500 });
  }


};
