import { usePageSelector } from "../zustand/page";
import { Button, Flex, IconButton, Link } from "@chakra-ui/react";
import { FaRegUser } from "react-icons/fa";

const Navbar = () => {
  const updatePage = usePageSelector((state) => state.updatePage);

  return (
    <Flex
      borderBottom={"2px solid grey"}
      padding="2"
      position={"sticky"}
      width="100%"
      justifyContent={"space-between"}
    >
      <Link
        onClick={() => {
          updatePage("home");
        }}
      >
        Meal Planner
      </Link>

      <Button
        variant={"outline"}
        onClick={() => {
          updatePage("recipes");
        }}
      >
        Recipes
      </Button>
      <IconButton variant={"outline"}>
        <FaRegUser />
      </IconButton>
    </Flex>
  );
};

export default Navbar;
