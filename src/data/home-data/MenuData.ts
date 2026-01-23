interface MenuItem {
    id: number;
    title: string;
    link: string;
    menu_class?: string;
    home_sub_menu?: {
      menu_details: {
        link: string;
        title: string;
        badge?: string;
        badge_class?: string;
      }[];
    }[];
    sub_menus?: {
      link: string;
      title: string;
      dropdown?: boolean;
      mega_menus?: {
        link: string;
        title: string;
      }[];
    }[];
  }
  
  const menu_data: MenuItem[] = [
    // {
    //   id: 1,
    //   title: "Logo", // Assuming you want a "Logo" link
    //   link: "/",
    // },
    {
      id: 2,
      title: "Home",
      link: "/",
    },
    {
      id: 3,
      title: "Courses",
      link: "/courses", 
    },
    {
      id: 4,
      title: "About",
      link: "/about-us",
    },
    {
      id: 5,
      title: "Blogs",
      link: "/blog",
    },
    {
      id:6,
      title:"Contact us",
      link:"/contact"
    }
    // {
    //   id: 6,
    //   title: "Login",
    //   link: "/login",
    // },
  ];
  
  export default menu_data;