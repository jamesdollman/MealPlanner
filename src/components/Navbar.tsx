import { usePageSelector } from "../zustand/page";
import {
  Button,
  Flex,
  IconButton,
  Link,
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaRegUser, FaBook, FaBox, FaRobot, FaCalendar, FaShoppingCart } from "react-icons/fa";
import AccountPreferences from "./AccountPreferences";
import { supabase } from "../api/supabase";
import { useSession } from "../zustand/user";

const Navbar = () => {
  const { page, updatePage, resetPage } = usePageSelector();
  const [showAccountPreferences, setAPOpen] = useState(false);
  const resetSession = useSession((state) => state.resetSession);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    resetSession();
    resetPage();
  };

  return (
    <>
      <Flex
        borderBottom={"2px solid grey"}
        padding="2"
        position={"sticky"}
        width="100%"
        justifyContent={"space-between"}
        alignItems="center"
      >
        <Link
          onClick={() => {
            updatePage("home");
          }}
          fontWeight="bold"
          fontSize="lg"
        >
          Meal Planner
        </Link>

        <Flex gap={2}>
          <Button
            variant={page === "pantry" ? "solid" : "outline"}
            size="sm"
            onClick={() => {
              updatePage("pantry");
            }}
          >
            <FaBox style={{ marginRight: "4px" }} />
            Pantry
          </Button>

          <Button
            variant={page === "recipes" ? "solid" : "outline"}
            size="sm"
            onClick={() => {
              updatePage("recipes");
            }}
          >
            <FaBook style={{ marginRight: "4px" }} />
            Recipes
          </Button>

          <Button
            variant={page === "ai-generation" ? "solid" : "outline"}
            size="sm"
            onClick={() => {
              updatePage("ai-generation");
            }}
          >
            <FaRobot style={{ marginRight: "4px" }} />
            AI Generate
          </Button>

          <Button
            variant={page === "calendar" ? "solid" : "outline"}
            size="sm"
            onClick={() => {
              updatePage("calendar");
            }}
          >
            <FaCalendar style={{ marginRight: "4px" }} />
            Calendar
          </Button>

          <Button
            variant={page === "grocery" ? "solid" : "outline"}
            size="sm"
            onClick={() => {
              updatePage("grocery");
            }}
          >
            <FaShoppingCart style={{ marginRight: "4px" }} />
            Grocery
          </Button>
        </Flex>

        <Menu.Root>
          <Menu.Trigger asChild>
            <IconButton variant={"outline"} size="sm">
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
                  Account preferences
                </Menu.Item>
                <Menu.Item value="feature-previews">Feature previews</Menu.Item>
                <Menu.Item value="changelog">Changelog</Menu.Item>
                <Menu.Item value="language">Language</Menu.Item>
                <Menu.Item value="logout" color="red.fg" onClick={handleLogout}>
                  Log out
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
      {showAccountPreferences && (
        <AccountPreferences open={showAccountPreferences} onAccountSettingsClose={() => setAPOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
