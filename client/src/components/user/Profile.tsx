import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import UpdatePassword from "./UpdatePassword";
import UpdateProfile from "./UpdateProfile";
import UploadAvatar from "./UploadAvatar";

const Profile = () => {
  return (
    <main className="flex min-h-screen items-center justify-center flex-1 flex-col">
      <Tabs defaultValue="profile" className="w-[385px]">
        <TabsList>
          <TabsTrigger value="profile">Update Profile</TabsTrigger>
          <TabsTrigger value="password">Update Password</TabsTrigger>
          <TabsTrigger value="avatar">Upload Avatar</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <UpdateProfile />
        </TabsContent>
        <TabsContent value="password">
          <UpdatePassword />
        </TabsContent>
        <TabsContent value="avatar">
          <UploadAvatar />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Profile;
