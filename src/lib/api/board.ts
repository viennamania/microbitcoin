import clientPromise from '@/lib/mongodb';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { S, u } from 'uploadthing/dist/types-e8f81bbc';
import { Interface } from 'readline';
import { contentFieldToContent } from 'uploadthing/client';

// object id
import { ObjectId } from 'mongodb';

export interface BoardProps {


  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userNickname: string;
  userAvatar: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;


  title: string;
  content: string;
  images: string[];

  category: string;
  tags: string[];


  scrapCount: number;
  likeCount: number;
  commentCount: number;
  viewCount: number;

  likeYn: boolean;


}


export interface ResultProps {
  _id: string;
  boards: BoardProps[];
  totalCount: number;
}

/*
export interface ResultProps {
  _id: string;
  boards: BoardProps[];
}
*/


export interface TagProps {
  name: string;
  count: number;
}

export interface TagResultProps {
  _id: string;
  tags: TagProps[];
  totalCount: number;
}


export interface ReplyProps { 

  id: string;
  boardId: string;
  commentId: string;
  userId: string;
  userEmail: string;
  userNickname: string;
  userAvatar: string;

  content: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;

}

export interface CommentProps {
  
  id: string;
  boardId: string;
  userId: string;
  userEmail: string;
  userNickname: string;
  userAvatar: string;

  content: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  replies: ReplyProps[];
  replyCount: number;

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




/*
export async function getAll(

  limit: number,
  page: number,
  sort: string,
  order: string,
  q: string,

): Promise<ResultProps> {
*/

export async function getAll ( {
  limit,
  page,
  sort,
  order,
  q,
}: {
  limit: number,
  page: number,
  sort: string,
  order: string,
  q: string,
}): Promise<ResultProps> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('boards');


  console.log('limit: ' + limit);
  console.log('page: ' + page);

  
  ///const query = q === null ? '' : q;

  const query = q || '';

  console.log('query: [' + query + ']');



  const results = await collection
    .aggregate<BoardProps>([


      // match by q and feedTitle and feedContent and hiddenYn is exist  and not 'Y'
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            ////{ content: { $regex: query, $options: 'i' } },
            { userNickname: { $regex: query, $options: 'i' } },

            // tags array match
            { tags: { $elemMatch: { $regex: query, $options: 'i' } } },

          ],

        }
      },

      // lookup comments and get count of comments
      {
        $lookup:
        {
          from: 'comments',
          localField: 'id',
          foreignField: 'boardId',
          as: 'comments'
        }
      },

      // just get sum of comments plus sum of replies

      {
        $lookup:
        {
          from: 'comment_replies',
          localField: 'id',
          foreignField: 'boardId',
          as: 'replies'
        }
      },

      {
        $addFields: {
          commentCount: { $size: "$comments" },
          replyCount: { $size: "$replies" },
        }
      },

      {
        $project: {
          _id: 0,
          emailVerified: 0,
          comments: 0,
        }
      },


      /*
      sort === 'createdAt' ? { $sort: { createdAt: order === 'asc' ? 1 : -1 } } : { $sort: { viewCount: order === 'asc' ? 1 : -1 } },
      
      {
        $limit: limit,
        //////$skip: (page - 1) * limit, // skip the first n documents

      },
      */

      {
        $sort: {
          /////////////////////////////////////isTop: -1,
          [sort]: order === 'asc' ? 1 : -1,
        },
      },



      {
          $skip: (page - 1) * limit,
      },
      
      {
          $limit: limit,
      },


      
    ])
    .toArray();


    // get total count
    const totalCount = await collection.countDocuments(

      /*
      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { nickname: { $regex: query, $options: 'i' } },
        ],
      }
      */

      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          ////{ content: { $regex: query, $options: 'i' } },
          { userNickname: { $regex: query, $options: 'i' } },

          // tags array match
          { tags: { $elemMatch: { $regex: query, $options: 'i' } } },

        ],

      }



    );


    console.log('totalCount: ' + totalCount);

    // return results and totalCount


  return {
    _id: '1',
    boards: results,
    totalCount: totalCount,
  };



}


