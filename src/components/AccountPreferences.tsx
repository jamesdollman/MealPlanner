import { Dialog } from "@chakra-ui/react";

interface AccountPreferencesProps {
  open: boolean;
  onAccountSettingsClose: () => void;
}

const AccountPreferences = (props: AccountPreferencesProps) => {
  const { open } = props;

  return (
    <Dialog.Root open={open} placement={"center"}>
      <Dialog.Trigger />
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header alignSelf={"center"}>
            <Dialog.Title>Account Preferences</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body />
          <Dialog.Footer></Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default AccountPreferences;
