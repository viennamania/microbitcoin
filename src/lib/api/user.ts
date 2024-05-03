import clientPromise from '@/lib/mongodb';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import _, { create, random, result } from 'lodash';
import { ro } from '@faker-js/faker';

// mongodb object id
import { ObjectId } from 'mongodb';



import nodemailer from 'nodemailer';





export interface UserProps {
  /*
  name: string;
  username: string;
  email: string;
  image: string;
  bio: string;
  bioMdx: MDXRemoteSerializeResult<Record<string, unknown>>;
  followers: number;
  verified: boolean;
  */

  _id: ObjectId,
  id: string,
  name: string,
  nickname: string,
  email: string,
  password: string,
  avatar: string,
  regType: string,
  mobile: string,
  gender: string,
  weight: number,
  height: number,
  birthDate: string,
  purpose: string,
  
  //marketingAgree: string,
  isAgreedTerms: string,
  isAgreedPrivacy: string,
  isAgreedMarketing: string,

  createdAt: string,
  updatedAt: string,
  deletedAt: string,
  loginedAt: string,
  followers : number,
  emailVerified: boolean,

  roles: string[],

  status: string,

}




export interface ResultProps {
  _id: string;
  users: UserProps[];
  totalCount: number;
}



export async function getMdxSource(postContents: string) {
  // Use remark plugins to convert markdown into HTML string
  const processedContent = await remark()
    // Native remark plugin that parses markdown into MDX
    .use(remarkMdx)
    .process(postContents);

  // Convert converted html to string format
  const contentHtml = String(processedContent);

  // Serialize the content string into MDX
  const mdxSource = await serialize(contentHtml);

  return mdxSource;
}

export const placeholderBio = `
Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed. Cursus risus congue arcu aenean posuere aliquam.

Et vivamus lorem pulvinar nascetur non. Pulvinar a sed platea rhoncus ac mauris amet. Urna, sem pretium sit pretium urna, senectus vitae. Scelerisque fermentum, cursus felis dui suspendisse velit pharetra. Augue et duis cursus maecenas eget quam lectus. Accumsan vitae nascetur pharetra rhoncus praesent dictum risus suspendisse.`;





// getUserByLoginId

export async function getUserByLoginId(loginId: string): Promise<UserProps | null> {
  
    console.log('getUserByLoginId loginId: ' + loginId);
  
    const client = await clientPromise;
    const collection = client.db('vienna').collection('users');
    const results = await collection.findOne<UserProps>(
      { email: loginId },
      { projection: { _id: 0, emailVerified: 0 } }
    );
    if (results) {
      return {
        ...results,
        //bioMdx: await getMdxSource(results.bio || placeholderBio)
      };
    } else {
      return null;
    }
  }



export async function getUserById(_id: object): Promise<UserProps | null> {

  console.log('getUserById _id: ' + _id);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  const results = await collection.findOne<UserProps>(
    { id: _id },
    { projection: { _id: 0, emailVerified: 0 } }
    ////{ projection: { _id: 0, emailVerified: 0 } }
  );

  console.log('getUserById results: ' + results);

  if (results) {
    return {
      ...results,
      //bioMdx: await getMdxSource(results.bio || placeholderBio)
    };
  } else {
    return null;
  }
}







export async function getUser(id: string): Promise<UserProps | null> {

  console.log('getUser id: ' + id);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');
  const results = await collection.findOne<UserProps>(
    { id },
    { projection: { _id: 0, emailVerified: 0 } }
    ////{ projection: { _id: 0, emailVerified: 0 } }
  );
  if (results) {
    return {
      ...results,
      //bioMdx: await getMdxSource(results.bio || placeholderBio)
    };
  } else {
    return null;
  }
}




export async function getUserByMobile(mobile: string): Promise<UserProps | null> {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');
  const results = await collection.findOne<UserProps>(
    { mobile: mobile },
    { projection: { _id: 0, emailVerified: 0 } }
    ////{ projection: { _id: 0, emailVerified: 0 } }
  );


  return results || null;

}






export async function getUserByEmail(email: string): Promise<UserProps | null> {

  console.log('getUserByEmail email: ' + email);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');
  const results = await collection.findOne<UserProps>(
    { email: email },
    { projection: { _id: 0, emailVerified: 0 } }
    ////{ projection: { _id: 0, emailVerified: 0 } }
  );

  ////console.log('getUserByEmail results: ' + results);

  if (!results) {
    return null;
  }


  // user history insert or update
  // 데일리 영어로


  const collectionHistory = client.db('vienna').collection('user_daily_history');
  /// '2023-12-05' access count 55
  /// '2023-12-06' access count 22
  // korean time is utc + 9
  // format '2023-12-06'

  const todayDate = new Date().toISOString().slice(0, 10);

  

  const resultsHistory = await collectionHistory.findOne<UserProps>(
    {
      email: email,
      date: todayDate,
    },
    { projection: { _id: 0, emailVerified: 0 } }
    ////{ projection: { _id: 0, emailVerified: 0 } }
  );

  
  if (resultsHistory) {

    const resultsHistoryUpdate = await collectionHistory.updateOne(
      {
        email: email,
        date: todayDate,
      },
      { $inc: { count: 1 } }
    );
  } else {
      
    const resultsHistoryInsert = await collectionHistory.insertOne(
      {
        email: email,
        date: todayDate,
        count: 1,
      }
    );
  }



  if (results) {
    return {
      ...results,
      //bioMdx: await getMdxSource(results.bio || placeholderBio)
    };
  } else {
    return null;
  }
}