// getAllByUserId
export async function getAllByUserId({
  userId,
  limit,
  page,
  sort,
  order,
  q,
}: {
  userId: string,
  limit: number,
  page: number,
  sort: string,
  order: string,
  q: string,
}): Promise<ResultProps> {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('boards');

  const query = q || '';

  const results = await collection.aggregate<BoardProps>([
    {
      $match: {
        userId,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
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
      $limit: limit,
    },
  ]).toArray();

  const totalCount = await collection.countDocuments({
    userId,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
    ],
  });

  return {
    _id: '1',
    boards: results,
    totalCount,
  };


}






  // get total count
  export async function getAllCount(
    q: string,
  ) {
      
      const client = await clientPromise;
      const collection = client.db('vienna').collection('boards');


      const query = q || '';
  
      const results = await collection.countDocuments(

        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { nickname: { $regex: query, $options: 'i' } },
          ],

        }

      );
  
      return results;
  }










export async function getTop(

  limit: number,
  page: number,
  sort: string,
  order: string,
  q: string,

///): Promise<ResultProps[]> {

): Promise<BoardProps[]> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('boards');


  console.log('limit: ' + limit);
  console.log('page: ' + page);

  
  ///const query = q === null ? '' : q;

  const query = q || '';


  return await collection
    .aggregate<BoardProps>([

      ////sort === 'createdAt' ? { $sort: { createdAt: order === 'asc' ? 1 : -1 } } : { $sort: { viewCount: order === 'asc' ? 1 : -1 } },


      {
        $sort: { viewCount: -1 }

      },
      
      {
        $limit: limit,
        //////$skip: (page - 1) * limit, // skip the first n documents

      },
      // match by q and feedTitle and feedContent and hiddenYn is exist  and not 'Y'
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            ////{ content: { $regex: query, $options: 'i' } },
            { nickname: { $regex: query, $options: 'i' } },

            // tags array match
            { tags: { $elemMatch: { $regex: query, $options: 'i' } } },

          ],

        }
      },

      // lookup comments and get count of comments
      {
        $lookup:
        {
          from: 'comments',
          localField: 'id',
          foreignField: 'boardId',
          as: 'comments'
        }
      },

      // just get sum of comments plus sum of replies

      {
        $lookup:
        {
          from: 'comment_replies',
          localField: 'id',
          foreignField: 'boardId',
          as: 'replies'
        }
      },

      {
        $addFields: {
          commentCount: { $size: "$comments" },
          replyCount: { $size: "$replies" },
        }
      },

      {
        $project: {
          _id: 0,
          emailVerified: 0,
          comments: 0,
        }
      },



      
    ])
    .toArray();

}






/* get count */
export async function getCount(
  email: string,
  q: string,
): Promise<number> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('boards');


  const result = await collection.aggregate([
      {
          $match: {
            $or: [
              { title: { $regex: q, $options: 'i' } },
              ////{ content: { $regex: query, $options: 'i' } },
              { nickname: { $regex: q, $options: 'i' } },

              // tags array match
              { tags: { $elemMatch: { $regex: q, $options: 'i' } } },

            ],

          }
      },
      {
          $count: 'count',
      },

  ]).toArray();

  return result[0]?.count || 0;

}



export async function update(username: string, bio: string) {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('boards');
  return await collection.updateOne({ username }, { $set: { bio } });
}



export async function getOne(id: string): Promise<BoardProps | null> {
  console.log('getOne id: ' + id);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('boards');
  const results = await collection.findOne<BoardProps>(
    { id },
    { projection: { _id: 0, emailVerified: 0 } }
  );
  if (results) {
    return {
      ...results,
      ///bioMdx: await getMdxSource(results.bio || placeholderBio)
    };
  } else {
    return null;
  }
}




export async function updateBasic(
  id: string,
  title: string,
  content: string,


  ) {
    const client = await clientPromise;
    const collection = client.db('vienna').collection('boards');
  
    return await collection.updateOne(
      {
        id
      },
      {
        $set:
        {
          title,
          content,
          updatedAt: new Date().toISOString()
  
        }
      }
  
  )}





  export async function getAllByEmail(
    email: string,
    limit: number,
    page: number,
    sort: string,
    order: string,
    q: string,
  ): Promise<BoardProps[]> {
  
    const client = await clientPromise;
    const collection = client.db('vienna').collection('boards');
 
    const query = q === null ? '' : q;


    // $sort by createdAt or viewCount


    return await collection
    .aggregate<BoardProps>([
      
      {
        $match: {
          userEmail: email,
        }
      },


      sort === 'createdAt' ? { $sort: { createdAt: order === 'asc' ? 1 : -1 } } : { $sort: { viewCount: order === 'asc' ? 1 : -1 } },

      
      
      {
        $limit: limit,
        //////$skip: (page - 1) * limit, // skip the first n documents

      },

      // match by q and feedTitle and feedContent and hiddenYn is exist  and not 'Y'
      
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
          ],
        }
      },

      

      
    ])
    .toArray();
  
  }



  // get total count
  export async function getAllByEmailCount(
    email: string,
    q: string,
  ) {
      
      const client = await clientPromise;
      const collection = client.db('vienna').collection('boards');


      const query = q === null ? '' : q;
  
      const results = await collection.countDocuments(

        {
          email: email,
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
          ],
        }
 

      );
  
      return results;
  }





