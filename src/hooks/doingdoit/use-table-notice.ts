import { useState, useEffect, useMemo } from 'react';
import isString from 'lodash/isString';

import { useSession, signOut } from 'next-auth/react';


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



  /*
   * Table data
   */
  const [data, setData] = useState(initialData);

  /*
  * Dummy loading state.
  */
  const [isLoading, setLoading] = useState(true);

 
  /*
  const [searchTerm, setSearchTerm] = useState('');
  */

  const [sortConfig, setSortConfig] = useState<AnyObject>({
    key: 'createdAt', // 'createdAt'
    direction: 'desc',
  });

  /*
  const [currentPage, setCurrentPage] = useState(1);
  */


  
  /* get total count */
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async (
    searchTerm: string = '',
    countPerPage: number = 10,
    currentPage: number = 1,
    startDate: Date | string = '',
    endDate: Date | string = '',
  ) => {
    setLoading(true);

    if (session?.user?.email.includes('@unove.space')) {

      
      const res = await fetch('/api/vienna/notice/getAll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
        body: JSON.stringify({
          limit: countPerPage,
          page: currentPage,
          sort: sortConfig.key,
          order: sortConfig.direction,
          q: searchTerm,
          startDate: startDate,
          endDate: endDate,
          }),
      });

      
    
      const posts  = await res?.json() as any;


      //console.log(posts.data);

      setData(posts?.data?.boards);
      setTotalCount(posts?.data?.totalCount);


    } else {

      ///const res = await fetch(`/api/vienna/notice/getAllByEmail?email=${session?.user?.email}&_limit=${countPerPage}&_page=${currentPage}&_sort=${sortConfig.key}&_order=${sortConfig.direction}&_q=${searchTerm}`);


      
      const res = await fetch('/api/vienna/notice/getAll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
        body: JSON.stringify({
          limit: countPerPage,
          page: currentPage,
          sort: sortConfig.key,
          order: sortConfig.direction,
          q: searchTerm,
          startDate: startDate,
          endDate: endDate,
          }),
      });


      const posts  = await res?.json() as any;

      //console.log(posts.data);

      setData(posts?.data?.boards);

      setTotalCount(posts?.data?.totalCount);
    
    } 

    setLoading(false);

  };

  useEffect(() => {




    fetchData(
      searchTerm,
      countPerPage,
      currentPage,
      startDate,
      endDate,
    );
  }
  ,[ currentPage, countPerPage, ]);






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

  function paginatedData(data: T[] = sortedData) {
    const start = (currentPage - 1) * countPerPage;
    const end = start + countPerPage;

    if (data.length > start) return data.slice(start, end);
    return data;
  }

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
  
  
      await fetch(`/api/vienna/notice/deleteOne?id=${id}`);


      const res = await fetch('/api/vienna/notice/getAll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
        body: JSON.stringify({
          limit: countPerPage,
          page: currentPage,
          sort: sortConfig.key,
          order: sortConfig.direction,
          q: searchTerm,
          startDate: startDate,
          endDate: endDate,
          }),
      });

      
    
      const posts  = await res?.json() as any;


      //console.log(posts.data);

      setData(posts?.data?.boards);
      setTotalCount(posts?.data?.totalCount);
      
  
      setLoading(false);

    }

    deleteData();

    
  }



  /*
   * Handle Filters and searching
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
    if (initialFilterState) return setFilters(initialFilterState);
  }
  */

  /*
   * Set isFiltered and final filtered data
   */
  const isFiltered = applyFilters().length > 0;

  function calculateTotalItems() {
    /*
    if (isFiltered) {
      return applyFilters().length;
    }
    if (searchTerm) {
      return searchedData().length;
    }
    return sortedData.length;
    */
    return totalCount;
  }
  
  const filteredAndSearchedData = isFiltered ? applyFilters() : searchedData();

  //const tableData = paginatedData(filteredAndSearchedData);

  const tableData = data;


  /*
   * Go to first page when data is filtered and searched
   */
  /*
  useEffect(() => {

    handlePaginate(1);
  }, [isFiltered, searchTerm]);
  */



  // useTable returns
  return {
    isLoading,
    isFiltered,
    tableData,
    // pagination
    currentPage,
    
    //handlePaginate,

    totalItems: calculateTotalItems(),
    // sorting
    sortConfig,
    handleSort,
    // row selection
    selectedRowKeys,
    setSelectedRowKeys,
    handleRowSelect,
    handleSelectAll,

    // searching
    ////searchTerm,

    handleSearch,

    // filters
    filters,
    updateFilter,
    applyFilters,
    handleDelete,

    ////handleReset,
    
  };
}
