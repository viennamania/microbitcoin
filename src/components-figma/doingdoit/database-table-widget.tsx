'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import WidgetCard from '@/components/doingdoit/widget-card';
import { PiMagnifyingGlassBold } from 'react-icons/pi';



import { useColumn } from '@/hooks/use-column';

import ControlledTable from '@/components/controlled-table';

import cn from '@/utils/class-names';

import DateFiled from '@/components/controlled-table/date-field';
import { getDateRangeStateValues } from '@/utils/get-formatted-date';

import { DatePicker } from '@/components/ui/datepicker';





import { Button } from '@/components/ui/button';

import { CiSearch } from "react-icons/ci";


import { exportToCSV } from '@/utils/export-to-csv';


import { Modal } from '@/components/ui/modal';
import FollowerModal from '@/app/shared/profile/follower-modal';

import { postData, followersData, followingData } from '@/data/profile-data';
import { Badge } from '@/components/ui/badge';
import PostFeed from '@/app/shared/profile/post-feed';

import { Title, Text } from '@/components/ui/text';

import dynamic from 'next/dynamic';



import StatusField from '@/components/controlled-table/status-field';

import { RadioGroup } from '@/components/ui/radio-group';
import { Radio } from '@/components/ui/radio';


///import { useTable } from '@/hooks/use-table';

import { useTable } from '@/hooks/doingdoit/use-table-food';


import { useSession, signOut } from 'next-auth/react';


const FilterElement = dynamic(
  () => import('@/app/shared/invoice/invoice-list/filter-element'),
  { ssr: false }
);

///import TableFooter from '@/app/shared/table-footer';

/*
const TableFooter = dynamic(() => import('@/app/shared-vienna/table-footer'), {
  ssr: false,
});
*/





import TableFooter from './table-footer';
import { u } from 'uploadthing/dist/types-e8f81bbc';



const filterState = {
  amount: ['', ''],
  createdAt: [null, null],
  dueDate: [null, null],
  status: '',
};




type ColumnTypes = {
  data?: any[];
  sortConfig?: any;
  
  
  /////////////checkedItems?: string[];
  
  checkedItems?: any[];


  handleSelectAll?: any;
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
};

type BasicTableWidgetProps = {
  title?: React.ReactNode;
  className?: string;
  pageSize?: number;
  setPageSize?: React.Dispatch<React.SetStateAction<number>>;
  
  getColumns: ({
    data,
    sortConfig,
    checkedItems,
    handleSelectAll,
    onDeleteItem,
    onHeaderCellClick,
    onChecked,
  }: ColumnTypes) => any;

  data: any[];
  enablePagination?: boolean;
  variant?: 'modern' | 'minimal' | 'classic' | 'elegant' | 'retro';
  enableSearch?: boolean;
  paginatorClassName?: string;
  searchPlaceholder?: string;
  noGutter?: boolean;
  scroll?: {
    x?: number;
    y?: number;
  };
  sticky?: boolean;

  handleAdd: (ids: string[]) => void;
};


type FilterElementProps = {
  isFiltered: boolean;
  filters: { [key: string]: any };
  updateFilter: (columnId: string, filterValue: string | any[]) => void;
  handleReset: () => void;
};




const modalData = {
  title: '',
  description: '',
  data: [],
};





