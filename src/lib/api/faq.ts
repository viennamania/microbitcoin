import clientPromise from '@/lib/mongodb';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { S, u } from 'uploadthing/dist/types-e8f81bbc';

/// mongodbb object id
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


}


export interface CategoryProps {
  _id: string;
  title: string;
  count: number;
}


export interface ResultProps {
  _id: string;
  boards: BoardProps[];
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





export async function getAll({
  limit,
  page,
  sort,
  order,
  q,
  startDate,
  endDate,
  category,
 } : {
  limit: number,
  page: number,
  sort: string,
  order: string,
  q: string,
  startDate: string,
  endDate: string,
  category: string,
}): Promise<ResultProps> {


  if (!sort) {
    sort = 'createdAt';
  }

  if (!order) {
    order = 'desc';
  }

  
  if (startDate === '') {
    startDate = '2000-01-01';
  }

  if (endDate === '') {
    endDate = '2099-12-31';
  }



  console.log('limit: ' + limit);
  console.log('page: ' + page);
  console.log('sort: ' + sort);
  console.log('order: ' + order);
  console.log('q: ' + q);
  console.log('category: ' + category);
  console.log('startDate: ' + startDate);
  console.log('endDate: ' + endDate);
 


  const client = await clientPromise;
  const collection = client.db('vienna').collection('faqs');


  
  ///const query = q === null ? '' : q;

  const query = q || '';

  console.log('query: [' + query + ']');


  if (category === 'all') {

    const res =  await collection
    .aggregate<BoardProps>([

      {$match: {isTop: 'Y'}},

      // match by q and feedTitle and feedContent and hiddenYn is exist  and not 'Y'
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: 'i' } },


            // tags array match
            { tags: { $elemMatch: { $regex: query, $options: 'i' } } },

          ],

        }
      },



    ]).toArray();


    return {
      _id: 'all',
      boards: res,
      totalCount: res.length,
    };

  } else {


  const res =  await collection
    .aggregate<BoardProps>([



      // if category ia 'all', then match isTop is 'Y'



 
      {
        $match: {

          category: category === null ? { $exists: true } : category,

          ///category: category === null ? { $exists: true } : category,

          //isTop: category === 'all' ? 'Y' : { $exists: true },

        }
      },

      // match by q and feedTitle and feedContent and hiddenYn is exist  and not 'Y'
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: 'i' } },


            // tags array match
            { tags: { $elemMatch: { $regex: query, $options: 'i' } } },

          ],

        }
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
      
    ])
    .toArray();


    return {
      _id: category,
      boards: res,
      totalCount: res.length,
    };


  }

}



// get total count
export async function getAllCount(
  q: string,
) {
    
    const client = await clientPromise;
    const collection = client.db('vienna').collection('faqs');


    const query = q || '';

    const results = await collection.countDocuments(

      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          ////{ content: { $regex: query, $options: 'i' } },
          { nickname: { $regex: query, $options: 'i' } },

          // tags array match
          { tags: { $elemMatch: { $regex: query, $options: 'i' } } },

        ],

      }

    );

    return results;
}




export async function getCount(): Promise<number> {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('faqs');
  return await collection.countDocuments();
}



export async function update(username: string, bio: string) {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('notices');
  return await collection.updateOne({ username }, { $set: { bio } });
}



