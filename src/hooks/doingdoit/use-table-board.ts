import { useState, useEffect, useMemo } from 'react';
import isString from 'lodash/isString';


import { useSession, signOut } from 'next-auth/react';
import { set } from 'lodash';
import { u } from 'uploadthing/dist/types-e8f81bbc';

import useDebounce from './useDebounce';
import { start } from 'repl';
import toast from 'react-hot-toast';


interface AnyObject {
  [key: string]: any;
}

export function useTable<T extends AnyObject>(
  initialData: T[],
  countPerPage: number = 10,

  currentPage: number = 1,

  searchTerm: string = '',


  initialFilterState?: Partial<Record<string, any>>,

  startDate?: string,
  endDate?: string,
) {


  const { data: session, status } = useSession();


  const [userData, setUserData] = useState({
    id: '',
    avatar: '',
    nickname: '',
    gender: '',
    birthDate: '',

  });


  useEffect(() => {
    if (status === 'authenticated') {
      const fetchData = async () => {
        
        const res = await fetch(`/api/vienna/user/getUserByEmail?_email=${session?.user?.email}`);
    
        const posts  = await res?.json() as any;
    
        setUserData(posts?.data);

        ////console.log("useTable-notification userData:", posts?.data);
    
      };
  
      fetchData();
    }
  } , [status, session?.user?.email]);


  /*
   * Table data
   */
  const [data, setData] = useState(initialData);

  /*
  * Dummy loading state.
  */
  const [isLoading, setLoading] = useState(true);

  

  /* get total count */
  const [totalCount, setTotalCount] = useState(0);




  /*
  useEffect(() => {
    setLoading(false);
  }, []);
  */


  /*
   * Handle row selection
   */
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const handleRowSelect = (recordKey: string) => {
    const selectedKeys = [...selectedRowKeys];
    if (selectedKeys.includes(recordKey)) {
      setSelectedRowKeys(selectedKeys.filter((key) => key !== recordKey));
    } else {
      setSelectedRowKeys([...selectedKeys, recordKey]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedRowKeys.length === data.length) {
      setSelectedRowKeys([]);
    } else {
      setSelectedRowKeys(data.map((record) => record.id));
    }
  };

  /*
   * Handle sorting
   */
  const [sortConfig, setSortConfig] = useState<AnyObject>({
    key: 'createdAt', // 'createdAt
    direction: 'desc',
  });


  
  function sortData(data: T[], sortKey: string, sortDirection: string) {


    return [...data].sort((a, b) => {

      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }


  const sortedData = useMemo(() => {
    let newData = data;
    if (!sortConfig.key) {
      return newData;
    }
    return sortData(newData, sortConfig.key, sortConfig.direction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortConfig, data]);

  function handleSort(key: string) {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }

  

  /*
   * Handle pagination
   */
  /*
  const [currentPage, setCurrentPage] = useState(1);
  */

  /*
  function paginatedData(data: T[] = sortedData) {

    const start = (currentPage - 1) * countPerPage;
    const end = start + countPerPage;

    if (data.length > start) return data.slice(start, end);
    return data;
  }
  */

  /*
  function handlePaginate(pageNumber: number) {

    setCurrentPage(pageNumber);

  }
  */



  /*
   * Handle delete
   */
  function handleDelete(id: string | string[]) {

    /*

    const updatedData = Array.isArray(id)
      ? data.filter((item) => !id.includes(item.id))
      : data.filter((item) => item.id !== id);

    setData(updatedData);
      
      */


    const deleteData = async () => {

      setLoading(true);
  
  
      await fetch(`/api/vienna/board/deleteOne?id=${id}`);    


      /*
      const res = await fetch('/api/vienna/board/getAll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
        body: JSON.stringify({
          limit: countPerPage,
          page: currentPage,
          sort: sortConfig.key,
          order: sortConfig.direction,

          ///q: debouncedSearch,
          q: searchTerm,

          startDate: startDate,
          endDate: endDate,

          }),
      });


      const posts  = await res?.json() as any;


      ////setData(posts?.data?.boards);

      setData(
        posts?.data?.boards.map((item: any) => {
          return {
            ...item,

            key: item.id,
            totalCount: posts?.data?.totalCount,
            currentPage: currentPage,
            countPerPage: countPerPage,
            loginUserId: userData?.id,
          };
        })
      );


      setTotalCount(posts?.data?.totalCount);
          
  
      setLoading(false);
        
      */

      //alert('삭제되었습니다.');


      
      fetchData(
        searchTerm,
        countPerPage,
        currentPage,
        startDate,
        endDate,
      )
      


      // remove the deleted item from data
      ////const updatedData = data.filter((item) => item.id !== id);

      ///setData(updatedData);


      setLoading(false);


      toast.success('삭제되었습니다.');



    }

    deleteData();

    
  }



  /*
   * Handle Filters and searching
   */
  /*
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useDebounce(searchTerm, 500)
  */


  
  const [filters, setFilters] = useState<Record<string, any>>(
    initialFilterState ?? {}
  );

  function updateFilter(columnId: string, filterValue: string | any[]) {
    if (!Array.isArray(filterValue) && !isString(filterValue)) {
      throw new Error('filterValue data type should be string or array of any');
    }

    if (Array.isArray(filterValue) && filterValue.length !== 2) {
      throw new Error('filterValue data must be an array of length 2');
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      [columnId]: filterValue,
    }));
  }

  function applyFilters() {
    const searchTermLower = searchTerm.toLowerCase();

    return (
      sortedData
        .filter((item) => {
          const isMatchingItem = Object.entries(filters).some(
            ([columnId, filterValue]) => {
              if (
                Array.isArray(filterValue) &&
                typeof filterValue[1] === 'object'
              ) {
                const itemValue = new Date(item[columnId]);
                return (
                  // @ts-ignore
                  itemValue >= filterValue[0] && itemValue <= filterValue[1]
                );
              }
              if (
                Array.isArray(filterValue) &&
                typeof filterValue[1] === 'string'
              ) {
                const itemPrice = Math.ceil(Number(item[columnId]));
                return (
                  itemPrice >= Number(filterValue[0]) &&
                  itemPrice <= Number(filterValue[1])
                );
              }
              if (isString(filterValue) && !Array.isArray(filterValue)) {
                const itemValue = item[columnId]?.toString().toLowerCase();
                if (itemValue !== filterValue.toString().toLowerCase()) {
                  return false;
                }
                return true;
              }
            }
          );
          return isMatchingItem;
        })
        // global search after running filters
        .filter((item) =>
          Object.values(item).some((value) =>
            typeof value === 'object'
              ? value &&
                Object.values(value).some(
                  (nestedItem) =>
                    nestedItem &&
                    String(nestedItem).toLowerCase().includes(searchTermLower)
                )
              : value && String(value).toLowerCase().includes(searchTermLower)
          )
        )
    );
  }
  


  /*
   * Handle searching
   */
  function handleSearch(
    searchValue: string,
    countPerPage: number = 10,
    currentPage: number = 1,
    startDate: Date | string = '',
    endDate: Date | string = '',
  ) {
    
    ///setSearchTerm(searchValue);



    console.log('handleSearch searchValue : ' + searchValue);


    fetchData(
      searchValue,
      countPerPage,
      currentPage,
      startDate,
      endDate,
    );

  }



  
  function searchedData() {


    if (!searchTerm) return sortedData;

    const searchTermLower = searchTerm.toLowerCase();

    
    return sortedData.filter((item) =>
      Object.values(item).some((value) =>
        typeof value === 'object'
          ? value &&
            Object.values(value).some(
              (nestedItem) =>
                nestedItem &&
                String(nestedItem).toLowerCase().includes(searchTermLower)
            )
          : value && String(value).toLowerCase().includes(searchTermLower)
      )
    );

  }
  

  

  /*
   * Reset search and filters
   */

  /*
  function handleReset() {
    setData(() => initialData);
    
    handleSearch('');


    ///////////////if (initialFilterState) return setFilters(initialFilterState);
  }
  */



  /*
   * Set isFiltered and final filtered data
   */

  const isFiltered = applyFilters().length > 0;


  
  function calculateTotalItems() {

    ////////fetchTotalCount();

    return totalCount;

    
    /*
    if (isFiltered) {
      return applyFilters().length;
    }
    if (searchTerm) {
      return searchedData().length;
    }

    return sortedData.length;
    */
    
  }

  

  const filteredAndSearchedData = isFiltered ? applyFilters() : searchedData();




  ///const tableData = paginatedData(filteredAndSearchedData);

  const tableData = data;


  const fetchData = async (

    searchTerm: string = '',
    countPerPage: number = 10,
    currentPage: number = 1,
    startDate: Date | string = '',
    endDate: Date | string = '',

  ) => {
    setLoading(true);


    if (session?.user?.email.includes('@unove.space')) {



      const res = await fetch('/api/vienna/board/getAll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
        body: JSON.stringify({
          limit: countPerPage,
          page: currentPage,
          sort: sortConfig.key,
          order: sortConfig.direction,

          //q: debouncedSearch,
          q: searchTerm,

          startDate: startDate,
          endDate: endDate,

          }),
      });



      const posts  = await res?.json() as any;

      


      ///setData(posts?.data?.boards);
      setData(
        posts?.data?.boards.map((item: any) => {
          return {
            ...item,

            key: item.id,
            totalCount: posts?.data?.totalCount,
            currentPage: currentPage,
            countPerPage: countPerPage,
            loginUserId: userData?.id,
          };
        })
      );
      

      setTotalCount(posts?.data?.totalCount);


    } else if (userData?.id) {


      const res = await fetch('/api/vienna/board/getAllByUserId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
        body: JSON.stringify({
          userId: userData?.id,
          limit: countPerPage,
          page: currentPage,
          sort: sortConfig.key,
          order: sortConfig.direction,

          //q: debouncedSearch,
          q: searchTerm,

          startDate: startDate,
          endDate: endDate,

          }),
      });



      const posts  = await res?.json() as any;


      setData(
        posts?.data?.boards.map((item: any) => {
          return {
            ...item,

            key: item.id,
            totalCount: posts?.data?.totalCount,
            currentPage: currentPage,
            countPerPage: countPerPage,
            loginUserId: userData?.id,
          };
        })
      );

      

      setTotalCount(posts?.data?.totalCount);
    
    } else {

    }

    setLoading(false);

  };


  ////console.log('useTable-board data:', data);




  useEffect(() => {

    
    fetchData(
      searchTerm,
      countPerPage,
      currentPage,
      startDate,
      endDate,
    );
    
    //fetchData();

  }
  , [currentPage, countPerPage]);
  

  /*
  console.log('useTable-board searchTerm:', searchTerm);
  console.log('useTable-board countPerPage:', countPerPage);
  console.log('useTable-board currentPage:', currentPage);
  console.log('useTable-board startDate:', startDate);
  console.log('useTable-board endDate:', endDate);
  */



  /*
  ,[ debouncedSearch, sortConfig, currentPage, countPerPage,
    startDate, endDate,
    userData?.id, session?.user?.email]);
  */



  /*
   * Go to first page when data is filtered and searched
   */
  /*
  useEffect(() => {

    handlePaginate(1);


  }, [isFiltered, searchTerm, countPerPage, sortConfig, startDate, endDate]);
  */




  // useTable returns
  return {

    isLoading,
    
    
    isFiltered,


    tableData,


    // pagination
    currentPage,

    ///handlePaginate,

    totalItems: calculateTotalItems(),

    // sorting
    sortConfig,
    
    
    ////handleSort,


    // row selection
    selectedRowKeys,
    setSelectedRowKeys,
    handleRowSelect,
    handleSelectAll,

    // searching
    ///searchTerm,

    handleSearch,

    // filters
    //filters,
    //updateFilter,
    //applyFilters,


    handleDelete,


    ///handleReset,
    
  };


  





}