export async function getFirstUser(): Promise<UserProps | null> {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');
  const results = await collection.findOne<UserProps>(
    {},
    {
      projection: { _id: 0, emailVerified: 0 }
    }
  );
  if (results) {
    return {
      ...results,
      //bioMdx: await getMdxSource(results.bio || placeholderBio)
    };
  } else {
    return null;
  }
}




export async function getAllUsers( {
  limit,
  page,
  sort,
  order,
  q,
  regTypeArray,
  startDate,
  endDate,
}: {
  limit: number,
  page: number,
  sort: string,
  order: string,
  q: string,
  regTypeArray: string[],
  startDate: string,
  endDate: string,
}): Promise<ResultProps> {



  console.log('limit: ' + limit);
  console.log('page: ' + page);
  console.log('sort: ' + sort);
  console.log('order: ' + order);
  console.log('q: ' + q);
  console.log('regTypeArray: ' + regTypeArray);

  const query = q || '';


  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  const results = await collection
  .aggregate<UserProps>([

    {
      $match: {

        // valide email address
        email: {
          $regex: '@',
          $options: 'i'
        },

        // if nickname is not exist, then exclude it
        //nickname: {
        //  $exists: true
        //},


        
        status: {
          $exists: true,
          $eq: 'active'
        },
        
        // if roles is exist and then roles is in ['user']
        // if roles is not exist and then roles is in ['user']

        
        $or: [
          { roles: { $exists: true, $in: ['user'] } },
          { roles: { $exists: false } },
        ],
        

      }
    },

    {
      $match: {
        $or: [
          { mobile: { $regex: query, $options: 'i' } },
          { nickname: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      },
    },

    // regTypeArray match
    {
      $match: {
        regType: {
          $in: regTypeArray,
        },
      },
    },

    // startDate, endDate match for createdAt

    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        },
      },
    },

  

    // when  regType is 'all', then return all users
    // and when regType is 'email', 'kakao', 'naver', 'google', 'apple', then return users by regType
   

    

    {
      $sort: {
          [sort]: order === 'asc' ? 1 : -1,
      },
    },
    {
        $skip: (page - 1) * limit,
    },
    {
        $limit:  limit,
    },
    
  ])
  .toArray();


  const resultsCount = await collection.aggregate([
    {
      $match: {

        // valide email address
        email: {
          $regex: '@',
          $options: 'i'
        },

        // if nickname is not exist, then exclude it
        //nickname: {
        //  $exists: true
        //},
        
        status: {
          $exists: true,
          $eq: 'active'
        },
        
        // if roles is exist and then roles is in ['user']
        // if roles is not exist and then roles is in ['user']

        $or: [
          { roles: { $exists: true, $in: ['user'] } },
          { roles: { $exists: false } },
        ],

      }
    },

    {
      $match: {
        $or: [
          { mobile: { $regex: query, $options: 'i' } },
          { nickname: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      },
    },

    // regTypeArray match
    {
      $match: {
        regType: {
          $in: regTypeArray,
        },
      },
    },

    // startDate, endDate match for createdAt

    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        },
      },
    },
    
    {
      $count: 'count',
    },
  ]).toArray();


 


  return {
    _id: '1',
    users: results,
    totalCount: resultsCount[0]?.count || 0,
  };

  
}