/* register board */
export async function registerOne (
  {
    userId,
    userEmail,
    userName,
    userNickname,
    userAvatar,

    title,
    content,

    images,

    tags,
    category,


    
  }: {
 
    userId: string,
    userEmail: string,
    userName: string,
    userNickname: string,
    userAvatar: string,

    title: string,
    content: string,

    images: string[],

    tags: string[],
    category: string,

  }
) {




  const client = await clientPromise;
  const collection = client.db('vienna').collection('boards');


  // get sequence number and increment it

  ///const id = random(100000, 999999).toString();

  // random 6 digit number
  const id = Math.floor(100000 + Math.random() * 900000).toString();

  console.log('registerOne id: ' + id);


  // insert one document and read it







  await collection.insertOne(
    {

      id: id,
      
      userId: userId,
      userEmail: userEmail,
      userName: userName,
      userNickname: userNickname,
      userAvatar: userAvatar,

      title: title,
      content: content,

      images: images,

      tags: tags,
      category: category,

    
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,

    }
  );

  const results =  await collection.findOne(
    {
      id: id,
    }
  );



    // tags document insert and update each count
    const tagsArray = tags as any;
    console.log('tagsArray: ' + tagsArray);

    for (let i = 0; i < tagsArray?.length; i++) {

      const tagName = tagsArray[i];
      const tagCount = 1;

      const tagCollection = client.db('vienna').collection('tags');

      const tagResults = await tagCollection.findOne(
        {
          tagName: tagName,
        }
      );

      console.log('tagResults: ' + tagResults);
      if (tagResults) {
          
          console.log('tagResults._id: ' + tagResults._id);
  
          // update tag
          await tagCollection.updateOne(
            {
              tagName: tagName,
            },
            {
              $set: {
                tagName: tagName,
                tagCount: tagResults.tagCount + tagCount,
                updatedAt: new Date(),
              }
            }
          );
  
        } else {

          // insert tag
          await tagCollection.insertOne(
            {
              tagName: tagName,
              tagCount: tagCount,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          );

        }

    }


    return results;

  }






/* register board */
export async function updateOne (
  {
    id,
    userId,
    userEmail,
    userName,
    userNickname,
    userAvatar,

    title,
    content,

    images,

    tags,
    category,


    
  }: {
 
    id: string,
    userId: string,
    userEmail: string,
    userName: string,
    userNickname: string,
    userAvatar: string,

    title: string,
    content: string,

    images: string[],

    tags: string[],
    category: string,

  }
) {




  const client = await clientPromise;
  const collection = client.db('vienna').collection('boards');


  const results = await collection.updateOne(
    {
      id: id,
    },
    {
      $set:
      {
        userId: userId,
        userEmail: userEmail,
        userName: userName,
        userNickname: userNickname,
        userAvatar: userAvatar,

        title: title,
        content: content,

        images: images,

        tags: tags,
        category: category,

        updatedAt: new Date(),

      }
    }
  );





    return results;

  }
  


    
  export async function getBoardById(
    id: string,
    userId: string,
  ): Promise<BoardProps | null> {


    console.log('getBoardById  id: ' + id);
  
    const client = await clientPromise;

    const collection = client.db('vienna').collection('boards');

    // get one board document and check like using  aggregate with likes collection

    const results = await collection
      .aggregate<BoardProps>([

        {
          $match: {
            id: id
          }
        },

        {
          $lookup:
          {
            from: 'likes',
            localField: 'id',
            foreignField: 'boardId',
            as: 'likes'
          }
        },

        {
          $project: {
            _id: 0,
            emailVerified: 0,
            likes: {
              _id: 0,
              boardId: 0,
              userId: 0,
              userEmail: 0,
              userNickname: 0,
              userAvatar: 0,
              createdAt: 0,
              updatedAt: 0,
            }
          }
        },


        {
          $project: {
            likes: 0
          }
        },
        {
          $limit: 1,
        },

        


      ])
      .toArray();


      /* check linkes collection and add likeYn field */

      const likeCollection = client.db('vienna').collection('likes');

      const likeResults = await likeCollection.findOne(
        {
          boardId: id,
          userId: userId,
        } 
      );

      if (likeResults) {
        results[0].likeYn = true;
      }


 
    
      // view count update
      // if viewCount is null, set 1 else increment 1
      await collection.updateOne(
        {
          id: id,
        },
        {
          $set:
          {
            viewCount: results[0]?.viewCount ? results[0]?.viewCount + 1 : 1,
          }
        }
      );


    if (results) {

      return {
        ...results[0],
        ///////bioMdx: await getMdxSource(results.bio || placeholderBio)
      };

    } else {
      return null;
    }
    

    /*

    const collection = client.db('vienna').collection('boards');

    
    const results = await collection.findOne<BoardProps>(
      { id: id },
      { projection: { _id: 0, emailVerified: 0 } }
      ////{ projection: { _id: 0, emailVerified: 0 } }
    );

    // view count update
    // if viewCount is null, set 1 else increment 1
    await collection.updateOne(
      {
        id: id,
      },
      {
        $set:
        {
          viewCount: results?.viewCount ? results?.viewCount + 1 : 1,
        }
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

    */


  }

  
 // like 
  export async function like(
    id: string,
    userId: string,

  ) {
    const client = await clientPromise;
    const collection = client.db('vienna').collection('boards');
  
    const results = await collection.findOne<BoardProps>(
      { id: id },
      { projection: { _id: 0, emailVerified: 0 } }
    );
  
    if (results) {
  
      // like document insert and update each count
      const likeCollection = client.db('vienna').collection('likes');
  
      const likeResults = await likeCollection.findOne(
        {
          boardId: id,
          userId: userId,
        }
      );
  
      console.log('likeResults: ' + likeResults);
      if (likeResults) {
          
        console.log('likeResults._id: ' + likeResults._id);

        // update like
        await likeCollection.updateOne(
          {
            boardId: id,
            userId: userId,
          },
          {
            $set: {
              boardId: id,
              userId: userId,
              updatedAt: new Date(),
            }
          }
        );

      } else {

        // insert like
        await likeCollection.insertOne(
          {
            boardId: id,
            userId: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        );


        // update board likeCount

        await collection.updateOne(
          {
            id: id,
          },
          {
            $set:
            {
              likeCount: results?.likeCount ? results?.likeCount + 1 : 1,
            }
          }
        );

      }




    // points document insert
    // feedPost, feedLike, feedScrap, feedComment, feedFeedback,
    
    const pointsCollection = client.db('vienna').collection('points');

    // check points collection userId, feedId and add point only one time
    const pointsResults = await pointsCollection.findOne(
      {
        userId: userId,
        boardId: id,
        title: 'boardLike',
      }
    );

    if (!pointsResults) {



      const setupCollection = client.db('vienna').collection('setups');

      const setupResults = await setupCollection.findOne(
        {
          id: 'point',
        }
      );

      const point = setupResults?.boardLike || 0;

      await pointsCollection.insertOne(
        {
          userId: userId,
          point: point,
          boardId: id,
          title: 'boardLike',
          createdAt: new Date(),
        }
      );


    }



      return {
        ...results,
        //bioMdx: await getMdxSource(results.bio || placeholderBio)
      };
      
    } else {
      return null;
    }
  }



  // unlike 
  export async function unlike(
    id: string,
    userId: string,

  ) {

    const client = await clientPromise;
    const collection = client.db('vienna').collection('boards');
  
    const results = await collection.findOne<BoardProps>(
      { id: id },
      { projection: { _id: 0, emailVerified: 0 } }
    );
  
    if (results) {
  
      // like document insert and update each count
      const likeCollection = client.db('vienna').collection('likes');
  
      const likeResults = await likeCollection.findOne(
        {
          boardId: id,
          userId: userId,
        }
      );
  
      console.log('likeResults: ' + likeResults);

      if (likeResults) {
          
        console.log('likeResults._id: ' + likeResults._id);

        // update like
        await likeCollection.deleteOne(
          {
            boardId: id,
            userId: userId,
          }
        );

        // update board likeCount
        await collection.updateOne(
          {
            id: id,
          },
          {
            $set:
            {
              likeCount: results?.likeCount ? results?.likeCount - 1 : 0,
            }
          }
        );


        return results;

  
      } else {
        return null;
      }
    } else {

      return null;
    }
      
  }



  // getLikeCountByUserId

  export async function getLikeCountByUserId(
    userId: string,
  ) {
        
      const client = await clientPromise;
      const collection = client.db('vienna').collection('likes');

      const results = await collection.countDocuments(
        {
          userId: userId,
        }
      );


      return results;

  }




  // getCommentCountByUserId

  export async function getCommentCountByUserId(
    userId: string,
  ) {
        
      const client = await clientPromise;
      const collection = client.db('vienna').collection('comments');

      const results = await collection.countDocuments(
        {
          userId: userId,
        }
      );


      return results;
  
  }








  export async function registerComment (
    {
      boardId,
      userId,
      userEmail,
      userNickname,
      userAvatar,
  
      content,
  
      
    }: {
   
      boardId: string,
      userId: string,
      userEmail: string,
      userNickname: string,
      userAvatar: string,
  
      content: string,
  
    }
  ) {
  
  
  
  
    const client = await clientPromise;
    const collection = client.db('vienna').collection('comments');
  
  
    // get sequence number and increment it
  
    ///const id = random(100000, 999999).toString();
  
    // random 6 digit number
    const id = Math.floor(100000 + Math.random() * 900000).toString();
  
  
  
    const results = await collection.insertOne(
      {
  
        id: id,
        
        boardId: boardId,
        
        userId: userId,
        userEmail: userEmail,
        userNickname: userNickname,
        userAvatar: userAvatar,
  
        content: content,
  
      
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
  
      }
    );


    // if comment insert success, owner of board get notification
    // insert notification document
    // get user from boardId of borad document

    const boardCollection = client.db('vienna').collection('boards');
    const boardResults = await boardCollection.findOne(
      {
        id: boardId,
      }
    );

    if (boardResults) {

      const userIdOfBoard = boardResults?.userId;
      const userEmailOfBoard = boardResults?.userEmail;
      const userNicknameOfBoard = boardResults?.userNickname;
      const userAvatarOfBoard = boardResults?.userAvatar;

      // insert notification document
      const notificationCollection = client.db('vienna').collection('notifications');

      await notificationCollection.insertOne(
        {
          userId: userIdOfBoard,
          userEmail: userEmailOfBoard,
          userNickname: userNicknameOfBoard,
          userAvatar: userAvatarOfBoard,

          boardId: boardId,
          boardTitle: boardResults?.title,

          commentUserId: userId,
          commentUserEmail: userEmail,
          commentUserNickname: userNickname,
          commentUserAvatar: userAvatar,
          commentId: id,
          commentContent: content,

          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,

          readYn: 'N',

        }
      );

    }


    return results;
  
  }








  export async function updateComment (
    {
      commentId,
      content,
  
      
    }: {
   
      commentId: string,
      content: string,
  
    }
  ) {
  
  
  
  
    const client = await clientPromise;
    const collection = client.db('vienna').collection('comments');
  
  
    const results = await collection.updateOne(
      {
        id: commentId,
      },
      {
        $set:
        {
          content,
          updatedAt: new Date().toISOString()
  
        }
      }
  
  )}






  export async function getCommentByBoardId(
    boardId: string,
  ): Promise<CommentProps[]> {

    console.log('getCommentByBoardId boardId: ' + boardId);

    
  
    const client = await clientPromise;
    const collection = client.db('vienna').collection('comments');
 
    return await collection
    .aggregate<CommentProps>([
      
      {
        $match: {
          boardId: boardId,
        }
      },

      {
        $sort: { createdAt: -1 }
      },
      
      {
        $limit: 100,
      },

      // aggregate with comment_replies collection
      // and get replies list
      {
        $lookup:
        {
          from: 'comment_replies',
          localField: 'id',
          foreignField: 'commentId',
          as: 'replies'
        }
      },

      {
        $project: {
          _id: 0,
          emailVerified: 0,
        }
      },

      {
        $addFields: {
          replyCount: { $size: "$replies" },

          // replies list map sort by createdAt

          replies: {

            $map: {

              input: "$replies",
              as: "reply",
              in: {
                id: "$$reply.id",
                boardId: "$$reply.boardId",
                commentId: "$$reply.commentId",
                userId: "$$reply.userId",
                userEmail: "$$reply.userEmail",
                userNickname: "$$reply.userNickname",
                userAvatar: "$$reply.userAvatar",
                content: "$$reply.content",
                createdAt: "$$reply.createdAt",
                updatedAt: "$$reply.updatedAt",
                deletedAt: "$$reply.deletedAt",
              },

              // sort by createdAt
             

            },


          },



        }
      },


     
      {
        $match: {
          deletedAt: null,
        }
      },

      

      
    ])
    .toArray();
  
  }




  

  
  export async function getCommentCountByBoardId(
    boardId: string,
  ) {
        
        const client = await clientPromise;
        const collection = client.db('vienna').collection('comments');
  
        const results = await collection.countDocuments(
          {
            boardId: boardId,
          }
        );
  
  
        return results;
  
  } 




export async function getCommentCountByEmail(
  email: string,
) {
      
      const client = await clientPromise;
      const collection = client.db('vienna').collection('comments');

      const results = await collection.countDocuments(
        {
          userEmail: email,
        }
      );


      return results;

} 


  



export async function registerReply (
  {
    boardId,
    commentId,
    userId,
    userEmail,
    userNickname,
    userAvatar,

    content,

    
  }: {
 
    boardId: string,
    commentId: string,
    userId: string,
    userEmail: string,
    userNickname: string,
    userAvatar: string,

    content: string,

  }
) {




  const client = await clientPromise;
  const collection = client.db('vienna').collection('comment_replies');


  // get sequence number and increment it

  ///const id = random(100000, 999999).toString();

  // random 6 digit number
  const id = Math.floor(100000 + Math.random() * 900000).toString();



  const results = await collection.insertOne(
    {

      id: id,
      
      boardId: boardId,
      commentId: commentId,
      
      userId: userId,
      userEmail: userEmail,
      userNickname: userNickname,
      userAvatar: userAvatar,

      content: content,

    
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,

    }
  );

  return results;

}





export async function updateReply (
  {
    replyId,
    content,

    
  }: {
 
    replyId: string,
    content: string,

  }
) {
  
    const client = await clientPromise;
    const collection = client.db('vienna').collection('comment_replies');


    const results = await collection.updateOne(
      {
        id: replyId,
      },
      {
        $set:
        {
          content,
          updatedAt: new Date().toISOString()

        }
      }

  )}

  








export async function getRepliesByCommentId(
  commentId: string,
): Promise<ReplyProps[]> {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('comment_replies');

  return await collection
  .aggregate<ReplyProps>([

    {
      $match: {
        commentId: commentId,
      }
    },

    {
      $sort: { createdAt: -1 }
    },
    
    {
      $limit: 100,
    },

    {
      $project: {
        _id: 0,
        emailVerified: 0,
      }
    },

    {
      $match: {
        deletedAt: null,
      }
    },

    

    
  ])
  .toArray();

    
    
}




/* delete one */
export async function deleteOne(
  id: string,
): Promise<any> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('boards');


  // delete comment_replies (boardId, commentId)

  const commentRepliesCollection = client.db('vienna').collection('comment_replies');

  await commentRepliesCollection.deleteMany(
    {
      boardId: id,
    }
  );

  // delete comments (boardId)

  const commentsCollection = client.db('vienna').collection('comments');

  await commentsCollection.deleteMany(
    {
      boardId: id,
    }
  );
 


  return await collection.deleteOne({
      id: id,
  });
  

}



/* delete one */
export async function deleteComment(
  id: string,
): Promise<any> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('comments');


  // delete comment_replies (boardId, commentId)

  const commentRepliesCollection = client.db('vienna').collection('comment_replies');

  await commentRepliesCollection.deleteMany(
    {
      commentId: id,
    }
  );


  return await collection.deleteOne({
      id: id,
  });
  

}



