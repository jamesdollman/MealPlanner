import { usePageSelector, type PageOptions } from "../zustand/page";
import {
  Box,
  Button,
  Drawer,
  Flex,
  IconButton,
  Link,
  Menu,
  Portal,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState, type ReactNode } from "react";
import { FaRegUser, FaBook, FaBox, FaRobot, FaCalendar, FaShoppingCart, FaBars } from "react-icons/fa";
import AccountPreferences from "./AccountPreferences";
import { supabase } from "../api/supabase";
import { useSession } from "../zustand/user";

const NAV_ITEMS: Array<{ key: PageOptions; label: string; icon: ReactNode }> = [
  { key: "pantry", label: "Pantry", icon: <FaBox /> },
  { key: "recipes", label: "Recipes", icon: <FaBook /> },
  { key: "ai-generation", label: "AI Generate", icon: <FaRobot /> },
  { key: "calendar", label: "Calendar", icon: <FaCalendar /> },
  { key: "grocery", label: "Grocery", icon: <FaShoppingCart /> },
];

const Navbar = () => {
  const { page, updatePage, resetPage } = usePageSelector();
  const [showAccountPreferences, setAPOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const resetSession = useSession((state) => state.resetSession);
  const isDesktop = useBreakpointValue({ base: false, md: true });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    resetSession();
    resetPage();
  };

  return (
    <>
      <Flex
        borderBottom={"2px solid"}
        borderColor="border.muted"
        padding="2"
        position={"sticky"}
        top={0}
        bg="bg"
        zIndex={10}
        width="100%"
        justifyContent={"space-between"}
        alignItems="center"
      >
        <Link
          onClick={() => {
            updatePage("home");
            setMobileNavOpen(false);
          }}
          fontWeight="bold"
          fontSize="lg"
        >
          Meal Planner
        </Link>

        {isDesktop ? (
          <Flex gap={2}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.key}
                variant={page === item.key ? "solid" : "outline"}
                size="sm"
                onClick={() => {
                  updatePage(item.key);
                }}
              >
                <Box mr={1}>{item.icon}</Box>
                {item.label}
              </Button>
            ))}
          </Flex>
        ) : (
          <IconButton variant="outline" size="sm" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}>
            <FaBars />
          </IconButton>
        )}

        <Menu.Root>
          <Menu.Trigger asChild>
            <IconButton variant={"outline"} size="sm" aria-label="Account menu">
              <FaRegUser />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Text px={3} py={2} fontSize="sm" color="text.muted">
                  Account
                </Text>
                <Menu.Item
                  value="account-prefs"
                  onClick={() => {
                    setAPOpen(true);
                  }}
                >
                  Account settings
                </Menu.Item>
                <Menu.Item value="logout" color="red.fg" onClick={handleLogout}>
                  Log out
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>

      <Drawer.Root open={mobileNavOpen} placement="start" onOpenChange={(details) => setMobileNavOpen(details.open)}>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Title>Navigate</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Stack gap={2}>
                {NAV_ITEMS.map((item) => (
                  <Button
                    key={item.key}
                    justifyContent="start"
                    variant={page === item.key ? "solid" : "ghost"}
                    onClick={() => {
                      updatePage(item.key);
                      setMobileNavOpen(false);
                    }}
                  >
                    <Box mr={2}>{item.icon}</Box>
                    {item.label}
                  </Button>
                ))}
              </Stack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>

      {showAccountPreferences && (
        <AccountPreferences open={showAccountPreferences} onAccountSettingsClose={() => setAPOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
