'use client'; //turn file into a client component so it can use usePathname hook


import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

//import <link /> component to link between pages in app w/o refreshing every time
//code split by routes --> pages isolated --> if one has an error the rest of the app still works
/*whenever link components in browser viewport, nextjs prefetches code for route
  --> by the time user clicks link , destination's code loaded in background
*/
import Link from 'next/link'; 
import { usePathname } from 'next/navigation'; //used to get user's current path
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return ( //<a> tag was changed to <Link> here
          <Link
            key={link.name}
            href={link.href}
            className={
              clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {"bg-sky-100 text-blue-600": pathname === link.href,},
              ) //clsx used to conditionally display link w/ blue text/background when link.href matches pathname
            }
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