export async function getOne(id: string): Promise<BoardProps | null> {
  console.log('getOne id: ' + id);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('faqs');



  const results = await collection.findOne<BoardProps>(
    { id },
    { projection: { _id: 0, emailVerified: 0 } }
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
    const collection = client.db('vienna').collection('notices');
  
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
  ): Promise<ResultProps[]> {
  


    console.log('getAllByEmail email: ' + email);


    const client = await clientPromise;
    const collection = client.db('vienna').collection('notices');
  
    /*
    const results = await collection
      .find<UserProps>(
        {},
        {
          projection: { _id: 0, emailVerified: 0 },
          limit: limit,
          skip: (page - 1) * limit,
          sort: { followers: -1 }
        }
      )
      .toArray();
    */
  
    console.log('limit: ' + limit);
    console.log('page: ' + page);
  
     
    return await collection
      .aggregate<ResultProps>([
  
        
        {
          $limit: limit,
          /////$skip: (page - 1) * limit, // skip the first n documents
        },
        {
          $match: {
            email: email
          }
        },
        
        
        //{
        //  $skip: (page - 1) * limit, // skip the first n documents
        //},
        
        //{ $limit : 10 },
        //{ $skip : 2 },
        ///{ projection: { _id: 0, emailVerified: 0 } },
  
  
  
        {
          $group: {
  
            _id: {
              $toLower: { $substrCP: ['$name', 0, 1] }
            },
  
            boards: {
              $push: {
  
                id: '$id',
                createdAt: '$createdAt',
                category: '$category',
                avatar: '$avatar',
                tags: '$tags',
                title: '$title',
                content: '$content',
                scrapCount: '$scrapCount',
                likeCount: '$likeCount',
                commentCount: '$commentCount',
                viewCount: '$viewCount',
  
  
              }
            },
            count: { $sum: 1 }
          }
        },
        
        {
          //sort alphabetically
          $sort: {
            _id: 1
          }
        }
        
      ])
      .toArray();
  
    
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

    isTop,

    
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

    isTop: string,

  }
) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('faqs');


  // get sequence number and increment it

  ///const id = random(100000, 999999).toString();

  // random 6 digit number
  const id = Math.floor(100000 + Math.random() * 900000).toString();

  console.log('registerOne id: ' + id);


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

      isTop: isTop,

    
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




// updateOne
export async function updateOne(
  {
    id,
    title,
    content,
    images,
    tags,
    category,
    isTop,
  }: {
    id: string,
    title: string,
    content: string,
    images: string[],
    tags: string[],
    category: string,
    isTop: string,
  }
) {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('faqs');

  return await collection.updateOne(
    {
      id
    },
    {
      $set:
      {
        title,
        content,
        images,
        tags,
        category,
        isTop,
        updatedAt: new Date().toISOString()

      }
    }

)}









    
  export async function getBoardById(id: string): Promise<BoardProps | null> {

    console.log('getBoardById  id: ' + id);
  
    const client = await clientPromise;
    const collection = client.db('vienna').collection('notices');
    
    
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
          updatedAt: new Date().toISOString()
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
  }





/* get board by id and previous one by createdAt */
export async function getPrevBoardById(id: string): Promise<BoardProps | null> {
  
    console.log('getPrevBoardById  id: ' + id);
  
    const client = await clientPromise;
    const collection = client.db('vienna').collection('notices');
    
    
    const results = await collection.findOne<BoardProps>(
      { id: id },
      { projection: { _id: 0, emailVerified: 0 } }
      ////{ projection: { _id: 0, emailVerified: 0 } }
    );
    
    if (results) {

      const prevResults = await collection.findOne<BoardProps>(
        {
          createdAt: { $gt: results.createdAt }
        },
        {
          projection: { _id: 0, emailVerified: 0 },
          sort: { createdAt: 1 }
        }
      );

      console.log('prevResults: ' + prevResults);
      if (prevResults) {
        return {
          ...prevResults,
          //bioMdx: await getMdxSource(results.bio || placeholderBio)
        };
      } else {
        return null;
      }

    }

    return null;
}


/* get board by id and next one by createdAt */
export async function getNextBoardById(id: string): Promise<BoardProps | null> {
  
    console.log('getNextBoardById  id: ' + id);
  
    const client = await clientPromise;
    const collection = client.db('vienna').collection('notices');
    
    
    const results = await collection.findOne<BoardProps>(
      { id: id },
      { projection: { _id: 0, emailVerified: 0 } }
      ////{ projection: { _id: 0, emailVerified: 0 } }
    );
    
    if (results) {

      const nextResults = await collection.findOne<BoardProps>(
        {
          createdAt: { $lt: results.createdAt }
        },
        {
          projection: { _id: 0, emailVerified: 0 },
          sort: { createdAt: -1 }
        }
      );

      console.log('nextResults: ' + nextResults);
      if (nextResults) {
        return {
          ...nextResults,
          //bioMdx: await getMdxSource(results.bio || placeholderBio)
        };
      } else {
        return null;
      }

    }

    return null;

}
  
 



  
 // like 
 export async function like(
  id: string,
  userId: string,
  userEmail: string,
  userNickname: string,
  userAvatar: string,

) {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('notices');

  const results = await collection.findOne<BoardProps>(
    { id: id },
    { projection: { _id: 0, emailVerified: 0 } }
  );

  if (results) {

    // like document insert and update each count
    const likeCollection = client.db('vienna').collection('notice_likes');

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
            userEmail: userEmail,
            userNickname: userNickname,
            userAvatar: userAvatar,
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

    return {
      ...results,
      //bioMdx: await getMdxSource(results.bio || placeholderBio)
    };
  } else {
    return null;
  }
}





