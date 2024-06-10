'use client'; //allows use of event listeners and hooks

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
//useSearchParams allows access to params of current url
//usePathname allows reading of current url's pathname
//useRouter enables nav between routes within client components
import { useSearchParams, usePathname, useRouter } from 'next/navigation'; 
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  //usedebouncedcallback only runs code after specific time -> once user stops typing
  const handleSearch = useDebouncedCallback((term) =>{ 
    console.log(`Searching... ${term}`);
    const params = new URLSearchParams(searchParams); //utility methods for manipulating URL query params
    params.set('page','1');
    if(term){ //set param string based on user input
      params.set('query', term);
    } else{ //if input empty then delete it
      params.delete('query');
    }
    //pathname = current path
    //params.toString translates user input into URL friendly format
    replace(`${pathname}?${params.toString()}`); //update url with user's search data w/o page reload
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      {/*input = search input*/}
      <input 
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange = {(e) => {handleSearch(e.target.value);}}
        //ensure input field in sync w/ url + is populated when sharing
        defaultValue = {searchParams.get('query')?.toString()} //passed to input by reading from searchParams
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