export async function searchUser(query: string): Promise<UserProps[]> {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');
  return await collection
    .aggregate<UserProps>([
      {
        $search: {
          index: 'name-index',
          /* 
          name-index is a search index as follows:

          {
            "mappings": {
              "fields": {
                "followers": {
                  "type": "number"
                },
                "name": {
                  "analyzer": "lucene.whitespace",
                  "searchAnalyzer": "lucene.whitespace",
                  "type": "string"
                },
                "username": {
                  "type": "string"
                }
              }
            }
          }

          */
          text: {
            query: query,
            path: {
              wildcard: '*' // match on both name and username
            },
            fuzzy: {},
            score: {
              // search ranking algorithm: multiply relevance score by the log1p of follower count
              function: {
                multiply: [
                  {
                    score: 'relevance'
                  },
                  {
                    log1p: {
                      path: {
                        value: 'followers'
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        // filter out users that are not verified
        $match: {
          verified: true
        }
      },
      // limit to 10 results
      {
        $limit: 10
      },
      {
        $project: {
          _id: 0,
          emailVerified: 0,
          score: {
            $meta: 'searchScore'
          }
        }
      }
    ])
    .toArray();
}



export async function getUserCount(
  query: string = 'no query',
): Promise<number> {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  const result = await collection.aggregate([
    {
      $match: {

        // valide email address
        email: {
          $regex: '@',
          $options: 'i'
        },

        // if nickname is not exist, then exclude it
        nickname: {
          $exists: true
        },
        
        status: {
          $exists: true,
          $eq: 'active'
        },
        
        // if roles is exist and then roles is in ['user']
        // if roles is not exist and then roles is in ['user']

        $or: [
          { roles: { $exists: true, $in: ['user'] } },
          { roles: { $exists: false } },
        ],

      }
    },

    

    {
      $match: {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { nickname: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      },
    },
    



    {
      $count: 'count',
    },

  ]).toArray();

  console.log('getUserCount : ' + result[0]?.count);


  return result[0]?.count || 0;


}










export async function updateUser(username: string, bio: string) {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');
  return await collection.updateOne({ username }, { $set: { bio } });
}





/* set user */
export async function setUser (

  {
    email,
    password,
    regType,
    isAgreedTerms,
    isAgreedPrivacy,
    isAgreedMarketing,
  }: {
    email: string,
    password: string,
    regType: string,
    isAgreedTerms: string,
    isAgreedPrivacy: string,
    isAgreedMarketing: string,

  } 
): Promise<UserProps | null> {

  /*
    {
      email,
      password,
      regType,
      isAgreedTerms,
      isAgreedPrivacy,
      isAgreedMarketing,
    }: {
      email: string,
      password: string,
      regType: string,
      isAgreedTerms: string,
      isAgreedPrivacy: string,
      isAgreedMarketing: string,

    }
  ) {
    */

    console.log('setUser email: ' + email);
    console.log('setUser password: ' + password);
    console.log('setUser regType: ' + regType);
    console.log('setUser isAgreedTerms: ' + isAgreedTerms);
    console.log('setUser isAgreedPrivacy: ' + isAgreedPrivacy);
    console.log('setUser isAgreedMarketing: ' + isAgreedMarketing);


    const client = await clientPromise;
    const collection = client.db('vienna').collection('users');
  

    // delete all documents wherer email is ''
    const resultsDelete = await collection.deleteMany({ email: '' });






      /* check if email exists */
      const resultsCheck = await collection.findOne<UserProps>(
        { email: email },
        { projection: { _id: 0, emailVerified: 0 } }
      );

      if (resultsCheck) {
        return null;
      }


    // get sequence number and increment it

    // random 6 digit number
    const id = Math.floor(100000 + Math.random() * 900000).toString();

    //console.log('setUser email: ' + email);
    //console.log('setUser password: ' + password);
    ///console.log('setUser id: ' + id);

  

    // insert one document and read it
    const res1 = await collection.insertOne(
      {
        id: id,
        email: email,
        password: password,
        regType: regType,
        isAgreedTerms: isAgreedTerms,
        isAgreedPrivacy: isAgreedPrivacy,
        isAgreedMarketing: isAgreedMarketing,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),


        roles: [
          'user',
          //'admin',
          //'moderator',
          //'writer',
          //'editor',
        ],
      }
    );


    return await collection.findOne<UserProps>(
      { id: id },
      { projection: { _id: 0, emailVerified: 0 } }
    );
    


    //console.log('setUser res1: ' + res1);

    /*
    const results =  await collection.findOne(
      {
        id: id,
      }
    );

    console.log('setUser results: ' + results); 
  
    
    
    //return results;

    if (results) {
      return {
        ...results,
        //bioMdx: await getMdxSource(results.bio || placeholderBio)
      };
    } else {
      return null;
    }
    */



  
  }









/* set user */
export async function setManager (

  {
    email,
    password,
    regType,
    roles,
    isAgreedTerms,
    isAgreedPrivacy,
    isAgreedMarketing,
  }: {
    email: string,
    password: string,
    regType: string,
    roles: string,
    isAgreedTerms: string,
    isAgreedPrivacy: string,
    isAgreedMarketing: string,

  } 
): Promise<UserProps | null> {

  /*
    {
      email,
      password,
      regType,
      isAgreedTerms,
      isAgreedPrivacy,
      isAgreedMarketing,
    }: {
      email: string,
      password: string,
      regType: string,
      isAgreedTerms: string,
      isAgreedPrivacy: string,
      isAgreedMarketing: string,

    }
  ) {
    */

    console.log('setUser email: ' + email);
    console.log('setUser password: ' + password);
    console.log('setUser regType: ' + regType);
    console.log('setUser isAgreedTerms: ' + isAgreedTerms);
    console.log('setUser isAgreedPrivacy: ' + isAgreedPrivacy);
    console.log('setUser isAgreedMarketing: ' + isAgreedMarketing);


    const client = await clientPromise;
    const collection = client.db('vienna').collection('users');
  

    // delete all documents wherer email is ''
    const resultsDelete = await collection.deleteMany({ email: '' });






      /* check if email exists */
      const resultsCheck = await collection.findOne<UserProps>(
        { email: email },
        { projection: { _id: 0, emailVerified: 0 } }
      );

      if (resultsCheck) {
        return null;
      }


    // get sequence number and increment it

    // random 6 digit number
    const id = Math.floor(100000 + Math.random() * 900000).toString();

    //console.log('setUser email: ' + email);
    //console.log('setUser password: ' + password);
    ///console.log('setUser id: ' + id);

  

    // insert one document and read it
    const res1 = await collection.insertOne(
      {
        id: id,
        email: email,
        password: password,
        regType: regType,
        isAgreedTerms: isAgreedTerms,
        isAgreedPrivacy: isAgreedPrivacy,
        isAgreedMarketing: isAgreedMarketing,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),


        roles: [
          'user',
          //'admin',
          //'moderator',
          //'writer',
          //'editor',
        ],
      }
    );


    return await collection.findOne<UserProps>(
      { id: id },
      { projection: { _id: 0, emailVerified: 0 } }
    );
    


    //console.log('setUser res1: ' + res1);

    /*
    const results =  await collection.findOne(
      {
        id: id,
      }
    );

    console.log('setUser results: ' + results); 
  
    
    
    //return results;

    if (results) {
      return {
        ...results,
        //bioMdx: await getMdxSource(results.bio || placeholderBio)
      };
    } else {
      return null;
    }
    */



  
  }


  


  export async function updateUserByEmail (
    {
      email,
      name,
      nickname,
      //생년월일
      birthDate,
      emailVerified,
      mobile,
      avatar,

      //성별
      gender,
      weight,
      height,
      purpose,
      marketingAgree,
      medicalHistory,
      familyMedicalHistory,
      password,

    }: {
      email: string,
      name: string,
      nickname: string,
      //생년월일
      birthDate: string,
      emailVerified: string,
      mobile: string,
      avatar: string,
      gender: string,
      weight: number,
      height: number,
      purpose: string,
      marketingAgree: string,
      medicalHistory: string,
      familyMedicalHistory: string,
      password: string,
    }
  ) {

    console.log('updateUserByEmail email: ' + email);
    console.log('updateUserByEmail password: ' + password);
    console.log('updateUserByEmail medicalHistory: ' + medicalHistory);
    console.log('updateUserByEmail familyMedicalHistory: ' + familyMedicalHistory);

    console.log('updateUserByEmail birthDate: ' + birthDate);


    const client = await clientPromise;
    const collection = client.db('vienna').collection('users');
  

    //return await collection.updateOne({ username }, { $set: { bio } });

    // update on by email
    const results = await collection.updateOne(
      { email: email },
      { $set:
      
        {
          name: name,
          nickname: nickname,
          birthDate: birthDate,
          emailVerified: emailVerified,
          mobile: mobile,
          avatar: avatar,
          gender: gender,
          weight: weight,
          height: height,
          purpose: purpose,
          marketingAgree: marketingAgree,
          medicalHistory: medicalHistory,
          familyMedicalHistory: familyMedicalHistory,
          password: password,

        }
      }
    );


 

    return results;
  
  }


  /*
        id,
      name,
      nickname,
      avatar,
      birthDate,
      gender,
      weight,
      height,
      purpose,
      marketingAgree,
      medicalHistory,
      familyMedicalHistory,
      */

  export async function updateUserById (
    {
      id,
      name,
      nickname,
      avatar,
      //생년월일
      birthDate,
      //성별
      gender,
      weight,
      height,
      purpose,
      medicalHistory,
      familyMedicalHistory,

    }: {
      id: string,
      name: string,
      nickname: string,
      avatar: string,
      //생년월일
      birthDate: string,
      gender: string,
      weight: number,
      height: number,
      purpose: string,
      medicalHistory: string,
      familyMedicalHistory: string,
    }
  ) {

    const client = await clientPromise;
    const collection = client.db('vienna').collection('users');
  

    //return await collection.updateOne({ username }, { $set: { bio } });

    // update on by id
    const results = await collection.updateOne(
      { id: id },
      { $set:
      
        {
          name: name,
          nickname: nickname,
          avatar: avatar,
          birthDate: birthDate,
          gender: gender,
          weight: weight,
          height: height,
          purpose: purpose,
          medicalHistory: medicalHistory,
          familyMedicalHistory: familyMedicalHistory,

        }
      }
    );


    console.log('updateUserById results: ' + results);

    return results;
  
  }



  export async function updateAvatarById (
    {
      id,
      avatar,

    }: {
      id: string,
      avatar: string,
    }
  ) {

    const client = await clientPromise;
    const collection = client.db('vienna').collection('users');

    const results = await collection.updateOne(
      { id: id },
      { $set:
      
        {
          avatar: avatar,
        }
      }
    );

    return results;
  }


  export async function updateAvatarByEmail (
    {
      email,
      avatar,

    }: {
      email: string,
      avatar: string,
    }
  ) {

    const client = await clientPromise;
    const collection = client.db('vienna').collection('users');

    const results = await collection.updateOne(
      { email: email },
      { $set:
      
        {
          avatar: avatar,
        }
      }
    );

    return results;
  }







  /*
  export async function getAllWithdrewers(
    limit: number = 10,
    page: number = 1,
    sort: string = 'no sort',
    order: string = 'no order',
    query: string = 'no query',
  ): Promise<UserProps[]> {
  
    console.log('limit: ' + limit);
    console.log('page: ' + page);
    console.log('sort: ' + sort);
    console.log('order: ' + order);
    console.log('query: ' + query);
  
  
  
    const client = await clientPromise;
    const collection = client.db('vienna').collection('users');
  
    return await collection
    .aggregate<UserProps>([
  
      
  
      
      {
        $match: {
  
          // valide email address
          email: {
            $regex: '@',
            $options: 'i'
          },
  
          // if nickname is not exist, then exclude it
          nickname: {
            $exists: true
          },
  
  
          
          status: {
            $exists: true,
            $eq: 'withdraw'
          },
          
          // if roles is exist and then roles is in ['user']
          // if roles is not exist and then roles is in ['user']
  
          $or: [
            { roles: { $exists: true, $in: ['user'] } },
            { roles: { $exists: false } },
          ],
  
        }
      },
  
      {
        $match: {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { nickname: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
          ],
        },
      },
      
  
      {
        $sort: {
            [sort]: order === 'asc' ? 1 : -1,
        },
      },
      {
          $skip: (page - 1) * limit,
      },
      {
          $limit:  limit,
      },
      
    ])
    .toArray();
  
  
    
  }
  */


 

export async function getAllWithdrewers( {
  limit,
  page,
  sort,
  order,
  q,
  regTypeArray,
  startDate,
  endDate,
}: {
  limit: number,
  page: number,
  sort: string,
  order: string,
  q: string,
  regTypeArray: string[],
  startDate: string,
  endDate: string,
}): Promise<ResultProps> {



  console.log('limit: ' + limit);
  console.log('page: ' + page);
  console.log('sort: ' + sort);
  console.log('order: ' + order);
  console.log('q: ' + q);
  console.log('regTypeArray: ' + regTypeArray);

  const query = q || '';


  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  const results = await collection
  .aggregate<UserProps>([

    {
      $match: {

        // valide email address
        email: {
          $regex: '@',
          $options: 'i'
        },

        // if nickname is not exist, then exclude it
        nickname: {
          $exists: true
        },


        
        status: {
          $exists: true,
          $eq: 'withdraw'
        },
        
        // if roles is exist and then roles is in ['user']
        // if roles is not exist and then roles is in ['user']

        $or: [
          { roles: { $exists: true, $in: ['user'] } },
          { roles: { $exists: false } },
        ],

      }
    },

    {
      $match: {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { nickname: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      },
    },

    // regTypeArray match
    {
      $match: {
        regType: {
          $in: regTypeArray,
        },
      },
    },

    // startDate, endDate match for createdAt

    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        },
      },
    },

  

    // when  regType is 'all', then return all users
    // and when regType is 'email', 'kakao', 'naver', 'google', 'apple', then return users by regType
   

    

    {
      $sort: {
          [sort]: order === 'asc' ? 1 : -1,
      },
    },
    {
        $skip: (page - 1) * limit,
    },
    {
        $limit:  limit,
    },
    
  ])
  .toArray();


  const resultsCount = await collection.aggregate([
    {
      $match: {

        // valide email address
        email: {
          $regex: '@',
          $options: 'i'
        },

        // if nickname is not exist, then exclude it
        nickname: {
          $exists: true
        },
        
        status: {
          $exists: true,
          $eq: 'withdraw'
        },
        
        // if roles is exist and then roles is in ['user']
        // if roles is not exist and then roles is in ['user']

        $or: [
          { roles: { $exists: true, $in: ['user'] } },
          { roles: { $exists: false } },
        ],

      }
    },

    {
      $match: {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { nickname: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      },
    },

    // regTypeArray match
    {
      $match: {
        regType: {
          $in: regTypeArray,
        },
      },
    },

    // startDate, endDate match for createdAt

    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        },
      },
    },
    
    {
      $count: 'count',
    },
  ]).toArray();


 


  return {
    _id: '1',
    users: results,
    totalCount: resultsCount[0]?.count || 0,
  };

  
}

 
  





  export async function getWithdrewerCount(
    query: string = 'no query',
  ): Promise<number> {
  
    const client = await clientPromise;
    const collection = client.db('vienna').collection('users');
  
  
    const result = await collection.aggregate([
      {
        $match: {
  
          // valide email address
          email: {
            $regex: '@',
            $options: 'i'
          },
  
          // if nickname is not exist, then exclude it
          nickname: {
            $exists: true
          },
          
          status: {
            $exists: true,
            $eq: 'withdraw'
          },
          
          // if roles is exist and then roles is in ['user']
          // if roles is not exist and then roles is in ['user']
  
          $or: [
            { roles: { $exists: true, $in: ['user'] } },
            { roles: { $exists: false } },
          ],
  
        }
      },
  
      
  
      {
        $match: {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { nickname: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
          ],
        },
      },
      
  
  
  
      {
        $count: 'count',
      },
  
    ]).toArray();
  
  
    return result[0]?.count || 0;
  
  
  }










// check duplicate email and return true or false

export async function checkDuplicateEmail (
  _email: string,
): Promise<string> {

  ///console.log('checkDuplicateEmail _email: ' + _email);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  const results = await collection.findOne<UserProps>(
    { email: _email },
    { projection: { _id: 0, emailVerified: 0 } }
  );

  console.log('checkDuplicateEmail results: ' + results);

  if (results) {
    return 'Y';
  } else {
    return 'N';
  }
}



// check duplicate nickname and return true or false
export async function checkDuplicateNickname (
  _nickname: string,
): Promise<string> {

  console.log('checkDuplicateNickname _nickname: ' + _nickname);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  const results = await collection.findOne<UserProps>(
    { nickname: _nickname },
    { projection: { _id: 0, emailVerified: 0 } }
  );

  console.log('checkDuplicateNickname results: ' + results);

  if (results) {
    return 'Y';
  } else {
    return 'N';
  }
}




export async function checkDuplicateMobile (
  _mobile: string,
): Promise<string> {

  console.log('checkMobile _mobile: ' + _mobile);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  const results = await collection.findOne<UserProps>(
    { mobile: _mobile },
    { projection: { _id: 0, emailVerified: 0 } }
  );

  console.log('checkMobile results: ' + results);

  if (results) {
    return 'Y';
  } else {
    return 'N';
  }
}





// create or update user contract
export async function updateContract (
  {
    contractName,
    contractVersion,
    contractStatus,
    contractContent,
  }: {
    contractName: string,
    contractVersion: string,
    contractStatus: string,
    contractContent: string,
  }
) {
  
    //console.log('updateContract contractName: ' + contractName);
    //console.log('updateContract contractVersion: ' + contractVersion);
    //console.log('updateContract contractStatus: ' + contractStatus);
    //console.log('updateContract contractContent: ' + contractContent);
  
    const client = await clientPromise;
    const collection = client.db('vienna').collection('user_contract');
  
    const results = await collection.updateOne(
      { contractName: contractName },
      { $set:
      
        {
          contractName: contractName,
          contractVersion: contractVersion,
          contractStatus: contractStatus,
          contractContent: contractContent,
        }
      },
      { upsert: true }
    );
  
    console.log('updateContract results: ' + results);
  
    return results;
  }



  // get user contract
export async function getContract (
  {
    contractName,
  }: {
    contractName: string,
  }

): Promise<string> {
  
    ///console.log('getContract contractName: ' + contractName);
  
    const client = await clientPromise;
    const collection = client.db('vienna').collection('user_contract');

    // when collection does not exist, create collection



  
    const results = await collection.findOne(
      { contractName: contractName },
      { projection: { _id: 0, contractName: 0, contractVersion: 0, contractStatus: 0 } }
    );
  
    console.log('getContract results: ' + results);
  
    return results?.contractContent || '';
  }



// updateProfileById
/*
          id: _id,
          name: userName,
          nickname: userNickname,
          birthDate: userBirthDate,
          gender: userGender,
          avatar: userAvatar,
          weight: userWeight,
          height: userHeight,
          purpose: userPurpose,
          medicalHistory: userMedicalHistory,
          familyMedicalHistory: userFamilyMedicalHistory,
*/





export async function updateProfileById (
  {
    id,
    name,
    nickname,
    mobile,
    avatar,
    //생년월일
    birthDate,
    //성별
    gender,
    weight,
    height,
    purpose,
    medicalHistory,
    familyMedicalHistory,

  }: {
    id: string,
    name: string,
    nickname: string,
    mobile: string,
    avatar: string,
    //생년월일
    birthDate: string,
    gender: string,
    weight: number,
    height: number,
    purpose: string,
    medicalHistory: string,
    familyMedicalHistory: string,
  }
) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  //return await collection.updateOne({ username }, { $set: { bio } });

  // update on by id
  const results = await collection.updateOne(
    { id: id },
    { $set:
    
      {
        name: name,
        nickname: nickname,
        mobile: mobile,
        avatar: avatar,
        birthDate: birthDate,
        gender: gender,
        weight: weight,
        height: height,
        purpose: purpose,
        medicalHistory: medicalHistory,
        familyMedicalHistory: familyMedicalHistory,

      }
    }
  );


  ///console.log('updateProfileById results: ' + results);

  return results;

}


// sendVerificationCode
// generate 4 digit random number for verification code
// match mobile and uuid
// save it to mongodb
export async function sendVerificationCode (
  _mobile: string,
  _uuid: string,
) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('user_verification_code');

  //const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const verificationCode = "1234";




  const results = await collection.updateOne(
    { mobile: _mobile, uuid: _uuid },
    { $set:
    
      {
        mobile: _mobile,
        uuid: _uuid,
        verificationCode: verificationCode,
        createdAt: new Date(),
      }
    },
    { upsert: true }
  );

  return results;

}


