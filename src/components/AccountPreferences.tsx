import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Field,
  Input,
  NativeSelect,
  Stack,
  Switch,
  Tabs,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSession } from "../zustand/user";

interface AccountPreferencesProps {
  open: boolean;
  onAccountSettingsClose: () => void;
}

const AccountPreferences = ({ open, onAccountSettingsClose }: AccountPreferencesProps) => {
  const user = useSession((state) => state.user?.user);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name ?? "");
  const [timezone, setTimezone] = useState("UTC");
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [measurementSystem, setMeasurementSystem] = useState("imperial");
  const [receiveEmails, setReceiveEmails] = useState(true);
  const [showHints, setShowHints] = useState(true);

  return (
    <Dialog.Root open={open} placement={"center"} onOpenChange={(details) => !details.open && onAccountSettingsClose()}>
      <Dialog.Trigger />
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="2xl" mx={4}>
          <Dialog.CloseTrigger />
          <Dialog.Header alignSelf={"center"}>
            <Dialog.Title>Account Settings</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Tabs.Root defaultValue="profile" fitted variant="line">
              <Tabs.List mb={4}>
                <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
                <Tabs.Trigger value="preferences">Preferences</Tabs.Trigger>
                <Tabs.Trigger value="security">Security</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="profile">
                <Stack gap={4}>
                  <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Input value={user?.email ?? ""} disabled />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Display name</Field.Label>
                    <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Timezone</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="America/Chicago">America/Chicago</option>
                        <option value="America/Denver">America/Denver</option>
                        <option value="America/Los_Angeles">America/Los_Angeles</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Dietary notes & allergens</Field.Label>
                    <Textarea
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      placeholder="Example: Nut allergy, pescatarian preference, low-sodium meals"
                      resize="vertical"
                    />
                  </Field.Root>
                </Stack>
              </Tabs.Content>

              <Tabs.Content value="preferences">
                <Stack gap={4}>
                  <Field.Root>
                    <Field.Label>Measurement system</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={measurementSystem}
                        onChange={(e) => setMeasurementSystem(e.target.value)}
                      >
                        <option value="imperial">Imperial (cups, oz, °F)</option>
                        <option value="metric">Metric (ml, g, °C)</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </Field.Root>

                  <Box>
                    <Text fontWeight="medium" mb={2}>
                      Notifications
                    </Text>
                    <Stack gap={3}>
                      <Switch.Root
                        checked={receiveEmails}
                        onCheckedChange={(details) => setReceiveEmails(details.checked)}
                      >
                        <Switch.HiddenInput />
                        <Switch.Control />
                        <Switch.Label>Email me grocery and meal reminders</Switch.Label>
                      </Switch.Root>

                      <Switch.Root checked={showHints} onCheckedChange={(details) => setShowHints(details.checked)}>
                        <Switch.HiddenInput />
                        <Switch.Control />
                        <Switch.Label>Show onboarding hints in empty states</Switch.Label>
                      </Switch.Root>
                    </Stack>
                  </Box>
                </Stack>
              </Tabs.Content>

              <Tabs.Content value="security">
                <Stack gap={4}>
                  <Text color="fg.muted" fontSize="sm">
                    Keep your account secure by using a unique password and enabling email verification.
                  </Text>

                  <Field.Root>
                    <Field.Label>Current password</Field.Label>
                    <Input type="password" placeholder="Current password" />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>New password</Field.Label>
                    <Input type="password" placeholder="New password" />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Confirm new password</Field.Label>
                    <Input type="password" placeholder="Confirm new password" />
                  </Field.Root>

                  <Checkbox.Root>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Sign me out from all other active devices</Checkbox.Label>
                  </Checkbox.Root>
                </Stack>
              </Tabs.Content>
            </Tabs.Root>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outline" mr={3} onClick={onAccountSettingsClose}>
              Cancel
            </Button>
            <Button onClick={onAccountSettingsClose}>Save changes</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default AccountPreferences;