// register one category to faq_categories
export async function registerOneCategory(
  {
    title,
  }: {
    title: string,
  }
) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('faq_categories');


  // check if title is exist
  const results = await collection.findOne(
    {
      title: title,
    }
  );

  // if title is exist, return null
  if (results) {
    return null;
  }

  collection.insertOne(
    {
      title: title,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

}



// get all categories from faq_categories
export async function getAllCategory(
  limit: number,
  page: number,
  sort: string,
  order: string,
  q: string,

): Promise<CategoryProps[]> {



  const query = q || '';

  const client = await clientPromise;
  const collection = client.db('vienna').collection('faq_categories');

  const results = await collection.aggregate<CategoryProps>([

    {
      $match: {
        $or: [
          { title: { $regex: query, $options: 'i' } },
        ],

      }
    },

    /*
    {
      //sort alphabetically
      $sort: {
        title: 1
      }
    }
    */

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

  return results;

}



// get total count
export async function getCountCategory(
  q: string,
) {
    
    const client = await clientPromise;
    const collection = client.db('vienna').collection('faq_categories');


    const query = q || '';

    const results = await collection.countDocuments(

      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          ////{ content: { $regex: query, $options: 'i' } },
          { nickname: { $regex: query, $options: 'i' } },

          // tags array match
          { tags: { $elemMatch: { $regex: query, $options: 'i' } } },

        ],

      }

    );

    return results;
}



export async function getOneCategory(_id: string): Promise<BoardProps | null> {
 

  console.log('getOneCategory _id: ' + _id);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('faq_categories');
  const results = await collection.findOne<BoardProps>(

    ///{ ojectId: _id },
    { _id: new ObjectId(_id) },
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


/* delete one */
export async function deleteOneCategory(
  id: string,
): Promise<any> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('faq_categories');




  return await collection.deleteOne({
      _id: new ObjectId(id),
  });

}


// updateOne
export async function updateOneCategory(
  {
    id,
    title,

  }: {

    id: string,

    title: string,

  }
) {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('faq_categories');

  return await collection.updateOne(
    {

      _id: new ObjectId(id),


    },
    {
      $set:
      {
        title,
        updatedAt: new Date().toISOString()

      }
    }

)}




/* delete one */
export async function deleteOne(
  id: string,
): Promise<any> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('faqs');




  return await collection.deleteOne({
      id: id,
  });

}





// registerCategory

export async function registerCategory(
  {
    title,
  }: {
    title: string,
  }
) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('faq_categories');


  const results = await collection.findOne(
    {
      title: title,
    }
  );

  if (results) {
    return null;
  }

  const results2 = await collection.insertOne(
    {
      title: title,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );

  return results2;

}


// decrementCategoryOrderNumber
export async function decrementCategoryOrderNumber(
  id: string,
) {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('faq_categories');

  const results = await collection.findOne(
    {
      _id: new ObjectId(id),
    }
  );

  if (results) {

    // update like
    await collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          orderNumber: results.orderNumber - 1,
          updatedAt: new Date(),
        }
      }
    );

  }

  return results;

}

export async function incrementCategoryOrderNumber(
  id: string,
) {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('faq_categories');

  const results = await collection.findOne(
    {
      _id: new ObjectId(id),
    }
  );

  if (results) {

    // update like
    await collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          orderNumber: results.orderNumber + 1,
          updatedAt: new Date(),
        }
      }
    );

  }

  return results;

}


// getAllCategories

export async function getAllCategories(
  {
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
  }
): Promise<ResultProps> {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('faq_categories');

  const query = q || '';

  console.log('query: ' + query);

  const results = await collection.aggregate<BoardProps>([

    {
      $match: {
        $or: [
          { title: { $regex: query, $options: 'i' } },
        ],

      }
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

  return {
    _id: 'all',
    
    boards: results,

    totalCount: results.length,
  };

}