// verifyVerificationCode
// check if verification code is valid and  last 3 minutes afer createdAt
// if valid, then return 'Y'
// if not valid, then return user info

export async function verifyVerificationCode (
  _mobile: string,
  _uuid: string,
  _verificationCode: string,
): Promise<UserProps | null> {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('user_verification_code');

  const results = await collection.findOne(
    {
      mobile: _mobile, uuid: _uuid, verificationCode: _verificationCode,
      createdAt: {
        $gte: new Date(new Date().getTime() - 3 * 60 * 1000)
      }
    },
    { projection: { _id: 0, mobile: 0, uuid: 0, verificationCode: 0, createdAt: 0 } }

  );

  ///console.log('verifyVerificationCode results: ' + results);

  if (results) {

    const collectionUser = client.db('vienna').collection('users');

    // get user by mobile
    const resultsUser = await collectionUser.findOne<UserProps>(
      { mobile: _mobile },
      { projection: { _id: 0, emailVerified: 0 } }
    );
   
    return resultsUser || null;

  } else {

    return null;
  }

}







// sendVerificationCode
// generate 4 digit random number for verification code
// match mobile and uuid
// save it to mongodb
export async function sendVerificationCodeForEmail (
  _email: string,
  _uuid: string,
) {

  console.log('sendVerificationCodeForEmail _email: ' + _email);
  console.log('sendVerificationCodeForEmail _uuid: ' + _uuid);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('user_verification_code_email');

  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

  ///const verificationCode = "1234";



  //const html = `인증번호는 ${verificationCode} 입니다.`;
  /*
     <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>인증번호</h2>
      <p>인증번호는 ${verificationCode} 입니다.</p>
    </div>
    */

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>두잉두잇 인증번호</title>
    </head>
    <body>
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>두잉두잇 인증번호</h2>
        
        <h1>인증번호는 ${verificationCode} 입니다.</h1>

      </div>
    </body>
  </html>
  `;


  try {
    // Nodemailer transporter 생성
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'doingdoit.cs@gmail.com',
        
        pass: 'jspk xmnr dmeo pdhu', // Gmail '앱 비밀번호'

      },
    });
    

    /*
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
      auth: {
          user: 'doingdoit.cs@gmail.com', 
          pass: 'jspk xmnr dmeo pdhu' 
      }
    });
    */



    // 전송할 이메일 내용 설정
    const mailOptions = {

      from: 'doingdoit.cs@gmail.com',

      //to: 'songpalabs@gmail.com', //필자의 naver 계정에 보내보았다.

      to: _email,

      subject: '[두잉두잇] 인증번호',
      
      //text: html,

      html: html,

    };

    // 이메일 전송
    const info = await transporter.sendMail(mailOptions);

    console.log('이메일 전송 성공:', info.response);

  

  } catch (error) {
   
    console.error('이메일 전송 실패:', error);


  
  }









  const results = await collection.updateOne(
    { email: _email, uuid: _uuid },
    { $set:
    
      {
        email: _email,
        uuid: _uuid,
        verificationCode: verificationCode,
        createdAt: new Date(),
      }
    },
    { upsert: true }
  );

  return results;

}





// verifyVerificationCode
// check if verification code is valid and  last 3 minutes afer createdAt
// if valid, then return 'Y'
// if not valid, then return user info

export async function verifyVerificationCodeByEmail (
  _email: string,
  _uuid: string,
  _verificationCode: string,
): Promise<UserProps | null> {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('user_verification_code_email');

  const results = await collection.findOne(
    {
      email: _email, uuid: _uuid, verificationCode: _verificationCode,
      createdAt: {
        $gte: new Date(new Date().getTime() - 3 * 60 * 1000)
      }
    },
    { projection: { _id: 0, email: 0, uuid: 0, verificationCode: 0, createdAt: 0 } }

  );

  console.log('verifyVerificationCode results: ' + results);

  if (results) {

    const collectionUser = client.db('vienna').collection('users');

    // get user by mobile
    const resultsUser = await collectionUser.findOne<UserProps>(
      { email: _email },
      { projection: { _id: 0, emailVerified: 0 } }
    );
   
    return resultsUser || null;

  } else {

    return null;
  }

}




// updatePasswordByEmail

export async function updatePasswordByEmail (
  _email: string,
  _password: string,
) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  const results = await collection.updateOne(
    { email: _email },
    { $set:
    
      {
        password: _password,
      }
    }
  );

  return results;

}








/* delete one */
export async function deleteOne(
  id: string,
): Promise<any> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');





  const result =  await collection.deleteOne({
      id: id,
  });


  // delete all feeds having userId

  const collectionFeed = client.db('vienna').collection('feeds');

  await collectionFeed.deleteMany({
    userId: id,
  });


  // delete all feed_scraps having feedId
  // delete all feed_likes having feedId

  const collectionFeedScrap = client.db('vienna').collection('feed_scraps');

  await collectionFeedScrap.deleteMany({
    userId: id,
  });

  const collectionFeedLike = client.db('vienna').collection('feed_likes');

  await collectionFeedLike.deleteMany({
    userId: id,
  });


  // delete all favorite_foods having userId
  const collectionFavoriteFood = client.db('vienna').collection('favorite_foods');

  await collectionFavoriteFood.deleteMany({
    userId: id,
  });

  // delete user_foods having userId
  const collectionUserFood = client.db('vienna').collection('user_foods');

  await collectionUserFood.deleteMany({
    userId: id,
  });



  // delete boards having userId
  const collectionBoard = client.db('vienna').collection('boards');

  await collectionBoard.deleteMany({
    userId: id,
  });

  // delete comments having userId
  const collectionComment = client.db('vienna').collection('comments');

  await collectionComment.deleteMany({
    userId: id,
  });

  // delete comment_replies having userId
  const collectionCommentReply = client.db('vienna').collection('comment_replies');

  await collectionCommentReply.deleteMany({
    userId: id,
  });


  // delete likes having userId
  const collectionLike = client.db('vienna').collection('likes');

  await collectionLike.deleteMany({
    userId: id,
  });


  // delete surveys having userId
  const collectionSurvey = client.db('vienna').collection('surveys');

  await collectionSurvey.deleteMany({
    userId: id,
  });



  // delete points
  const collectionPoint = client.db('vienna').collection('points');

  await collectionPoint.deleteMany({
    userId: id,
  });


  // delete notifications

  const collectionNotification = client.db('vienna').collection('notifications');

  await collectionNotification.deleteMany({
    userId: id,
  });

 

  return result;


}






// withdraw user

export async function withdrawByEmail (
  _email: string,
) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  const results = await collection.updateOne(
    { email: _email },
    { $set:
    
      {
        status: 'withdraw',
        withdrawAt: new Date(),
      }
    }
  );

  return results;

}



// withdraw recovery user

export async function withdrawRecoveryById (
  id: string,
) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  const results = await collection.updateOne(
    { id: id },
    { $set:
    
      {
        status: 'active',
      }
    }
  );

  return results;

}




// getAllFeedbackWriterList
export async function getAllFeedbackWriterList(
  limit: number = 10,
  page: number = 1,
  sort: string = 'no sort',
  order: string = 'no order',
  query: string = 'no query',
): Promise<UserProps[]> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  return await collection.aggregate<UserProps>([
    {
      $match: {

        // valide email address
        email: {
          $regex: '@',
          $options: 'i'
        },

        // if nickname is not exist, then exclude it
        nickname: {
          $exists: true
        },

        // if roles is exist and then roles is in ['user']
        // if roles is not exist and then roles is in ['user']

        $or: [
          { roles: { $exists: true, $in: ['feedback_writer'] } },
          { roles: { $exists: false } },
        ],

      }
    },

    {
      $match: {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { nickname: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      },
    },

    {
      $sort: {
          [sort]: order === 'asc' ? 1 : -1,
      },
    },
    {
        $skip: (page - 1) * limit,
    },
    {
        $limit:  limit,
    },
    
  ])

  .toArray();


}




// checkEmailRegistered

export async function checkEmailRegistered (
  _email: string,
): Promise<UserProps | null> {

  console.log('checkEmailRegistered _email: ' + _email);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  // regType is 'email' and status is 'active'

  const results = await collection.findOne<UserProps>(
    { email: _email, regType: 'email', status: 'active' },
    { projection: { _id: 0, emailVerified: 0 } }
  );

  ///console.log('checkEmailRegistered results: ' + results);

  return results;


    

}