/* delete one */
export async function deleteReply(
  id: string,
): Promise<any> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('replys');



  return await collection.deleteOne({
      id: id,
  });
  

}









/* register board */
export async function registerTag (
  {
    name,
  }: {
 
    name: string,

  }
) {
    
  console.log('registerTag name: ' + name);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('board_tags');


  // check duplicate tag name

  const tagResults = await collection.findOne(
    {
      name: name,
    }
  );

  if (tagResults) {
    return null;
  }


  // order is sequence number
  // if order number is null, get max order number and increment 1

  // get order number from tags collection and increment it

  // insert new tag with order number 1, and orthers order number increment 1


  // increment order number of all tags
  // imcrement order number of all tags in tags collection


  // insert 1 order number tag and imcrement order number of all tags in tags collection


  await collection.updateMany(

    { },
    {
      $inc: { orderNumber: 1 }
    }

  );


  // insert new tag with order number 1

  // insert and get results

  const results = await collection.insertOne(
    {
      name: name,
      orderNumber: 1,
      count: 0,
      createdAt: new Date(),
    }
  );

  ////console.log('registerTag results: ' + results);


  return results;


}













export async function getAllTags( {
  limit,
  page,
  sort,
  order,
  q,

}: {
  limit: number,
  page: number,
  sort: string,
  order: string,
  q: string,

}): Promise<TagResultProps> {


  const query = q || '';


  const client = await clientPromise;
  const collection = client.db('vienna').collection('board_tags');

  const results = await collection
  .aggregate<TagProps>([

 

    {
      $match: {
        $or: [
          { name: { $regex: query, $options: 'i' } },
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


  const resultsCount = await collection.aggregate([
    

    {
      $match: {
        $or: [
          { name: { $regex: query, $options: 'i' } },

        ],
      },
    },

    
    {
      $count: 'count',
    },
  ]).toArray();


 


  return {
    _id: '1',
    
    tags: results,

    totalCount: resultsCount[0]?.count || 0,
  };

  
}





/* delete one tag */
export async function deleteOneTag(
  id: string,
): Promise<any> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('board_tags');

  // when delete tag, update order number of tags

  // get order number of tag

  const tagResults = await collection.findOne(
    {
      _id: new ObjectId(id),
    }
  );

  const orderNumber = tagResults?.orderNumber;


  //  decrement orderNumber of greater than orderNumber

  collection.updateMany(
      
    { orderNumber: { $gt: orderNumber } },
    {
      $inc: { orderNumber: -1 }
    }

  );


  return await collection.deleteOne({
      _id: new ObjectId(id),
  });
  

}





/* increament tag orderNumber */
export async function incrementTagOrderNumber(
  id: string,
): Promise<any> {

  console.log('=============incrementTagOrderNumber id: ' + id);




  // increment order number of tag which id is id
  // and other decrement  order number change

  const client = await clientPromise;
  const collection = client.db('vienna').collection('board_tags');

  // get order number of tag

  const tagResults = await collection
  .findOne(
    {
      _id: new ObjectId(id),
    }
  );

  const orderNumber = tagResults?.orderNumber;


  console.log('orderNumber: ' + orderNumber);



  //  decrement orderNumber of orderNumber -1

  await collection.updateOne(
        
    { orderNumber: orderNumber - 1 },
    {
      $set: { orderNumber: orderNumber }
    }
  
  );




  const results = await collection.updateOne(
      
    { _id: new ObjectId(id) },
    {
      $set: { orderNumber: orderNumber - 1 }
    }

  );


  return results;

}
  

/* increament tag orderNumber */
export async function decrementTagOrderNumber(
  id: string,
): Promise<any> {

  console.log('=============decrementTagOrderNumber id: ' + id);




  // increment order number of tag which id is id
  // and other decrement  order number change

  const client = await clientPromise;
  const collection = client.db('vienna').collection('board_tags');

  // get order number of tag

  const tagResults = await collection
  .findOne(
    {
      _id: new ObjectId(id),
    }
  );

  const orderNumber = tagResults?.orderNumber;


  console.log('orderNumber: ' + orderNumber);



  //  decrement orderNumber of orderNumber -1

  await collection.updateOne(
        
    { orderNumber: orderNumber + 1 },
    {
      $set: { orderNumber: orderNumber }
    }
  
  );




  const results = await collection.updateOne(
      
    { _id: new ObjectId(id) },
    {
      $set: { orderNumber: orderNumber + 1 }
    }

  );


  return results;

}




// getStatisticsSummary

export async function getStatisticsSummary() {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('boards');

  const results = await collection.aggregate([
    {
      $match: {
        deletedAt: null,
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        totalViewCount: { $sum: "$viewCount" },
        totalLikeCount: { $sum: "$likeCount" },
        totalCommentCount: { $sum: "$commentCount" },
        totalReplyCount: { $sum: "$replyCount" },
      }
    },
  ]).toArray();

  return results[0];

}