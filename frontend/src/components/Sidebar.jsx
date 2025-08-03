import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Home, 
  TreePine, 
  ShoppingCart,
  User,
  ChevronLeft,
  ChevronRight as RightArrow,
  Boxes,
  Truck,
  Settings,
  Layers,
  Package2, 
  Warehouse, 
  Factory, 
  Archive, 
  Scale, 
  Tags, 
  Ruler,
  ShoppingBag, 
  PackageCheck, 
  Flame,
  ClipboardCheck, 
  TrendingUp, 
  Receipt as ReceiptIcon,
  UserPlus2Icon, 
} from "lucide-react";

const Sidebar = ({ expanded, toggleSidebar, setActiveComponent, activeComponent }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // ดึงข้อมูล user จาก localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.status);
    }
  }, []);

  // Handle screen resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-expand parent categories based on active item when component mounts
  useEffect(() => {
    const menuItems = getMenuItems();
    for (const item of menuItems) {
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (subItem.id === activeComponent) {
            setExpandedCategories((prev) => ({ ...prev, [item.id]: true }));
            break;
          }
        }
      }
    }
  }, [activeComponent]);

  const getMenuItems = () => {
    // กำหนดเมนูทั้งหมด
    const allMenuItems = [
      {
        id: "dashboard",
        icon: <Home color="#2563EB" size={20} />,
        label: "ໜ້າຫຼັກ",
        roles: ["Admin", "User1", "User2", "User3"] // ทุก role เห็นได้
      },
      {
        id: "ok",
        icon: <TreePine color="#16A34A" size={20} />,
        label: "ຈັດການ ນຳເຂົ້າວັດຖຸດິບ",
        roles: ["Admin", "User1"], // เฉพาะ Admin และ User1
        subItems: [
          {
            id: "materials-name",
            label: "ຊື່",
            icon: <Tags color="#16A34A" size={16} />,
            roles: ["Admin", "User1"]
          },
          {
            id: "materials-type",
            label: "ປະເພດ",
            icon: <Layers color="#16A34A" size={16} />,
            roles: ["Admin", "User1"]
          },
          {
            id: "materials-size",
            label: "ຂະໜາດ",
            icon: <Ruler color="#16A34A" size={16} />,
            roles: ["Admin", "User1"]
          },
          {
            id: "materials-volume",
            label: "ໜ່ວຍວັດ",
            icon: <Scale color="#16A34A" size={16} />,
            roles: ["Admin", "User1"]
          },
          {
            id: "materials-purchase",
            label: "ການຊື້ວັດຖຸດິບ",
            icon: <ShoppingBag color="#16A34A" size={16} />,
            roles: ["Admin", "User1"]
          },
        ],
      },
      {
        id: "materials",
        icon: <Warehouse color="#8B5CF6" size={20} />,
        label: "ຈັດການ ສາງວັດຖຸດິບ",
        roles: ["Admin", "User1"],
        subItems: [
          {
            id: "materials-storages",
            label: "ບ່ອນຈັດເກັບ",
            icon: <Archive color="#8B5CF6" size={16} />,
            roles: ["Admin", "User1"]
          },
          {
            id: "materials-inventory",
            label: "ສາງວັດຖຸດິບ",
            icon: <Package2 color="#8B5CF6" size={16} />,
            roles: ["Admin", "User1"]
          },
        ],
      },
      {
        id: "production",
        icon: <Factory color="#DC2626" size={20} />,
        label: "ຈັດການ ການຜະລິດ",
        roles: ["Admin", "User2"],
        subItems: [
          {
            id: "production-requisition",
            label: "ເບີກຜະລິດ",
            icon: <ClipboardCheck color="#DC2626" size={16} />,
            roles: ["Admin", "User2"]
          },
          {
            id: "production-process",
            label: "ການຜະລິດ",
            icon: <Settings color="#DC2626" size={16} />,
            roles: ["Admin", "User2"]
          },
          {
            id: "production-drying",
            label: "ການອົບໄມ້",
            icon: <Flame color="#DC2626" size={16} />,
            roles: ["Admin", "User2"]
          },
          {
            id: "production-inspection",
            label: "ການກວດສອບ",
            icon: <PackageCheck color="#DC2626" size={16} />,
            roles: ["Admin", "User2"]
          },
          {
            id: "production-improvement",
            label: "ການປັບປຸງ",
            icon: <TrendingUp color="#DC2626" size={16} />,
            roles: ["Admin", "User2"]
          }
        ],
      },
      {
        id: "inventory",
        icon: <Boxes color="#F59E0B" size={20} />,
        label: "ຈັດການ ສິນຄ້າ",
        roles: ["Admin", "User2"],
        subItems: [
          {
            id: "inventory-type",
            label: "ປະເພດ",
            icon: <Tags color="#F59E0B" size={16} />,
            roles: ["Admin", "User2"]
          },
          {
            id: "inventory-size",
            label: "ຂະໜາດ",
            icon: <Ruler color="#F59E0B" size={16} />,
            roles: ["Admin", "User2"]
          },
          {
            id: "inventory-storage",
            label: "ບ່ອນຈັດເກັບ",
            icon: <Archive color="#F59E0B" size={16} />,
            roles: ["Admin", "User2"]
          },
                    {
            id: "inventory-products",
            label: "ສິນຄ້າ",
            icon: <Package2 color="#F59E0B" size={16} />,
            roles: ["Admin", "User2"]
          },
        ],
      },
      {
        id: "sales",
        icon: <ShoppingCart color="#10B981" size={20} />,
        label: "ຈັດການ ການຂາຍ",
        roles: ["Admin", "User3"],
        subItems: [
          {
            id: "sales-shop",
            label: "ຂາຍໜ້າຮ້ານ",
            icon: <ShoppingBag color="#10B981" size={16} />,
            roles: ["Admin", "User3"]
          },
          {
            id: "sales-invoice",
            label: "ຂາຍສົ່ງ",
            icon: <Truck color="#10B981" size={16} />,
            roles: ["Admin", "User3"]
          },
          {
            id: "sales-debt",
            label: "ຕິດໜີ້",
            icon: <ReceiptIcon color="#10B981" size={16} />,
            roles: ["Admin", "User3"]
          },
        ],
      },
      {
        id: "user",
        icon: <User color="#3B82F6" size={20} />,
        label: "ຜູ້ໃຊ້",
        roles: ["Admin"], // เฉพาะ Admin เท่านั้น
        subItems: [
          {
            id: "user",
            label: "ຜູ້ໃຊ້ທັງໝົດ",
            icon: <UserPlus2Icon color="#3B82F6" size={16} />,
            roles: ["Admin"]
          },
        ],
      }
    ];

    // กรองเมนูตาม role ของผู้ใช้
    const filterMenuByRole = (items) => {
      return items.filter(item => {
        // ถ้าไม่มี roles กำหนดไว้ หรือ role ของผู้ใช้อยู่ใน roles ที่อนุญาต
        if (!item.roles || item.roles.includes(userRole)) {
          // ถ้ามี subItems ให้กรอง subItems ด้วย
          if (item.subItems) {
            item.subItems = filterMenuByRole(item.subItems);
            // ถ้าหลังจากกรองแล้ว subItems ไม่เหลือเลย ให้ซ่อน parent menu
            return item.subItems.length > 0;
          }
          return true;
        }
        return false;
      });
    };

    return filterMenuByRole(allMenuItems);
  };

  const toggleCategory = (id) => {
    setExpandedCategories((prev) => {
      if (prev[id]) {
        return {}; // if already open, close all
      } else {
        return { [id]: true }; // open only this
      }
    });
  };

  const handleItemClick = (item) => {
    if (item.subItems) {
      toggleCategory(item.id);

      // If category is being expanded and has subitems, navigate to first subitem
      if (!expandedCategories[item.id] && item.subItems.length > 0) {
        const firstSubItem = item.subItems[0];
        setActiveComponent(firstSubItem.id);
      }
    } else {
      if (item.id === "logout") {
        // Handle logout logic
        console.log("Logging out...");
        // You would typically clear session/auth state here
      } else {
        setActiveComponent(item.id);

        // Reset any expanded categories for cleaner UI when going to dashboard
        if (item.id === "dashboard") {
          setExpandedCategories({});
        }
      }
    }
  };

  // Recursive function to render menu items and their subitems
  const renderMenuItems = (items, level = 0) => {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        <div
          className={`relative flex items-center cursor-pointer transition-colors
                     ${level === 0
              ? "p-4"
              : level === 1
                ? "pl-8 pr-4 py-2"
                : level === 2
                  ? "pl-12 pr-4 py-2"
                  : "pl-16 pr-4 py-2"
            }
                     ${activeComponent === item.id
              ? "border-l-4 border-blue-500 bg-blue-50 text-blue-600"
              : "border-l-4 border-transparent hover:bg-gray-100"
            }`}
          onClick={() => handleItemClick(item)}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="flex items-center flex-1">
            {item.icon && <span>{item.icon}</span>}
            {expanded && (
              <>
                <span className={item.icon ? "ml-6" : ""}>{item.label}</span>
                {item.subItems && (
                  <span className="ml-auto">
                    {expandedCategories[item.id] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Hover tooltip - only show when collapsed and on desktop */}
          {!expanded && !isMobile && hoveredItem === item.id && (
            <div className="absolute left-16 bg-gray-800 text-white py-2 px-3 rounded z-10 text-sm whitespace-nowrap">
              {item.label}
            </div>
          )}
        </div>

        {/* Render subitems when expanded */}
        {expanded &&
          item.subItems &&
          expandedCategories[item.id] &&
          renderMenuItems(item.subItems, level + 1)}
      </React.Fragment>
    ));
  };

  const menuItems = getMenuItems();

  return (
    <div className="h-full bg-gray-100">
      <div
        className={`bg-white shadow-md transition-all duration-300 flex flex-col h-full`}
      >
        {/* Logo */}
        <div
          onClick={toggleSidebar}
          className="px-4 mb-6 py-3 border-b flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center text-indigo-900 font-bold text-xl">
            <div className="h-8 w-8 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#2D3B8E" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" fill="#E63946" />
              </svg>
            </div>
            {expanded &&
              <span className="ml-10"
                style={{
                  opacity: expanded ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}>
                ໂຮງງານໄມ້
                {userRole && (
                  <span className="block text-xs text-gray-500 mt-1">
                    {userRole === 'Admin' ? 'ຜູ້ດູແລລະບົບ' : 
                     userRole === 'User1' ? 'ຈັດການວັດຖຸດິບ' :
                     userRole === 'User2' ? 'ຈັດການການຜະລິດ' :
                     userRole === 'User3' ? 'ຈັດການການຂາຍ' : userRole}
                  </span>
                )}
              </span>}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          {renderMenuItems(menuItems)}
        </div>

        {/* Desktop Toggle Button - hide on mobile */}
        <div className="p-4 border-t hidden md:block">
          <button
            onClick={toggleSidebar}
            className="w-full p-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center"
          >
            {expanded ? (
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;