export default function DatabaseTableWidget({
  title,
  data = [],
  getColumns,
  
  pageSize = 20,

  setPageSize,
  enablePagination,
  variant = 'modern',
  enableSearch = true,
  paginatorClassName,
  noGutter,
  sticky,
  scroll = { x: 1300 },
  className,
  searchPlaceholder = 'Search...',


  handleAdd,


}: BasicTableWidgetProps) {



  const { data: session, status } = useSession();


  /* fetch user data from an API
  /api/doingdoit/user/getUser
  */
  const [userData, setUserData] = useState({
    id: "",
    email: "",
    nickname: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/vienna/user/getUserByEmail?_email=${session?.user?.email}`);
      const json = await res?.json();

      //////console.log(json);

      const data = json as any;
      
      if (data.data) {
        setUserData(data.data);
      } else {
        //alert(json.message);
      }
    };
    fetchData();
  } , [session?.user?.email]);
  



  const [open, setOpen] = useState(false);



  //const [pageSize, setPageSize] = useState(10);




  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });

  const onDeleteItem = (id: string) => {


    ////handleDelete(id);

    handleDelete([id]);

    /* popup modal delete item completed */
    //alert('삭제되었습니다.');

    setOpen(true);
    modalData.description = '삭제되었습니다.';

  };




  const {
    isLoading,
    isFiltered,
    tableData,
    currentPage,
    totalItems,

    //handlePaginate,

    filters,
    updateFilter,
    searchTerm,
    handleSearch,
    sortConfig,
    handleSort,
    selectedRowKeys,
    setSelectedRowKeys,
    //handleRowSelect,
    handleSelectAll,
    handleDelete,
    
    
    /////handleAdd,


    handleReset,
  } = useTable(
    data,
    pageSize,
    //filterState
  );


  /*
  const {
    isLoading,
    sortConfig,
    totalItems,
    tableData,
    currentPage,
    searchTerm,
    handleSort,
    handleDelete,
    handleSearch,
    handlePaginate,
    selectedRowKeys,
    handleRowSelect,
    handleSelectAll,

  } = useTable(data, pageSize);
  */


  const handleRowSelect = (id: string) => {

    //alert('handleRowSelect id: ' + id);


      // close modal
      setOpen(false);

      // add item

      handleAdd([tableData.find((data) => data.foodCode === id)]);

       /*
      handleAdd(selectedRowKeys.map((item, index) => (
        tableData.find((data) => data.id === item)
      )));
      */


    /*
    const selected = selectedRowKeys.includes(id);

    if (selected) {

      ///setSelectedRowKeys((prev) => prev.filter((key) => key !== id));

      // close modal
      setOpen(false);

      // add item

      handleAdd(selectedRowKeys.map((item, index) => (
        tableData.find((data) => data.id === item)
      )));


    } else {

      ///setSelectedRowKeys((prev) => [...prev, id]);


    }
    */

  };





  const columns = React.useMemo(
    () =>
      getColumns({
        data,
        sortConfig,
        
        ///////checkedItems: selectedRowKeys,


        checkedItems: selectedRowKeys.map((item, index) => (
          tableData.find((data) => data.id === item)
        )),


        onHeaderCellClick,
        onDeleteItem,
        onChecked: handleRowSelect,
        handleSelectAll,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedRowKeys,
      onHeaderCellClick,
      sortConfig.key,
      sortConfig.direction,
      onDeleteItem,
      handleRowSelect,
      handleSelectAll,
    ]
  );


  const { visibleColumns, checkedColumns, setCheckedColumns } =
    useColumn(columns);


 
  const isMediumScreen = true;



  const statusOptions = [
    {
      value: 'all',
      name: '전체',
      label: (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium text-green-dark">전체</Text>
        </div>
      ),
    },
    {
      value: 'foodGroup1',
      name: '구이류',
      label: (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium text-green-dark">구이류</Text>
        </div>
      ),
    },
    {
      value: 'foodGroup2',
      name: '음료',
      label: (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium text-orange-dark">음료</Text>
        </div>
      ),
    },
    {
      value: 'foodGroup3',
      name: '튀김류',
      label: (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium text-red-dark">튀김류</Text>
        </div>
      ),
    },

  ]


  const [value, setValue] = useState('createdAt');


  const [startDate, setStartDate] = useState<Date>(new Date( new Date().getFullYear(), new Date().getMonth(), 1 ));
  const [endDate, setEndDate] = useState<Date>(new Date( new Date().getFullYear(), new Date().getMonth()+1, 0 ));



  /* 즐겨찾는 음식 */
  /* userFoodData */
  /* data from api */

  const [userFoodData, setUserFoodData] = useState<any[]>([]);


  useEffect(() => {

    const fetchData = async () => {

      if (!userData.id || userData.id === "") {
        return;
      }

      //const res = await fetch(`/api/vienna/food/getAllUserFood?_userId=${userData.id}`);

      const countPerPage = 100;
      const currentPage = 1;
      const debouncedSearch = '';



      const res = await fetch('/api/vienna/food/getAllUserFood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
        body: JSON.stringify({
          userId: userData.id,
          limit: countPerPage,
          page: currentPage,
          sort: sortConfig.key,
          order: sortConfig.direction,
          q: debouncedSearch,
        }),
      });



      const posts  = await res?.json() as any;

      console.log("getAllUserFood=", posts?.data);

      //setUserFoodData(posts?.data);
      setUserFoodData(posts?.data?.foods);

      

    }

    fetchData();

  } , [userData.id, sortConfig.key, sortConfig.direction]);

  

  
  const handleSelectUserFood = async (id: string) => {
    
    // get food data from api
    const res = await fetch(`/api/vienna/food/getOne?_foodCode=${id}`);

    const posts  = await res?.json() as any;

    console.log("getOne=", posts?.data);

    // close modal
    setOpen(false);

    // add item
    handleAdd([posts?.data]);

  }







  return (

    <div className="flex flex-col gap-10">

    {/* 즐겨찾는 음식 */}
    {/* userFoodData */}

    <div className='flex flex-col items-start justify-start gap-3'>

      <div className='flex flex-row items-center justify-start gap-3'>
        <div className='text-base font-semibold text-gray-900'>
          즐겨찾는 음식
        </div>
        <div className='text-sm font-semibold text-gray-900'>
          {userFoodData?.length}개
        </div>
      </div>

      {/* list of buttons for userFoodData */}
      
        {/*
        <div className='flex flex-row items-center justify-start gap-3'>
        {userFoodData?.length > 0 && userFoodData?.map((item, index) => (
          <button
            key={index}
            className='flex flex-row items-center justify-start gap-3'
            onClick={() => handleSelectUserFood(item?.foodCode)}
          >
            <div className='text-sm font-semibold text-gray-900'>
              {item.foodName}
            </div>
          </button>
        ))}
        </div>
        */}



        {userFoodData?.length > 0 && (
          <div
            className="mt-0 flex flex-wrap gap-2"
          >
            {userFoodData?.map(( item , index) => (
  
              <button
                key={index}
                //className="flex items-center rounded-full border border-gray-300 py-1 pe-2.5 ps-3 text-sm font-medium text-gray-700"
                className="rounded-81xl bg-[#212121] flex flex-row items-center justify-start py-3 px-5 gap-[20px] text-center text-xs text-grey-9 font-menu-off"
                onClick={() => handleSelectUserFood(item?.foodCode)}
              >
                <div className="relative font-extrabold text-white  ">
                  {
                    item?.foodName
                  }
                </div>

              </button>
            ))}
          </div>
        )}





      

      {/*
      {userFoodData?.length > 0 && userFoodData?.map((item, index) => (
        <div key={index} className='flex flex-row items-center justify-start gap-3'>
          <button
            className='flex flex-row items-center justify-start gap-3'
            onClick={() => handleSelectUserFood(item?.foodCode)}
          >
            <div className='text-sm font-semibold text-gray-900'>
              {item.foodName}
            </div>
            <div className='text-sm font-semibold text-gray-900'>
              {item.foodCode}
            </div>
          </button>

        </div>
      ))}
      */}


    </div>

 



    <WidgetCard
      title={title}

      className={cn('flex flex-col ', className)}
      
      headerClassName=" widget-card-header flex-col sm:flex-row [&>.ps-2]:ps-0 [&>.ps-2]:w-full sm:[&>.ps-2]:w-auto [&>.ps-2]:mt-3 sm:[&>.ps-2]:mt-0"
      
      {...(enableSearch && {
        action: (


          <div className=' flex flex-row items-start justify-center gap-3 '>




            {/* select */} 
            <div className='flex flex-wrap items-center justify-start gap-3'>
              <div className=' w-16 flex items-center justify-start gap-2'>
                대분류
              </div>
              <StatusField
                placeholder='대분류를 선택하세요'
                options={statusOptions}
                //value={filters['status']}
                onChange={(value: string) => {
                  //updateFilter('status', value);
                }}
                getOptionValue={(option) => option.value}
                displayValue={(selected: string) =>
                  statusOptions.find((option) => option.value === selected)?.label ??
                  selected
                }
                
                {...(isMediumScreen && {
                  //label: 'Status',
                  labelClassName: 'text-base font-medium',
                })}
              
                //size='lg'
                className=" w-44 "
              />
            </div>


            <div className='flex flex-wrap items-center justify-start gap-3'>


              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onClear={() => handleSearch('')}
                onChange={(event) => handleSearch(event.target.value)}
                clearable
                prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
                labelClassName='text-base font-medium'
              
              />

              {/*}
              <div className='flex flex-row items-center justify-center gap-3'>
                
                <Button className="w-24 bg-gray-200 text-black " >
                  초기화
                </Button>
                
                <Button className="w-24 @lg:w-auto dark:bg-gray-100 dark:text-white dark:active:bg-gray-100">
                  <CiSearch className="me-1.5 h-[17px] w-[17px]" />
                  검색
                </Button>
              </div>
              */}

            </div>







          {/*
          <RadioGroup
            value={value}
            //setValue={setValue}

            setValue={(value) => {
              //setValue(value);
              console.log('value', value);
            } }

            className="justify-center space-x-4 space-y-4"
          >
            <div className="divide-slate-300 flex flex-row items-center justify-center gap-5">
              <div className=" w-16 ">
                정렬
              </div>
              <Radio
                name="sort"
                label="등록순"
                value="createdAt"
                labelClassName="pl-2 text-sm font-medium text-gray-900"
              />
              <Radio
                name="sort"
                label="식품코드순"
                value="foodCode"
                labelClassName="pl-2 text-sm font-medium text-gray-900"
                //helperClassName="text-gray-500 text-sm mt-3 ms-8"
                //helperText="Notify me for all reminders."
              />
              <Radio
                name="sort"
                label="식품영순"
                value="foodName"
                labelClassName="pl-2 text-sm font-medium text-gray-900"
                //helperClassName="text-gray-500 text-sm mt-3 ms-8"
                //helperText="Notify me for all reminders."
              />
            </div>
          </RadioGroup>
          */}

            

        </div>



        ),

      })}

    >
      
      <div
        className={cn('table-wrapper flex-grow', noGutter && '-mx-5 lg:-mx-7 ')}
      >
        <ControlledTable
          showLoadingText={false}
          isLoading={isLoading}
          data={tableData}
          columns={visibleColumns}
          scroll={scroll}
          sticky={sticky}

          
          //variant={variant}
          variant='modern'

          className="mt-6    "

          

          {...(enablePagination && {
            
            
            paginatorOptions: {
              pageSize,
              ...(setPageSize && { setPageSize }),
              total: totalItems,
              current: currentPage,
              //onChange: (page: number) => handlePaginate(page),
            },
            

            /*
            paginatorOptions: {
              pageSize,
              setPageSize,
              total: totalItems,
              current: currentPage,
              onChange: (page: number) => handlePaginate(page),
            },
            */


            paginatorClassName: cn(
              'mt-4 lg:mt-5',
              noGutter && 'px-5 lg:px-7',
              paginatorClassName
            ),
          })}

        
          

        />
      </div>



      {/* modal view */}
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          //setActive(() => 'posts');
        }}
        overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-lg"
        containerClassName="dark:bg-gray-100 max-w-[460px] rounded-md p-5 lg:p-6"
      >
        <div className="flex flex-col items-center justify-center gap-10 m-5">
            {/*
          <Title
            as="h3"
            className="text-lg font-semibold text-gray-900 xl:text-xl"
          >
            {modalData.title}
          </Title>
        
          <Button
            variant="text"
            onClick={() => {
              setOpen(false);
              setActive(() => 'posts');
            }}
            className="h-auto px-1 py-1"
          >
            <PiXBold className="h-5 w-5 text-base" />
          </Button>
          */}

            {modalData.description && (
              <div className="">
                <Text
                  as="p"
                  className="text-base font-semibold text-gray-900 xl:text-lg"
                >
                  {modalData.description}
                </Text>
              </div>
            )}

              {/*
            <Button
              variant="text"
              onClick={() => {
                setOpen(false);
                setActive(() => 'posts');
              }}
              className="h-auto px-1 py-1"
            >
              <PiXBold className="h-5 w-5 text-base" />
            </Button>
            */}
            {/* close button */}
            <Button
              size="lg"
              color="primary"
              className='flex items-center space-x-2'
              onClick={() => {
                setOpen(false);
                //setActive(() => 'posts');
              }}
            >
              닫기
            </Button>

          
        </div>

              {/*
        {modalData && <FollowerModal data={modalData.data} />}
              */}
      </Modal>



    </WidgetCard>


    </div>

    
  );
}
